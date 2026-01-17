import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { ContractStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, FileText, Eye, ChevronRight, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { getNextStatus } from '@/types';
import { toast } from 'sonner';

type FilterTab = 'all' | 'active' | 'pending' | 'signed';

export function ContractList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  
  const contracts = useStore((state) => state.contracts);
  const advanceContractStatus = useStore((state) => state.advanceContractStatus);
  const deleteContract = useStore((state) => state.deleteContract);

  const filteredContracts = contracts.filter((contract) => {
    switch (activeTab) {
      case 'active':
        return contract.status !== 'locked' && contract.status !== 'revoked';
      case 'pending':
        return ['created', 'approved', 'sent'].includes(contract.status);
      case 'signed':
        return contract.status === 'signed' || contract.status === 'locked';
      default:
        return true;
    }
  });

  const handleAdvanceStatus = (id: string, currentStatus: ContractStatus) => {
    if (advanceContractStatus(id)) {
      const statusLabels: Record<string, string> = {
        created: 'approved',
        approved: 'sent',
        sent: 'signed',
        signed: 'locked',
      };
      toast.success(`Contract ${statusLabels[currentStatus]}!`);
    }
  };

  const handleDeleteContract = (id: string, name: string) => {
    deleteContract(id);
    toast.success(`Contract "${name}" deleted`);
  };

  const tabCounts = {
    all: contracts.length,
    active: contracts.filter((c) => c.status !== 'locked' && c.status !== 'revoked').length,
    pending: contracts.filter((c) => ['created', 'approved', 'sent'].includes(c.status)).length,
    signed: contracts.filter((c) => c.status === 'signed' || c.status === 'locked').length,
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contracts</h1>
          <p className="text-muted-foreground">Manage your contracts and their lifecycle</p>
        </div>
        <Button onClick={() => navigate('/contracts/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Contract
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
        <TabsList>
          <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
          <TabsTrigger value="active">Active ({tabCounts.active})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({tabCounts.pending})</TabsTrigger>
          <TabsTrigger value="signed">Signed ({tabCounts.signed})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredContracts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {activeTab === 'all' ? 'No contracts yet' : `No ${activeTab} contracts`}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'all'
                    ? 'Create your first contract from a blueprint.'
                    : `You don't have any ${activeTab} contracts at the moment.`}
                </p>
                {activeTab === 'all' && (
                  <Button onClick={() => navigate('/contracts/new')} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Contract
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract Name</TableHead>
                    <TableHead>Blueprint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => {
                    const nextStatus = getNextStatus(contract.status);
                    return (
                      <TableRow key={contract.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <FileText className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{contract.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {contract.blueprintName}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={contract.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(contract.createdAt), 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/contracts/${contract.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                            {nextStatus && (
                              <Button
                                size="sm"
                                onClick={() => handleAdvanceStatus(contract.id, contract.status)}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Contract</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{contract.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteContract(contract.id, contract.name)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

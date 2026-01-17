import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { FileText, LayoutTemplate, Plus, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export function Dashboard() {
  const blueprints = useStore((state) => state.blueprints);
  const contracts = useStore((state) => state.contracts);

  const stats = {
    totalBlueprints: blueprints.length,
    totalContracts: contracts.length,
    pendingContracts: contracts.filter((c) => 
      ['created', 'approved', 'sent'].includes(c.status)
    ).length,
    signedContracts: contracts.filter((c) => 
      c.status === 'signed' || c.status === 'locked'
    ).length,
    revokedContracts: contracts.filter((c) => c.status === 'revoked').length,
  };

  const recentContracts = [...contracts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your contract management</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Blueprints
            </CardTitle>
            <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlueprints}</div>
            <Link to="/blueprints" className="text-xs text-primary hover:underline">
              View all →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Contracts
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContracts}</div>
            <Link to="/contracts" className="text-xs text-primary hover:underline">
              View all →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingContracts}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Signed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.signedContracts}</div>
            <p className="text-xs text-muted-foreground">Completed contracts</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get started</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button variant="outline" className="justify-start gap-3 h-12" asChild>
              <Link to="/blueprints/new">
                <Plus className="h-5 w-5" />
                Create New Blueprint
              </Link>
            </Button>
            <Button variant="outline" className="justify-start gap-3 h-12" asChild>
              <Link to="/contracts/new">
                <Plus className="h-5 w-5" />
                Create New Contract
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Contracts</CardTitle>
              <CardDescription>Latest activity</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/contracts">
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentContracts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No contracts yet. Create one to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {recentContracts.map((contract) => (
                  <Link
                    key={contract.id}
                    to={`/contracts/${contract.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{contract.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(contract.updatedAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={contract.status} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { StatusTimeline } from '@/components/StatusTimeline';
import { ContractCanvas } from '@/components/ContractCanvas';
import { ArrowLeft, ChevronRight, XCircle, Save } from 'lucide-react';
import { format } from 'date-fns';
import { ContractFieldValue, getNextStatus, canRevoke, isEditable } from '@/types';
import { toast } from 'sonner';
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

const statusActions: Record<string, string> = {
  created: 'Approve',
  approved: 'Send',
  sent: 'Mark as Signed',
  signed: 'Lock',
};

export function ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contract = useStore((state) => state.getContractById(id || ''));
  const blueprint = useStore((state) => state.getBlueprintById(contract?.blueprintId || ''));
  const updateContractFields = useStore((state) => state.updateContractFields);
  const advanceContractStatus = useStore((state) => state.advanceContractStatus);
  const revokeContract = useStore((state) => state.revokeContract);

  const [fieldValues, setFieldValues] = useState<ContractFieldValue[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const loadedContractId = useRef<string | null>(null);

  // Only initialize fieldValues when contract ID changes (not on status changes)
  useEffect(() => {
    if (contract && contract.id !== loadedContractId.current) {
      setFieldValues(contract.fieldValues);
      loadedContractId.current = contract.id;
      setHasChanges(false);
    }
  }, [contract?.id]);

  if (!contract || !blueprint) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Contract not found</h2>
        <Button onClick={() => navigate('/contracts')}>Back to Contracts</Button>
      </div>
    );
  }

  const editable = isEditable(contract.status);
  const nextStatus = getNextStatus(contract.status);
  const canBeRevoked = canRevoke(contract.status);

  const updateFieldValue = (fieldId: string, value: string | boolean) => {
    setFieldValues((prev) =>
      prev.map((fv) => (fv.fieldId === fieldId ? { ...fv, value } : fv))
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    updateContractFields(contract.id, fieldValues);
    setHasChanges(false);
    toast.success('Contract saved successfully!');
  };

  const handleAdvanceStatus = () => {
    if (advanceContractStatus(contract.id)) {
      toast.success(`Contract ${statusActions[contract.status].toLowerCase()}!`);
    }
  };

  const handleRevoke = () => {
    if (revokeContract(contract.id)) {
      toast.success('Contract revoked');
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/contracts')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{contract.name}</h1>
            <StatusBadge status={contract.status} />
          </div>
          <p className="text-muted-foreground">
            Based on {contract.blueprintName} • Created {format(new Date(contract.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          {editable && hasChanges && (
            <Button onClick={handleSave} variant="outline" className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          )}
          {canBeRevoked && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                  <XCircle className="h-4 w-4" />
                  Revoke
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Revoke Contract</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to revoke this contract? This action cannot be undone and the contract cannot proceed further.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRevoke}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Revoke
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {nextStatus && (
            <Button onClick={handleAdvanceStatus} className="gap-2">
              {statusActions[contract.status]}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Contract Lifecycle</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusTimeline currentStatus={contract.status} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contract Fields</CardTitle>
              <CardDescription>
                {editable ? 'Fill in the contract details on the canvas below' : 'This contract is locked and cannot be edited'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ContractCanvas
            fields={blueprint.fields}
            fieldValues={fieldValues}
            onFieldValueChange={updateFieldValue}
            editable={editable}
          />
        </CardContent>
      </Card>
    </div>
  );
}

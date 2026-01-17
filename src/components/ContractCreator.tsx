import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Save, Type, Calendar, PenLine, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { FieldType } from '@/types';
import { cn } from '@/lib/utils';

const fieldTypeIcons: Record<FieldType, React.ElementType> = {
  text: Type,
  date: Calendar,
  signature: PenLine,
  checkbox: CheckSquare,
};

const fieldTypeColors: Record<FieldType, string> = {
  text: 'border-blue-400 bg-blue-50',
  date: 'border-purple-400 bg-purple-50',
  signature: 'border-amber-400 bg-amber-50',
  checkbox: 'border-green-400 bg-green-50',
};

export function ContractCreator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const blueprints = useStore((state) => state.blueprints);
  const createContract = useStore((state) => state.createContract);

  const [name, setName] = useState('');
  const [selectedBlueprintId, setSelectedBlueprintId] = useState(searchParams.get('blueprintId') || '');

  const selectedBlueprint = blueprints.find((bp) => bp.id === selectedBlueprintId);

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Please enter a contract name');
      return;
    }
    if (!selectedBlueprintId) {
      toast.error('Please select a blueprint');
      return;
    }

    const contract = createContract(name.trim(), selectedBlueprintId);
    if (contract) {
      toast.success('Contract created successfully!');
      navigate(`/contracts/${contract.id}`);
    } else {
      toast.error('Failed to create contract');
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/contracts')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Contract</h1>
          <p className="text-muted-foreground">Generate a contract from a blueprint</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Form */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
            <CardDescription>Set up your new contract</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Contract Name *</Label>
              <Input
                id="name"
                placeholder="e.g., John Smith Employment Contract"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blueprint">Blueprint *</Label>
              <Select value={selectedBlueprintId} onValueChange={setSelectedBlueprintId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a blueprint..." />
                </SelectTrigger>
                <SelectContent>
                  {blueprints.length === 0 ? (
                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                      No blueprints available.
                      <Button
                        variant="link"
                        className="block mx-auto mt-2"
                        onClick={() => navigate('/blueprints/new')}
                      >
                        Create one first
                      </Button>
                    </div>
                  ) : (
                    blueprints.map((bp) => (
                      <SelectItem key={bp.id} value={bp.id}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {bp.name}
                          <span className="text-muted-foreground text-xs">
                            ({bp.fields.length} fields)
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedBlueprint && (
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h4 className="font-medium">Selected Blueprint</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedBlueprint.description || 'No description'}
                </p>
                <div className="flex gap-4 text-sm">
                  <span>{selectedBlueprint.fields.length} fields</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => navigate('/contracts')}>
                Cancel
              </Button>
              <Button onClick={handleCreate} className="gap-2">
                <Save className="h-4 w-4" />
                Create Contract
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right side - Blueprint Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Blueprint Preview</CardTitle>
            <CardDescription>
              {selectedBlueprint ? 'Visual layout of fields in the blueprint' : 'Select a blueprint to preview'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[400px] bg-white rounded-lg border border-zinc-200 shadow-inner overflow-auto">
              {/* Subtle grid pattern */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />

              {!selectedBlueprint ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-zinc-400">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Select a blueprint to see preview</p>
                  </div>
                </div>
              ) : selectedBlueprint.fields.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-zinc-400">
                    <p>This blueprint has no fields</p>
                  </div>
                </div>
              ) : (
                selectedBlueprint.fields.map((field) => {
                  const Icon = fieldTypeIcons[field.type];
                  return (
                    <div
                      key={field.id}
                      className={cn(
                        "absolute flex items-center gap-2 px-3 py-2 rounded-lg border",
                        "min-w-[180px]",
                        fieldTypeColors[field.type]
                      )}
                      style={{
                        left: field.position.x,
                        top: field.position.y,
                      }}
                    >
                      <Icon className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                      <span className="text-zinc-800 text-sm font-medium truncate">
                        {field.label}
                      </span>
                      {field.required && (
                        <span className="text-red-500 text-xs">*</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

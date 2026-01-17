import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { BlueprintField, FieldType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { BlueprintCanvas, FieldToolbar, FieldProperties } from '@/components/BlueprintCanvas';

const fieldTypeLabels: Record<FieldType, string> = {
  text: 'Text Field',
  date: 'Date Picker',
  signature: 'Signature',
  checkbox: 'Checkbox',
};

const generateFieldId = () => `field_${Math.random().toString(36).substring(2, 9)}`;

export function BlueprintCreator() {
  const navigate = useNavigate();
  const addBlueprint = useStore((state) => state.addBlueprint);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<BlueprintField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const selectedField = fields.find(f => f.id === selectedFieldId) || null;

  const addField = (type: FieldType) => {
    // Place new fields in a staggered pattern
    const baseY = 40 + (fields.length % 5) * 80;
    const baseX = 40 + Math.floor(fields.length / 5) * 240;
    
    const newField: BlueprintField = {
      id: generateFieldId(),
      type,
      label: `New ${fieldTypeLabels[type]}`,
      position: { x: baseX, y: baseY },
      required: false,
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const updateField = (id: string, updates: Partial<BlueprintField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter a blueprint name');
      return;
    }
    if (fields.length === 0) {
      toast.error('Please add at least one field');
      return;
    }

    const blueprint = addBlueprint({
      name: name.trim(),
      description: description.trim(),
      fields,
    });

    toast.success('Blueprint created successfully!');
    navigate(`/blueprints/${blueprint.id}`);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/blueprints')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Blueprint</h1>
            <p className="text-muted-foreground">Design a reusable contract template</p>
          </div>
        </div>
        <Button onClick={handleSave} className="gap-2" size="lg">
          <Save className="h-5 w-5" />
          Save Blueprint
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left sidebar - Blueprint details */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Blueprint Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Employment Contract"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Field Properties</CardTitle>
              <CardDescription>
                {selectedField ? `Editing: ${selectedField.label}` : 'Select a field'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <FieldProperties 
                field={selectedField}
                onUpdateField={updateField}
                onRemoveField={removeField}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main canvas area */}
        <div className="lg:col-span-3 space-y-4">
          <FieldToolbar onAddField={addField} />
          
          <Card className="p-0 overflow-hidden">
            <CardHeader className="py-3 px-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Template Canvas</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {fields.length} field{fields.length !== 1 ? 's' : ''}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <BlueprintCanvas
                fields={fields}
                onFieldsChange={setFields}
                selectedFieldId={selectedFieldId}
                onSelectField={setSelectedFieldId}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

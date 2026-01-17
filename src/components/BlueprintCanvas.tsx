import { useRef, useState, useCallback } from 'react';
import { BlueprintField, FieldType } from '@/types';
import { Type, Calendar, PenLine, CheckSquare, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const fieldTypeIcons: Record<FieldType, React.ElementType> = {
  text: Type,
  date: Calendar,
  signature: PenLine,
  checkbox: CheckSquare,
};

const fieldTypeLabels: Record<FieldType, string> = {
  text: 'Text Field',
  date: 'Date Picker',
  signature: 'Signature',
  checkbox: 'Checkbox',
};

const fieldTypeColors: Record<FieldType, string> = {
  text: 'border-blue-400 bg-blue-50',
  date: 'border-purple-400 bg-purple-50',
  signature: 'border-amber-400 bg-amber-50',
  checkbox: 'border-green-400 bg-green-50',
};

interface BlueprintCanvasProps {
  fields: BlueprintField[];
  onFieldsChange: (fields: BlueprintField[]) => void;
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
}

export function BlueprintCanvas({ 
  fields, 
  onFieldsChange, 
  selectedFieldId,
  onSelectField 
}: BlueprintCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent, fieldId: string) => {
    e.stopPropagation();
    const field = fields.find(f => f.id === fieldId);
    if (!field || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - field.position.x,
      y: e.clientY - rect.top - field.position.y
    });
    setDraggedField(fieldId);
    onSelectField(fieldId);
  };

  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (!draggedField || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - 200, e.clientX - rect.left - dragOffset.x));
    const y = Math.max(0, Math.min(rect.height - 60, e.clientY - rect.top - dragOffset.y));
    
    onFieldsChange(fields.map(f => 
      f.id === draggedField 
        ? { ...f, position: { x: Math.round(x), y: Math.round(y) } }
        : f
    ));
  }, [draggedField, dragOffset, fields, onFieldsChange]);

  const handleDragEnd = () => {
    setDraggedField(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectField(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData('fieldType') as FieldType;
    if (!fieldType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 100;
    const y = e.clientY - rect.top - 30;

    const newField: BlueprintField = {
      id: `field_${Math.random().toString(36).substring(2, 9)}`,
      type: fieldType,
      label: `New ${fieldTypeLabels[fieldType]}`,
      position: { x: Math.max(0, x), y: Math.max(0, y) },
      required: false,
    };

    onFieldsChange([...fields, newField]);
    onSelectField(newField.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeField = (id: string) => {
    onFieldsChange(fields.filter(f => f.id !== id));
    if (selectedFieldId === id) {
      onSelectField(null);
    }
  };

  return (
    <div 
      ref={canvasRef}
      className={cn(
        "relative w-full h-[600px] bg-white rounded-lg border border-zinc-300 shadow-sm",
        "overflow-hidden cursor-crosshair transition-colors",
        draggedField && "cursor-grabbing"
      )}
      onMouseMove={draggedField ? handleDrag : undefined}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onClick={handleCanvasClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

      {/* Empty state */}
      {fields.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-zinc-400">
            <p className="text-lg font-medium">Drop fields here</p>
            <p className="text-sm">Drag field types from the toolbar to start designing</p>
          </div>
        </div>
      )}

      {/* Fields */}
      {fields.map((field) => {
        const Icon = fieldTypeIcons[field.type];
        const isSelected = selectedFieldId === field.id;
        const isDragging = draggedField === field.id;

        return (
          <div
            key={field.id}
            className={cn(
              "absolute flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
              "cursor-move select-none min-w-[200px]",
              fieldTypeColors[field.type],
              isSelected && "ring-2 ring-primary ring-offset-2",
              isDragging && "opacity-80 scale-105 shadow-xl"
            )}
            style={{
              left: field.position.x,
              top: field.position.y,
              zIndex: isSelected ? 10 : 1
            }}
            onMouseDown={(e) => handleDragStart(e, field.id)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectField(field.id);
            }}
          >
            <GripVertical className="h-4 w-4 text-zinc-400 flex-shrink-0" />
            <Icon className="h-4 w-4 text-zinc-600 flex-shrink-0" />
            <span className="text-zinc-800 text-sm font-medium truncate flex-1">
              {field.label}
            </span>
            {field.required && (
              <span className="text-red-500 text-xs">*</span>
            )}
            {isSelected && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-zinc-500 hover:text-red-500 hover:bg-transparent flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  removeField(field.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface FieldToolbarProps {
  onAddField: (type: FieldType) => void;
}

export function FieldToolbar({ onAddField }: FieldToolbarProps) {
  const handleDragStart = (e: React.DragEvent, type: FieldType) => {
    e.dataTransfer.setData('fieldType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
      <span className="w-full text-sm font-medium text-muted-foreground mb-1">
        Drag to canvas or click to add:
      </span>
      {(Object.entries(fieldTypeLabels) as [FieldType, string][]).map(([type, label]) => {
        const Icon = fieldTypeIcons[type];
        return (
          <button
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            onClick={() => onAddField(type)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all",
              "cursor-grab active:cursor-grabbing hover:scale-105",
              fieldTypeColors[type]
            )}
          >
            <Icon className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

interface FieldPropertiesProps {
  field: BlueprintField | null;
  onUpdateField: (id: string, updates: Partial<BlueprintField>) => void;
  onRemoveField: (id: string) => void;
}

export function FieldProperties({ field, onUpdateField, onRemoveField }: FieldPropertiesProps) {
  if (!field) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Select a field to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Field Label</Label>
        <Input
          value={field.label}
          onChange={(e) => onUpdateField(field.id, { label: e.target.value })}
          placeholder="Enter label"
        />
      </div>

      <div className="space-y-2">
        <Label>Field Type</Label>
        <Select
          value={field.type}
          onValueChange={(value: FieldType) => onUpdateField(field.id, { type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(fieldTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Position</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">X</Label>
            <Input
              type="number"
              value={field.position.x}
              onChange={(e) => onUpdateField(field.id, { 
                position: { ...field.position, x: Number(e.target.value) } 
              })}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Y</Label>
            <Input
              type="number"
              value={field.position.y}
              onChange={(e) => onUpdateField(field.id, { 
                position: { ...field.position, y: Number(e.target.value) } 
              })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label>Required Field</Label>
        <Switch
          checked={field.required || false}
          onCheckedChange={(checked) => onUpdateField(field.id, { required: checked })}
        />
      </div>

      <Button
        variant="destructive"
        className="w-full"
        onClick={() => onRemoveField(field.id)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Field
      </Button>
    </div>
  );
}

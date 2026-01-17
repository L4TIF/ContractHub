import { BlueprintField, FieldType, ContractFieldValue } from '@/types';
import { Type, Calendar, PenLine, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const fieldTypeIcons: Record<FieldType, React.ElementType> = {
  text: Type,
  date: Calendar,
  signature: PenLine,
  checkbox: CheckSquare,
};

const fieldTypeColors: Record<FieldType, string> = {
  text: 'border-blue-500 bg-blue-500/10',
  date: 'border-purple-500 bg-purple-500/10',
  signature: 'border-amber-500 bg-amber-500/10',
  checkbox: 'border-green-500 bg-green-500/10',
};

interface ContractCanvasProps {
  fields: BlueprintField[];
  fieldValues: ContractFieldValue[];
  onFieldValueChange: (fieldId: string, value: string | boolean) => void;
  editable: boolean;
}

export function ContractCanvas({ 
  fields, 
  fieldValues, 
  onFieldValueChange, 
  editable 
}: ContractCanvasProps) {
  const getFieldValue = (fieldId: string) => {
    return fieldValues.find((fv) => fv.fieldId === fieldId)?.value || '';
  };

  // Calculate canvas height based on field positions
  const maxY = Math.max(500, ...fields.map(f => f.position.y + 120));

  return (
    <div 
      className={cn(
        "relative w-full bg-white rounded-lg border border-zinc-200 shadow-sm",
        "overflow-auto p-6"
      )}
      style={{ minHeight: `${maxY}px` }}
    >

      {/* Fields */}
      {fields.map((field) => {
        const value = getFieldValue(field.id);

        // When not editable (view mode), show clean data only
        if (!editable) {
          return (
            <div
              key={field.id}
              className="absolute"
              style={{
                left: field.position.x,
                top: field.position.y,
              }}
            >
              <div className="text-xs text-zinc-500 mb-1">{field.label}</div>
              {field.type === 'checkbox' ? (
                <div className="text-zinc-900 font-medium">
                  {value ? '✓ Yes' : '✗ No'}
                </div>
              ) : field.type === 'signature' ? (
                <div className="text-zinc-900 font-serif italic text-lg border-b border-zinc-300 min-w-[200px] pb-1">
                  {value || '—'}
                </div>
              ) : (
                <div className="text-zinc-900 font-medium">
                  {value || '—'}
                </div>
              )}
            </div>
          );
        }

        // Editable mode with inputs
        return (
          <div
            key={field.id}
            className={cn(
              "absolute flex flex-col gap-2 p-3 rounded-lg border min-w-[220px]",
              fieldTypeColors[field.type]
            )}
            style={{
              left: field.position.x,
              top: field.position.y,
            }}
          >
            <span className="text-zinc-700 text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </span>

            {field.type === 'text' && (
              <Input
                value={value as string}
                onChange={(e) => onFieldValueChange(field.id, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="bg-white border-zinc-300 text-zinc-900"
              />
            )}
            
            {field.type === 'date' && (
              <Input
                type="date"
                value={value as string}
                onChange={(e) => onFieldValueChange(field.id, e.target.value)}
                className="bg-white border-zinc-300 text-zinc-900"
              />
            )}
            
            {field.type === 'signature' && (
              <Input
                value={value as string}
                onChange={(e) => onFieldValueChange(field.id, e.target.value)}
                placeholder="Type your signature"
                className="bg-white border-zinc-300 text-zinc-900 font-serif italic"
              />
            )}
            
            {field.type === 'checkbox' && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id={field.id}
                  checked={value as boolean}
                  onCheckedChange={(checked) => onFieldValueChange(field.id, !!checked)}
                  className="border-zinc-400 data-[state=checked]:bg-primary"
                />
                <label htmlFor={field.id} className="text-sm text-zinc-700">
                  I agree
                </label>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

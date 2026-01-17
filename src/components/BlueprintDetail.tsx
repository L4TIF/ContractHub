import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Type, PenLine, CheckSquare, FileText, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { FieldType } from '@/types';
import { Badge } from '@/components/ui/badge';
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

export function BlueprintDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const blueprint = useStore((state) => state.getBlueprintById(id || ''));

  if (!blueprint) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Blueprint not found</h2>
        <Button onClick={() => navigate('/blueprints')}>Back to Blueprints</Button>
      </div>
    );
  }

  // Calculate canvas height based on field positions
  const maxY = Math.max(400, ...blueprint.fields.map(f => f.position.y + 80));

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/blueprints')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{blueprint.name}</h1>
          <p className="text-muted-foreground">
            Created on {format(new Date(blueprint.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to={`/contracts/new?blueprintId=${blueprint.id}`}>
            <Plus className="h-4 w-4" />
            Create Contract
          </Link>
        </Button>
      </div>

      {/* Visual Canvas Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Blueprint Layout</CardTitle>
          <CardDescription>Visual preview of the contract template</CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="relative w-full bg-white rounded-lg border border-zinc-200 shadow-inner overflow-auto"
            style={{ minHeight: `${maxY}px` }}
          >
            {/* Subtle grid pattern */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            {blueprint.fields.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-zinc-400">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No fields in this blueprint</p>
                </div>
              </div>
            ) : (
              blueprint.fields.map((field) => {
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="mt-1">{blueprint.description || 'No description provided.'}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fields</label>
                <p className="mt-1 text-2xl font-bold">{blueprint.fields.length}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="mt-1">{format(new Date(blueprint.updatedAt), 'MMM d, yyyy h:mm a')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fields List</CardTitle>
            <CardDescription>All fields in this blueprint</CardDescription>
          </CardHeader>
          <CardContent>
            {blueprint.fields.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No fields defined.</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-auto">
                {blueprint.fields.map((field) => {
                  const Icon = fieldTypeIcons[field.type];
                  return (
                    <div
                      key={field.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{field.label}</p>
                        <p className="text-sm text-muted-foreground capitalize">{field.type}</p>
                      </div>
                      {field.required && (
                        <Badge variant="secondary">Required</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

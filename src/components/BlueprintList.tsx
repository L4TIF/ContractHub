import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, LayoutTemplate, FileText, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
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
import { toast } from 'sonner';

export function BlueprintList() {
  const navigate = useNavigate();
  const blueprints = useStore((state) => state.blueprints);
  const deleteBlueprint = useStore((state) => state.deleteBlueprint);

  const handleDelete = (id: string, name: string) => {
    deleteBlueprint(id);
    toast.success(`Blueprint "${name}" deleted`);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blueprints</h1>
          <p className="text-muted-foreground">Manage your contract templates</p>
        </div>
        <Button onClick={() => navigate('/blueprints/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Blueprint
        </Button>
      </div>

      {blueprints.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <LayoutTemplate className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No blueprints yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first blueprint to start generating contracts.
            </p>
            <Button onClick={() => navigate('/blueprints/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Blueprint
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blueprints.map((blueprint) => (
            <Card key={blueprint.id} className="group relative hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <LayoutTemplate className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{blueprint.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <FileText className="h-3 w-3" />
                        {blueprint.fields.length} fields
                      </CardDescription>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Blueprint</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{blueprint.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(blueprint.id, blueprint.name)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {blueprint.description || 'No description provided.'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(blueprint.createdAt), 'MMM d, yyyy')}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/blueprints/${blueprint.id}`}>View</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to={`/contracts/new?blueprintId=${blueprint.id}`}>Use</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { ContractStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ContractStatus;
  className?: string;
}

const statusConfig: Record<ContractStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' }> = {
  created: { label: 'Created', variant: 'secondary' },
  approved: { label: 'Approved', variant: 'info' },
  sent: { label: 'Sent', variant: 'warning' },
  signed: { label: 'Signed', variant: 'success' },
  locked: { label: 'Locked', variant: 'default' },
  revoked: { label: 'Revoked', variant: 'destructive' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config.variant as any}
      className={cn(
        'font-medium',
        config.variant === 'success' && 'bg-success text-success-foreground hover:bg-success/90',
        config.variant === 'warning' && 'bg-warning text-warning-foreground hover:bg-warning/90',
        config.variant === 'info' && 'bg-info text-info-foreground hover:bg-info/90',
        className
      )}
    >
      {config.label}
    </Badge>
  );
}

import { ContractStatus, STATUS_FLOW } from '@/types';
import { cn } from '@/lib/utils';
import { Check, XCircle, Lock, FileText, ThumbsUp, Send, PenLine } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: ContractStatus;
  className?: string;
}

const statusIcons: Record<ContractStatus, React.ElementType> = {
  created: FileText,
  approved: ThumbsUp,
  sent: Send,
  signed: PenLine,
  locked: Lock,
  revoked: XCircle,
};

export function StatusTimeline({ currentStatus, className }: StatusTimelineProps) {
  const isRevoked = currentStatus === 'revoked';
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {STATUS_FLOW.map((status, index) => {
        const Icon = statusIcons[status];
        const isCompleted = !isRevoked && currentIndex >= index;
        const isCurrent = currentStatus === status;

        return (
          <div key={status} className="flex items-center">
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors',
                isCompleted
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-muted-foreground/30 text-muted-foreground',
                isCurrent && 'ring-2 ring-primary ring-offset-2'
              )}
            >
              {isCompleted && index < currentIndex ? (
                <Check className="w-4 h-4" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
            </div>
            {index < STATUS_FLOW.length - 1 && (
              <div
                className={cn(
                  'w-8 h-0.5 mx-1',
                  !isRevoked && currentIndex > index
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30'
                )}
              />
            )}
          </div>
        );
      })}
      {isRevoked && (
        <>
          <div className="w-8 h-0.5 mx-1 bg-destructive" />
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive text-destructive-foreground">
            <XCircle className="w-4 h-4" />
          </div>
        </>
      )}
    </div>
  );
}

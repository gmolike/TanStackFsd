import { memo } from 'react';

import type { HeaderProps } from './Header';
import { Header } from './Header';

type WithProgressProps = HeaderProps & {
  progress: number; // 0-100
  showPercentage?: boolean;
};

/**
 * HeaderWithProgress - Header with progress bar for upload or multi-step forms
 *
 * @param props.progress - Progress percentage (0-100)
 * @param props.showPercentage - Shows percentage next to progress bar (default: false)
 */
function WithProgressComponent({
  progress,
  showPercentage = false,
  description,
  ...props
}: WithProgressProps) {
  const progressElement = (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Fortschritt</span>
        {showPercentage && <span className="font-medium">{Math.round(progress)}%</span>}
      </div>
      <div className="h-2 w-full rounded-full bg-secondary">
        <div
          className="h-2 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );

  const enhancedDescription = description ? (
    <div className="space-y-3">
      {typeof description === 'string' ? <p>{description}</p> : description}
      {progressElement}
    </div>
  ) : (
    progressElement
  );

  return <Header {...props} description={enhancedDescription} descriptionClassName="space-y-3" />;
}

export const WithProgress = memo(WithProgressComponent);
export type { WithProgressProps };

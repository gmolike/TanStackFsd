import { useRef, useState } from 'react';
import type { HTMLProps } from 'react';

import type { ReactNode } from '@tanstack/react-router';

import { Tooltip, TooltipContent, TooltipTrigger } from '~/shared/shadcn';

type Props = { children: ReactNode | string; className?: HTMLProps<HTMLElement>['className'] };

/**
 * Warning: Does not work with "div" and "p" as children. To set CSS attributes use the className parameter.
 * If you need a surrounding element use "span" instead. <br>
 * Cuts of overflowing text and adds a Tooltip only when overflow exists.
 * @param children
 * @param classNames
 * @constructor
 */
export const TextMightyOverflow = ({ children, className }: Props) => {
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [hasOverflowingChildren, setHasOverflowingChildren] = useState(false);

  return (
    <Tooltip
      open={hasOverflowingChildren && tooltipIsOpen}
      onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
        if (open && tooltipRef.current) {
          setHasOverflowingChildren(
            tooltipRef.current.offsetHeight < tooltipRef.current.scrollHeight ||
              tooltipRef.current.offsetWidth < tooltipRef.current.scrollWidth,
          );
        }
        setTooltipIsOpen(open);
      }}
    >
      <TooltipTrigger asChild>
        <div className={`flex-1 truncate ${className}`} ref={tooltipRef}>
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
};

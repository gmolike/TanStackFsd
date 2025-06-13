// src/shared/ui/root-layout/index.tsx
import type { PropsWithChildren } from 'react';

import { cn } from '~/shared/lib/utils';

/**
 * CSDoc: RootLayout Component
 * @description Root layout wrapper that provides consistent page structure
 * @param children - Child components to render
 * @param className - Additional CSS classes
 * @example
 * ```tsx
 * <RootLayout>
 *   <Outlet />
 * </RootLayout>
 * ```
 */

interface RootLayoutProps extends PropsWithChildren {
  className?: string;
}

export const RootLayout = ({ children, className }: RootLayoutProps) => {
  return (
    <div className={cn('min-h-screen bg-background font-sans antialiased', className)}>
      {children}
    </div>
  );
};

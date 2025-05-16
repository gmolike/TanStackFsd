import { memo } from 'react';

import type { FooterProps } from './Footer';
import { Footer } from './Footer';

/**
 * FooterSplit - Split footer with messages left and buttons right
 *
 * Alternative to Footer with variant="split" for consistent API
 */
function SplitComponent(props: Omit<FooterProps, 'variant'>) {
  return <Footer {...props} variant="split" />;
}

export const Split = memo(SplitComponent);

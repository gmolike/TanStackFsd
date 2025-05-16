import { memo } from 'react';

import type { FooterProps } from './Footer';
import { Footer } from './Footer';

/**
 * FooterCentered - Centered footer variant for onboarding and login s
 *
 * Alternative to Footer with variant="centered" for consistent API
 */
function CenteredComponent(props: Omit<FooterProps, 'variant'>) {
  return <Footer {...props} variant="centered" />;
}

export const Centered = memo(CenteredComponent);

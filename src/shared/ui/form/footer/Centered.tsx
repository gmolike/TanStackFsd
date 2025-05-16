import { memo } from 'react';

import type { FooterProps } from './Footer';
import { Footer } from './Footer';

/**
 * CenteredComponent - Centered footer variant for onboarding and login forms
 */
const CenteredComponent = (props: Omit<FooterProps, 'variant'>) => (
  <Footer {...props} variant="centered" />
);

export const Centered = memo(CenteredComponent);

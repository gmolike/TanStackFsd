// src/shared/ui/form/header/Header.test.tsx
import { render, screen } from '@testing-library/react';
import { User } from 'lucide-react';
import { describe, expect, test } from 'vitest';

import { Header } from './Header';

describe('Header Component', () => {
  test('renders title and description', () => {
    render(<Header title="User Profile" description="Update your personal information" />);

    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('Update your personal information')).toBeInTheDocument();
  });

  test('renders with icon', () => {
    render(<Header title="Settings" icon={User} />);

    // Icon container should be present
    const iconContainer = screen.getByText('Settings').parentElement?.parentElement;
    expect(iconContainer?.querySelector('svg')).toBeInTheDocument();
  });

  test('renders different variants', () => {
    const { rerender } = render(<Header title="Title" variant="default" />);

    expect(screen.getByText('Title')).toBeInTheDocument();

    rerender(<Header title="Title" variant="centered" />);
    expect(screen.getByText('Title')).toBeInTheDocument();

    rerender(<Header title="Title" variant="minimal" />);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});

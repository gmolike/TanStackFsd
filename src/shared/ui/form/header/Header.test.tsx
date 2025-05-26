// src/shared/ui/form/header/Header.test.tsx
import { waitFor } from '@testing-library/dom';
import type { RenderResult } from '@testing-library/react';
import { User } from 'lucide-react';
import { afterEach, describe, expect, test } from 'vitest';

import { cleanup, render } from '~/shared/test/test-utils';

import { Header } from './Header';

const setupHeader = async (props: Parameters<typeof Header>[0]): Promise<RenderResult> => {
  const renderResult = render(<Header {...props} />);

  // Wait for header to be rendered
  await waitFor(() => renderResult.getByText(props.title));

  return renderResult;
};

describe('Header Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders title and description', async () => {
    const { getByText } = await setupHeader({
      title: 'Settings',
      description: 'Update your settings',
    });

    getByText('Settings');
    getByText('Update your settings');
  });

  test('renders with icon', async () => {
    const { getByText, container } = await setupHeader({
      title: 'Settings',
      icon: User,
    });

    getByText('Settings');

    // Check if SVG icon is present
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  test('renders different variants', async () => {
    const { rerender, getByText } = await setupHeader({
      title: 'Title',
      variant: 'default',
    });

    getByText('Title');

    rerender(<Header title="Title" variant="centered" />);
    await waitFor(() => getByText('Title'));

    rerender(<Header title="Title" variant="minimal" />);
    await waitFor(() => getByText('Title'));
  });
});

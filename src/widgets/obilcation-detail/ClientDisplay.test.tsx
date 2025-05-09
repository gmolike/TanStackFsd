import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ClientDisplay } from '../ClientDisplay';

// Mock dependent components
vi.mock('features/clients', () => ({
  ClientDetail: ({
    clientId,
    onCardTitleClick,
  }: {
    clientId: string;
    onCardTitleClick: () => void;
  }) => (
    <div data-testid="client-detail" onClick={onCardTitleClick}>
      Client Detail {clientId}
    </div>
  ),
  ClientShortInfo: ({
    shortName,
    type,
    city,
    detailBlockOnClick,
  }: {
    shortName: string;
    type: string;
    city: string;
    detailBlockOnClick: () => void;
  }) => (
    <div data-testid="client-short-info" onClick={detailBlockOnClick}>
      Client {shortName} {type} {city}
    </div>
  ),
}));

describe('ClientDisplay component', () => {
  const mockObligationDetail = {
    clientShortName: 'TestClient',
    clientType: 'Company',
    clientCity: 'Berlin',
  };

  it('should render client short info by default', () => {
    render(<ClientDisplay clientId="client-123" obligationDetail={mockObligationDetail as any} />);

    expect(screen.getByTestId('client-short-info')).toBeInTheDocument();
    expect(screen.queryByTestId('client-detail')).not.toBeInTheDocument();
  });

  it('should switch to client detail view when clicked', () => {
    render(<ClientDisplay clientId="client-123" obligationDetail={mockObligationDetail as any} />);

    // Click on the short info to show details
    fireEvent.click(screen.getByTestId('client-short-info'));

    // Should now show client detail
    expect(screen.getByTestId('client-detail')).toBeInTheDocument();
    expect(screen.queryByTestId('client-short-info')).not.toBeInTheDocument();
  });

  it('should switch back to short info when client detail is clicked', () => {
    render(<ClientDisplay clientId="client-123" obligationDetail={mockObligationDetail as any} />);

    // Click to show details
    fireEvent.click(screen.getByTestId('client-short-info'));

    // Click again to hide details
    fireEvent.click(screen.getByTestId('client-detail'));

    // Should show short info again
    expect(screen.getByTestId('client-short-info')).toBeInTheDocument();
    expect(screen.queryByTestId('client-detail')).not.toBeInTheDocument();
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Detail } from '../Detail';

// Mock the necessary API calls but use actual component implementations
vi.mock('entities/clients/api/useQuery', () => ({
  useObligationDetail: vi.fn().mockReturnValue({
    data: {
      id: 'obligation-123',
      status: 'ACTIVE',
      obligatedPersonId: 'person-123',
      obligationStart: '2023-01-01',
      obligationEnd: '2023-12-31',
      creatorLastName: 'Creator',
      creationDate: '2023-01-01',
      editorLastName: 'Editor',
      editDate: '2023-02-01',
      clientShortName: 'TestClient',
      clientType: 'Company',
      clientCity: 'Berlin',
      obligatedPersonRank: 'Manager',
      obligatedPersonLastName: 'Doe',
      obligatedPersonFirstName: 'John',
      additionalWords: [{ word: 'Word1', startDate: '2023-01-01', endDate: '2023-12-31' }],
      notes: 'Test notes',
    },
    isLoading: false,
    isError: false,
  }),
}));

// Mock client and person related dependencies
vi.mock('features/clients', () => ({
  ClientDetail: ({ clientId, onCardTitleClick }) => (
    <div data-testid="client-detail" onClick={onCardTitleClick}>
      Client Detail {clientId}
    </div>
  ),
  ClientShortInfo: ({ shortName, type, city, detailBlockOnClick }) => (
    <div data-testid="client-short-info" onClick={detailBlockOnClick}>
      Client {shortName} {type} {city}
    </div>
  ),
}));

vi.mock('features/persons', () => ({
  PersonsDetail: ({ personId, onCardTitleClick }) => (
    <div data-testid="person-detail" onClick={onCardTitleClick}>
      Person Detail {personId}
    </div>
  ),
  PersonsShortInfo: ({ rank, lastName, firstName, detailBlockOnClick }) => (
    <div data-testid="person-short-info" onClick={detailBlockOnClick}>
      Person {rank} {lastName} {firstName}
    </div>
  ),
}));

// Still need to mock some UI components
vi.mock('shared/shadcn', () => ({
  Card: ({ children, 'data-testid': testId }) => <div data-testid={testId}>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, disabled }) => <button disabled={disabled}>{children}</button>,
}));

// The remaining shared UI components
vi.mock('shared/ui', () => {
  // Preserve original module implementation except for specific components
  const originalModule = vi.importActual('shared/ui');

  return {
    ...originalModule,
    DetailCardHeader: ({ title, backlink }) => (
      <div data-testid="detail-card-header">
        {title} <a href={backlink}>Back</a>
      </div>
    ),
    QueryStateHandler: ({ isLoading, isError, children }) => {
      if (isLoading) return <div>Loading...</div>;
      if (isError) return <div>Error!</div>;
      return <>{children}</>;
    },
    StatusBadge: ({ value }) => <div data-testid="status-badge">{value}</div>,
  };
});

describe('Obligation Detail Integration', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it('should render the obligation detail with expandable client and person sections', async () => {
    render(<Detail clientId="client-123" obligationId="obligation-123" backlink="/back" />, {
      wrapper: createWrapper(),
    });

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByTestId('obligation-details')).toBeInTheDocument();
    });

    // Initially show short info for client and person
    expect(screen.getByTestId('client-short-info')).toBeInTheDocument();
    expect(screen.getByTestId('person-short-info')).toBeInTheDocument();

    // Expand client details
    fireEvent.click(screen.getByTestId('client-short-info'));

    // Should now show client detail
    expect(screen.getByTestId('client-detail')).toBeInTheDocument();
    expect(screen.queryByTestId('client-short-info')).not.toBeInTheDocument();

    // Collapse client details
    fireEvent.click(screen.getByTestId('client-detail'));

    // Should show client short info again
    expect(screen.getByTestId('client-short-info')).toBeInTheDocument();

    // Expand person details
    fireEvent.click(screen.getByTestId('person-short-info'));

    // Should now show person detail
    expect(screen.getByTestId('person-detail')).toBeInTheDocument();
    expect(screen.queryByTestId('person-short-info')).not.toBeInTheDocument();

    // Collapse person details
    fireEvent.click(screen.getByTestId('person-detail'));

    // Should show person short info again
    expect(screen.getByTestId('person-short-info')).toBeInTheDocument();
  });
});

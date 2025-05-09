import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useApi } from '../api/useApi';
import { Detail } from '../Detail';

// Mock the API hook
vi.mock('../api/useApi', () => ({
  useApi: vi.fn(),
}));

// Mock the UI components
vi.mock('../ui/ClientDisplay', () => ({
  ClientDisplay: ({
    clientId,
    obligationDetail,
  }: {
    clientId: string;
    obligationDetail?: { id: string };
  }) => (
    <div data-testid="client-display">
      Client Display {clientId} {obligationDetail?.id}
    </div>
  ),
}));

vi.mock('../ui/PersonDisplay', () => ({
  PersonDisplay: ({
    personId,
    obligationDetail,
  }: {
    personId: string;
    obligationDetail?: { id: string };
  }) => (
    <div data-testid="person-display">
      Person Display {personId} {obligationDetail?.id}
    </div>
  ),
}));

// Mock shared UI components
vi.mock('shared/ui', () => ({
  DetailCardHeader: ({ title, backlink }: { title: string; backlink: string }) => (
    <div data-testid="detail-card-header">
      {title} <a href={backlink}>Back</a>
    </div>
  ),
  DetailBlock: ({ headline, children }: { headline: string; children: React.ReactNode }) => (
    <div data-testid="detail-block" data-headline={headline}>
      {children}
    </div>
  ),
  DetailLabelValuePair: ({ label, text }: { label: string; text: string }) => (
    <div data-testid="detail-label-value">
      {label}: {text}
    </div>
  ),
  EntityDetailTable: ({ title, data }: { title: string; data: Array<{ [key: string]: any }> }) => (
    <div data-testid="entity-detail-table" data-title={title}>
      Table with {data.length || 0} rows
    </div>
  ),
  QueryStateHandler: ({
    isLoading,
    isError,
    children,
  }: {
    isLoading: boolean;
    isError: boolean;
    children: React.ReactNode;
  }) => (
    <div data-testid="query-state-handler">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error!</div>}
      {!isLoading && !isError && children}
    </div>
  ),
  StatusBadge: ({ value }: { value: string | number }) => (
    <div data-testid="status-badge">{value}</div>
  ),
}));

describe('Detail component', () => {
  const mockObligationDetail = {
    id: 'obligation-123',
    status: 'ACTIVE',
    obligatedPersonId: 'person-123',
    obligationStart: '2023-01-01',
    obligationEnd: '2023-12-31',
    creatorLastName: 'Creator',
    creationDate: '2023-01-01',
    editorLastName: 'Editor',
    editDate: '2023-02-01',
    additionalWords: [{ word: 'Word1', startDate: '2023-01-01', endDate: '2023-12-31' }],
    notes: 'Test notes',
  };

  it('should display loading state', () => {
    vi.mocked(useApi).mockReturnValue({
      isLoading: true,
      isError: false,
      obligationDetail: undefined,
      personId: undefined,
    });

    render(<Detail clientId="client-123" obligationId="obligation-123" backlink="/back" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display error state', () => {
    vi.mocked(useApi).mockReturnValue({
      isLoading: false,
      isError: true,
      obligationDetail: undefined,
      personId: undefined,
    });

    render(<Detail clientId="client-123" obligationId="obligation-123" backlink="/back" />);

    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  it('should render obligation details correctly', () => {
    vi.mocked(useApi).mockReturnValue({
      isLoading: false,
      isError: false,
      obligationDetail: mockObligationDetail,
      personId: 'person-123',
    });

    render(<Detail clientId="client-123" obligationId="obligation-123" backlink="/back" />);

    // Check header
    expect(screen.getByTestId('detail-card-header')).toHaveTextContent(
      'Verpflichtung obligation-123',
    );

    // Check client and person displays
    expect(screen.getByTestId('client-display')).toBeInTheDocument();
    expect(screen.getByTestId('person-display')).toBeInTheDocument();

    // Check detail sections
    const detailBlocks = screen.getAllByTestId('detail-block');

    // Check validity period
    const validityBlock = detailBlocks.find(
      (block) => block.getAttribute('data-headline') === 'Gültigkeitszeitraum',
    );
    expect(validityBlock).toBeInTheDocument();
    if (validityBlock) {
      within(validityBlock).getByText(/2023-01-01/);
      within(validityBlock).getByText(/2023-12-31/);
    }

    // Check additional words table
    expect(screen.getByTestId('entity-detail-table')).toHaveAttribute('data-title', 'Zusatzwort');
    expect(screen.getByText('Table with 1 rows')).toBeInTheDocument();

    // Check notes
    const notesBlock = detailBlocks.find(
      (block) => block.getAttribute('data-headline') === 'Hinweis',
    );
    expect(notesBlock).toBeInTheDocument();
    if (notesBlock) {
      within(notesBlock).getByText('Test notes');
    }
  });
});

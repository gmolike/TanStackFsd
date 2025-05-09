import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PersonDisplay } from '../PersonDisplay';

// Mock dependent components
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

describe('PersonDisplay component', () => {
  const mockObligationDetail = {
    obligatedPersonRank: 'Manager',
    obligatedPersonLastName: 'Doe',
    obligatedPersonFirstName: 'John',
  };

  it('should render person short info by default', () => {
    render(<PersonDisplay personId="person-123" obligationDetail={mockObligationDetail as any} />);

    expect(screen.getByTestId('person-short-info')).toBeInTheDocument();
    expect(screen.queryByTestId('person-detail')).not.toBeInTheDocument();
  });

  it('should not switch to detail view if personId is undefined', () => {
    render(<PersonDisplay personId={undefined} obligationDetail={mockObligationDetail as any} />);

    // Click on the short info
    fireEvent.click(screen.getByTestId('person-short-info'));

    // Should still show short info (no personId to fetch details)
    expect(screen.getByTestId('person-short-info')).toBeInTheDocument();
    expect(screen.queryByTestId('person-detail')).not.toBeInTheDocument();
  });

  it('should switch to person detail view when clicked with valid personId', () => {
    render(<PersonDisplay personId="person-123" obligationDetail={mockObligationDetail as any} />);

    // Click on the short info to show details
    fireEvent.click(screen.getByTestId('person-short-info'));

    // Should now show person detail
    expect(screen.getByTestId('person-detail')).toBeInTheDocument();
    expect(screen.queryByTestId('person-short-info')).not.toBeInTheDocument();
  });

  it('should switch back to short info when person detail is clicked', () => {
    render(<PersonDisplay personId="person-123" obligationDetail={mockObligationDetail as any} />);

    // Click to show details
    fireEvent.click(screen.getByTestId('person-short-info'));

    // Click again to hide details
    fireEvent.click(screen.getByTestId('person-detail'));

    // Should show short info again
    expect(screen.getByTestId('person-short-info')).toBeInTheDocument();
    expect(screen.queryByTestId('person-detail')).not.toBeInTheDocument();
  });
});

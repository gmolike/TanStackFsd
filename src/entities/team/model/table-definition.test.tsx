import { describe, expect, it } from 'vitest';

import { commonDataTableMocks, testCellRendering, testTableDefinition } from '~/shared/test/utils';

import { createTeamMemberFactory } from './__test__/test-factories';
import { teamColumnSets, teamTableDefinition } from './table-definition';

// Mock shared UI components
vi.mock('~/shared/ui/data-table', () => commonDataTableMocks);

// Mock status badge
vi.mock('../../ui/status-badge', () => ({
  StatusBadge: ({ status }: { status: string }) => <span data-testid="status-badge">{status}</span>,
}));

describe('Team Table Definition', () => {
  const mockTeamMember = createTeamMemberFactory();

  // Nutze generischen Table Test Helper
  testTableDefinition(teamTableDefinition, {
    requiredFields: ['name', 'email', 'role', 'department', 'status', 'actions'],
    testData: mockTeamMember,
    fieldTests: {
      name: {
        accessor: 'Max Mustermann',
        config: { sortable: true, searchable: true },
      },
      email: {
        accessor: 'test@example.com',
        config: { sortable: true, searchable: true },
      },
      status: {
        accessor: 'active',
        config: { sortable: false, searchable: false },
      },
      actions: {
        config: { sortable: false, searchable: false, cellType: 'actions' },
      },
    },
  });

  describe('Cell Components', () => {
    it('should render name cell correctly', () => {
      const nameField = teamTableDefinition.fields.find((f) => f.id === 'name');

      testCellRendering(nameField, { value: 'ignored', row: mockTeamMember }, (container) => {
        const cell = container.querySelector('.font-medium');
        expect(cell).toBeTruthy();
        expect(cell?.textContent).toBe('Max Mustermann');
      });
    });
  });

  describe('Column Sets', () => {
    it('should only include valid field ids', () => {
      const allFieldIds = teamTableDefinition.fields.map((f) => f.id);

      Object.values(teamColumnSets).forEach((columnSet) => {
        columnSet.forEach((columnId) => {
          expect(allFieldIds).toContain(columnId);
        });
      });
    });
  });
});

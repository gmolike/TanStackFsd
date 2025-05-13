import { waitFor } from '@testing-library/dom';
import type { RenderResult } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { obligationDetailMapper } from 'entities/obligations';
import { useObligationDetail } from 'entities/clients/api/useQuery';

import { mock } from 'test/MockFactory';
import { obligationDetailStructure } from 'test/test-utils/custom-assertions/common';
import { assert, findDetailsTable } from 'test/test-utils/custom-assertions/vitest';
import { cleanup, render } from 'test/test-utils/testUtils';
import { createQueryResult } from 'shared/test/query-helpers';

import { useApi } from './api/useApi';
import { ObligationDetail } from './index';

// Mock der Module
vi.mock('entities/clients/api/useQuery', () => ({
  useObligationDetail: vi.fn(),
}));

vi.mock('entities/obligations', () => ({
  obligationDetailMapper: {
    toFrontendType: vi.fn(),
  },
}));

const setup = async (clientId: string, obligationId = ''): Promise<RenderResult> => {
  const renderResult = render(
    <ObligationDetail clientId={clientId} obligationId={obligationId} backlink={'/foo'} />,
  );
  await renderResult.findByRole('heading', {
    name: 'Verpflichtung' + (obligationId ? ` ${obligationId}` : ''),
  });
  return renderResult;
};

// Mock-Daten wie vorher
const obligationDetailMock = obligationDetailMapper.toFrontendType(mock.dto.obligationDetail());

// API Mock-Struktur beibehalten
const apiMock = {
  isLoading: false,
  isError: false,
  obligationDetail: obligationDetailMock,
  personId: obligationDetailMock.obligatedPersonId,
};

describe('obligationDetailView basics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock den obligationDetailMapper
    vi.mocked(obligationDetailMapper.toFrontendType).mockReturnValue(obligationDetailMock);

    // Mock useObligationDetail mit dem Helper
    vi.mocked(useObligationDetail).mockReturnValue(
      createQueryResult({
        data: mock.dto.obligationDetail(),
        isSuccess: true,
        status: 'success',
      }),
    );
  });

  afterEach(cleanup);

  test('basic layout', async () => {
    // useApi wird nicht direkt gemockt, sondern nutzt die gemockten Dependencies
    const { container, findByRole } = await setup(crypto.randomUUID(), obligationDetailMock.id);

    expect((await findByRole('link')).getAttribute('href')).toBe('/foo');

    assert.detailForm(container, obligationDetailStructure(obligationDetailMock));

    await waitFor(() =>
      assert
        .table(findDetailsTable(container, 'Zusatzwort'))
        .hasHeaders(['Zusatzwort', 'Beginn', 'Ende'])
        .hasRowsCount(6)
        .hasRowsContent(
          (obligationDetailMock.additionalWords ?? []).map((a) => [a.word, a.startDate, a.endDate]),
        ),
    );
  });

  test('person and client details should be closed', async () => {
    const { findByRole, queryByText, queryByTestId } = await setup(
      crypto.randomUUID(),
      obligationDetailMock.id,
    );

    const checkDetailsClosed = async (
      showButtonText: RegExp,
      hideButtonText: RegExp,
      appearingTestId: string,
    ) => {
      await findByRole('button', { name: showButtonText });
      await waitFor(() => expect(queryByText(hideButtonText)).toBeNull());
      await waitFor(() => expect(queryByTestId(appearingTestId)).toBeNull());
    };
    await checkDetailsClosed(/Kunde/i, /Kundendetails/i, 'client-details');
    await checkDetailsClosed(/Verpflichtete Person/i, /Personendetails/i, 'person-details');
  });

  test('person and client details should be opened', async () => {
    const { queryByRole, findByText, findByTestId } = await setup(
      crypto.randomUUID(),
      obligationDetailMock.id,
    );

    const checkDetailsOpen = async (
      showButtonText: RegExp,
      hideButtonText: RegExp,
      appearingTestId: string,
    ) => {
      await waitFor(() => expect(queryByRole('button', { name: showButtonText })).toBeNull());
      await findByTestId(appearingTestId);
      await findByText(hideButtonText);
    };
    await checkDetailsOpen(/Kunde/i, /Kundendetails/i, 'client-details');
    await checkDetailsOpen(/Verpflichtete Person/i, /Personendetails/i, 'person-details');
  });
});

describe('obligationDetailView loading', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(obligationDetailMapper.toFrontendType).mockReturnValue(obligationDetailMock);

    // Mock Loading-Zustand mit Helper
    vi.mocked(useObligationDetail).mockReturnValue(
      createQueryResult({
        isLoading: true,
        isPending: true,
        status: 'pending',
        fetchStatus: 'fetching',
      }),
    );
  });

  afterEach(cleanup);

  test('obligation is still loading', async () =>
    await setup(crypto.randomUUID()).then(({ findByText }) => findByText(/lade/i)));
});

describe('obligationDetailView error', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(obligationDetailMapper.toFrontendType).mockReturnValue(obligationDetailMock);

    // Mock Error-Zustand mit Helper
    vi.mocked(useObligationDetail).mockReturnValue(
      createQueryResult({
        error: new Error('API Error'),
        isError: true,
        status: 'error',
        fetchStatus: 'idle',
      }),
    );
  });

  afterEach(cleanup);

  test('obligation detail loading error', async () =>
    await setup(crypto.randomUUID()).then(({ findByText }) => findByText(/fehler/i)));
});

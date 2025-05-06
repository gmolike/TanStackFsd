// src/widgets/client-details/model/use-client-detail.ts

import { useState } from 'react';
import { useClientById } from '~/entities/client/api/client-api';
import { ClientDetailTableType } from '~/entities/client/model/types';

export const useClientDetail = (clientId: string) => {
  const { data: client, isLoading, isError } = useClientById(clientId);
  const [currentExpandedTable, setCurrentExpandedTable] = useState<ClientDetailTableType | null>(
    null,
  );

  const onExpandButtonClick = (tableType: ClientDetailTableType) => () => {
    setCurrentExpandedTable(currentExpandedTable === tableType ? null : tableType);
  };

  return {
    client,
    isLoading,
    isError,
    currentExpandedTable,
    onExpandButtonClick,
  };
};

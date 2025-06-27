import type { Dispatch, PropsWithChildren, ReactNode, SetStateAction } from 'react';

import { Button } from '~/shared/shadcn';
import { CompactDeleteButton } from '~/shared/ui/dataTable';

type Props = {
  title: string;
  onEditButtonClick: () => void;
  onDeleteButtonClick: Dispatch<SetStateAction<boolean>>;
  subHeaderComponent?: ReactNode;
  onDetailClose: () => void;
};

export const Header = ({
  title,
  onEditButtonClick,
  onDeleteButtonClick,
  subHeaderComponent,
  onDetailClose,
  children,
}: PropsWithChildren<Props>) => (
  <div className="space-y-6">
    <div className="mb-0 flex flex-col gap-4 pl-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="mt-2 text-gray-600">{subHeaderComponent}</div>
      </div>
    </div>
    <section className="pb-6">
      <div className="mx-8 flex items-center justify-between py-6">
        <Button variant="ghost" onClick={onDetailClose}>
          ← Detailansicht schließen
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEditButtonClick}>
            Bearbeiten
          </Button>
          <CompactDeleteButton onClick={() => onDeleteButtonClick(true)} />
        </div>
      </div>
      {children}
    </section>
  </div>
);

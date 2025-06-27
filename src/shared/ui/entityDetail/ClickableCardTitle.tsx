import { ChevronsLeft } from 'lucide-react';

import { CardTitle } from '~/shared/shadcn';

type Props = {
  text: string;
  onClick: () => void;
};

export const ClickableCardTitle = ({ text, onClick }: Props) => (
  <CardTitle>
    <button
      className="-my-1 -ml-3 flex cursor-pointer items-center rounded-md px-3 py-1 hover:bg-gray-200"
      title="Details schließen"
      onClick={onClick}
    >
      {text}
      <ChevronsLeft size={25} className="ml-2" />
    </button>
  </CardTitle>
);

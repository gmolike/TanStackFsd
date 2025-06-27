import { ChevronsRight } from 'lucide-react';

type Props = {
  text: string;
  tooltip: string;
  onClick: () => void;
};

export const ExpandableHeadline = ({ text, tooltip, onClick }: Props) => (
  <button
    className="-ml-2 inline-flex items-center justify-center whitespace-nowrap rounded-sm bg-gray-100 px-2 hover:bg-gray-200"
    title={tooltip}
    onClick={onClick}
  >
    {text}
    <ChevronsRight size={20} className="ml-1" />
  </button>
);

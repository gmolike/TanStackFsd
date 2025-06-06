import { useParams } from '@tanstack/react-router';

import { TeamDetailWidget } from '~/widgets/team';

export const Detail = () => {
  const { memberId } = useParams({ from: '/team/$memberId' });
  return <TeamDetailWidget memberId={memberId} />;
};

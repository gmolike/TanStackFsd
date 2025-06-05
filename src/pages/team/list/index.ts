// src/pages/team/list/index.ts

// Page component
export { TeamListPage } from './ui/page';

// View components
export { TeamCardView } from './ui/card-view';
export { TeamTableView } from './ui/table-view';

// API utilities as namespace to avoid naming conflicts
export * as teamListApi from './api/usePageQueries';

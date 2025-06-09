// src/widgets/dashboard/team-section/TeamSection.tsx
import { DashboardTable } from '~/features/team/dashboard-table';

/**
 * Team Section Widget für Dashboard
 * @component
 */
export const TeamSection = () => (
  <section className="py-8">
    <h2 className="mb-6 text-2xl font-bold">Unser Team</h2>
    <DashboardTable />
  </section>
);

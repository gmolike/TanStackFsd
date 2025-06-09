// src/pages/home/ui/page.tsx
import { TeamSection } from '~/widgets/dashboard';

export function HomePage() {
  return (
    <div className="container mx-auto">
      <h1 className="mb-8 text-4xl font-bold">Dashboard</h1>
      <TeamSection />
    </div>
  );
}

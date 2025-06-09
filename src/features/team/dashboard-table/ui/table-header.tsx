// src/features/team/dashboard-table/ui/table-header.tsx
import { UserCheck, Users, Wifi } from 'lucide-react';

import { Card } from '~/shared/shadcn';

import type { TableStatsProps } from '../model/types';

/**
 * Header mit Statistiken für die Team-Tabelle
 */
export const TableHeader = ({ total, active, remote }: TableStatsProps) => (
  <div className="mb-6 grid gap-4 md:grid-cols-3">
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="text-sm text-muted-foreground">Gesamt</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
      </div>
    </Card>

    <Card className="p-4">
      <div className="flex items-center gap-3">
        <UserCheck className="h-8 w-8 text-green-600" />
        <div>
          <p className="text-sm text-muted-foreground">Aktiv</p>
          <p className="text-2xl font-bold">{active}</p>
        </div>
      </div>
    </Card>

    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Wifi className="h-8 w-8 text-blue-600" />
        <div>
          <p className="text-sm text-muted-foreground">Remote</p>
          <p className="text-2xl font-bold">{remote}</p>
        </div>
      </div>
    </Card>
  </div>
);

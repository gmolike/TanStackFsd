// src/widgets/client-details/ui/client-detail-card.tsx

import { type FC } from 'react';

// Entity imports
import type { Deadline, Dfma, Report, SecurityPersonnel } from '~/entities/client/model/types';
import { ClientDetailTableType } from '~/entities/client/model/types';
import type { Obligation } from '~/entities/obligation/model/types';

// Shared
import { ClientStatus } from '~/shared/api/types';
import { cn } from '~/shared/lib/utils';

// UI components
import {
  DetailBlock,
  DetailCardHeader,
  DetailLabelValuePair,
  EntityDetailTable,
} from '~/shared/ui/entity-detail';
import { QueryStateHandler } from '~/shared/ui/query-state-handler';
import { StatusBadge } from '~/shared/ui/status-badge';
import { Card, CardContent } from '~/shared/ui/card';
import { DropdownMenuContent, DropdownMenuItem } from '~/shared/ui/dropdown-menu';

// Model
import { useClientDetail } from '../model/use-client-detail';

interface ClientDetailCardProps {
  clientId: string;
  backlink?: string;
  onCardTitleClick?: () => void;
}

export const ClientDetailCard: FC<ClientDetailCardProps> = ({
  clientId,
  backlink,
  onCardTitleClick,
}) => {
  const { client, isLoading, isError, currentExpandedTable, onExpandButtonClick } =
    useClientDetail(clientId);

  const title = client ? `Kundendetails ${client.shortName}` : 'Kundendetails';

  return (
    <Card data-testid="client-details" className={cn({ 'bg-gray-100': onCardTitleClick })}>
      <DetailCardHeader
        title={title}
        backlink={backlink}
        onCardTitleClick={onCardTitleClick}
        dropdownMenuContent={
          <DropdownMenuContent className="" align="end">
            <DropdownMenuItem disabled>Verpflichtung anlegen</DropdownMenuItem>
            <DropdownMenuItem disabled>neuen Kunden anlegen</DropdownMenuItem>
            <DropdownMenuItem disabled>Kunden bearbeiten</DropdownMenuItem>
            <DropdownMenuItem disabled>Sicherheitspersonal anlegen</DropdownMenuItem>
            <DropdownMenuItem disabled>Frist anlegen</DropdownMenuItem>
            <DropdownMenuItem disabled>Bericht anlegen</DropdownMenuItem>
          </DropdownMenuContent>
        }
      />
      <CardContent>
        <QueryStateHandler isLoading={isLoading} isError={isError}>
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <div>Status</div>
              {client?.status && <StatusBadge enumType={ClientStatus} value={client.status} />}
            </div>

            <DetailBlock headline="Kundendaten" columnsPerRow={4}>
              <DetailLabelValuePair label={'Name'} text={client?.name} />
              <DetailLabelValuePair label={'Kurzname'} text={client?.shortName} />
              <DetailLabelValuePair label={'ZS-Nr'} text={client?.zsNo} />
              <DetailLabelValuePair label={'ZS-Filial-Nr'} text={client?.zsDepartmentNo} />
              <DetailLabelValuePair label={'Land'} text={client?.address.country} />
              <DetailLabelValuePair label={'Ort'} text={client?.address.city} />
              <DetailLabelValuePair label={'PLZ'} text={client?.address.zipCode} />
              <DetailLabelValuePair label={'Straße'} text={client?.address.street} />
            </DetailBlock>

            <EntityDetailTable<SecurityPersonnel>
              title={ClientDetailTableType.securityPersonal}
              data={client?.securityPersonnel}
              columnInfo={[
                { header: 'Name', identifier: 'securityPersonName' },
                { header: 'Tätigkeit', identifier: 'securityPersonnelOccupation' },
              ]}
              isTableExpanded={currentExpandedTable === ClientDetailTableType.securityPersonal}
              onExpandButtonClick={onExpandButtonClick(ClientDetailTableType.securityPersonal)}
            />

            <EntityDetailTable<Obligation>
              title={ClientDetailTableType.obligation}
              data={client?.obligations}
              columnInfo={[
                { header: 'ID Verpflichtung', identifier: 'id' },
                { header: 'Beginn', identifier: 'obligationStart' },
                { header: 'Ende', identifier: 'obligationEnd' },
                { header: 'Bearbeitungsdatum', identifier: 'editDate' },
              ]}
              isTableExpanded={currentExpandedTable === ClientDetailTableType.obligation}
              onExpandButtonClick={onExpandButtonClick(ClientDetailTableType.obligation)}
            />

            <EntityDetailTable<Report>
              title={ClientDetailTableType.report}
              data={client?.reports}
              columnInfo={[
                { header: 'Berichtsart', identifier: 'type' },
                { header: 'Berichtsdatum', identifier: 'date' },
                { header: 'Berichtergebnis', identifier: 'result' },
                { header: 'Bearbeiter', identifier: 'creatorPersonnelNumber' },
              ]}
              isTableExpanded={currentExpandedTable === ClientDetailTableType.report}
              onExpandButtonClick={onExpandButtonClick(ClientDetailTableType.report)}
            />

            <EntityDetailTable<Deadline>
              title={ClientDetailTableType.deadline}
              data={client?.deadlines}
              columnInfo={[
                { header: 'Fristdatum', identifier: 'deadlineDate' },
                { header: 'Fristgrund', identifier: 'reason' },
                { header: 'Eintragsdatum', identifier: 'createdAt' },
                { header: 'Erledigt', identifier: 'completed' },
                { header: 'Bearbeiter', identifier: 'creatorPersonnelNumber' },
              ]}
              isTableExpanded={currentExpandedTable === ClientDetailTableType.deadline}
              onExpandButtonClick={onExpandButtonClick(ClientDetailTableType.deadline)}
            />

            <EntityDetailTable<Dfma>
              title={ClientDetailTableType.dfma}
              data={client?.dfmas}
              columnInfo={[
                { header: 'Gebäude', identifier: 'building' },
                { header: 'Raum', identifier: 'room' },
                { header: 'Genehmigt durch', identifier: 'approvedBy' },
                { header: 'Genehmigt bis', identifier: 'approvedUntil' },
                { header: 'Vorläufig', identifier: 'provisionally' },
                { header: 'Bezugsdokument', identifier: 'relatedDocument' },
              ]}
              isTableExpanded={currentExpandedTable === ClientDetailTableType.dfma}
              onExpandButtonClick={onExpandButtonClick(ClientDetailTableType.dfma)}
            />
          </div>
        </QueryStateHandler>
      </CardContent>
    </Card>
  );
};

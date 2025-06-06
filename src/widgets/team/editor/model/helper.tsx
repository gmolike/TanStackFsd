import { Loader2 } from 'lucide-react';

import { Alert, AlertDescription, Button, Card, CardContent, CardHeader } from '~/shared/shadcn';

export const LoadingState = () => (
  <div className="container mx-auto max-w-4xl py-8">
    <Card>
      <CardContent className="flex flex-col items-center py-12">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Lade Teammitglied...</p>
      </CardContent>
    </Card>
  </div>
);

type ErrorStateProps = {
  onBack: () => void;
};

export const ErrorState = ({ onBack }: ErrorStateProps) => (
  <div className="container mx-auto max-w-4xl py-8">
    <Card>
      <CardHeader>
        <Alert variant="destructive">
          <AlertDescription>Teammitglied nicht gefunden</AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button onClick={onBack}>Zurück zur Übersicht</Button>
      </CardContent>
    </Card>
  </div>
);

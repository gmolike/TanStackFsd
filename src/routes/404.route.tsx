import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/*')({
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1>404 - Seite nicht gefunden</h1>
      <p>Die angeforderte Seite existiert nicht.</p>
    </div>
  );
}

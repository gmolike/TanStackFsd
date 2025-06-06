export const InfoRow = ({ label, value }: { label: string; value: boolean }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm">{label}</span>
    <span className={`text-sm font-medium ${value ? 'text-green-600' : 'text-gray-500'}`}>
      {value ? 'Aktiviert' : 'Deaktiviert'}
    </span>
  </div>
);

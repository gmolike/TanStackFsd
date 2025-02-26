import { type User } from './model/types';

interface UserAvatarProps {
  user: User | null;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar = ({ user, size = 'md' }: UserAvatarProps) => {
  if (!user) return null;

  // Größenberechnung
  const sizeMap = {
    sm: '32px',
    md: '40px',
    lg: '48px',
  };

  const fontSize = {
    sm: '14px',
    md: '16px',
    lg: '20px',
  };

  // Initialen des Benutzers
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  // Zufällige, aber konsistente Farbe basierend auf Benutzer-ID
  const getColorFromId = (id: string) => {
    const colors = [
      '#3b82f6', // Blau
      '#10b981', // Grün
      '#f97316', // Orange
      '#8b5cf6', // Lila
      '#ef4444', // Rot
      '#06b6d4', // Cyan
    ];

    // Einfache Hash-Funktion
    const hash = id.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    return colors[hash % colors.length];
  };

  return (
    <div
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        borderRadius: '50%',
        backgroundColor: getColorFromId(user.id),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: fontSize[size],
      }}
      title={user.name}
    >
      {initials}
    </div>
  );
};

interface UserInfoProps {
  user: User | null;
  showRole?: boolean;
}

export const UserInfo = ({ user, showRole = false }: UserInfoProps) => {
  if (!user) return null;

  return (
    <div>
      <div style={{ fontWeight: 'bold' }}>{user.name}</div>
      {showRole && <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>{user.role}</div>}
    </div>
  );
};

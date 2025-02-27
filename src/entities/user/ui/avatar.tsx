import { JSX } from 'react';

import { type User } from '../model/types';

type UserAvatarProps = {
  user: User | null;
  size?: 'sm' | 'md' | 'lg';
};

export const Avatar = ({ user, size = 'md' }: UserAvatarProps): JSX.Element | null => {
  if (!user) return null;

  // Größenberechnung
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
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
      'bg-blue-500', // Blau
      'bg-green-500', // Grün
      'bg-orange-500', // Orange
      'bg-purple-500', // Lila
      'bg-red-500', // Rot
      'bg-cyan-500', // Cyan
    ];

    // Einfache Hash-Funktion
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return colors[hash % colors.length];
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold text-white ${sizeClasses[size]} ${getColorFromId(user.id)}`}
      title={user.name}
    >
      {initials}
    </div>
  );
};

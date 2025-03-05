import { JSX } from 'react';

import { type User, type UserRole } from '../model/types';

type UserBadgeVariant = 'compact' | 'default' | 'detailed';

type UserBadgeProps = {
  user: User;
  variant?: UserBadgeVariant;
};

const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'editor':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'user':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusColor = (status: 'active' | 'inactive'): string =>
  status === 'active'
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-gray-100 text-gray-800 border-gray-200';

export const UserRoleBadge = ({ role }: { role: UserRole }): JSX.Element => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getRoleColor(
      role,
    )}`}
  >
    {role}
  </span>
);

export const UserStatusBadge = ({ status }: { status: 'active' | 'inactive' }): JSX.Element => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
      status,
    )}`}
  >
    {status}
  </span>
);

export const UserAvatar = ({
  user,
  size = 'md',
}: {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}): JSX.Element => {
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

export const UserBadge = ({ user, variant = 'default' }: UserBadgeProps): JSX.Element => {
  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        <UserAvatar user={user} size="sm" />
        <span className="font-medium">{user.name}</span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="flex items-center space-x-3">
        <UserAvatar user={user} size="md" />
        <div className="flex flex-col">
          <span className="font-medium">{user.name}</span>
          <span className="text-sm text-gray-500">{user.email}</span>
          <div className="mt-1 flex space-x-2">
            <UserRoleBadge role={user.role} />
            <UserStatusBadge status={user.status} />
          </div>
        </div>
      </div>
    );
  }

  // Default
  return (
    <div className="flex items-center space-x-3">
      <UserAvatar user={user} size="md" />
      <div className="flex flex-col">
        <span className="font-medium">{user.name}</span>
        <span className="text-sm text-gray-500">{user.email}</span>
      </div>
    </div>
  );
};

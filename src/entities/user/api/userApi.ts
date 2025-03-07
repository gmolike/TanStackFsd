import type { User, UsersQueryParams } from '../model/types';

// Mock Daten für die Demo
const MOCK_USERS: Array<User> = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-15T10:00:00Z',
    lastLogin: '2023-05-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-02-20T11:30:00Z',
    lastLogin: '2023-05-19T09:15:00Z',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'editor',
    status: 'inactive',
    createdAt: '2023-03-10T09:45:00Z',
    lastLogin: '2023-04-05T16:20:00Z',
  },
  {
    id: '4',
    name: 'Bob Brown',
    email: 'bob@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-03-15T14:20:00Z',
    lastLogin: '2023-05-18T11:10:00Z',
  },
  {
    id: '5',
    name: 'Carol White',
    email: 'carol@example.com',
    role: 'editor',
    status: 'active',
    createdAt: '2023-04-01T08:30:00Z',
    lastLogin: '2023-05-15T13:45:00Z',
  },
];

export const userApi = {
  getUsers: async ({
    page = 1,
    limit = 10,
    filters,
    sort,
  }: UsersQueryParams): Promise<{
    data: Array<User>;
    total: number;
  }> => {
    // In einer echten App würde hier ein API-Aufruf stehen
    // Simuliere eine API-Antwort mit den Mock-Daten
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredUsers = [...MOCK_USERS];

    // Filtern
    if (filters) {
      if (filters.role) {
        filteredUsers = filteredUsers.filter((user) => user.role === filters.role);
      }
      if (filters.status) {
        filteredUsers = filteredUsers.filter((user) => user.status === filters.status);
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm),
        );
      }
    }

    // Sortieren
    if (sort) {
      filteredUsers.sort((a, b) => {
        const aValue = a[sort.field];
        const bValue = b[sort.field];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sort.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (aValue === undefined) return sort.direction === 'asc' ? -1 : 1;
        if (bValue === undefined) return sort.direction === 'asc' ? 1 : -1;

        return sort.direction === 'asc'
          ? (aValue as unknown as number) - (bValue as unknown as number)
          : (bValue as unknown as number) - (aValue as unknown as number);
      });
    }

    // Paginierung
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

    return {
      data: paginatedUsers,
      total: filteredUsers.length,
    };
  },

  getUserById: async (id: string): Promise<User | null> => {
    // Simuliere API-Aufruf
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = MOCK_USERS.find((u) => u.id === id);
    return user || null;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    // Simuliere API-Aufruf
    await new Promise((resolve) => setTimeout(resolve, 700));

    const userIndex = MOCK_USERS.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // In einer echten App würden wir hier die Änderungen an den Server senden
    // Für die Demo aktualisieren wir nur das lokale Array
    const updatedUser = {
      ...MOCK_USERS[userIndex],
      ...userData,
    };

    MOCK_USERS[userIndex] = updatedUser;
    return updatedUser;
  },

  deleteUser: async (id: string): Promise<void> => {
    // Simuliere API-Aufruf
    await new Promise((resolve) => setTimeout(resolve, 600));

    const userIndex = MOCK_USERS.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // In einer echten App würden wir hier den Benutzer vom Server löschen
    // Für die Demo entfernen wir ihn aus dem lokalen Array
    MOCK_USERS.splice(userIndex, 1);
  },
};

import { baseApi } from '~/shared/api';
import { type User } from '../model/types';

// Simulation von API-Endpunkten für Benutzer
export const userApi = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulieren eines API-Aufrufs
    return baseApi.post('/login', { email, password });
  },

  getCurrentUser: async (): Promise<User> => {
    // Simulieren eines API-Aufrufs
    return baseApi.get('/users/me');
  },

  logout: async (): Promise<void> => {
    // Simulieren eines API-Aufrufs
    return baseApi.post('/logout', {});
  },
};

// src/entities/team/api/mock-api.ts

import type { FilterParam, PaginatedResult, QueryParams } from '~/shared/mock';
import { ApiError, createMockStorage, delay, queryData, randomDelay } from '~/shared/mock';

import type { CreateTeamMember, TeamMember, UpdateTeamMember } from '../model/schema';

import { generateFullTeam, generateTeamMember } from './mock-data';

/**
 * Mock API Implementation für Team Members
 * Simuliert eine echte REST API mit CRUD Operationen
 */

// Storage für Team Members
const teamStorage = createMockStorage<TeamMember>('team-members');

// Initialisiere mit Mock-Daten wenn leer
teamStorage.initialize(() => generateFullTeam(30));

/**
 * Team Mock API
 */
export const teamMockApi = {
  /**
   * Holt alle Teammitglieder mit optionaler Filterung, Sortierung und Paginierung
   */
  async getTeamMembers(params?: QueryParams): Promise<PaginatedResult<TeamMember>> {
    await randomDelay();

    try {
      const members = teamStorage.getAll();

      // Erweitere QueryParams mit team-spezifischen Suchfeldern
      const searchParams: QueryParams = {
        ...params,
        searchFields: params?.searchFields || [
          'firstName',
          'lastName',
          'email',
          'role',
          'department',
        ],
      };

      return queryData(members, searchParams);
    } catch (error) {
      throw new ApiError(500, 'Fehler beim Abrufen der Teammitglieder', error);
    }
  },

  /**
   * Holt ein einzelnes Teammitglied nach ID
   */
  async getTeamMemberById(id: string): Promise<TeamMember> {
    await randomDelay();

    const member = teamStorage.getById(id);

    if (!member) {
      throw new ApiError(404, `Teammitglied mit ID ${id} nicht gefunden`);
    }

    return member;
  },

  /**
   * Holt Teammitglieder nach Abteilung
   */
  async getTeamMembersByDepartment(
    department: string,
    params?: Omit<QueryParams, 'filters'>,
  ): Promise<PaginatedResult<TeamMember>> {
    const filters: Array<FilterParam> = [
      { field: 'department', operator: 'eq', value: department },
      ...(params?.filters || []),
    ];

    return this.getTeamMembers({ ...params, filters });
  },

  /**
   * Holt Teammitglieder nach Status
   */
  async getTeamMembersByStatus(
    status: string,
    params?: Omit<QueryParams, 'filters'>,
  ): Promise<PaginatedResult<TeamMember>> {
    const filters: Array<FilterParam> = [
      { field: 'status', operator: 'eq', value: status },
      ...(params?.filters || []),
    ];

    return this.getTeamMembers({ ...params, filters });
  },

  /**
   * Holt Teammitglieder die Remote arbeiten
   */
  async getRemoteTeamMembers(params?: QueryParams): Promise<PaginatedResult<TeamMember>> {
    await randomDelay();

    try {
      const members = teamStorage.getAll();
      const remoteMembers = members.filter((member) => member.remoteWork);

      return queryData(remoteMembers, params);
    } catch (error) {
      throw new ApiError(500, 'Fehler beim Abrufen der Remote-Teammitglieder', error);
    }
  },

  /**
   * Erstellt ein neues Teammitglied
   */
  async createTeamMember(data: CreateTeamMember): Promise<TeamMember> {
    await delay(800);

    try {
      // Validiere eindeutige E-Mail
      const existingMembers = teamStorage.getAll();
      const duplicateEmail = existingMembers.find(
        (member) => member.email.toLowerCase() === data.email.toLowerCase(),
      );

      if (duplicateEmail) {
        throw new ApiError(409, `E-Mail ${data.email} wird bereits verwendet`);
      }

      // Generiere neues Teammitglied mit übergebenen Daten
      const newMember = generateTeamMember(data);

      // Speichere und gib zurück
      return teamStorage.add(newMember);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Fehler beim Erstellen des Teammitglieds', error);
    }
  },

  /**
   * Aktualisiert ein Teammitglied
   */
  async updateTeamMember(id: string, data: UpdateTeamMember): Promise<TeamMember> {
    await delay(600);

    try {
      // Prüfe ob Mitglied existiert
      const existingMember = teamStorage.getById(id);
      if (!existingMember) {
        throw new ApiError(404, `Teammitglied mit ID ${id} nicht gefunden`);
      }

      // Validiere eindeutige E-Mail wenn geändert
      if (data.email && data.email !== existingMember.email) {
        const members = teamStorage.getAll();
        const duplicateEmail = members.find(
          (member) => member.id !== id && member.email.toLowerCase() === data.email.toLowerCase(),
        );

        if (duplicateEmail) {
          throw new ApiError(409, `E-Mail ${data.email} wird bereits verwendet`);
        }
      }

      // Aktualisiere
      const updatedMember = teamStorage.update(id, data);

      if (!updatedMember) {
        throw new ApiError(500, 'Fehler beim Aktualisieren des Teammitglieds');
      }

      return updatedMember;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Fehler beim Aktualisieren des Teammitglieds', error);
    }
  },

  /**
   * Löscht ein Teammitglied
   */
  async deleteTeamMember(id: string): Promise<void> {
    await delay(700);

    const success = teamStorage.delete(id);

    if (!success) {
      throw new ApiError(404, `Teammitglied mit ID ${id} nicht gefunden`);
    }
  },

  /**
   * Aktualisiert den Status eines Teammitglieds
   */
  async updateTeamMemberStatus(
    id: string,
    status: 'active' | 'inactive' | 'vacation',
  ): Promise<TeamMember> {
    await randomDelay(100, 300);

    try {
      const member = teamStorage.getById(id);

      if (!member) {
        throw new ApiError(404, `Teammitglied mit ID ${id} nicht gefunden`);
      }

      return this.updateTeamMember(id, { status });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Fehler beim Aktualisieren des Status', error);
    }
  },

  /**
   * Statistiken
   */
  async getTeamStats(): Promise<{
    totalCount: number;
    byDepartment: Record<string, number>;
    byStatus: Record<string, number>;
    remoteCount: number;
    averageTenure: number;
  }> {
    await randomDelay();

    const members = teamStorage.getAll();
    const now = new Date();

    const stats = {
      totalCount: members.length,
      byDepartment: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      remoteCount: 0,
      totalTenureMonths: 0,
    };

    members.forEach((member) => {
      // Nach Abteilung
      stats.byDepartment[member.department] = (stats.byDepartment[member.department] || 0) + 1;

      // Nach Status
      stats.byStatus[member.status] = (stats.byStatus[member.status] || 0) + 1;

      // Remote Arbeit
      if (member.remoteWork) {
        stats.remoteCount++;
      }

      // Betriebszugehörigkeit in Monaten
      const tenureMonths = Math.floor(
        (now.getTime() - member.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
      );
      stats.totalTenureMonths += tenureMonths;
    });

    return {
      totalCount: stats.totalCount,
      byDepartment: stats.byDepartment,
      byStatus: stats.byStatus,
      remoteCount: stats.remoteCount,
      averageTenure:
        stats.totalCount > 0 ? Math.round(stats.totalTenureMonths / stats.totalCount) : 0,
    };
  },

  /**
   * Organisationsstruktur
   */
  async getOrganizationChart(): Promise<{
    departments: Array<{
      name: string;
      manager: TeamMember | null;
      members: Array<TeamMember>;
    }>;
  }> {
    await randomDelay();

    const members = teamStorage.getAll();
    const departments = new Map<string, Array<TeamMember>>();

    // Gruppiere nach Abteilung
    members.forEach((member) => {
      const dept = departments.get(member.department) || [];
      dept.push(member);
      departments.set(member.department, dept);
    });

    // Erstelle Struktur
    const chart = Array.from(departments.entries()).map(([dept, deptMembers]) => {
      // Finde Manager (vereinfacht: derjenige mit "Manager" im Titel)
      const manager = deptMembers.find(
        (m) => m.role.toLowerCase().includes('manager') || m.role.toLowerCase().includes('lead'),
      );

      return {
        name: dept,
        manager: manager || null,
        members: deptMembers.filter((m) => m !== manager),
      };
    });

    return { departments: chart };
  },

  /**
   * Utility-Funktionen
   */
  async resetData(): Promise<void> {
    teamStorage.reset(() => generateFullTeam(30));
  },

  async clearData(): Promise<void> {
    teamStorage.clear();
  },
};

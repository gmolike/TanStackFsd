// src/entities/team/api/mock-api.ts
import type { PaginatedResult, QueryParams } from '~/shared/mock';
import { createMockStorage, queryData } from '~/shared/mock';

import type { CreateTeamMember, TeamMember, UpdateTeamMember } from '../model/schema';

import { generateFullTeam, generateTeamMember } from './mock-data';

// Storage für Team Members
const teamStorage = createMockStorage<TeamMember>('team-members');

// Initialisiere mit 250 Mock-Teammitgliedern
teamStorage.initialize(() => generateFullTeam(250));

/**
 * Team Mock API - Synchron und vereinfacht
 */
export const teamMockApi = {
  /**
   * Holt alle Teammitglieder
   */
  getTeamMembers(params?: QueryParams): Promise<PaginatedResult<TeamMember>> {
    const members = teamStorage.getAll();

    // Wenn kein Limit angegeben, gib alle zurück
    if (!params?.limit) {
      return Promise.resolve({
        data: members,
        total: members.length,
        page: 1,
        limit: members.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    }

    // Ansonsten normale Paginierung
    const searchParams: QueryParams = {
      ...params,
      searchFields: params.searchFields || ['firstName', 'lastName', 'email', 'role', 'department'],
    };
    return Promise.resolve(queryData(members, searchParams));
  },
  /**
   * Holt ein einzelnes Teammitglied
   */
  getTeamMemberById(id: string): Promise<TeamMember> {
    const member = teamStorage.getById(id);
    if (!member) {
      return Promise.reject(new Error(`Teammitglied mit ID ${id} nicht gefunden`));
    }
    return Promise.resolve(member);
  },

  /**
   * Erstellt ein neues Teammitglied
   */
  createTeamMember(data: CreateTeamMember): Promise<TeamMember> {
    const existingMembers = teamStorage.getAll();
    const emailExists = existingMembers.some(
      (member) => member.email.toLowerCase() === data.email.toLowerCase(),
    );

    if (emailExists) {
      return Promise.reject(new Error(`E-Mail ${data.email} wird bereits verwendet`));
    }

    const newMember = generateTeamMember(data);
    return Promise.resolve(teamStorage.add(newMember));
  },

  /**
   * Aktualisiert ein Teammitglied
   */
  updateTeamMember(id: string, data: UpdateTeamMember): Promise<TeamMember> {
    const existingMember = teamStorage.getById(id);
    if (!existingMember) {
      return Promise.reject(new Error(`Teammitglied mit ID ${id} nicht gefunden`));
    }

    if (data.email && data.email !== existingMember.email) {
      const members = teamStorage.getAll();
      const emailExists = members.some(
        (member) =>
          member.id !== id &&
          data.email !== undefined &&
          member.email.toLowerCase() === data.email.toLowerCase(),
      );

      if (emailExists) {
        return Promise.reject(new Error(`E-Mail ${data.email} wird bereits verwendet`));
      }
    }

    const updatedMember = teamStorage.update(id, data);
    if (!updatedMember) {
      return Promise.reject(new Error('Fehler beim Aktualisieren'));
    }

    return Promise.resolve(updatedMember);
  },

  /**
   * Löscht ein Teammitglied
   */
  deleteTeamMember(id: string): Promise<void> {
    const success = teamStorage.delete(id);
    if (!success) {
      return Promise.reject(new Error(`Teammitglied mit ID ${id} nicht gefunden`));
    }
    return Promise.resolve();
  },

  /**
   * Status-Update
   */
  updateTeamMemberStatus(
    id: string,
    status: 'active' | 'inactive' | 'vacation',
  ): Promise<TeamMember> {
    return this.updateTeamMember(id, { id, status });
  },

  /**
   * Team-Statistiken
   */
  getTeamStats(): Promise<{
    totalCount: number;
    byDepartment: Record<string, number>;
    byStatus: Record<string, number>;
    remoteCount: number;
  }> {
    const members = teamStorage.getAll();
    const stats = {
      totalCount: members.length,
      byDepartment: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      remoteCount: 0,
    };

    members.forEach((member) => {
      stats.byDepartment[member.department] = (stats.byDepartment[member.department] || 0) + 1;
      stats.byStatus[member.status] = (stats.byStatus[member.status] || 0) + 1;
      if (member.remoteWork) stats.remoteCount++;
    });

    return Promise.resolve(stats);
  },

  /**
   * Remote Team Members
   */
  getRemoteTeamMembers(params?: QueryParams): Promise<PaginatedResult<TeamMember>> {
    const members = teamStorage.getAll();
    const remoteMembers = members.filter((member) => member.remoteWork);
    return Promise.resolve(queryData(remoteMembers, params));
  },

  /**
   * Team Members by Department
   */
  getTeamMembersByDepartment(
    department: string,
    params?: Omit<QueryParams, 'filters'>,
  ): Promise<PaginatedResult<TeamMember>> {
    const members = teamStorage.getAll();
    const deptMembers = members.filter((m) => m.department === department);
    return Promise.resolve(queryData(deptMembers, params));
  },

  /**
   * Team Members by Status
   */
  getTeamMembersByStatus(
    status: string,
    params?: Omit<QueryParams, 'filters'>,
  ): Promise<PaginatedResult<TeamMember>> {
    const members = teamStorage.getAll();
    const statusMembers = members.filter((m) => m.status === status);
    return Promise.resolve(queryData(statusMembers, params));
  },

  /**
   * Organization Chart
   */
  getOrganizationChart(): Promise<{
    departments: Array<{
      name: string;
      manager: TeamMember | null;
      members: Array<TeamMember>;
    }>;
  }> {
    const members = teamStorage.getAll();
    const departments = new Map<string, Array<TeamMember>>();

    members.forEach((member) => {
      const dept = departments.get(member.department) || [];
      dept.push(member);
      departments.set(member.department, dept);
    });

    const chart = Array.from(departments.entries()).map(([dept, deptMembers]) => {
      const manager = deptMembers.find(
        (m) => m.role.toLowerCase().includes('manager') || m.role.toLowerCase().includes('lead'),
      );

      return {
        name: dept,
        manager: manager || null,
        members: deptMembers.filter((m) => m !== manager),
      };
    });

    return Promise.resolve({ departments: chart });
  },

  /**
   * Reset mit neuen Daten
   */
  resetData(count: number = 250): Promise<void> {
    teamStorage.reset(() => generateFullTeam(count));
    return Promise.resolve();
  },
};

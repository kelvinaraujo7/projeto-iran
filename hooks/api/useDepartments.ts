import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Department {
  id?: string;
  departmentId?: string;
  name: string;
  onlineScheduling?: boolean;
  serviceTime?: string;
  startServiceMorning?: string;
  endServiceMorning?: string;
  startServiceAfternoon?: string;
  endServiceAfternoon?: string;
  exceptionDay?: Date | null;
  unitId?: string;
  active: boolean;
  
  start_service_morning?: string;
  end_service_morning?: string;
  start_service_afternoon?: string;
  end_service_afternoon?: string;
  online_scheduling?: boolean;
  service_time?: string;
  exception_day?: Date | string | null;
  unit_id?: string;
}

export interface CreateDepartmentData {
  name: string;
  onlineScheduling: boolean;
  serviceTime: string;
  startServiceMorning: string;
  endServiceMorning: string;
  startServiceAfternoon: string;
  endServiceAfternoon: string;
  exceptionDay?: Date | null;
  active: boolean;
}

export interface UpdateDepartmentData {
  name?: string;
  onlineScheduling?: boolean;
  serviceTime?: string;
  startServiceMorning?: string;
  endServiceMorning?: string;
  startServiceAfternoon?: string;
  endServiceAfternoon?: string;
  exceptionDay?: string | Date | null;
  active?: boolean;
}

// Query Keys
export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...departmentKeys.lists(), { filters }] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
};

// Hooks para Departments
export function useDepartments(filters?: { page?: number }) {
  return useQuery({
    queryKey: departmentKeys.list(filters || {}),
    queryFn: () => {
      const { page = 1, ...otherFilters } = filters || {};
      
      let url = `/departments`;
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      
      Object.entries(otherFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      return api.get(url);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => api.get(`/departments/${id}`),
    enabled: !!id,
  });
}

// Hook para buscar um departamento específico por ID
export function useDepartmentById(id: string | undefined) {
  return useQuery({
    queryKey: departmentKeys.detail(id || ''),
    queryFn: async () => {
      
      try {
        const listResponse = await api.get('/departments');
        
        if (listResponse && listResponse.departments && Array.isArray(listResponse.departments)) {
          const department = listResponse.departments.find((dept: any) => dept.id === id);
          if (department) {
            return department;
          }
        }
      } catch (error) {
        console.log('List endpoint failed, trying individual endpoint:', error);
      }
      
      try {
        const response = await api.get(`/departments/${id}`);
        
        if (response) {
          if (response.departmentId && response.departmentId.value) {
            const normalized = {
              id: response.departmentId.value,
              name: response.name,
              active: response.active,
              onlineScheduling: response.onlineScheduling,
              serviceTime: response.serviceTime,
              startServiceMorning: response.startServiceMorning,
              endServiceMorning: response.endServiceMorning,
              startServiceAfternoon: response.startServiceAfternoon,
              endServiceAfternoon: response.endServiceAfternoon,
              exceptionDay: response.exceptionDay,
              unitId: response.unitId,
            };
            return normalized;
          }
          
          if (response.value && response.value.department) {
            const dept = response.value.department;
            const normalized = {
              id: dept._id?.value || dept.id,
              ...dept.props,
            };
            return normalized;
          }
          
          return response;
        }
        
        throw new Error('Invalid response format');
      } catch (error) {
        console.error('Both endpoints failed:', error);
        throw error;
      }
    },
    enabled: !!id && id !== 'new',
    staleTime: 0,
    gcTime: 0,
  })
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentData) => {
      return api.post(`/departments`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDepartmentData }) => {      
      try {
        const result = await api.put(`/departments/${id}`, data);
        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data, { id }) => {      
      let updatedDepartment = null;
      if (data && data.department) {
        updatedDepartment = data.department;
        
        queryClient.setQueryData(departmentKeys.detail(id), updatedDepartment);
      } else if (data && data.value && data.value.department) {
        const dept = data.value.department;
        updatedDepartment = {
          id: dept._id?.value || id,
          ...dept.props,
        };
        queryClient.setQueryData(departmentKeys.detail(id), updatedDepartment);
      }
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: departmentKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      }, 500);
    },
    onError: (error, { id, data }) => {
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return api.delete(`/departments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
}

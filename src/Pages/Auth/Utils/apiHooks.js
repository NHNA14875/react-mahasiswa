import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const useGetData = (queryKey, endpoint) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/${endpoint}`);
      return data;
    },
  });
};

const useAddData = (queryKey, endpoint) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newData) => {
      await axios.post(`${BASE_URL}/${endpoint}`, newData);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });
};

const useUpdateData = (queryKey, endpoint) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      await axios.put(`${BASE_URL}/${endpoint}/${id}`, updateData);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });
};

const useDeleteData = (queryKey, endpoint) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${BASE_URL}/${endpoint}/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
  });
};

export const useMahasiswa       = () => useGetData('mahasiswa', 'mahasiswa');
export const useAddMahasiswa    = () => useAddData('mahasiswa', 'mahasiswa');
export const useUpdateMahasiswa = () => useUpdateData('mahasiswa', 'mahasiswa');
export const useDeleteMahasiswa = () => useDeleteData('mahasiswa', 'mahasiswa');

export const useDosen       = () => useGetData('dosen', 'dosen');
export const useAddDosen    = () => useAddData('dosen', 'dosen');
export const useUpdateDosen = () => useUpdateData('dosen', 'dosen');
export const useDeleteDosen = () => useDeleteData('dosen', 'dosen');

export const useMataKuliah       = () => useGetData('matakuliah', 'matakuliah');
export const useAddMataKuliah    = () => useAddData('matakuliah', 'matakuliah');
export const useUpdateMataKuliah = () => useUpdateData('matakuliah', 'matakuliah');
export const useDeleteMataKuliah = () => useDeleteData('matakuliah', 'matakuliah');

export const useKelas       = () => useGetData('kelas', 'kelas');
export const useAddKelas    = () => useAddData('kelas', 'kelas');
export const useUpdateKelas = () => useUpdateData('kelas', 'kelas');
export const useDeleteKelas = () => useDeleteData('kelas', 'kelas');
import { defineStore } from "pinia";
import { api } from "src/boot/axios";


export const useAttendanceStores = defineStore("attendance", {
  state: () => ({
    attendances: [],
    attendance: {},
    classAttendances: [],
    classAttendance: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(params) {
      const { data, error } = await api.get("/attendance", {
        params: params,
      });
      if (error) throw error;
      this.attendances = data;
    },

    async create(params) {
      const { data, error } = await api.post(`/attendance`, params);
      if (error) throw error;
      return data;
    },

    async update(id, params) {
      const { data, error } = await api.put(`/attendance/${id}`, params);
      if (error) throw error;
      this.attendance = data;
    },

    async findOneAttendance(params) {
      const { data, error } = await api.get(`/attendance/find-one`, {
        params: params,
      });
      if (error) throw error;
      this.attendance = data;
    },

    /* routa de classe attendance */
    async createClassAttendance(params) {
      const { data, error } = await api.post(`/attendance/class`, {
        ...params
      });
      if (error) throw error;
      this.classAttendance = data;
    },

    async fetchClassAttendances(params) {
      const { data, error } = await api.get(`/attendance/class`, {params: params});
      if (error) throw error;
      this.classAttendances = data;
    },

    async fetchClassAttendance(id) {
      const { data, error } = await api.get(`/attendance/class/${id}`);
      if (error) throw error;
      this.classAttendance = data;
    },
  },
});

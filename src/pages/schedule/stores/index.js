import { defineStore } from "pinia";
import { api } from "src/boot/axios"

export const useScheduleStores = defineStore("schedule", {
  state: () => ({
    schecules: [],
    schecule: {}
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(params) {
      const { data, error } = await api.get(`/schedule/`, {params: params});
      if (error) throw error;
      this.schecules = data;
    },

    async create(params) {
      const { data, error } = await api.post("/schedule", params);
      if (error) throw error;
      this.schecule = data;
    },

    async delete(params) {
      const { data, error } = await api.delete(`/schedule`, {params: params} );
      if (error) throw error;
      return data;
    }
  },
});

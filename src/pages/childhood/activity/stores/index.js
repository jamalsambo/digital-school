import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useActivityStores = defineStore("activities", {
  state: () => ({
    activities: [],
    activity: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(params) {
      const { data, error } = await api.get(`/childhood-activity`, {
        params: params,
      });
      if (error) throw error;
      this.activities = data;
    },

    async create(params) {
      const { data, error } = await api.post("/childhood-activity", {
        ...params,
      });
      if (error) throw error;
      return data;
    },

    async findOne(id) {
      const { data, error } = await api.get(`/childhood-activity/${id}`);
      if (error) throw error;
      this.activity = data;
    },
    async update(id, params) {
      const { data, error } = await api.put(
        `/childhood-activity/${id}`,
        params
      );
      if (error) throw error;
      this.activity = data;
    },
  },
});

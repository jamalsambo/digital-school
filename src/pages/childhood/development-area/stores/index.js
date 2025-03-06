import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useDevelopmentAreaStores = defineStore("development-area", {
  state: () => ({
    developmentAreas: [],
    developmentArea: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list(params) {
      const { data, error } = await api.get(`/childhood-development-area`, {
        params: params,
      });
      if (error) throw error;
      this.developmentAreas = data;
    },

    async create(params) {
      const { data, error } = await api.post("/childhood-development-area", {
        ...params,
      });
      if (error) throw error;
      return data;
    },

    async findOne(id) {
      const { data, error } = await api.get(
        `/childhood-development-area/${id}`
      );
      if (error) throw error;
      this.developmentArea = data;
    },
    async update(id, params) {
      const { data, error } = await api.put(
        `/childhood-development-area/${id}`,
        params
      );
      if (error) throw error;
      this.developmentArea = data;
    },
    async addDevelopmentActivity(params) {
      const { data, error } = await api.post(
        `/childhood-development-area/${params}/activities`,
        params
      );
      if (error) throw error;
      return data;
    },
    async deleteDevelopmentActivity(developmentAreaId, activityId) {
      const { data, error } = await api.delete(
        `/childhood-development-area/${developmentAreaId}/${activityId}`
      );
      if (error) throw error;
      return data;
    },
  },
});

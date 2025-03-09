import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

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
      const { data, error } = await api.get(`development-area`, {
        params: params,
      });
      if (error) throw error;
      this.developmentAreas = data;
    },

    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore?.user?.userDetails;
      const { data, error } = await api.post("development-area", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      return data;
    },

    async findOne(id) {
      const { data, error } = await api.get(
        `development-area/${id}`
      );
      if (error) throw error;
      this.developmentArea = data;
    },
    async update(id, params) {
      const { data, error } = await api.put(
        `development-area/${id}`,
        params
      );
      if (error) throw error;
      this.developmentArea = data;
    },
    async addDevelopmentActivity(dAreaId,params) {
      const { data, error } = await api.post(
        `development-area/${dAreaId}/activities`,
        params
      );
      if (error) throw error;
      return data;
    },
    async deleteDevelopmentActivity(developmentAreaId, activityId) {
      const { data, error } = await api.delete(
        `development-area/${developmentAreaId}/${activityId}`
      );
      if (error) throw error;
      return data;
    },
  },
});

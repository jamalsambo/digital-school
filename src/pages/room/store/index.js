import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/pages/auth/store";

export const useRoomStores = defineStore("room", {
  state: () => ({
    rooms: [],
    room: {},
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async list() {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.get(
        `room/institution/${institutionId}`
      );
      if (error) throw error;
      this.rooms = data;
    },

    async create(params) {
      const authStore = useAuthStore();
      const { institutionId } = authStore.user;
      const { data, error } = await api.post("room", {
        ...params,
        institutionId: institutionId,
      });
      if (error) throw error;
      this.room = data;
    },

    async update(id, params) {
      const { data, error } = await api.put(`/class-room/${id}`, params);
      if (error) throw error;
      this.room = data;
    },
  },
});

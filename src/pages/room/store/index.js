import { defineStore } from "pinia";
import { api } from "src/boot/axios";

import { useAuthStore } from "src/pages/auth/store";

const authStore = useAuthStore();
const { institutionId } = authStore.user.userDetails;

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
      const { data, error } = await api.get(
        `/class/institution/${institutionId}/room`
      );
      if (error) throw error;
      this.rooms = data;
    },

    async create(params) {
      const { data, error } = await api.post("/class/create/class-room", {...params,institutionId: institutionId });
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

import { defineStore } from "pinia";
import * as storage from "./storage";
import { api } from "src/boot/axios";
import { useUserStores } from "src/pages/user/store";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    user: {},
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async Actionlogin(data) {
      const response = await api.post("/auth", data);
      this.ActionSetUser(response.data.user);
      this.ActionSetToken(response.data.token);
    },

    async ActionCheckToken() {
      if (this.token) {
        return this.token;
      }

      const token = storage.getLocalToken();

      if (!token) {
        return Promise.reject(new Error("Token Inválido"));
      }

      this.ActionSetToken(token);
      return this.ActionLoadSession();
    },

    async ActionLoadSession() {
      try {
        const {
          data: { user },
        } = await api.get("/auth/resfresh-token");
        this.ActionSetUser(user);

        const useStores = useUserStores();
        await useStores.findPermissions(user.sub); // Chame aqui
      } catch (err) {
        this.signOut();
      }
    },

    ActionSetUser(user) {
      this.user = user;
    },

    ActionSetToken(token) {
      storage.setLocalToken(token);
      this.token = token;
    },

    signOut() {
      storage.deleteLocalToken();
      this.ActionSetUser({});
      this.ActionSetToken("");
    },
  },
});

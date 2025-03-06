<template>
  <q-page padding>
    <Tables :columns="Columns" :rows="rooms" :title="title">
      <template #new>
        <q-btn
          color="primary"
          icon="add"
          label="Adicionar"
          no-caps
          @click="addRoom"
          class="q-ml-sm"
        />
      </template>
      <template #actions>
        <q-btn color="primary" icon="edit" no-caps class="q-ml-sm" flat="" />
      </template>
    </Tables>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Tables from "src/components/Tables.vue";
import { useRoomStores } from "../store";
import Columns from "../components/columns/Classe";


/* Use store */
const route = useRoute()
const router = useRouter();
const roomStores = useRoomStores();

/* Data */
const id = route.params
const rooms = ref([]);
const title = ref("Salas");

/* Methods */
/* funcao para adicionar sala */
const addRoom = async () => {
  router.push({name: "room-create"})
};
//* Funcao para buscar salas */
const fetchRooms = async () => {
  await roomStores.list();
  rooms.value = roomStores.rooms;
};

onMounted(() => {
  fetchRooms();
});
</script>

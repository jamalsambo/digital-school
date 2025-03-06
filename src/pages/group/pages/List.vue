<template>
  <q-page padding>
    <Tables :rows="groups" :columns="GroupColumns" :title="'Grupos'">
      <template #new>
        <q-btn
                  color="primary"
                  icon="add"
                  label="Adicionar"
                  no-caps
                  class="q-ml-sm"
                  @click="createGroup"
                />
      </template>
      <template #actions="{ props }">
        <q-btn
          icon="edit"
          color="primary"
          class="q-mr-sm"
          flat
          @click="editTask(props)"
        >
          <q-tooltip> Editar grupo </q-tooltip>
        </q-btn>
      </template>
    </Tables>
  </q-page>
</template>

<script setup>
import {  onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGroupStores } from "../store";
import Tables from "src/components/Tables.vue";
import GroupColumns from "../components/columns/GroupColumns";


/* use store */
const route = useRoute();
const router = useRouter();
const groupStores = useGroupStores();

/* data*/
const { classe } = route.params
const groups = ref([]);

/* Methods */
const createGroup = () => {
   router.push({
    name: 'group-create',
    params: {
      classe: classe,
    },
   })
}
/* fetch data */
const fetchGroups = async () => {
  try {
    await groupStores.list();
    groups.value = groupStores.groups;
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchGroups();
});
</script>

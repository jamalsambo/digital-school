<template>
  <q-page padding>
    <Tables
      :rows="groups"
      :columns="GroupColumns"
      :title="'Grupos'"
    >
      <template #new>
        <q-btn
          color="primary"
          icon="add"
          label="Novo"
          no-caps
          class="q-ml-sm"
          @click="createGroup"
        />
        <q-btn
          color="primary"
          icon="add"
          label="Distribuir"
          no-caps
          class="q-ml-sm"
          @click="handleGroupDistribution"
        />
      </template>
      <template #actions="{ props }">
        <q-btn
          icon="group"
          color="primary"
          class="q-mr-sm"
          flat
          @click="handleAddMembers(props)"
        >
          <q-tooltip> Editar grupo </q-tooltip>
        </q-btn>
      </template>
    </Tables>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGroupStores } from "../store";
import { useUserStores } from "src/pages/user/store";
import Tables from "src/components/Tables.vue";
import GroupColumns from "../components/columns/GroupColumns";
import useNotify from "src/composables/UseNotify";

/* setup data */
const route = useRoute();
const router = useRouter();

/* setup store */
const userStores = useUserStores();
const groupStores = useGroupStores();
const { notifyError, notifySuccess } = useNotify();

/* data*/
const { classe, disciplineId } = route.params;
const groups = ref([]);

/* Methods */
const createGroup = async () => {
  const payload = {
    classId: classe,
    activityId: disciplineId,
    teacherId: userStores.user.employee?.id,
  };
  try {
    await groupStores.create(payload);
    notifySuccess("Grupo criado com sucesso!");
    await fetchGroups();
  } catch (error) {
    notifyError("Ocorreu um erro ao tentar criar o grupo!");
  }
};
const handleAddMembers = (props) => {
  router.push({
    name: "group-member",
    params: { groupId: props.key },
  });
};
const handleGroupDistribution = () => {
  router.push({
    name: "group-distribution",
  });
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

<template>
  <q-page padding>
    <Tables :rows="tasks" :columns="TaskColumns" :title="'Tarefas'">
      <template #new>
        <q-btn
          color="primary"
          icon="add"
          label="Adicionar"
          no-caps
          class="q-ml-sm"
          @click="handleCreateTask"
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
          <q-tooltip> Editar tarefa </q-tooltip>
        </q-btn>
        <q-btn
          icon="group"
          color="primary"
          class="q-mr-sm"
          flat
          @click="addGroup(props)"
          :title="'Alocar ao tarefa'"
        >

        </q-btn>
      </template>
    </Tables>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useTaskStores } from "../store";
import { useRoute, useRouter } from "vue-router";
import Tables from "src/components/Tables.vue";
import TaskColumns from "../components/columns/TaskColumns";

/* use store */
const route = useRoute();
const router = useRouter();
const taskStores = useTaskStores();
``;
/* data*/
const { classeId, disciplineId } = route.params;
const tasks = ref([]);

/* fetch data */
const fetchTasks = async () => {
  try {
    await taskStores.list();
    tasks.value = taskStores.tasks;
  } catch (error) {
    console.error(error);
  }
};

const handleCreateTask = () => {
  router.push({
    name: "task-create",
    params: { classeId: classeId, disciplineId: disciplineId },
  });
};

const editTask = (row) => {
  router.push({
    name: "task-edit",
    params: { id: row.key },
  });
};

const addGroup = (row) => {
  router.push({
    name: "task-add-groups",
    params: { id: row.key, entity: "groups" },
  });
};

const addStudent = (row) => {
  router.push({
    name: "task-add-students",
    params: { id: row.key, entity: "students" },
  });
};

onMounted(async () => {
  await fetchTasks();
});
</script>

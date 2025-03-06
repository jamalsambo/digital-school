<template>
  <q-page padding>
    <Tables :rows="tasks" :columns="TaskColumns" :title="'Tarefas'">
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
              >
                <q-tooltip> Alocar ao grupo </q-tooltip>
              </q-btn>
              <q-btn
                icon="person"
                color="primary"
                class="q-mr-sm"
                flat
                @click="addStudent(props)"
              >
                <q-tooltip> Alocar ao estudante </q-tooltip>
              </q-btn>
            </template>
    </Tables>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useTaskStores } from "../store";
import { useRouter } from "vue-router";
import Tables from "src/components/Tables.vue";
import TaskColumns from "../components/columns/TaskColumns";

/* use store */
const router = useRouter();
const taskStores = useTaskStores();

/* data*/
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

const editTask = (row) => {
  router.push({
    name: "task-edit",
    params: { id: row.key },
  })
}

const addGroup = (row) => {
  router.push({
    name: "task-add-groups",
    params: { id: row.key, entity: "groups" },
  });
}

const addStudent = (row) => {
  router.push({
    name: "task-add-students",
    params: { id: row.key, entity: "students" },
  });
}

onMounted(async () => {
  await fetchTasks();
});
</script>

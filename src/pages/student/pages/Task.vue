<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Minhas Tarefas</div>
    <q-card
      v-for="task in allTasks"
      :key="task.id"
      class="q-mb-md"
      flat
      bordered
    >
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-subtitle1">{{ task.title }}</div>
          <div class="text-caption text-grey">
            {{ formatDate(task.dueDate) }} –
            <q-badge
              :label="task.groups.length > 0 ? 'Grupo' : 'Individual'"
              :color="task.groups.length > 0 ? 'primary' : 'secondary'"
              class="q-ml-xs"
            />
          </div>
        </div>

        <q-btn
          flat
          dense
          color="primary"
          icon="visibility"
          @click="viewTask(task)"
          label="Ver"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useTaskStores } from "src/pages/academic/task/store";
import { useStudentStores } from "../store";
import { date } from "quasar";
import { useRoute } from "vue-router";

/* setup router */
const route = useRoute();

/* setup stores */
const taskStores = useTaskStores();
const studentStores = useStudentStores();

const { studentId } = route.params;
const allTasks = ref([]);

const formatDate = (val) => date.formatDate(val, "DD/MM/YYYY");

const viewTask = (task) => {
  console.log("Ver tarefa:", task);
};

const fetchTasks = async () => {
  try {
    await taskStores.list({
      classId: studentStores.student.enrollmentActive?.classId,
    });
    allTasks.value = taskStores.tasks.filter((task) => {
      const isInIndividualTask = task.students?.some((student) => {
        return student.studentId === studentId;
      });

      const isInGroupTask = task.groups?.some((group) => {
        return group.members?.some((member) => {
          return member.studentId === studentId;
        });
      });

      return isInIndividualTask || isInGroupTask;
    });
  } catch (error) {
    console.log(error);
  }
};
const fetchStudent = async () => {
  try {
    studentStores.findOne(studentId);
  } catch (error) {
    console.log(error);
  }
};
onMounted(async () => {
  await fetchStudent();
  await fetchTasks();
});
</script>

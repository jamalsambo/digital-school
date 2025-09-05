<template>
  <q-page padding>
    <!-- Card de Progresso Acadêmico -->
    <q-card class="my-4">
      <q-card-section>
        <ScheduleComponent ref="scheduleRef" :classe="enrollment?.classe" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStudentStores } from "./student/store";
import { useAuthStore } from "src/pages/auth/store";
import { useScheduleStores } from "./schedule/stores";
import { useNotificationStores } from "./notification/store";
import { useEnrollmentStores } from "./enrollment/store";
import ScheduleComponent from "src/pages/schedule/pages/Create.vue";

/* setup store */
const studentStores = useStudentStores();
const authStore = useAuthStore();
const scheduleStores = useScheduleStores();
const notificacaoStores = useNotificationStores();
const enrollmentStores = useEnrollmentStores();

/* setup data */
const user = computed(() => authStore.user);
const student = ref();
const enrollment = ref();
const schedule = ref([]);
const contact = ref();
const notifications = ref([]);
const scheduleRef = ref();

/* methods */

/* fetch data */
const fetchStudent = async () => {
  try {
    await studentStores.findOne(user.value.userDetails.id);
    student.value = studentStores.student;
    tasks.value = student.value.tasksStudent;
    contact.value = student.value.contacts.find(
      (c) => c.type === "Principal" && c.owner === "Estudante"
    );
  } catch (error) {
    // notifyError("Erro ao carregar estudante");
  }
};

const fetchSchedule = async () => {
  try {
    await scheduleStores.list({ classId: enrollment.value?.classId });
    schedule.value = scheduleStores.schecules;
  } catch (error) {}
};

const fetchNotifications = async () => {
  try {
    await notificacaoStores.list({ received: contact.value.number });
    notifications.value = notificacaoStores.notifications;
  } catch (error) {}
};

const fetchEnrrolment = async () => {
  try {
    await enrollmentStores.findByStudent(user.value?.studentId);
    enrollment.value = enrollmentStores.enrollment;
  } catch (error) {
    console.log(error);
  }
};
onMounted(async () => {
  await fetchStudent();
  await fetchEnrrolment();
  await fetchSchedule();

  if (scheduleRef.value?.generatePeriods) {
    scheduleRef.value.generatePeriods();
    schedule.value.forEach(({ dayWeek, period, discipline, classe }) => {
      const colIndex = scheduleRef.value.days.indexOf(dayWeek);
      if (colIndex !== -1 && period < scheduleRef.value.schedule.length) {
        scheduleRef.value.schedule[period].slots[colIndex] = {
          disciplineName: discipline.name,
          className: classe.name,
        };
      }
    });
  }
});

// // Notificações
// const notificacoes =  [
//   { titulo: 'Novo Trabalho', mensagem: 'Trabalho de física disponível para entrega.' },
//   { titulo: 'Prova agendada', mensagem: 'Prova de matemática no dia 22/02.' }
// ]
</script>

<style scoped>
.q-card {
  margin-bottom: 20px;
}
</style>

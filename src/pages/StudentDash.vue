<template>
  <q-page padding>
    <!-- Card de Progresso Acadêmico -->
    <q-card class="my-4">
      <q-card-section>
        <div class="text-h6">Progresso Acadêmico</div>
      </q-card-section>
      <q-card-section>
        <q-linear-progress
          :value="progressoNota"
          color="positive"
          track-color="grey-3"
        />
        <div class="q-mt-md">Média: {{ progressoNota * 100 }}%</div>
      </q-card-section>
    </q-card>

    <!-- Card de Tarefas Pendentes -->
    <q-card class="my-4">
      <q-card-section>
        <div class="text-h6">Tarefas Pendentes</div>
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item v-for="(task, index) in tasks" :key="index">
            <q-item-section>
              <div>
                <strong
                  >{{ task.tasks.title }} -
                  {{ task.tasks.discipline.name }}</strong
                >
              </div>
              <div>Data de entrega: {{ task.tasks.dueDate }}</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Card de Agenda de Aulas -->
    <q-card class="my-4">
      <q-card-section>
        <div class="text-h6">Agenda de aulas para hoje</div>
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item v-for="(sched, index) in scheduleOfDay" :key="index">
            <q-item-section>
              <div>
                <strong>{{ sched?.discipline?.name }}</strong>
              </div>
              <div>{{ sched.startTime }} - {{ sched?.endTime }}</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Card de Notificações -->
    <q-card class="my-4">
      <q-card-section>
        <div class="text-h6">Notificações</div>
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item v-for="(notification, index) in notifications" :key="index">
            <q-item-section>
              <div>
                <strong
                  >{{ notification.title }} -
                  {{ notification.meetingDate }}</strong
                >
              </div>
              <div>{{ notification.message }}</div>
            </q-item-section>
          </q-item>
        </q-list>
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
import scripts from "src/composables/Scripts";

/* setup store */
const studentStores = useStudentStores();
const authStore = useAuthStore();
const scheduleStores = useScheduleStores();
const notificacaoStores = useNotificationStores();
const { filterEnrollmentsByYear } = scripts();

/* setup data */
const user = computed(() => authStore.user);
const student = ref();
const enrollment = ref();
const scheduleOfDay = ref([]);
const contact = ref();
const notifications = ref([]);
const tasks = ref([]);
const progressoNota = 0.85; // 85%
const days = [
  { value: 1, name: "Segunda" },
  { value: 2, name: "Terça" },
  { value: 3, name: "Quarta" },
  { value: 4, name: "Quinta" },
  { value: 5, name: "Sexta" },
];
const today = 1; // Retorna 0-6new Date().getDay();
const todayObj = days.find((day) => day.value === today);

/* methods */

/* fetch data */
const fetchStudent = async () => {
  try {
    await studentStores.findOne(user.value.userDetails.id);
    student.value = studentStores.student;
    tasks.value = student.value.tasksStudent;
    enrollment.value = filterEnrollmentsByYear(
      student.value.enrollments,
      new Date().getFullYear()
    );
    contact.value = student.value.contacts.find(
      (c) => c.type === "Principal" && c.owner === "Estudante"
    );
  } catch (error) {
    notifyError("Erro ao carregar estudante");
  }
};

const fetchSchedule = async () => {
  try {
    await scheduleStores.list({ classId: enrollment.value.classId });
    scheduleOfDay.value = scheduleStores.schecules.filter(
      (sche) => sche.dayWeek === todayObj.name
    );
  } catch (error) {}
};

const fetchNotifications = async () => {
  try {
    await notificacaoStores.list({ received: contact.value.number });
    notifications.value = notificacaoStores.notifications;
  } catch (error) {}
};
onMounted(async () => {
  await fetchStudent();
  await fetchSchedule();
  await fetchNotifications();
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

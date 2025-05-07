<template>
  <q-page padding>
    <!-- Card de Agenda -->
    <q-card class="my-4">
      <q-card-section>
        <div class="text-h6">Agenda de aulas para hoje</div>
      </q-card-section>
      <q-card-section>
        <q-list>
          <q-item v-for="(sched, index) in scheduleOfDay" :key="index">
            <q-item-section>
              <div>
                <strong
                  >{{ sched?.discipline?.name }} -
                  {{ sched?.classe?.name }}</strong
                >
              </div>
              <div>{{ sched.startTime }} - {{ sched?.endTime }}</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Card de Desempenho dos Alunos -->
    <q-card class="my-4">
      <q-card-section>
        <div class="text-h6">Desempenho dos Alunos</div>
      </q-card-section>
      <q-card-section>
      <q-list bordered>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="bluetooth" />
          </q-item-section>
          <q-item-section><span>Brevemente</span></q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
      <!-- <q-card-section>
        <q-table
          :rows="alunos"
          :columns="alunosColumns"
          row-key="id"
        />
      </q-card-section> -->
    </q-card>

    <!-- Card de Notificações -->
    <q-card class="my-4">
      <q-card-section>
        <div class="text-h6">Notificações</div>
      </q-card-section>
      <q-card-section>
        <q-list bordered>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="bluetooth" />
          </q-item-section>
          <q-item-section><span>Brevemente</span></q-item-section>
        </q-item>
      </q-list>

        <!-- <q-list>
          <q-item v-for="(notificacao, index) in notificacoes" :key="index">
            <q-item-section>
              <div><strong>{{ notificacao.titulo }}</strong></div>
              <div>{{ notificacao.mensagem }}</div>
            </q-item-section>
          </q-item>
        </q-list> -->
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "./auth/store";
import { useEmployeeStores } from "./employee/stores";
import { useScheduleStores } from "./schedule/stores";

/* use store */
const authStore = useAuthStore();
const employeeStore = useEmployeeStores();
const scheduleStore = useScheduleStores();

/* data */
const user = computed(() => authStore.user);
const teachings = ref([]);
const scheduleOfDay = ref([]);
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
const fetchTeachings = async () => {
  await employeeStore.findTeachings(user.value.userDetails?.id);
  teachings.value = employeeStore.teachings;
};

const fetchSchedule = async () => {
  scheduleOfDay.value = [];

  await Promise.all(
    teachings.value.map(async (teach) => {
      await scheduleStore.list({
        classId: teach.classId,
        disciplineId: teach.disciplineId,
      });

      const schedule = scheduleStore.schecules.find(
        (sche) => sche.dayWeek === todayObj.name
      );
      if (schedule) {
        scheduleOfDay.value.push(schedule);
      }
    })
  );

  // Ordenação pelo horário de início (supondo startTime como string "HH:mm")
  scheduleOfDay.value.sort((a, b) => a.startTime.localeCompare(b.startTime));
};

onMounted(async () => {
  await fetchTeachings();
  await fetchSchedule();
});
</script>

<style scoped>
.q-card {
  margin-bottom: 20px;
}
</style>

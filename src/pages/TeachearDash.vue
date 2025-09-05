<template>
  <q-page padding>
    <!-- Card de Agenda -->
    <q-card class="my-4">
      <q-card-section>
        <ScheduleComponent
          ref="scheduleRef"
          :classe="classe"
          :is-teacher="user.isTeacher"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "./auth/store";
import { useScheduleStores } from "./schedule/stores";
import ScheduleComponent from "src/pages/schedule/pages/Create.vue";

/* use store */
const authStore = useAuthStore();
const scheduleStore = useScheduleStores();

/* data */
const user = computed(() => authStore.user);
const schedule = ref([]);
const scheduleRef = ref();
const classe = ref();

/* methods */
const fetchSchedule = async () => {
  try {
    await scheduleStore.list({ employeeId: user?.value.employeeId });
    schedule.value = scheduleStore.schecules;
    const startTimes = schedule.value.map((item) => item.startTime);
    startTimes.sort();
    const smallestTime = startTimes[0];
    const largestTime = startTimes[startTimes.length - 1];
    classe.value = {
      period: {
        start: smallestTime,
        end: largestTime,
      },
    };
  } catch (error) {}
};

onMounted(async () => {
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
</script>

<style scoped>
.q-card {
  margin-bottom: 20px;
}
</style>

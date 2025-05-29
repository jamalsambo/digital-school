<template>
  <q-page padding>
    <div class="shadow-2">
      <ScheduleComponent ref="scheduleRef" :classe="classe" />
    <div class="row q-mt-md justify-end">
          <q-btn
            label="voltar"
            color="negative"
            flat
            type="reset"
            @click="router.back()"
          />
        </div>
    </div>

  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useClassStores } from "../store";
import ScheduleComponent from "src/pages/schedule/pages/Create.vue";

/* setup router */
const route = useRoute();
const router = useRouter();

/* setup stores */
const classStores = useClassStores();

/* setup data */
const { classId } = route.params;
const classe = ref();
const scheduleRef = ref([]);

/* fetch data */
const fetchClass = async () => {
  try {
    await classStores.findOne(classId);
    classe.value = classStores.classe;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchClass();
  if (scheduleRef.value?.generatePeriods) {
    scheduleRef.value.generatePeriods();
    classe.value.schedules.forEach(
      ({ dayWeek, period, discipline, employee }) => {
        const colIndex = scheduleRef.value.days.indexOf(dayWeek);
        if (colIndex !== -1 && period < scheduleRef.value.schedule.length) {
scheduleRef.value.schedule[period].slots[colIndex] = {
  disciplineName: discipline.name,
  employeeName: employee.basicInformation?.fullName
};

        }
      }
    );
  }
});
</script>

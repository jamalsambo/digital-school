<template>
  <div class="q-pa-md">
    <q-card flat bordered class="shadow-2">
      <q-card-section>
        <div class="text-h6">
          Horário Semanal {{ `${"do professor" - employee?.name - "" || ""}  ` }}
          {{ classe?.name }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <!-- Conteiner com scroll horizontal em telas pequenas -->
        <div class="q-pa-xs scroll" style="overflow-x: auto">
          <q-markup-table bordered flat class="full-width">
            <thead>
              <tr>
                <th class="text-left">Tempo</th>
                <th class="text-left" v-for="day in days" :key="day">
                  {{ day }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in schedule" :key="rowIndex">
                <td>
                  <strong>{{ rowIndex + 1 }}º</strong><br />
                  <span>{{ row.time }}</span>
                </td>
                <td v-for="(slot, colIndex) in row.slots" :key="colIndex">
                  <q-select
                    v-if="employee"
                    v-model="schedule[rowIndex].slots[colIndex]"
                    :options="availableTeachings"
                    option-label="label"
                    option-value="value"
                    dense
                    outlined
                    clearable
                    map-options
                    emit-value
                    style="min-width: 120px"
                    @update:model-value="
                      (val) => handleSelectDiscipline(val, rowIndex, colIndex)
                    "
                    @clear="
                      (val) =>
                        handleClearDisciplineHorary(val, rowIndex, colIndex)
                    "
                  />
                  <div
                    v-else
                    class="q-pa-xs text-white text-center"
                    :style="{
                      backgroundColor: getDisciplineColor(slot),
                      borderRadius: '8px',
                      minHeight: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }"
                  >
                    {{ getDisciplineLabel(slot, props.isTeacher) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import { ref } from "vue";

const props = defineProps({
  employee: { type: Object, required: true },
  classe: { type: Object, required: false },
  availableTeachings: { type: Array, required: true },
  isTeacher: { type: Boolean, required: false, default: false}
});

const schedule = ref([]);
const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const parseTimeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatMinutesToTime = (totalMinutes) => {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getDisciplineLabel = (slot, isTeacher) => {
  if (!slot?.disciplineName) return "";

  if (isTeacher) {
    return `${slot.disciplineName} - ${slot.employeeName || ""}`;
  } else {
     return `${slot.disciplineName} - ${slot.className || ""}`;
  }
};


function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 65%)`;
  return color;
}

const getDisciplineColor = (slot) => {
  const name = slot?.disciplineName;
  return name ? stringToColor(name) : "#9E9E9E";
};

const generatePeriods = () => {
  if (!props.classe?.period?.start || !props.classe?.period?.end) return;

  const start = parseTimeToMinutes(props.classe.period.start);
  const end = parseTimeToMinutes(props.classe.period.end);
  const lessonDuration = 45;
  const shortBreak = 5;
  const longBreak = 10;

  const periods = [];
  let time = start,
    count = 1;

  while (time + lessonDuration <= end) {
    periods.push(formatMinutesToTime(time));
    time += lessonDuration + (count === 3 ? longBreak : shortBreak);
    count++;
  }

  schedule.value = periods.map((hour) => ({
    time: hour,
    slots: Array(days.length).fill(null),
  }));
};

function handleSelectDiscipline(val, rowIndex, colIndex) {
  emit("select-discipline", { value: val, rowIndex, colIndex });
}

function handleClearDisciplineHorary(val, rowIndex, colIndex) {
  emit("clear-discipline", { value: val, rowIndex, colIndex });
}

const emit = defineEmits(["select-discipline", "clear-discipline"]);

defineExpose({ generatePeriods, schedule, days });
</script>

<template>
  <div class="schedule-component">

    <!-- Header -->
    <div class="form-card-header row items-center q-px-lg q-py-md">
      <div class="form-header-icon q-mr-md">
        <q-icon name="calendar_month" size="1.2rem" color="white" />
      </div>
      <div class="col">
        <div class="form-header-title">Horário Semanal</div>
        <div class="form-header-sub">
          <span v-if="employee">Professor: {{ employee.name }}</span>
          <span v-if="employee && classe"> · </span>
          <span v-if="classe">Turma: {{ classe.name }}</span>
        </div>
      </div>
      <!-- Pill -->
      <div class="schedule-pill" v-if="schedule.length">
        <q-icon name="event" size="0.9rem" color="white" class="q-mr-xs" />
        {{ schedule.length }} período(s)
      </div>
    </div>

    <q-separator />

    <!-- Empty state: sem períodos gerados -->
    <div v-if="!schedule.length" class="empty-state">
      <div class="empty-icon-wrap q-mb-md">
        <q-icon name="calendar_month" size="2.5rem" color="white" />
      </div>
      <div class="empty-title">Horário não configurado</div>
      <div class="empty-sub">A turma não possui um período definido para gerar os horários</div>
    </div>

    <!-- Table -->
    <div v-else class="schedule-scroll q-pa-lg">
      <table class="schedule-table">
        <thead>
          <tr>
            <th class="th-periodo">Período</th>
            <th
              v-for="day in days"
              :key="day"
              class="th-day"
            >
              {{ day }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in schedule" :key="rowIndex">

            <!-- Período -->
            <td class="td-periodo">
              <div class="periodo-num">{{ rowIndex + 1 }}º</div>
              <div class="periodo-time">{{ row.time }}</div>
            </td>

            <!-- Slots -->
            <td
              v-for="(slot, colIndex) in row.slots"
              :key="colIndex"
              class="td-slot"
            >
              <!-- Modo edição (professor seleccionado) -->
              <q-select
                v-if="employee"
                v-model="schedule[rowIndex].slots[colIndex]"
                :options="availableTeachings"
                option-label="label"
                option-value="value"
                dense outlined
                clearable
                map-options
                emit-value
                class="slot-select"
                placeholder="—"
                @update:model-value="(val) => handleSelectDiscipline(val, rowIndex, colIndex)"
                @clear="(val) => handleClearDisciplineHorary(val, rowIndex, colIndex)"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">Sem disciplinas disponíveis</q-item-section>
                  </q-item>
                </template>
              </q-select>

              <!-- Modo visualização -->
              <div
                v-else
                class="slot-chip"
                :style="slot?.disciplineName ? `background:${getDisciplineColor(slot)}` : ''"
                :class="{ 'slot-chip-empty': !slot?.disciplineName }"
              >
                <q-icon
                  v-if="slot?.disciplineName"
                  name="menu_book"
                  size="0.75rem"
                  color="white"
                  class="q-mr-xs"
                />
                <span>{{ getDisciplineLabel(slot, isTeacher) || '—' }}</span>
              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";

/* ── Props ── */
const props = defineProps({
  employee: { type: Object, default: null },
  classe: { type: Object, default: null },
  availableTeachings: { type: Array, default: () => [] },
  isTeacher: { type: Boolean, default: false },
});

/* ── Emits ── */
const emit = defineEmits(["select-discipline", "clear-discipline"]);

/* ── State ── */
const schedule = ref([]);
const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

/* ── Utils ── */
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
  return isTeacher
    ? `${slot.disciplineName} - ${slot.employeeName || ""}`
    : `${slot.disciplineName} - ${slot.className || ""}`;
};

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 55%)`;
};

const getDisciplineColor = (slot) => {
  const name = slot?.disciplineName;
  return name ? stringToColor(name) : "#e5e7eb";
};

/* ── Methods ── */
const generatePeriods = () => {
  if (!props.classe?.period?.start || !props.classe?.period?.end) return;

  const start = parseTimeToMinutes(props.classe.period.start);
  const end = parseTimeToMinutes(props.classe.period.end);
  const lessonDuration = 45;
  const shortBreak = 5;
  const longBreak = 10;

  const periods = [];
  let time = start, count = 1;

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

const handleSelectDiscipline = (val, rowIndex, colIndex) => {
  emit("select-discipline", { value: val, rowIndex, colIndex });
};

const handleClearDisciplineHorary = (val, rowIndex, colIndex) => {
  emit("clear-discipline", { value: val, rowIndex, colIndex });
};

/* ── Expose ── */
defineExpose({ generatePeriods, schedule, days });
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap");

.schedule-component {
  font-family: "DM Sans", sans-serif;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #edf0f5;
  box-shadow: 0 2px 20px rgba(15, 40, 98, 0.07);
}

/* ── Header ── */
.form-card-header {
  background: #fafbfd;
  border-bottom: 1px solid #f0f0f0;
}
.form-header-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.form-header-title {
  font-family: "Sora", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #0f2862;
}
.form-header-sub { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; }

.schedule-pill {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  color: white;
  border-radius: 20px;
  padding: 4px 12px;
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
}

/* ── Empty State ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}
.empty-icon-wrap {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-title {
  font-family: "Sora", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #0f2862;
  margin-bottom: 4px;
}
.empty-sub { font-size: 0.82rem; color: #9ca3af; max-width: 280px; }

/* ── Table ── */
.schedule-scroll { overflow-x: auto; }

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.th-periodo,
.th-day {
  font-family: "Sora", sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  background: #fafbfd;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 2px solid #edf0f5;
  white-space: nowrap;
}
.th-periodo { width: 80px; }

.td-periodo {
  padding: 10px 16px;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
  vertical-align: middle;
}
.periodo-num {
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  color: #0f2862;
  line-height: 1;
}
.periodo-time { font-size: 0.75rem; color: #9ca3af; margin-top: 2px; }

.td-slot {
  padding: 8px 10px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
  min-width: 150px;
}

/* ── Slot Select (edit mode) ── */
.slot-select { min-width: 140px; }
.slot-select :deep(.q-field__control) {
  border-radius: 8px;
  background: #f8fafc;
  font-size: 0.82rem;
}
.slot-select :deep(.q-field__control:hover) { border-color: #1a3fa6; }

/* ── Slot Chip (view mode) ── */
.slot-chip {
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.78rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  min-height: 36px;
  transition: transform 0.1s;
}
.slot-chip:hover { transform: scale(1.02); }
.slot-chip-empty {
  background: #f3f4f6 !important;
  color: #d1d5db;
  font-weight: 400;
}

/* ── Row hover ── */
.schedule-table tbody tr { transition: background 0.15s; }
.schedule-table tbody tr:hover td { background: #f5f8ff; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .th-periodo, .th-day, .td-periodo, .td-slot { padding: 8px; }
  .td-slot { min-width: 120px; }
}
</style>

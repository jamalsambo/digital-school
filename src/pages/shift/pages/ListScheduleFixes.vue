<template>
  <q-page class="edigital-page">
    <!-- Top Bar -->
    <div class="page-topbar row items-center q-px-xl q-py-md">
      <q-btn
        flat round dense
        icon="arrow_back_ios_new"
        class="back-btn q-mr-md"
        @click="$router.back()"
      />

      <div class="col">
        <q-breadcrumbs class="breadcrumb-nav" active-color="primary" separator="›">
          <q-breadcrumbs-el label="Dashboard" icon="home" to="/" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Gestão Académica" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Horários" to="/shifts" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Horário Semanal" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="calendar_view_week" size="1.3rem" color="white" />
          </div>
          <span>Horário Semanal</span>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <!-- Refresh -->
        <q-btn flat round dense icon="refresh" class="action-icon-btn" @click="refresh" />

        <!-- Novo Período -->
        <q-btn
          unelevated
          icon="add"
          label="Novo Período"
          class="new-btn"
          no-caps
          @click="addCustomRow"
        />
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row q-px-xl q-mb-lg row q-gutter-md">
      <div class="stat-card col" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="`background:${stat.color}18`">
          <q-icon :name="stat.icon" size="1.3rem" :style="`color:${stat.color}`" />
        </div>
        <div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Schedule Card -->
    <div class="q-px-xl q-pb-xl">
      <q-card class="table-card" flat>
        <q-card-section class="q-pa-none">

          <!-- Toolbar -->
          <div class="table-toolbar row items-center justify-between q-px-lg q-py-md">
            <div class="row items-center q-gutter-xs">
              <span class="table-count">{{ sortedRows.length }}</span>
              <span class="table-count-label">períodos configurados</span>
            </div>
            <div class="row items-center q-gutter-xs">
              <q-chip
                v-for="day in weekDays" :key="day"
                dense class="day-chip"
              >
                {{ day.slice(0, 3) }}
              </q-chip>
            </div>
          </div>

          <q-separator />

          <!-- Schedule Table -->
          <div class="schedule-wrap">
            <q-table
              :rows="sortedRows"
              :columns="columns"
              row-key="id"
              hide-bottom
              flat
              class="edigital-table schedule-table"
            >
              <!-- Coluna HORA -->
              <template #body-cell-hora="props">
                <q-td :props="props" class="time-cell">
                  <div class="time-inputs row q-gutter-sm">
                    <q-input
                      v-model="props.row.entry"
                      mask="##:##"
                      outlined dense
                      class="edigital-input time-input"
                      :rules="[validateTime]"
                      error-message="Conflito de horário!"
                    >
                      <template #prepend>
                        <span class="time-label-tag">Entrada</span>
                      </template>
                      <template #append>
                        <q-icon name="access_time" class="cursor-pointer time-icon">
                          <q-popup-proxy>
                            <q-time v-model="props.row.entry" mask="HH:mm" format24h />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>

                    <q-input
                      v-model="props.row.exit"
                      mask="##:##"
                      outlined dense
                      class="edigital-input time-input"
                      :rules="[validateTime]"
                      error-message="Conflito de horário!"
                    >
                      <template #prepend>
                        <span class="time-label-tag exit-tag">Saída</span>
                      </template>
                      <template #append>
                        <q-icon name="access_time" class="cursor-pointer time-icon">
                          <q-popup-proxy>
                            <q-time v-model="props.row.exit" mask="HH:mm" format24h />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>

                  <!-- Period chip preview -->
                  <div class="q-mt-xs" v-if="props.row.entry && props.row.exit">
                    <q-chip dense class="period-chip" icon="schedule">
                      {{ props.row.entry }} — {{ props.row.exit }}
                    </q-chip>
                  </div>
                </q-td>
              </template>

              <!-- Colunas de Dias -->
              <template
                v-for="day in weekDays"
                #[`body-cell-${day}`]="props"
                :key="day"
              >
                <q-td :props="props" class="day-cell">
                  <q-select
                    v-model="props.row.activities[day]"
                    :options="activitiesOptions"
                    outlined dense
                    emit-value map-options
                    options-dense
                    class="edigital-input day-select"
                    placeholder="—"
                    @update:model-value="updateSelection(props.row, day)"
                  />
                </q-td>
              </template>
            </q-table>
          </div>

        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useShiftStores } from "../store";
import useNotify from "src/composables/UseNotify";

/* ── Store ── */
const shiftStores = useShiftStores();
const { notifyError, notifySuccess } = useNotify();

/* ── Config ── */
const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

/* ── State ── */
const registeredActivities = ref([]);
const fixedSchedules = ref([]);
const rows = ref([]);

/* ── Columns ── */
const columns = ref([
  { name: "hora", label: "HORA", align: "left" },
  ...weekDays.map((day) => ({ name: day, label: day, align: "center" })),
]);

/* ── Computed ── */
const sortedRows = computed(() =>
  [...rows.value].sort((a, b) => timeToMinutes(a.entry) - timeToMinutes(b.entry))
);

const activitiesOptions = computed(() =>
  registeredActivities.value.map((activity) => ({
    label: activity.name,
    value: activity.id,
  }))
);

const stats = computed(() => [
  {
    label: "Períodos",
    value: rows.value.length,
    icon: "calendar_view_week",
    color: "#1a3fa6",
  },
  {
    label: "Actividades",
    value: registeredActivities.value.length,
    icon: "push_pin",
    color: "#21b573",
  },
  {
    label: "Dias Activos",
    value: weekDays.length,
    icon: "today",
    color: "#f59e0b",
  },
]);

/* ── Time Utils ── */
const timeToMinutes = (time) => {
  const [hours, minutes] = time?.split(":") || [0, 0];
  return parseInt(hours) * 60 + parseInt(minutes);
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

/* ── Validation ── */
const validateTime = () => {
  const entries = sortedRows.value.map((row) => ({
    start: timeToMinutes(row.entry),
    end: timeToMinutes(row.exit),
  }));
  for (let i = 1; i < entries.length; i++) {
    if (entries[i].start < entries[i - 1].end) return false;
  }
  return true;
};

/* ── Row Management ── */
const addRow = (schedule) => {
  rows.value.push({ id: Date.now(), ...schedule });
};

const addCustomRow = () => {
  const lastRow = sortedRows.value[sortedRows.value.length - 1];
  const lastEnd = lastRow ? timeToMinutes(lastRow.exit) : 480;
  addRow({
    type: "custom",
    entry: minutesToTime(lastEnd),
    exit: minutesToTime(lastEnd + 60),
    activities: Object.fromEntries(weekDays.map((day) => [day, null])),
  });
};

const loadInitialData = () => {
  fixedSchedules.value.forEach((schedule) => addRow(schedule));
};

/* ── Methods ── */
const refresh = async () => {
  rows.value = [];
  await fetchActivities();
  await fetchSchedule();
  loadInitialData();
};

const updateSelection = async (row, day) => {
  const payload = {
    activityFixeId: row.activities[day],
    type: "fixed",
    dayWeek: day,
    start: row.entry,
    end: row.exit,
  };
  try {
    await shiftStores.createShiftFixe(payload);
    notifySuccess("Horário actualizado!");
  } catch (error) {
    notifyError("Erro ao actualizar horário");
  }
};

const groupDataByPeriod = (data) => {
  const grouped = {};
  data.forEach((item) => {
    if (!grouped[item.start]) {
      grouped[item.start] = {
        type: item.type,
        entry: item.start,
        exit: item.end,
        activities: {},
      };
    }
    weekDays.forEach((day) => {
      if (day === item.dayWeek && item.activityFixeId) {
        grouped[item.start].activities[day] = item.activityFixeId;
      }
    });
  });
  return Object.values(grouped);
};

/* ── Fetch ── */
const fetchActivities = async () => {
  try {
    await shiftStores.findActivityFixe();
    registeredActivities.value = shiftStores.activitiesFixes;
  } catch (error) {
    notifyError("Erro ao carregar actividades");
  }
};

const fetchSchedule = async () => {
  try {
    await shiftStores.findShiftFixe();
    fixedSchedules.value = groupDataByPeriod(shiftStores.scheduleFixes);
  } catch (error) {
    notifyError("Erro ao carregar horário");
  }
};

/* ── Lifecycle ── */
onMounted(async () => {
  await fetchActivities();
  await fetchSchedule();
  loadInitialData();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap");

.edigital-page {
  min-height: 100vh;
  background: #f0f4f8;
  font-family: "DM Sans", sans-serif;
}

/* ── Top Bar ── */
.page-topbar {
  background: #ffffff;
  border-bottom: 1px solid #e8edf3;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.06);
}
.back-btn {
  background: #f0f4f8;
  color: #1a3fa6 !important;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  transition: background 0.2s;
}
.back-btn:hover { background: #e0e8f7; }

.breadcrumb-nav { font-size: 0.78rem; }
.breadcrumb-link { color: #9ca3af !important; }
.breadcrumb-active { color: #1a3fa6 !important; font-weight: 600; }

.page-title {
  font-family: "Sora", sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f2862;
}
.title-icon-wrap {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon-btn {
  background: #f0f4f8;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  transition: background 0.2s;
}
.action-icon-btn:hover { background: #e0e8f7; }

.new-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white;
  border-radius: 10px;
  padding: 0 18px;
  height: 38px;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: "Sora", sans-serif;
  letter-spacing: 0.01em;
  transition: box-shadow 0.2s, transform 0.15s;
}
.new-btn:hover {
  box-shadow: 0 6px 18px rgba(26, 63, 166, 0.35);
  transform: translateY(-1px);
}

/* ── Stats ── */
.stats-row { padding-top: 1.2rem; }
.stat-card {
  background: white;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.05);
  border: 1px solid #edf0f5;
  transition: box-shadow 0.2s;
}
.stat-card:hover { box-shadow: 0 4px 20px rgba(15, 40, 98, 0.1); }
.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-value {
  font-family: "Sora", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f2862;
  line-height: 1;
}
.stat-label { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; font-weight: 500; }

/* ── Table Card ── */
.table-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(15, 40, 98, 0.07);
  border: 1px solid #edf0f5;
}
.table-toolbar {
  background: #fafbfd;
  border-bottom: 1px solid #f0f0f0;
}
.table-count { font-family: "Sora", sans-serif; font-weight: 700; font-size: 1rem; color: #0f2862; }
.table-count-label { font-size: 0.82rem; color: #9ca3af; }

/* ── Day Chips (toolbar) ── */
.day-chip {
  background: #eff6ff;
  color: #1a3fa6;
  font-family: "Sora", sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: 6px;
}

/* ── Schedule Table ── */
.schedule-wrap {
  overflow-x: auto;
}
.schedule-table {
  min-width: 1000px;
}

.edigital-table :deep(thead tr th) {
  font-family: "Sora", sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  background: #fafbfd;
  border-bottom: 2px solid #edf0f5;
  padding: 14px 16px;
}
.edigital-table :deep(tbody tr) { transition: background 0.15s; }
.edigital-table :deep(tbody tr:hover) { background: #f5f8ff !important; }
.edigital-table :deep(tbody tr td) {
  font-size: 0.875rem;
  color: #374151;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

/* ── Time Cell ── */
.time-cell { min-width: 280px; }

.time-inputs { flex-wrap: nowrap; }

.time-input { min-width: 120px; }

.time-label-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: #1a3fa6;
  font-family: "Sora", sans-serif;
  white-space: nowrap;
}
.exit-tag { color: #6366f1; }

.time-icon { color: #1a3fa6; transition: color 0.2s; }
.time-icon:hover { color: #0f2862; }

/* ── Period Chip ── */
.period-chip {
  background: #1a3fa6;
  color: white;
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 0.75rem;
  border-radius: 8px;
}

/* ── Day Cell ── */
.day-cell { min-width: 160px; }

.day-select { min-width: 140px; }

/* ── Input overrides ── */
.edigital-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
}
.edigital-input :deep(.q-field__control:hover) {
  border-color: #1a3fa6;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .stats-row { padding: 1rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
}
</style>

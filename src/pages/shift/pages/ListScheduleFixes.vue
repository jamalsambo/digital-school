<template>
  <q-card class="q-ma-md">
    <q-table
      :rows="sortedRows"
      :columns="columns"
      row-key="id"
      hide-bottom
      flat
      class="schedule-table"
    >
      <!-- Coluna HORA -->
      <template #body-cell-hora="props">
        <q-td :props="props" class="time-cell">
          <div class="row q-gutter-sm">
            <q-input
              v-model="props.row.entry"
              mask="##:##"
              label="Entrada"
              outlined
              dense
              :rules="[validateTime]"
              error-message="Conflito de horário!"
            >
              <template #append>
                <q-icon  name="access_time">
                  <q-popup-proxy>
                    <q-time v-model="props.row.entry" mask="HH:mm" format24h />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              v-model="props.row.exit"
              mask="##:##"
              label="Saída"
              outlined
              dense
              :rules="[validateTime]"
              error-message="Conflito de horário!"
            >
              <template #append>
                <q-icon name="access_time">
                  <q-popup-proxy>
                    <q-time v-model="props.row.exit" mask="HH:mm" format24h />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div v-if="props.row.label" class="text-caption text-grey q-mt-xs">
            {{ props.row.label }}
          </div>
        </q-td>
      </template>

      <!-- Colunas de Dias -->
      <template
        v-for="day in weekDays"
        #[`body-cell-${day}`]="props"
        :key="day"
      >
        <q-td
          :props="props"
        >
          <q-select
            v-model="props.row.activities[day]"
            :options="activitiesOptions"
            outlined
            dense
            emit-value
            map-options
            @update:model-value="uupdateSelection(props.row, day)"
            options-dense
          />
        </q-td>

      </template>
    </q-table>

    <q-card-actions class="q-pa-md">
      <q-btn
        @click="addCustomRow"
        icon="add"
        label="Novo Período"
        color="positive"
        class="q-mr-sm"
      />
      <q-space />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useShiftStores } from "../store";

const shiftStores = useShiftStores();

// Configurações
const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

// Simulação de banco de dados
const registeredActivities = ref([]);

const uupdateSelection = async (row, day) => {
  const selectedActivityId = row.activities[day]; // Número da atividade selecionada

  // Encontrar o objeto completo da atividade pelo ID
  // const selectedActivity = activitiesOptions.value.find(act => act.value === selectedActivityId);

  const payload = {
    activityFixeId: selectedActivityId,
    type: "fixed",
    dayWeek: day,
    start: row.entry,
    end: row.exit,
  };

  try {
    await shiftStores.createShiftFixe(payload)

  } catch (error) {
    console.log(error)
  }
};

// Horários fixos
const fixedSchedules = ref([]);

// Reatividade
const columns = ref([
  { name: "hora", label: "HORA", align: "left" },
  ...weekDays.map((day) => ({ name: day, label: day })),
]);

const rows = ref([]);

// Conversão de tempo
const timeToMinutes = (time) => {
  const [hours, minutes] = time?.split(":") || [0, 0];
  return parseInt(hours) * 60 + parseInt(minutes);
};

// Validação
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

// Linhas ordenadas
const sortedRows = computed(() => {
  return [...rows.value].sort(
    (a, b) => timeToMinutes(a.entry) - timeToMinutes(b.entry)
  );
});

// Adição de linhas
const addRow = (schedule) => {
  rows.value.push({
    id: Date.now(),
    ...schedule,
  });
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

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

// Carregar dados iniciais
const loadInitialData = () => {
  // Carregar horários fixos
  fixedSchedules.value.forEach((schedule) => addRow(schedule));
};

// Opções de atividades formatadas
const activitiesOptions = computed(() => {
  return registeredActivities.value.map((activity) => ({
    label: activity.name,
    value: activity.id,
  }));
});

const fetchActivities = async () => {
  try {
    await shiftStores.findActivityFixe();
    registeredActivities.value = shiftStores.activitiesFixes;
  } catch (error) {
    console.log(error);
  }
};


const fetchSchedule = async () => {
  try {
    await shiftStores.findShiftFixe()
    fixedSchedules.value = groupDataByPeriod(shiftStores.scheduleFixes)
  } catch (error) {
    console.log()
  }
}

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
      if (day ===item.dayWeek && item.activityFixeId) {
        grouped[item.start].activities[day] = item.activityFixeId;
      }
    });
  });

  return Object.values(grouped);
};

// Inicialização
onMounted(async () => {
  await fetchActivities();
  await fetchSchedule()
  loadInitialData();
});
</script>

<style>
.schedule-table .q-table__top {
  border-bottom: 1px solid #ddd;
}

.time-cell {
  min-width: 250px;
}

.q-table__card {
  min-width: 1000px;
}

.q-input--readonly .q-field__control {
  background-color: #f8f9fa;
}

.q-select__dropdown-icon {
  color: #666;
}
</style>

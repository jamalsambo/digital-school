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
              :readonly="props.row.type === 'fixed'"
              :rules="[validateTime]"
              error-message="Conflito de horário!"
            >
              <template #append>
                <q-icon v-if="props.row.type !== 'fixed'" name="access_time">
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
              :readonly="props.row.type === 'fixed'"
              :rules="[validateTime]"
              error-message="Conflito de horário!"
            >
              <template #append>
                <q-icon v-if="props.row.type !== 'fixed'" name="access_time">
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
          :style="getActivityStyle(props.row.activities[day])"
        >
          <q-select
            v-model="props.row.activities[day]"
            :options="activitiesOptions"
            outlined
            dense
            emit-value
            map-options
            :readonly="props.row.type === 'fixed'"
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
      <q-btn
        @click="save"
        icon="save"
        label="Salvar Agenda"
        color="primary"
        :disable="hasOverlap"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

// Configurações
const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

// Simulação de banco de dados
const registeredActivities = ref([
  { id: 1, nome: "Trabalho", cor: "#4ECDC4" },
  { id: 2, nome: "Reunião", cor: "#FF6B6B" },
  { id: 3, nome: "Lanche", cor: "#2ECC71" },
  { id: 4, nome: "Almoço", cor: "#FF9F43" },
]);

const savedSchedule = ref([
  {
    entry: "08:00",
    exit: "09:00",
    activities: {
      Segunda: 1,
      Terça: 1,
      Quarta: 1,
      Quinta: 1,
      Sexta: 1,
    },
  },
  {
    entry: "12:00",
    exit: "13:00",
    activities: {
      Segunda: 4,
      Terça: 4,
      Quarta: 4,
      Quinta: 4,
      Sexta: 4,
    },
  },
]);

// Horários fixos
const fixedSchedules = [
  {
    type: "fixed",
    entry: "09:00",
    exit: "09:30",
    label: "Lanche da Manhã",
    activities: Object.fromEntries(weekDays.map((day) => [day, 3])),
  },
  {
    type: "fixed",
    entry: "13:00",
    exit: "17:00",
    label: "Período da Tarde",
    activities: Object.fromEntries(weekDays.map((day) => [day, 1])),
  },
];

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

// Verificação de conflitos
const hasOverlap = computed(() => !validateTime());

// Estilo das atividades
const getActivityStyle = (activityId) => {
  const activity = registeredActivities.value.find((a) => a.id === activityId);
  return activity
    ? {
        backgroundColor: `${activity.cor}20`,
        borderLeft: `3px solid ${activity.cor}`,
      }
    : {};
};

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
  // Carregar horários salvos
  savedSchedule.value.forEach((schedule) => {
    addRow({
      ...schedule,
      type: "saved",
    });
  });

  // Carregar horários fixos
  fixedSchedules.forEach((schedule) => addRow(schedule));
};

// Salvamento
const save = async () => {
  try {
    // 1. Criar payload com dados atuais
    const payload = sortedRows.value
      .map((row) => ({
        entry: row.entry,
        exit: row.exit,
        activities: row.activities,
      }));

    // 2. Atualizar dados salvos com o novo payload
    savedSchedule.value = [...payload]; // Cria nova referência para trigger de reatividade

    const newRou =  rows.value.filter((row) => row.type === "custom");
    console.log(newRou)


    // 3. Limpar linhas salvas antigas
    rows.value = rows.value.filter((row) => row.type !== "custom");
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erro ao salvar: " + error.message,
    });
  }
};

// Opções de atividades formatadas
const activitiesOptions = computed(() => {
  return registeredActivities.value.map((activity) => ({
    label: activity.nome,
    value: activity.id,
  }));
});

// Inicialização
onMounted(() => {
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

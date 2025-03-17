<template>
 <q-page padding>
  <q-card class="q-ma-md">
    <q-table
      :rows="sortedRows"
      :columns="columns"
      row-key="id"
      hide-bottom
      :pagination="{ rowsPerPage: 10 }"
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
        >
          <q-select
            v-model="props.row.activities[day]"
            :options="activitiesOptions"
            outlined
            dense
            emit-value
            map-options
            :readonly="props.row.type === 'fixed' || hasOverlap"

            @update:model-value="updateSelection(props.row, day)"
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
</q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useShiftStores } from "src/pages/shift/store";
import { useClassStores } from "src/pages/class/store";
import { useScheduleStores } from "../stores";
import { useRoute } from "vue-router";


// setup routes
const route = useRoute();

// setup store
const shiftStores = useShiftStores();
const classStores = useClassStores();
const scheduleStores = useScheduleStores();

// setup data
const { classId } = route.params;
// Configurações
const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const registeredActivities = ref([]);
const savedSchedule = ref([]);
const fixedSchedules = ref([]);

const columns = ref([
  { name: "hora", label: "HORA", align: "left" },
  ...weekDays.map((day) => ({ name: day, label: day })),
]);
const rows = ref([]);
const classe = ref();
const classEntry = ref();
const classExit = ref();
const classTime = ref([
  {
    type: "fixed",
    entry: classEntry,
    exit: classEntry,
    label: "Lanche da Manhã",
    activities: Object.fromEntries(weekDays.map((day) => [day, "Entrada"])),
  },
]);

const updateSelection = async (row, day) => {
  const selectedActivityId = row.activities[day]; // Número da atividade selecionada

  // Encontrar o objeto completo da atividade pelo ID
  // const selectedActivity = activitiesOptions.value.find(act => act.value === selectedActivityId);

  const payload = {
    classId: classId,
    disciplineId: selectedActivityId,
    dayWeek: day,
    startTime: row.entry,
    endTime: row.exit,
  };

  try {
    await scheduleStores.create(payload);
  } catch (error) {
    console.log(error);
  }
};

// methods
const timeToMinutes = (time) => {
  const [hours, minutes] = time?.split(":") || [0, 0];
  return parseInt(hours) * 60 + parseInt(minutes);
};

// Validação
const validateTime = (time) => {
  const timeMinutes = timeToMinutes(time);
  const classStart = timeToMinutes(classEntry.value);
  const classEnd = timeToMinutes(classExit.value);

  // Verificar se está dentro do horário da classe
  if (timeMinutes < classStart || timeMinutes > classEnd) {
    return "Fora do horário da classe!";
  }

  // Verificar conflitos entre períodos
  const entries = sortedRows.value.map((row) => ({
    start: timeToMinutes(row.entry),
    end: timeToMinutes(row.exit),
  }));

  for (let i = 1; i < entries.length; i++) {
    if (entries[i].start < entries[i - 1].end) return "Conflito de horário!";
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

// Adição de linhas
const addRow = (schedule) => {
  rows.value.push({
    id: Date.now(),
    ...schedule,
  });
};

const addCustomRow = () => {
  const classEndTime = timeToMinutes(classExit.value); // Horário de término da classe (ex: 17:00)

const lastRow = sortedRows.value[sortedRows.value.length - 1];
const lastEnd = lastRow ? timeToMinutes(lastRow.exit) : 480; // 480 = 8:00 AM

// Calcular novo horário, mas não ultrapassar o fim da aula
const newEntry = lastEnd;
const newExit = Math.min(newEntry + 60, classEndTime); // 👈 Limitar ao horário da classe

if (newEntry >= classEndTime) {
  alert("Não é possível adicionar mais períodos após o término da aula!");
  return;
}

addRow({
  type: "custom",
  entry: minutesToTime(newEntry),
  exit: minutesToTime(newExit),
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

  // // Carregar horários fixos
  classTime.value.forEach((schedule) => addRow(schedule));
  fixedSchedules.value.forEach((schedule) => addRow(schedule));
};

// Opções de atividades formatadas
const activitiesOptions = computed(() => {
  return registeredActivities.value.map((activity) => ({
    label: activity.name,
    value: activity.id,
  }));
});

const fetchScheduleFixe = async () => {
  try {
    await shiftStores.findShiftFixe();
    fixedSchedules.value = groupDataByPeriod(shiftStores.scheduleFixes);
  } catch (error) {
    console.log();
  }
};

const fetchClass = async () => {
  try {
    await classStores.findOne(classId);
    classe.value = classStores.classe;
    classEntry.value = classe.value.period.start;
    classExit.value = '17:00';
    if (classStores.classe.curriculumId) {
      console.log("tem curriculum");
    } else {
      registeredActivities.value =
        classStores.classe.course.curriculum.developmentAreas.flatMap(
          (area) => {
            return area.developmentAreaActivities.map((dev) => {
              return {
                id: dev.activity.id,
                name: dev.activity.name, // ou qualquer outro dado relevante
              }; // ou qualquer outro dado relevante
            });
          }
        );
    }
  } catch (error) {
    console.log(error);
    // notifyError("Erro no carregamento");
  }
};

const fetchSchedules = async () => {
  try {
    await scheduleStores.list();
    savedSchedule.value = groupDataByPeriodTe(scheduleStores.schecules)
  } catch (error) {
    console.log(error)
  }
}

const groupDataByPeriodTe = (data) => {
  const grouped = {};

  data.forEach((item) => {
    if (!grouped[item.startTime]) {
      grouped[item.startTime] = {
        entry: item.startTime,
        exit: item.endTime,
        activities: {},


      };
    }

    weekDays.forEach((day) => {
      if (day === item.dayWeek && item.disciplineId) {
        grouped[item.startTime].activities[day] = item.discipline.name;
      }
    });
  });

  return Object.values(grouped);
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
        grouped[item.start].activities[day] = item.activity.name;
      }
    });
  });

  return Object.values(grouped);
};

// Inicialização
onMounted(async () => {
  await fetchClass();
  await fetchScheduleFixe();
  await fetchSchedules();
  loadInitialData();
});
</script>

<style>
.schedule-table .q-table__top {
  border-bottom: 1px solid #ddd;
}
.schedule-table .q-table__middle {
  max-height: none !important;
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

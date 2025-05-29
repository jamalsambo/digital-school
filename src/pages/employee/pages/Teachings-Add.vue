<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card flat bordered class="shadow-2">
        <q-card-section>
          <div class="text-h6">Associar Disciplinas ao Professor</div>
          <div class="text-body2 text-grey-7">
            Escolha um professor e associe as disciplinas desejadas por ciclo.
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- Professor -->
            <q-select
              v-model="employee"
              class="col-md-6 col-sm-12 col-xs-12"
              :options="employees"
              label="Professor"
              option-label="name"
              option-value="id"
              outlined
              map-options
              clearable
              dense
              :rules="[(val) => !!val || 'Selecione um professor.']"
              @update:model-value="handleEmployeeChange(employee)"
            />

            <!-- Disciplinas -->
            <q-select
              class="col-md-6 col-sm-12 col-xs-12"
              outlined
              v-model="selected"
              multiple
              :options="filteredOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              use-chips
              stack-label
              label="Disciplinas por Ciclo"
              dense
            >
              <template v-slot:selected-item="scope">
                <q-chip @remove="removeSelection(scope.opt.value)">
                  {{ scope.opt.label }}
                </q-chip>
              </template>

              <template v-slot:option="scope">
                <q-item clickable v-ripple @click="toggleSelection(scope.opt)">
                  <q-item-section>
                    <q-item-label>
                      <strong v-if="scope.opt.isGroup">
                        {{ scope.opt.label }}
                      </strong>
                      <span v-else>{{ scope.opt.label }}</span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-icon v-if="isSelected(scope.opt)" name="check" />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-section>
          <ScheduleComponent
            ref="scheduleRef"
            :employee="employee"
            :classe="classe"
            :available-teachings="availableTeachings"
            @select-discipline="onSelectDiscipline"
            @clear-discipline="onClearDisciplineHorary"
          >
          </ScheduleComponent>
        </q-card-section>
        <div class="row q-mt-md justify-end">
          <q-btn
            label="voltar"
            color="negative"
            flat
            type="reset"
            @click="router.back()"
          />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
/* ============================== IMPORTS ============================== */
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEmployeeStores } from "../stores";
import { useClassStores } from "src/pages/class/store";
import { useScheduleStores } from "src/pages/schedule/stores";
import useNotify from "src/composables/UseNotify";
import ScheduleComponent from "src/pages/schedule/pages/Create.vue";

/* ============================== STORES & ROUTE ============================== */
const route = useRoute();
const router = useRouter();
const employeeStores = useEmployeeStores();
const classStores = useClassStores();
const scheculeStores = useScheduleStores();
const { notifyError, notifySuccess, notifyInfo } = useNotify();

/* ============================== REFS ============================== */
const { id: classId } = route.params;
const employees = ref([]);
const employee = ref(null);
const disciplines = ref([]);
const selected = ref([]);
const classe = ref();
const scheduleRef = ref([]);

/* ============================== COMPUTEDS ============================== */
const isSelected = (opt) => selected.value.includes(opt.value);

const rawData = computed(() => {
  const grouped = {};
  disciplines.value.forEach((d) => {
    if (!grouped[d.name]) grouped[d.name] = { cicles: [] };
    grouped[d.name].cicles.push({ id: d.id, cicle: d.cicle });
  });
  return grouped;
});

const filteredOptions = computed(() => {
  if (!employee.value) return [];

  const takenDisciplineIds = new Set();
  employees.value.forEach((e) => {
    if (e.id !== employee.value.id && e.teachings?.length) {
      e.teachings.forEach((t) =>
        takenDisciplineIds.add(t.developmentAreaActivityId)
      );
    }
  });

  const list = [];
  for (const discipline in rawData.value) {
    const availableCicles = rawData.value[discipline].cicles.filter(
      (c) => !takenDisciplineIds.has(c.id)
    );

    if (availableCicles.length > 0) {
      list.push({ label: discipline, isGroup: true });
      availableCicles.forEach((c) =>
        list.push({
          label: `Ciclo ${c.cicle}`,
          value: c.id,
          parent: discipline,
        })
      );
    }
  }

  return list;
});

const selectedTeachings = computed(() => {
  return (
    employees.value.find((p) => p.id === employee.value?.id)?.teachings || []
  );
});

const teachingUsageCount = computed(() => {
  const count = {};
  scheduleRef.value.schedule.forEach((row) =>
    row.slots.forEach((id) => {
      if (id) count[id] = (count[id] || 0) + 1;
    })
  );
  return count;
});

const availableTeachings = computed(() => {
  return selectedTeachings.value
    .filter((t) => {
      const usage =
        teachingUsageCount.value[t.developmentAreaActivity.activity.id] || 0;
      return t.developmentAreaActivity.hours - usage > 0;
    })
    .map((t) => {
      const usage =
        teachingUsageCount.value[t.developmentAreaActivity.activity.id] || 0;
      return {
        label: `${t.developmentAreaActivity.activity.name} - (${t.classEntity.name} - ${t.classEntity.course.name}) (${usage}/${t.developmentAreaActivity.hours})`,
        value: t.developmentAreaActivity.activity.id,
      };
    });
});

/* ============================== EVENTOS ============================== */
const handleEmployeeChange = async (employee) => {
  scheduleRef.value.schedule.forEach((row) => row.slots.fill(null));
  selected.value = employee.teachings.map((t) => t.developmentAreaActivityId);

  employee.schedules.forEach(({ dayWeek, period, discipline }) => {
    const colIndex = scheduleRef.value.days.indexOf(dayWeek);
    if (colIndex !== -1 && period < scheduleRef.value.schedule.length) {
      scheduleRef.value.schedule[period].slots[colIndex] = discipline.id;
    }
  });
};

const toggleSelection = async (opt) => {
  if (opt.isGroup) return;

  const payload = {
    employeeId: employee.value.id,
    developmentAreaActivityId: opt.value,
    classId,
  };

  const index = selected.value.indexOf(opt.value);
  const isAdding = index === -1;

  try {
    if (isAdding) {
      selected.value.push(opt.value);
      await employeeStores.addTeachings(payload);
      notifySuccess("Disciplina adicionada com sucesso");
    } else {
      selected.value.splice(index, 1);
      await employeeStores.removeTeachings(employee.value.id, opt.value);
    }
    await fetchEmployees();
  } catch (error) {
    console.log(error);
    notifyError("Ocorreu um erro ao atualizar a disciplina.");
  }
};

const removeSelection = (val) => {
  const index = selected.value.indexOf(val);
  if (index !== -1) selected.value.splice(index, 1);
};

const onSelectDiscipline = async ({ value, rowIndex, colIndex }) => {
  if (value === null) return;

  const selectedDay = scheduleRef.value.days[colIndex];
  const selectedPeriod = rowIndex;
  const startTime = scheduleRef.value.schedule[rowIndex].time;

  const usage = teachingUsageCount.value[value] || 0;
  const teaching = selectedTeachings.value.find(
    (t) => t.developmentAreaActivity.activity.id === value
  );

  if (!teaching || usage >= teaching.developmentAreaActivity.hours) {
    notifyError("A carga horária da disciplina foi esgotada.");
    scheduleRef.value.schedule[rowIndex].slots[colIndex] = null;
    return;
  }

  const conflict = employees.value.some(
    (prof) =>
      prof.id !== employee.value?.id &&
      prof.schedules?.some(
        (s) =>
          s.dayWeek === selectedDay &&
          s.period === selectedPeriod &&
          s.classe.id === classe.value?.id
      )
  );

  if (conflict) {
    notifyInfo(
      "Já existe uma disciplina alocada por outro professor neste período."
    );
    scheduleRef.value.schedule[rowIndex].slots[colIndex] = null;
    return;
  }

  const payload = {
    classId,
    disciplineId: value,
    employeeId: employee.value.id,
    dayWeek: selectedDay,
    period: selectedPeriod,
    startTime,
  };

  try {
    await scheculeStores.create(payload);
  } catch (error) {
    console.log(error);
  }
};

const onClearDisciplineHorary = async ({ value, rowIndex, colIndex }) => {
  const selectedDay = scheduleRef.value.days[colIndex];
  const selectedPeriod = rowIndex;

  const payload = {
    classId,
    disciplineId: value,
    employeeId: employee.value.id,
    dayWeek: selectedDay,
    period: selectedPeriod,
  };

  try {
    await scheculeStores.delete(payload);
  } catch (error) {
    console.log(error);
  }
};

/* ============================== FETCHERS ============================== */
const fetchEmployees = async () => {
  try {
    await employeeStores.list();
    employees.value = employeeStores.employees
      .filter((e) => e.teacher === "Sim")
      .map((e) => ({
        id: e.id,
        name: e?.basicInformation?.fullName ?? "Default",
        teacher: e?.teacher,
        teachings: e?.teachings,
        schedules: e?.schedules,
      }));
  } catch {
    notifyError("Erro ao carregar professores.");
  }
};

const fetchClassDisciplines = async () => {
  try {
    await classStores.findOne(classId);
    if (!classStores.classe.curriculumId) {
      const curriculum = classStores.classe.course.curriculums.find(
        (c) => c.status === "ACTIVO"
      );

      disciplines.value =
        curriculum?.developmentAreas?.flatMap((area) =>
          area.developmentAreaActivities.map((dev) => ({
            id: dev.id,
            name: dev.activity.name,
            disciplineId: dev.activity.id,
            cicle: dev.cicle,
          }))
        ) ?? [];
    }
  } catch {
    notifyError("Erro ao carregar a turma.");
  }
};

const fetchClasse = async () => {
  try {
    await classStores.findOne(classId);
    classe.value = classStores.classe;
  } catch (error) {
    console.log(error);
  }
};

/* ============================== LIFECYCLE ============================== */
onMounted(async () => {
  await fetchClasse();
  await fetchEmployees();
  await fetchClassDisciplines();
  if (scheduleRef.value?.generatePeriods) {
    scheduleRef.value.generatePeriods();
  }
});
</script>

<style scoped>
.text-h6 {
  font-weight: bold;
}
.q-markup-table th,
.q-markup-table td {
  min-width: 100px;
  height: 50px;
}
</style>

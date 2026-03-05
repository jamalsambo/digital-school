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
          <q-breadcrumbs-el label="Professores" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Associar Disciplinas" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="assignment_ind" size="1.3rem" color="white" />
          </div>
          <span>Associar Disciplinas ao Professor</span>
        </div>
      </div>
    </div>

    <div class="q-px-xl q-pt-lg q-pb-xl q-gutter-lg">

      <!-- Card: Seleção -->
      <q-card class="form-card" flat>

        <div class="form-card-header row items-center q-px-lg q-py-md">
          <div class="form-header-icon q-mr-md">
            <q-icon name="person_search" size="1.2rem" color="white" />
          </div>
          <div class="col">
            <div class="form-header-title">Configuração de Atribuição</div>
            <div class="form-header-sub">
              Escolha um professor e associe as disciplinas desejadas por ciclo
            </div>
          </div>
          <!-- Pill de disciplinas seleccionadas -->
          <div class="permissions-count-pill" v-if="employee">
            <q-icon name="menu_book" size="0.9rem" color="white" class="q-mr-xs" />
            {{ selected.length }} disciplina(s)
          </div>
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <div class="section-label q-mb-md">Selecionar Professor e Disciplinas</div>

          <div class="row q-col-gutter-md">

            <!-- Professor -->
            <div class="col-md-6 col-12">
              <div class="field-label">Professor <span class="required">*</span></div>
              <q-select
                v-model="employee"
                :options="employees"
                option-label="name"
                option-value="id"
                placeholder="Selecione o professor..."
                outlined dense
                class="edigital-input"
                map-options
                clearable
                :rules="[(val) => !!val || 'Selecione um professor.']"
                @update:model-value="handleEmployeeChange(employee)"
              >
                <template #prepend>
                  <q-icon name="person" color="grey-5" size="1rem" />
                </template>
              </q-select>
            </div>

            <!-- Disciplinas -->
            <div class="col-md-6 col-12">
              <div class="field-label">Disciplinas por Ciclo</div>
              <q-select
                v-model="selected"
                :options="filteredOptions"
                option-value="value"
                option-label="label"
                placeholder="Selecione as disciplinas..."
                outlined dense
                class="edigital-input"
                multiple
                emit-value
                map-options
                use-chips
                stack-label
                :disable="!employee"
              >
                <template #prepend>
                  <q-icon name="menu_book" color="grey-5" size="1rem" />
                </template>

                <template #selected-item="scope">
                  <q-chip
                    dense removable
                    class="discipline-chip"
                    @remove="removeSelection(scope.opt.value)"
                  >
                    {{ scope.opt.label }}
                  </q-chip>
                </template>

                <template #option="scope">
                  <q-item
                    v-if="scope.opt.isGroup"
                    dense
                    class="discipline-group-item"
                  >
                    <q-item-section>
                      <q-item-label class="discipline-group-label">
                        {{ scope.opt.label }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    v-else
                    clickable v-ripple
                    class="discipline-item"
                    @click="toggleSelection(scope.opt)"
                  >
                    <q-item-section>
                      <q-item-label class="discipline-item-label">
                        {{ scope.opt.label }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon
                        v-if="isSelected(scope.opt)"
                        name="check_circle"
                        color="primary"
                        size="1rem"
                      />
                    </q-item-section>
                  </q-item>
                </template>

                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      {{ employee ? 'Nenhuma disciplina disponível' : 'Selecione um professor primeiro' }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

          </div>

          <!-- Professor Pill -->
          <div class="student-pill row items-center q-gutter-sm q-mt-md" v-if="employee">
            <q-avatar size="36px" class="student-pill-avatar">
              <q-icon name="person" color="white" size="1.1rem" />
            </q-avatar>
            <div>
              <div class="student-pill-name">{{ employee.name }}</div>
              <div class="student-pill-sub">
                {{ selected.length }} disciplina(s) atribuída(s) · {{ availableTeachings.length }} disponível(eis) para horário
              </div>
            </div>
            <q-space />
            <q-btn
              flat round dense icon="close"
              size="sm" color="grey-5"
              @click="employee = null; selected = []"
            />
          </div>

        </q-card-section>
      </q-card>

      <!-- Card: Horário Semanal -->
      <q-card class="form-card" flat v-if="employee">

        <div class="form-card-header row items-center q-px-lg q-py-md">
          <div class="form-header-icon q-mr-md">
            <q-icon name="calendar_month" size="1.2rem" color="white" />
          </div>
          <div>
            <div class="form-header-title">Horário Semanal</div>
            <div class="form-header-sub">
              Distribua as disciplinas pelos períodos e dias da semana
            </div>
          </div>
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg schedule-wrap">
          <ScheduleComponent
            ref="scheduleRef"
            :employee="employee"
            :classe="classe"
            :available-teachings="availableTeachings"
            @select-discipline="onSelectDiscipline"
            @clear-discipline="onClearDisciplineHorary"
          />
        </q-card-section>

      </q-card>

      <!-- Empty State (sem professor) -->
      <q-card v-else class="form-card empty-card" flat>
        <q-card-section class="column items-center q-py-xl">
          <div class="empty-icon-wrap q-mb-md">
            <q-icon name="assignment_ind" size="3rem" color="white" />
          </div>
          <div class="empty-title">Nenhum professor seleccionado</div>
          <div class="empty-sub">Selecione um professor acima para visualizar e configurar o horário semanal</div>
        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "src/pages/auth/store";
import { useEmployeeStores } from "../stores";
import { useClassStores } from "src/pages/class/store";
import { useScheduleStores } from "src/pages/schedule/stores";
import { useInstitutionStores } from "src/pages/institution/store";
import useNotify from "src/composables/UseNotify";
import ScheduleComponent from "src/pages/schedule/pages/Create.vue";

/* ── Router / Store ── */
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const employeeStores = useEmployeeStores();
const classStores = useClassStores();
const scheculeStores = useScheduleStores();
const institutionStores = useInstitutionStores();
const { notifyError, notifySuccess, notifyInfo } = useNotify();

/* ── Params ── */
const { id: classId } = route.params;

/* ── State ── */
const employees = ref([]);
const employee = ref(null);
const disciplines = ref([]);
const selected = ref([]);
const classe = ref(null);
const scheduleRef = ref(null);
const currentCycle = ref(null);

/* ── Computed ── */
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
      e.teachings.forEach((t) => takenDisciplineIds.add(t.developmentAreaActivityId));
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
        list.push({ label: `Ciclo ${c.cicle}`, value: c.id, parent: discipline })
      );
    }
  }
  return list;
});

const selectedTeachings = computed(() =>
  employees.value.find((p) => p.id === employee.value?.id)?.teachings || []
);

const teachingUsageCount = computed(() => {
  const count = {};
  scheduleRef.value?.schedule?.forEach((row) =>
    row.slots.forEach((id) => {
      if (id) count[id] = (count[id] || 0) + 1;
    })
  );
  return count;
});

const availableTeachings = computed(() =>
  selectedTeachings.value
    .filter((t) => {
      const usage = teachingUsageCount.value[t.developmentAreaActivity.activity.id] - 1 || 0;
      const maxHours = parseInt(t.developmentAreaActivity.hours);
      return maxHours - usage > 0;
    })
    .map((t) => {
      const usage = teachingUsageCount.value[t.developmentAreaActivity.activity.id] || 0;
      return {
        label: `${t.developmentAreaActivity.activity.name} - (${t.classEntity.name} - ${t.classEntity.course.name}) (${usage}/${t.developmentAreaActivity.hours})`,
        value: t.developmentAreaActivity.activity.id,
      };
    })
);

/* ── Methods ── */
const handleEmployeeChange = async (emp) => {
  if (!emp) { selected.value = []; return; }
  scheduleRef.value?.schedule?.forEach((row) => row.slots.fill(null));
  selected.value = emp.teachings.map((t) => t.developmentAreaActivityId);

  emp.schedules.forEach(({ dayWeek, period, discipline }) => {
    const colIndex = scheduleRef.value?.days?.indexOf(dayWeek);
    if (colIndex !== -1 && period < scheduleRef.value?.schedule?.length) {
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
      notifySuccess("Disciplina adicionada com sucesso!");
    } else {
      selected.value.splice(index, 1);
      await employeeStores.removeTeachings(employee.value.id, opt.value);
    }
    await fetchEmployees();
  } catch (error) {
    notifyError("Ocorreu um erro ao actualizar a disciplina.");
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

  if (!teaching || usage > teaching.developmentAreaActivity.hours) {
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
          s.classe?.id === classe.value?.id
      )
  );

  if (conflict) {
    notifyInfo("Já existe uma disciplina alocada por outro professor neste período.");
    scheduleRef.value.schedule[rowIndex].slots[colIndex] = null;
    return;
  }

  try {
    await scheculeStores.create({
      classId,
      disciplineId: value,
      employeeId: employee.value.id,
      dayWeek: selectedDay,
      period: selectedPeriod,
      startTime,
    });
  } catch (error) {
    notifyError("Erro ao guardar o horário.");
  }
};

const onClearDisciplineHorary = async ({ value, rowIndex, colIndex }) => {
  try {
    await scheculeStores.delete({
      classId,
      disciplineId: value,
      employeeId: employee.value.id,
      dayWeek: scheduleRef.value.days[colIndex],
      period: rowIndex,
    });
  } catch (error) {
    notifyError("Erro ao remover o horário.");
  }
};

/* ── Fetchers ── */
const fetchEmployees = async () => {
  try {
    await employeeStores.list(authStore.user.institutionId);
    employees.value = employeeStores.employees
      .filter((e) => e.teacher === "Sim")
      .map((e) => ({
        id: e.id,
        name: e?.basicInformation?.fullName ?? "—",
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
    notifyError("Erro ao carregar a classe.");
  }
};

const fetchCurrentCycle = async () => {
  try {
    await institutionStores.findCurrentCycle(authStore.user.institutionId);
    currentCycle.value = institutionStores.currentCycle;
  } catch (error) {
    notifyError("Erro ao carregar o ciclo actual.");
  }
};

/* ── Lifecycle ── */
onMounted(async () => {
  await fetchClasse();
  await fetchEmployees();
  await fetchClassDisciplines();
  await fetchCurrentCycle();
  if (scheduleRef.value?.generatePeriods) {
    scheduleRef.value.generatePeriods();
  }
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

/* ── Form Card ── */
.form-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(15, 40, 98, 0.07);
  border: 1px solid #edf0f5;
}
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

/* ── Form Fields ── */
.section-label {
  font-family: "Sora", sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
}
.field-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}
.required { color: #ef4444; }

.edigital-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
}
.edigital-input :deep(.q-field__control:hover) { border-color: #1a3fa6; }

/* ── Discipline Select ── */
.discipline-chip {
  background: #eff6ff;
  color: #1a3fa6;
  font-weight: 600;
  font-size: 0.75rem;
  border-radius: 8px;
}
.discipline-group-item {
  background: #f8fafc;
  border-top: 1px solid #edf0f5;
  padding: 6px 16px;
}
.discipline-group-label {
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #1a3fa6;
}
.discipline-item { padding: 8px 16px; }
.discipline-item:hover { background: #f5f8ff; }
.discipline-item-label { font-size: 0.85rem; color: #374151; padding-left: 8px; }

/* ── Professor Pill ── */
.student-pill {
  background: #f0f6ff;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  padding: 0.75rem 1rem;
}
.student-pill-avatar {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 10px;
}
.student-pill-name {
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f2862;
}
.student-pill-sub { font-size: 0.75rem; color: #9ca3af; }

/* ── Permissions Count Pill ── */
.permissions-count-pill {
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
.empty-card { background: white; }
.empty-icon-wrap {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-title {
  font-family: "Sora", sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f2862;
  margin-bottom: 6px;
}
.empty-sub { font-size: 0.85rem; color: #9ca3af; text-align: center; max-width: 320px; }

/* ── Schedule ── */
.schedule-wrap { overflow-x: auto; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; }
  .edigital-page .q-px-xl {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
</style>

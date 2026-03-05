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
          <q-breadcrumbs-el label="Turmas" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Lançamento de Notas" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="grading" size="1.3rem" color="white" />
          </div>
          <span>Lançamento de Notas{{ discipline ? ` — ${discipline.activity?.name}` : '' }}</span>
        </div>
      </div>
    </div>

    <div class="q-px-xl q-pt-lg q-pb-xl q-gutter-lg">

      <!-- Card: Configuração -->
      <q-card class="form-card" flat>

        <div class="form-card-header row items-center q-px-lg q-py-md">
          <div class="form-header-icon q-mr-md">
            <q-icon name="tune" size="1.2rem" color="white" />
          </div>
          <div class="col">
            <div class="form-header-title">Configuração da Avaliação</div>
            <div class="form-header-sub">Defina a data de realização antes de lançar as notas</div>
          </div>
          <!-- Pill de alunos -->
          <div class="permissions-count-pill" v-if="students.length">
            <q-icon name="groups" size="0.9rem" color="white" class="q-mr-xs" />
            {{ students.length }} aluno(s)
          </div>
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <div class="section-label q-mb-md">Informações da Avaliação</div>

          <!-- Stats inline -->
          <div class="row q-gutter-md q-mb-lg">
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

          <div class="row q-col-gutter-md">
            <div class="col-md-4 col-12">
              <div class="field-label">Data de Realização <span class="required">*</span></div>
              <q-input
                v-model="dateCompletion"
                type="date"
                outlined dense
                class="edigital-input"
                :rules="[(val) => !!val || 'A data é obrigatória.']"
              >
                <template #prepend>
                  <q-icon name="event" color="grey-5" size="1rem" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Card: Tabela de Notas -->
      <q-card class="table-card" flat>
        <q-card-section class="q-pa-none">

          <div class="table-toolbar row items-center justify-between q-px-lg q-py-md">
            <div class="row items-center">
              <div class="table-section-icon q-mr-sm">
                <q-icon name="grading" size="1rem" color="white" />
              </div>
              <div>
                <div class="table-section-title">Registo de Notas</div>
                <div class="table-count-label">{{ students.length }} aluno(s)</div>
              </div>
            </div>
          </div>

          <q-separator />

          <!-- Loading -->
          <div v-if="loading" class="column items-center q-pa-xl">
            <q-spinner-dots color="primary" size="2.5rem" />
            <div class="text-grey-5 q-mt-sm" style="font-size:0.85rem">A carregar dados...</div>
          </div>

          <!-- Empty -->
          <div v-else-if="!students.length" class="empty-state">
            <div class="empty-icon-wrap q-mb-md">
              <q-icon name="grading" size="2.5rem" color="white" />
            </div>
            <div class="empty-title">Nenhum aluno encontrado</div>
            <div class="empty-sub">Não existem alunos associados a esta turma ou disciplina</div>
          </div>

          <!-- Table -->
          <div v-else class="schedule-scroll">
            <q-table
              :rows="students"
              :columns="columns"
              row-key="id"
              :loading="loading"
              class="edigital-table"
              flat
              :pagination="{ rowsPerPage: 20 }"
            >
              <template #body-cell="props">
                <q-td :props="props" class="q-pa-sm">

                  <!-- Nome -->
                  <div v-if="props.col.field === 'name'" class="student-name-cell">
                    <q-avatar size="32px" class="student-mini-avatar q-mr-sm">
                      <q-icon name="person" color="white" size="0.9rem" />
                    </q-avatar>
                    {{ props.row.name }}
                  </div>

                  <!-- Campos de nota -->
                  <div v-else>

                    <!-- Modo normal (não participativa) -->
                    <div v-if="!discipline.participation">
                      <div class="row items-center no-wrap">
                        <q-input
                          v-model.number="(props.row.grades[props.col.field] ?? { note: 0, items: {} }).note"
                          type="number"
                          outlined dense
                          :min="0" :max="20"
                          class="col grade-input"
                          @focus="if (!props.row.grades[props.col.field]) { props.row.grades[props.col.field] = { note: 0, items: {} }; }"
                          @blur="updateGrade(props.row.id, props.col, { note: props.row.grades[props.col.field].note })"
                        />
                        <q-btn
                          flat dense round
                          icon="expand_more"
                          class="expand-btn q-ml-xs"
                          @click="toggleExpanded(props.row.id, props.col.field)"
                        >
                          <q-tooltip>Ver itens</q-tooltip>
                        </q-btn>
                      </div>

                      <!-- Itens expandidos -->
                      <div
                        v-if="isExpanded(props.row.id, props.col.field)"
                        class="expanded-block q-mt-sm"
                      >
                        <div
                          v-for="(item, index) in props.col.items"
                          :key="index"
                          class="q-mb-sm"
                        >
                          <div class="item-label q-mb-xs">{{ item.name }} <span class="item-weight">{{ item.weight }}%</span></div>
                          <q-input
                            v-model.number="(props.row.grades[props.col.field].items[item.id] ?? { note: 0 }).note"
                            type="number"
                            outlined dense
                            :min="0" :max="20"
                            class="grade-input"
                            @blur="updateGradeItem(
                              props.row.grades[props.col.field].id,
                              item.id,
                              props.row.grades[props.col.field].items[item.id].note,
                              props.row.grades[props.col.field].items[item.id].id
                            )"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Modo participativa -->
                    <div v-else>
                      <q-select
                        v-if="props.col.label.includes('Participativa')"
                        v-model="(props.row.grades[props.col.field] ?? { participation: 'NA' }).participation"
                        :options="['Sim', 'Não']"
                        outlined dense
                        class="grade-select"
                        @focus="if (!props.row.grades[props.col.field]) { props.row.grades[props.col.field] = { participation: 'NA' }; }"
                        @update:model-value="updateGrade(props.row.id, props.col, props.row.grades[props.col.field])"
                      />
                      <q-input
                        v-else-if="props.col.name === 'observation'"
                        v-model="(props.row.grades[props.col.field] ?? { observations: 'NA' }).observations"
                        outlined dense
                        placeholder="Observação..."
                        class="grade-input"
                        @focus="if (!props.row.grades[props.col.field]) { props.row.grades[props.col.field] = { observations: 'NA' }; }"
                        @blur="updateGrade(props.row.id, props.col, props.row.grades[props.col.field])"
                      />
                    </div>

                  </div>
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
import { useRoute } from "vue-router";
import { useClassStores } from "src/pages/class/store";
import { useStudentStores } from "src/pages/student/store";
import { useEvolutionStores } from "../stores";
import { useDevelopmentAreaStores } from "src/pages/development-area/stores";
import useNotify from "src/composables/UseNotify";

/* ── Router / Store ── */
const route = useRoute();
const classStores = useClassStores();
const studentStores = useStudentStores();
const evolutionStores = useEvolutionStores();
const developmentAreaStores = useDevelopmentAreaStores();
const { notifyInfo, notifyError } = useNotify();

/* ── Params ── */
const { classe: classId, studentId, discipline: disciplineId } = route.params;

/* ── State ── */
const discipline = ref(null);
const assessmentTypesData = ref([]);
const students = ref([]);
const columns = ref([]);
const expandedRows = ref({});
const evolution = ref(null);
const dateCompletion = ref(null);
const loading = ref(false);

/* ── Computed ── */
const stats = computed(() => [
  {
    label: "Alunos",
    value: students.value.length,
    icon: "groups",
    color: "#1a3fa6",
  },
  {
    label: "Tipos de Avaliação",
    value: assessmentTypesData.value.length,
    icon: "grading",
    color: "#21b573",
  },
  {
    label: "Disciplina",
    value: discipline.value?.activity?.name ?? "—",
    icon: "menu_book",
    color: "#f59e0b",
  },
]);

/* ── Methods ── */
const toggleExpanded = (rowId, field) => {
  const key = `${rowId}_${field}`;
  expandedRows.value[key] = !expandedRows.value[key];
};

const isExpanded = (rowId, field) => {
  return !!expandedRows.value[`${rowId}_${field}`];
};

const updateGrade = async (studentId, assessmentType, grade) => {
  if (!dateCompletion.value) {
    notifyInfo("Por favor, selecione a data de realização da avaliação.");
    return;
  }
  try {
    const payload = {
      studentId,
      disciplineId,
      courseEvolutionTypeId: assessmentType.field,
    };
    await evolutionStores.findOne(payload);
    evolution.value = evolutionStores.evolution;

    if (evolution.value) {
      await evolutionStores.update(evolution.value.id, { ...grade });
    } else {
      await evolutionStores.create({
        studentId,
        developmentAreaActivityId: disciplineId,
        classId,
        courseEvolutionTypeId: assessmentType.field,
        ...grade,
        dateCompletion: dateCompletion.value,
      });
    }
  } catch (error) {
    notifyError("Erro ao actualizar a nota.");
  }
};

const updateGradeItem = async (evolutionId, courseEvolutionTypeItemId, grade, evolutionItemId) => {
  if (!dateCompletion.value) {
    notifyInfo("Por favor, selecione a data de realização da avaliação.");
    return;
  }
  try {
    if (evolutionItemId) {
      await evolutionStores.updateItem(evolutionItemId, { note: grade });
    } else {
      await evolutionStores.createItem({
        evolutionId,
        courseEvolutionTypeItemId,
        note: grade,
        dateCompletion: dateCompletion.value,
      });
    }
  } catch (error) {
    notifyError("Erro ao actualizar o item de avaliação.");
  }
};

/* ── Fetch ── */
const fetchData = async () => {
  try {
    await classStores.findOne(classId);
    const evolutionTypes = classStores.classe?.course?.evolutionTypes ?? [];
    assessmentTypesData.value = evolutionTypes.map((e) => ({
      name: e.evolutionType.name,
      key: e.id,
      weight: e.weight,
      items: e.items,
    }));

    columns.value = [
      { name: "name", required: true, label: "Aluno", align: "left", field: "name" },
      ...(discipline.value.participation
        ? assessmentTypesData.value.filter((type) => type.name === "Participativa")
        : assessmentTypesData.value
      ).map((type) => ({
        name: type.key,
        required: true,
        label: `${type.name} - ${type.weight}%`,
        align: "center",
        field: type.key,
        items: type.items,
      })),
      ...(discipline.value.participation
        ? [{ name: "observation", label: "Observação", align: "left" }]
        : []),
    ];
  } catch (error) {
    notifyError("Erro ao carregar dados da turma.");
  }
};

const fetchDiscipline = async () => {
  try {
    await developmentAreaStores.findOneDevepmentActivity(disciplineId);
    discipline.value = developmentAreaStores.developmentAreaActivity;
  } catch (error) {
    notifyError("Erro ao carregar a disciplina.");
  }
};

const fetchStudents = async () => {
  loading.value = true;
  try {
    await studentStores.list({ classId });
    students.value = studentStores.students
      .filter((s) => !studentId || s.id === studentId)
      .map((student) => {
        const evolutions = student.evolutions.filter(
          (d) => d.developmentAreaActivityId === disciplineId
        );
        return {
          id: student.id,
          name: student.basicInformation?.fullName ?? "—",
          grades: evolutions.reduce((acc, evo) => {
            acc[evo.courseEvolutionTypeId] = {
              id: evo.id ?? null,
              note: Number(evo.note ?? 0),
              participation: evo.participation ?? "NA",
              observations: evo.observations ?? "NA",
              items: {},
            };
            for (const item of evo.items ?? []) {
              acc[evo.courseEvolutionTypeId].items[item.courseEvolutionTypeItemId] = {
                id: item.id,
                note: Number(item.note ?? 0),
              };
            }
            return acc;
          }, {}),
        };
      });
  } catch (error) {
    notifyError("Erro ao carregar os alunos.");
  } finally {
    loading.value = false;
  }
};

/* ── Lifecycle ── */
onMounted(async () => {
  await fetchDiscipline();
  await fetchStudents();
  await fetchData();
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
  width: 36px; height: 36px;
  transition: background 0.2s;
}
.back-btn:hover { background: #e0e8f7; }
.breadcrumb-nav { font-size: 0.78rem; }
.breadcrumb-link { color: #9ca3af !important; }
.breadcrumb-active { color: #1a3fa6 !important; font-weight: 600; }
.page-title {
  font-family: "Sora", sans-serif;
  font-size: 1.3rem; font-weight: 700; color: #0f2862;
}
.title-icon-wrap {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}

/* ── Form Card ── */
.form-card {
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 2px 20px rgba(15, 40, 98, 0.07);
  border: 1px solid #edf0f5;
}
.form-card-header { background: #fafbfd; border-bottom: 1px solid #f0f0f0; }
.form-header-icon {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.form-header-title { font-family: "Sora", sans-serif; font-size: 1rem; font-weight: 700; color: #0f2862; }
.form-header-sub { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; }

/* ── Stats ── */
.stat-card {
  background: white; border-radius: 14px; padding: 1rem 1.2rem;
  display: flex; align-items: center; gap: 0.9rem;
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.05);
  border: 1px solid #edf0f5; transition: box-shadow 0.2s;
}
.stat-card:hover { box-shadow: 0 4px 20px rgba(15, 40, 98, 0.1); }
.stat-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-value { font-family: "Sora", sans-serif; font-size: 1.5rem; font-weight: 700; color: #0f2862; line-height: 1; }
.stat-label { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; font-weight: 500; }

/* ── Section Label / Field Label ── */
.section-label {
  font-family: "Sora", sans-serif; font-size: 0.8rem;
  font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: #6b7280;
}
.field-label { font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 6px; }
.required { color: #ef4444; }
.edigital-input :deep(.q-field__control) { border-radius: 10px; background: #f8fafc; }
.edigital-input :deep(.q-field__control:hover) { border-color: #1a3fa6; }

/* ── Permissions Count Pill ── */
.permissions-count-pill {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  color: white; border-radius: 20px; padding: 4px 12px;
  font-family: "Sora", sans-serif; font-weight: 700; font-size: 0.8rem;
  display: flex; align-items: center;
}

/* ── Table Card ── */
.table-card {
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 2px 20px rgba(15, 40, 98, 0.07);
  border: 1px solid #edf0f5;
}
.table-toolbar { background: #fafbfd; border-bottom: 1px solid #f0f0f0; }
.table-section-icon {
  width: 30px; height: 30px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.table-section-title { font-family: "Sora", sans-serif; font-weight: 700; font-size: 0.9rem; color: #0f2862; }
.table-count-label { font-size: 0.74rem; color: #9ca3af; }

.edigital-table :deep(thead tr th) {
  font-family: "Sora", sans-serif; font-size: 0.75rem;
  font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: #6b7280;
  background: #fafbfd; border-bottom: 2px solid #edf0f5; padding: 14px 16px;
}
.edigital-table :deep(tbody tr) { transition: background 0.15s; }
.edigital-table :deep(tbody tr:hover) { background: #f5f8ff !important; }
.edigital-table :deep(tbody tr td) {
  font-size: 0.875rem; color: #374151;
  padding: 8px 12px; border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

/* ── Grade Inputs ── */
.grade-input { min-width: 80px; }
.grade-input :deep(.q-field__control) { border-radius: 8px; background: #f8fafc; }
.grade-input :deep(.q-field__control:hover) { border-color: #1a3fa6; }

.grade-select { min-width: 100px; }
.grade-select :deep(.q-field__control) { border-radius: 8px; background: #f8fafc; }

.expand-btn {
  color: #6b7280 !important;
  border-radius: 8px;
  width: 28px; height: 28px;
  transition: background 0.15s;
}
.expand-btn:hover { background: #e8f0fe !important; color: #1a3fa6 !important; }

/* ── Expanded Block ── */
.expanded-block {
  background: #f8fafc;
  border: 1px solid #edf0f5;
  border-radius: 10px;
  padding: 0.75rem;
}
.item-label { font-size: 0.78rem; font-weight: 600; color: #374151; }
.item-weight { color: #1a3fa6; font-family: "Sora", sans-serif; }

/* ── Student Name Cell ── */
.student-name-cell { display: flex; align-items: center; }
.student-mini-avatar {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px; flex-shrink: 0;
}

/* ── Empty State ── */
.empty-state {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 3.5rem 2rem; text-align: center;
}
.empty-icon-wrap {
  width: 72px; height: 72px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
}
.empty-title { font-family: "Sora", sans-serif; font-size: 1rem; font-weight: 700; color: #6b7280; margin-bottom: 4px; }
.empty-sub { font-size: 0.82rem; color: #d1d5db; max-width: 280px; }

/* ── Scroll ── */
.schedule-scroll { overflow-x: auto; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
}
</style>

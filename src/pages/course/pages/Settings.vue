<template>
  <q-page class="edigital-page">

    <!-- ── Top Bar ── -->
    <div class="page-topbar row items-center q-px-xl q-py-md">
      <q-btn flat round dense icon="arrow_back_ios_new" class="back-btn q-mr-md" @click="$router.back()">
        <q-tooltip>Voltar</q-tooltip>
      </q-btn>

      <div class="col">
        <q-breadcrumbs class="breadcrumb-nav" active-color="primary" separator="›">
          <q-breadcrumbs-el label="Dashboard" icon="home" to="/" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Cursos" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Configuração do Estágio" class="breadcrumb-active" />
        </q-breadcrumbs>
        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="settings" size="1.3rem" color="white" />
          </div>
          <span>Configuração do Estágio</span>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <q-btn flat round dense icon="refresh" color="grey-6" class="action-icon-btn" @click="fetchCourse">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- ── Loading Skeleton ── -->
    <div v-if="loading" class="q-px-xl q-pt-lg">
      <div class="row q-col-gutter-md">
        <div class="col-12"><q-skeleton height="200px" class="rounded-xl" /></div>
        <div class="col-12"><q-skeleton height="200px" class="rounded-xl" /></div>
        <div class="col-12"><q-skeleton height="200px" class="rounded-xl" /></div>
      </div>
    </div>

    <div v-else class="q-px-xl q-pb-xl">

      <!-- ── Stats ── -->
      <div class="stats-row q-mb-lg row q-gutter-md">
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

      <!-- ════ Section 1: Planos Curriculares ════ -->
      <div class="section-block q-mb-lg">
        <div class="section-header-bar row items-center justify-between q-px-lg q-py-md">
          <div class="row items-center">
            <div class="section-icon-wrap q-mr-sm" style="background:linear-gradient(135deg,#1a3fa6,#0f2862)">
              <q-icon name="menu_book" size="1rem" color="white" />
            </div>
            <div>
              <div class="section-title">Planos Curriculares</div>
              <div class="section-sub">{{ curriculuns.length }} plano(s) configurado(s)</div>
            </div>
          </div>
          <q-btn
            unelevated no-caps
            icon="add"
            label="Adicionar Plano"
            class="new-btn"
            @click="addCurriculum"
          />
        </div>

        <q-separator />

        <Tables :rows="curriculuns" :columns="ColumnsCurriculum" class="no-shadow edigital-table">
          <template #no-data>
            <div class="empty-row">
              <q-icon name="menu_book" size="2rem" color="grey-4" />
              <span>Nenhum plano curricular adicionado</span>
            </div>
          </template>
          <template #actions="{ props }">
            <div class="row no-wrap q-gutter-xs">
              <q-btn flat round dense icon="school" class="tbl-btn tbl-btn-secondary" @click="settingsCurriculum(props)">
                <q-tooltip>Configurar Currículo</q-tooltip>
              </q-btn>
              <q-btn flat round dense icon="edit" class="tbl-btn tbl-btn-primary" @click="editClasse(props)">
                <q-tooltip>Editar Plano</q-tooltip>
              </q-btn>
            </div>
          </template>
        </Tables>
      </div>

      <!-- ════ Section 2: Tipos de Avaliação ════ -->
      <div class="section-block q-mb-lg">
        <div class="section-header-bar row items-center justify-between q-px-lg q-py-md">
          <div class="row items-center">
            <div class="section-icon-wrap q-mr-sm" style="background:linear-gradient(135deg,#7b1fa2,#4a148c)">
              <q-icon name="fact_check" size="1rem" color="white" />
            </div>
            <div>
              <div class="section-title">Tipos de Avaliação</div>
              <div class="section-sub">{{ evolutionTypes.length }} tipo(s) de avaliação definido(s)</div>
            </div>
          </div>
          <q-btn
            unelevated no-caps
            icon="add"
            label="Adicionar Tipo"
            class="new-btn new-btn-purple"
            @click="addEvolutionType"
          />
        </div>

        <q-separator />

        <Tables :rows="evolutionTypes" :columns="EvolutionTypeColumns" class="no-shadow edigital-table">
          <template #no-data>
            <div class="empty-row">
              <q-icon name="fact_check" size="2rem" color="grey-4" />
              <span>Nenhum tipo de avaliação adicionado</span>
            </div>
          </template>
          <template #actions="{ props }">
            <div class="row no-wrap q-gutter-xs">
              <q-btn flat round dense icon="edit" class="tbl-btn tbl-btn-primary" @click="editClasse(props)">
                <q-tooltip>Editar Tipo</q-tooltip>
              </q-btn>
            </div>
          </template>
        </Tables>
      </div>

      <!-- ════ Section 3: Turmas ════ -->
      <div class="section-block q-mb-lg">
        <div class="section-header-bar row items-center justify-between q-px-lg q-py-md">
          <div class="row items-center">
            <div class="section-icon-wrap q-mr-sm" style="background:linear-gradient(135deg,#21b573,#0d7040)">
              <q-icon name="groups" size="1rem" color="white" />
            </div>
            <div>
              <div class="section-title">Turmas</div>
              <div class="section-sub">{{ classes.length }} turma(s) registada(s)</div>
            </div>
          </div>
          <q-btn
            unelevated no-caps
            icon="add"
            label="Adicionar Turma"
            class="new-btn new-btn-green"
            @click="addClasse"
          />
        </div>

        <q-separator />

        <Tables :rows="classes" :columns="ClasseColumns" class="no-shadow edigital-table">
          <template #no-data>
            <div class="empty-row">
              <q-icon name="groups" size="2rem" color="grey-4" />
              <span>Nenhuma turma adicionada</span>
            </div>
          </template>
          <template #actions="{ props }">
            <div class="row no-wrap q-gutter-xs">

              <q-btn flat round dense icon="calendar_month" class="tbl-btn tbl-btn-secondary" @click="showScheduleClass(props)">
                <q-tooltip>Horário da Turma</q-tooltip>
              </q-btn>

              <q-btn flat round dense icon="edit" class="tbl-btn tbl-btn-primary" @click="editClasse(props)">
                <q-tooltip>Editar Turma</q-tooltip>
              </q-btn>

              <q-btn flat round dense icon="person_pin" class="tbl-btn tbl-btn-green" @click="te(props)">
                <q-tooltip>Alocação de Professores e Horário</q-tooltip>
              </q-btn>

            </div>
          </template>
        </Tables>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCourseStores } from "../store";
import Tables from "src/components/Tables.vue";
import useNotify from "src/composables/UseNotify";
import ClasseColumns from "../components/ClasseColumns";
import ColumnsCurriculum from "../components/ColumnsCurriculum";
import EvolutionTypeColumns from "../components/EvolutionTypesColumns";

/* ── Router & Stores ── */
const route  = useRoute();
const router = useRouter();
const courseStores = useCourseStores();
const { notifyError } = useNotify();

/* ── Params ── */
const { educationId, internshipId, program } = route.params;

/* ── Data ── */
const curriculuns    = ref([]);
const classes        = ref([]);
const evolutionTypes = ref([]);
const loading        = ref(false);

/* ── Computed ── */
const stats = computed(() => [
  { label: "Planos Curriculares", value: curriculuns.value.length,    icon: "menu_book",   color: "#1a3fa6" },
  { label: "Tipos de Avaliação",  value: evolutionTypes.value.length, icon: "fact_check",  color: "#7b1fa2" },
  { label: "Turmas",              value: classes.value.length,        icon: "groups",      color: "#21b573" },
]);

/* ── Methods ── */
const addClasse = () => {
  router.push({
    name: "create-classe",
    params: { educationId, internshipId },
  });
};

const addCurriculum = () => {
  router.push({
    name: "create-curriculum",
    params: { educationId, courseId: internshipId },
  });
};

const settingsCurriculum = (props) => {
  router.push({
    name: "settings-curriculum",
    params: { educationId, curriculumId: props.key },
  });
};

const editClasse = (row) => {
  router.push({
    name: "edit-classe",
    params: { educationId, internshipId, classeId: row.key },
  });
};

const showScheduleClass = (row) => {
  router.push({ name: "class-schedule", params: { classId: row.key } });
};

const te = (row) => {
  router.push({ name: "employee-teachings-add", params: { id: row.key } });
};

const addEvolutionType = () => {
  router.push({
    name: "course-evolution-type-create",
    params: { courseId: internshipId },
  });
};

/* ── Fetch ── */
const fetchCourse = async () => {
  loading.value = true;
  try {
    await courseStores.findOne(internshipId);
    classes.value        = courseStores.course.classes        ?? [];
    curriculuns.value    = courseStores.course.curriculums    ?? [];
    evolutionTypes.value = courseStores.course.evolutionTypes ?? [];
  } catch (error) {
    notifyError("Erro no carregamento do estágio.");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchCourse();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

.edigital-page {
  min-height: 100vh;
  background: #f0f4f8;
  font-family: 'DM Sans', sans-serif;
}

/* ── Top Bar ── */
.page-topbar {
  background: #ffffff;
  border-bottom: 1px solid #e8edf3;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 12px rgba(15,40,98,0.06);
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
  font-family: 'Sora', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f2862;
}
.title-icon-wrap {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.action-icon-btn {
  background: #f0f4f8;
  border-radius: 10px;
  width: 36px; height: 36px;
  transition: background 0.2s;
}
.action-icon-btn:hover { background: #e0e8f7; }

/* ── Stats ── */
.stats-row { padding-top: 1.2rem; }
.stat-card {
  background: white;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  box-shadow: 0 2px 12px rgba(15,40,98,0.05);
  border: 1px solid #edf0f5;
  transition: box-shadow 0.2s;
}
.stat-card:hover { box-shadow: 0 4px 20px rgba(15,40,98,0.10); }
.stat-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-value {
  font-family: 'Sora', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f2862;
  line-height: 1;
}
.stat-label { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; font-weight: 500; }

/* ── Section Blocks ── */
.section-block {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(15,40,98,0.07);
  border: 1px solid #edf0f5;
}
.section-header-bar { background: #fafbfd; }
.section-icon-wrap {
  width: 30px; height: 30px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.section-title {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 0.92rem;
  color: #0f2862;
}
.section-sub { font-size: 0.74rem; color: #9ca3af; }

/* ── New Buttons ── */
.new-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white;
  border-radius: 10px;
  padding: 0 16px;
  height: 36px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  transition: box-shadow 0.2s, transform 0.15s;
}
.new-btn:hover { box-shadow: 0 6px 18px rgba(26,63,166,0.3); transform: translateY(-1px); }

.new-btn-purple {
  background: linear-gradient(135deg, #7b1fa2, #4a148c) !important;
}
.new-btn-purple:hover { box-shadow: 0 6px 18px rgba(123,31,162,0.3) !important; }

.new-btn-green {
  background: linear-gradient(135deg, #21b573, #0d7040) !important;
}
.new-btn-green:hover { box-shadow: 0 6px 18px rgba(33,181,115,0.3) !important; }

/* ── Table ── */
.edigital-table :deep(thead tr th) {
  font-family: 'Sora', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  background: #fafbfd;
  border-bottom: 2px solid #edf0f5;
  padding: 12px 16px;
}
.edigital-table :deep(tbody tr:hover) { background: #f5f8ff !important; }
.edigital-table :deep(tbody tr td) {
  font-size: 0.875rem;
  color: #374151;
  padding: 11px 16px;
  border-bottom: 1px solid #f3f4f6;
}

/* ── Table Buttons ── */
.tbl-btn { border-radius: 8px !important; width: 30px; height: 30px; transition: background 0.15s; }
.tbl-btn-primary   { color: #1a3fa6 !important; }
.tbl-btn-primary:hover   { background: #e8f0fe !important; }
.tbl-btn-secondary { color: #6b7280 !important; }
.tbl-btn-secondary:hover { background: #f3f4f6 !important; }
.tbl-btn-green     { color: #15803d !important; }
.tbl-btn-green:hover     { background: #dcfce7 !important; }

/* ── Empty Row ── */
.empty-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2.5rem;
  color: #9ca3af;
  font-size: 0.85rem;
  font-weight: 500;
}

/* ── Skeleton ── */
.rounded-xl { border-radius: 16px !important; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
  .stats-row { padding: 1rem; }
}
</style>

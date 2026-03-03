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
          <q-breadcrumbs-el label="Académico" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Controlo Académico" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="school" size="1.3rem" color="white" />
          </div>
          <span>Controlo Académico</span>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <!-- Toggle Emissão -->
        <q-btn
          :icon="issueDocument ? 'close' : 'description'"
          :label="issueDocument ? 'Cancelar Emissão' : 'Emitir Documento'"
          :class="issueDocument ? 'cancel-btn' : 'new-btn'"
          no-caps flat
          @click="issueDocument = !issueDocument"
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

    <div class="q-px-xl q-pb-xl q-gutter-lg">

      <!-- Pesquisa Card -->
      <q-card class="form-card" flat>

        <div class="form-card-header row items-center q-px-lg q-py-md">
          <div class="form-header-icon q-mr-md">
            <q-icon name="manage_search" size="1.2rem" color="white" />
          </div>
          <div>
            <div class="form-header-title">Pesquisa de Estudante</div>
            <div class="form-header-sub">Selecione o estudante e o estágio para consultar o histórico</div>
          </div>
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <div class="section-label q-mb-md">Filtros de Pesquisa</div>

          <div class="row q-col-gutter-md">

            <!-- Estudante -->
            <div class="col-md-4 col-12">
              <div class="field-label">Estudante</div>
              <q-select
                v-model="student"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                :options="options"
                @filter="filterFn"
                option-label="name"
                placeholder="Pesquisar estudante..."
                outlined dense
                class="edigital-input"
                map-options
                @update:model-value="updateStudentSelect"
              >
                <template #prepend>
                  <q-icon name="person_search" color="grey-5" size="1rem" />
                </template>
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">Nenhum resultado</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Estágio / Classe -->
            <div class="col-md-4 col-12">
              <div class="field-label">Estágio</div>
              <q-select
                v-model="classe"
                :options="stages"
                option-label="classe.name"
                placeholder="Selecione um estágio"
                outlined dense
                class="edigital-input"
                map-options
                :disable="!student"
                @update:model-value="updateClasseSelect"
              >
                <template #prepend>
                  <q-icon name="class" color="grey-5" size="1rem" />
                </template>
                <template #selected>
                  <span v-if="classe">{{ classe.classe.name }} — {{ classe.classe.course.name }}</span>
                  <span v-else class="text-grey-5">Selecione um estágio</span>
                </template>
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.classe.name }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.classe.course.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Tipo de Documento (só quando emissão activa) -->
            <div class="col-md-4 col-12" v-if="issueDocument">
              <div class="field-label">Tipo de Documento</div>
              <q-select
                v-model="emission"
                :options="docs"
                option-label="name"
                placeholder="Selecione o documento"
                outlined dense
                class="edigital-input"
                map-options
                :disable="!classe"
                @update:model-value="handleImission(emission)"
              >
                <template #prepend>
                  <q-icon name="description" color="grey-5" size="1rem" />
                </template>
              </q-select>
            </div>

          </div>

          <!-- Estudante seleccionado — info pill -->
          <div class="student-pill row items-center q-gutter-sm q-mt-md" v-if="student">
            <q-avatar size="36px" class="student-pill-avatar">
              <q-icon name="person" color="white" size="1.1rem" />
            </q-avatar>
            <div>
              <div class="student-pill-name">{{ student.name }}</div>
              <div class="student-pill-sub">{{ stages.length }} estágio(s) disponível(eis)</div>
            </div>
            <q-space />
            <q-btn flat round dense icon="close" size="sm" color="grey-5" @click="clearStudent" />
          </div>

        </q-card-section>
      </q-card>

      <!-- Histórico Académico -->
      <HistoryStudent
        v-if="student && studentHistory"
        :student-history="studentHistory"
        :launch-grades="launchGrades"
      />

      <!-- Empty State -->
      <q-card v-else-if="!student" class="form-card empty-card" flat>
        <q-card-section class="column items-center q-py-xl">
          <div class="empty-icon-wrap q-mb-md">
            <q-icon name="school" size="3rem" color="white" />
          </div>
          <div class="empty-title">Nenhum estudante seleccionado</div>
          <div class="empty-sub">Pesquise e selecione um estudante para visualizar o histórico académico</div>
        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStudentStores } from "src/pages/student/store";
import { useHistoryStores } from "../stores";
import { useRouter } from "vue-router";
import HistoryStudent from "../components/HistoryStudent.vue";
import useNotify from "src/composables/UseNotify";

/* ── Router / Store ── */
const router = useRouter();
const studentsStores = useStudentStores();
const historyStores = useHistoryStores();
const { notifyError } = useNotify();

/* ── State ── */
const students = ref([]);
const student = ref(null);
const options = ref([]);
const classe = ref(null);
const stages = ref([]);
const studentHistory = ref(null);
const emission = ref(null);
const issueDocument = ref(false);

const docs = ref([
  { value: "certificate", name: "Certificado" },
  { value: "note", name: "Nota Informativa" },
]);

/* ── Computed ── */
const stats = computed(() => [
  {
    label: "Estudantes",
    value: students.value.length,
    icon: "people",
    color: "#1a3fa6",
  },
  {
    label: "Seleccionado",
    value: student.value ? 1 : 0,
    icon: "person",
    color: "#21b573",
  },
  {
    label: "Estágios",
    value: stages.value.length,
    icon: "class",
    color: "#f59e0b",
  },
]);

/* ── Methods ── */
const updateStudentSelect = (val) => {
  stages.value = val.enrollments ?? [];
  classe.value = null;
  studentHistory.value = null;
  emission.value = null;
};

const clearStudent = () => {
  student.value = null;
  stages.value = [];
  classe.value = null;
  studentHistory.value = null;
  emission.value = null;
};

const updateClasseSelect = async (value) => {
  try {
    const { courseId } = value.classe;
    await historyStores.findStudentHistory(student.value.id, courseId);
    studentHistory.value = historyStores.studentHistory;
  } catch (error) {
    notifyError("Erro ao carregar histórico do estudante");
  }
};

const launchGrades = (disciplineId) => {
  router.push({
    name: "evolution-create",
    params: {
      classe: classe.value.classe.id,
      discipline: disciplineId,
      studentId: student.value.id,
    },
  });
};

const handleImission = (value) => {
  if (value.value === "certificate") {
    router.push({
      name: "emission-certificate",
      params: {
        courseId: classe.value.id,
        studentId: student.value.id,
      },
    });
  } else {
    router.push({
      name: "emission-informative-note",
      params: {
        cicle: 1,
        studentId: student.value.id,
      },
    });
  }
};

const filterFn = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = students.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const fetchStudents = async () => {
  try {
    await studentsStores.list();
    students.value = studentsStores.students.map((s) => ({
      id: s.id,
      name: s?.basicInformation?.fullName ?? "—",
      ...s,
    }));
    options.value = students.value;
  } catch (error) {
    notifyError("Erro ao carregar estudantes");
  }
};

/* ── Lifecycle ── */
onMounted(async () => {
  await fetchStudents();
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

.new-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white !important;
  border-radius: 10px;
  padding: 0 18px;
  height: 38px;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: "Sora", sans-serif;
  transition: box-shadow 0.2s, transform 0.15s;
}
.new-btn:hover {
  box-shadow: 0 6px 18px rgba(26, 63, 166, 0.35);
  transform: translateY(-1px);
}

.cancel-btn {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #6b7280 !important;
  padding: 0 18px;
  height: 38px;
  font-weight: 600;
  background: white;
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

.edigital-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
}
.edigital-input :deep(.q-field__control:hover) { border-color: #1a3fa6; }

/* ── Student Pill ── */
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

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .stats-row { padding: 1rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
}
</style>

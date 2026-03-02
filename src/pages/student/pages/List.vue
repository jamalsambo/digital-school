<template>
  <q-page class="edigital-page">

    <!-- Top Bar -->
    <div class="page-topbar row items-center q-px-xl q-py-md">
      <q-btn
        flat round dense
        icon="arrow_back_ios_new"
        class="back-btn q-mr-md"
        @click="$router.back()"
      >
        <q-tooltip>Voltar</q-tooltip>
      </q-btn>

      <div class="col">
        <q-breadcrumbs class="breadcrumb-nav" active-color="primary" separator="›">
          <q-breadcrumbs-el label="Dashboard" icon="home" to="/" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Gestão Académica" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Estudantes" class="breadcrumb-active" />
        </q-breadcrumbs>
        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="school" size="1.3rem" color="white" />
          </div>
          <span>Estudantes</span>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <!-- Search -->
        <q-input
          v-model="filter"
          dense outlined
          placeholder="Pesquisar estudante..."
          class="search-input"
          debounce="300"
          clearable
        >
          <template #prepend>
            <q-icon name="search" color="grey-5" size="1.1rem" />
          </template>
        </q-input>

        <!-- Refresh -->
        <q-btn flat round dense icon="refresh" color="grey-6" class="action-icon-btn" @click="refresh">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>

        <!-- Adicionar Estudante -->
        <q-btn
          v-if="authStore.hasCreateStudents"
          unelevated
          icon="person_add"
          label="Adicionar Estudante"
          class="new-btn"
          no-caps
          :loading="addingStudent"
          @click="addStudents"
        >
          <template #loading>
            <q-spinner-dots color="white" />
          </template>
        </q-btn>
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

    <!-- Table Card -->
    <div class="q-px-xl q-pb-xl">
      <q-card class="table-card" flat>
        <q-card-section class="q-pa-none">

          <!-- Table Toolbar -->
          <div class="table-toolbar row items-center justify-between q-px-lg q-py-md">
            <div class="row items-center q-gutter-xs">
              <span class="table-count">{{ filteredStudents.length }}</span>
              <span class="table-count-label">estudantes encontrados</span>
            </div>
            <div class="row items-center q-gutter-xs">
              <q-btn flat round dense icon="view_list" :color="viewMode==='list'?'primary':'grey-5'" size="sm" @click="viewMode='list'">
                <q-tooltip>Vista de Lista</q-tooltip>
              </q-btn>
              <q-btn flat round dense icon="grid_view" :color="viewMode==='grid'?'primary':'grey-5'" size="sm" @click="viewMode='grid'">
                <q-tooltip>Vista em Grelha</q-tooltip>
              </q-btn>
            </div>
          </div>

          <q-separator />

          <!-- List View -->
          <q-table
            v-if="viewMode === 'list'"
            class="edigital-table no-shadow"
            :rows="students"
            :columns="columns"
            row-key="id"
            :filter="filter"
            :loading="loading"
            v-model:pagination="pagination"
            flat
          >
            <!-- Loading -->
            <template #loading>
              <q-inner-loading showing color="primary" />
            </template>

            <!-- Empty state -->
            <template #no-data>
              <div class="full-width column flex-center q-pa-xl text-grey-5">
                <q-icon name="people_outline" size="4rem" class="q-mb-md" />
                <div class="text-h6 text-weight-medium">Nenhum estudante encontrado</div>
                <div class="text-caption q-mt-xs">Tente ajustar a pesquisa ou adicione um novo estudante</div>
              </div>
            </template>

            <!-- Actions column -->
            <template #body-cell-actions="props">
              <q-td :props="props">
                <div class="row no-wrap items-center q-gutter-xs">

                  <!-- Ver Detalhes -->
                  <q-btn flat round dense icon="info_outline" class="tbl-btn tbl-btn-primary" @click="editStudent(props.row)">
                    <q-tooltip>Ver Detalhes</q-tooltip>
                  </q-btn>

                  <!-- Gerir Acesso -->
                  <q-btn flat round dense icon="manage_accounts" class="tbl-btn tbl-btn-secondary" @click="addUser(props.row)">
                    <q-tooltip>{{ props.row.userId ? 'Gerir Conta' : 'Criar Acesso' }}</q-tooltip>
                  </q-btn>

                  <!-- Badge se não tem conta -->
                  <q-chip
                    v-if="!props.row.userId"
                    size="sm" dense
                    color="orange-1"
                    text-color="orange-9"
                    icon="warning_amber"
                    class="no-account-chip"
                  >
                    Sem conta
                  </q-chip>

                </div>
              </q-td>
            </template>

          </q-table>

          <!-- Grid View -->
          <div v-else class="grid-view q-pa-lg row q-gutter-md">
            <div
              v-for="student in filteredStudents"
              :key="student.id"
              class="grid-card col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div class="grid-card-header">
                <q-avatar size="48px" class="student-avatar">
                  <q-icon name="person" color="white" size="1.5rem" />
                </q-avatar>
                <q-chip
                  v-if="!student.userId"
                  size="xs" dense color="orange-1" text-color="orange-9"
                  class="q-ml-auto"
                >
                  Sem conta
                </q-chip>
                <q-chip v-else size="xs" dense color="green-1" text-color="green-9" class="q-ml-auto">
                  Com acesso
                </q-chip>
              </div>
              <div class="grid-card-body">
                <div class="grid-name">{{ student.basicInformation?.fullName || '—' }}</div>
                <div class="grid-info">Nº {{ student.number || '—' }}</div>
              </div>
              <div class="grid-card-actions row q-gutter-xs">
                <q-btn flat dense no-caps icon="info_outline" label="Detalhes" class="grid-action-btn" @click="editStudent(student)" />
                <q-btn flat dense no-caps icon="manage_accounts" label="Acesso" class="grid-action-btn grid-action-primary" @click="addUser(student)" />
              </div>
            </div>

            <!-- Empty grid -->
            <div v-if="filteredStudents.length === 0" class="full-width column flex-center q-pa-xl text-grey-5">
              <q-icon name="people_outline" size="4rem" class="q-mb-md" />
              <div class="text-h6">Nenhum estudante encontrado</div>
            </div>
          </div>

        </q-card-section>
      </q-card>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useStudentStores } from "src/pages/student/store";
import { useAuthStore } from "src/pages/auth/store";
import { useUserStores } from "src/pages/user/store";
import columns from "src/pages/student/components/ColumnsStudentsList";
import useNotify from "src/composables/UseNotify";

/* ── Router & Stores ── */
const router = useRouter();
const authStore = useAuthStore();
const studentStores = useStudentStores();
const userStores = useUserStores();
const { notifyInfo, notifyError } = useNotify();
const studentTypeID = import.meta.env.VITE_STUDENT_ID;

/* ── UI State ── */
const filter = ref("");
const viewMode = ref("list");
const loading = ref(false);
const addingStudent = ref(false);
const pagination = ref({ rowsPerPage: 10 });

/* ── Data ── */
const students = ref([]);

/* ── Computed ── */
const stats = computed(() => [
  { label: "Total",        value: students.value.length,                                    icon: "people",          color: "#1a3fa6" },
  { label: "Com Acesso",   value: students.value.filter(s => s.userId).length,              icon: "verified_user",   color: "#21b573" },
  { label: "Sem Acesso",   value: students.value.filter(s => !s.userId).length,             icon: "person_off",      color: "#f57c00" },
  { label: "Activos",      value: students.value.filter(s => s.status === "Activo").length, icon: "check_circle",    color: "#1565c0" },
]);

const filteredStudents = computed(() => {
  if (!filter.value) return students.value;
  const q = filter.value.toLowerCase();
  return students.value.filter(s =>
    s.basicInformation?.fullName?.toLowerCase().includes(q) ||
    s.number?.toLowerCase().includes(q)
  );
});

/* ── Methods ── */
const addStudents = async () => {
  addingStudent.value = true;
  try {
    await studentStores.create();
    router.push({
      name: "student-space",
      params: { id: studentStores.student.id, created: "create" },
    });
  } catch (error) {
    notifyError("Erro ao criar estudante.");
  } finally {
    addingStudent.value = false;
  }
};

const editStudent = (student) => {
  router.push({
    name: "student-space",
    params: { id: student.id, created: "edit" },
  });
};

const addUser = async (student) => {
  try {
    if (student.userId) {
      router.push({ name: "manage-account", params: { userId: student.userId } });
    } else {
      await userStores.create({
        displayName: student.basicInformation?.fullName,
        username: student.number,
        password: "1234",
        userTypeId: studentTypeID,
        institutionId: student?.institutionId,
      });
      await studentStores.update(student.id, { userId: userStores.user.id });
      router.push({ name: "manage-account", params: { userId: userStores.user.id } });
    }
  } catch (error) {
    notifyError("Erro ao gerir acesso do estudante.");
  }
};

/* ── Fetch ── */
const fetchStudents = async () => {
  loading.value = true;
  try {
    await studentStores.list();
    students.value = studentStores.students;
  } catch (error) {
    notifyError("Falha ao carregar os estudantes.");
  } finally {
    loading.value = false;
  }
};

const refresh = () => fetchStudents();

onMounted(() => {
  fetchStudents();
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

.search-input { width: 220px; }
.search-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
  height: 38px;
}

.action-icon-btn {
  background: #f0f4f8;
  border-radius: 10px;
  width: 36px; height: 36px;
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
  font-family: 'Sora', sans-serif;
  letter-spacing: 0.01em;
  transition: box-shadow 0.2s, transform 0.15s;
}
.new-btn:hover {
  box-shadow: 0 6px 18px rgba(26,63,166,0.35);
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
.stat-label {
  font-size: 0.78rem;
  color: #9ca3af;
  margin-top: 2px;
  font-weight: 500;
}

/* ── Table Card ── */
.table-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(15,40,98,0.07);
  border: 1px solid #edf0f5;
}

.table-toolbar {
  background: #fafbfd;
  border-bottom: 1px solid #f0f0f0;
}
.table-count {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: #0f2862;
}
.table-count-label {
  font-size: 0.82rem;
  color: #9ca3af;
}

/* ── Quasar Table overrides ── */
.edigital-table :deep(thead tr th) {
  font-family: 'Sora', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  background: #fafbfd;
  border-bottom: 2px solid #edf0f5;
  padding: 14px 16px;
}
.edigital-table :deep(tbody tr) {
  transition: background 0.15s;
}
.edigital-table :deep(tbody tr:hover) {
  background: #f5f8ff !important;
}
.edigital-table :deep(tbody tr td) {
  font-size: 0.875rem;
  color: #374151;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}

/* ── Table Buttons ── */
.tbl-btn {
  border-radius: 8px !important;
  width: 32px; height: 32px;
  transition: background 0.15s;
}
.tbl-btn-primary { color: #1a3fa6 !important; }
.tbl-btn-primary:hover { background: #e8f0fe !important; }
.tbl-btn-secondary { color: #6b7280 !important; }
.tbl-btn-secondary:hover { background: #f3f4f6 !important; }

.no-account-chip {
  font-size: 0.7rem;
  font-weight: 600;
}

/* ── Grid View ── */
.grid-card {
  background: white;
  border-radius: 14px;
  border: 1px solid #edf0f5;
  padding: 1.2rem;
  box-shadow: 0 2px 12px rgba(15,40,98,0.05);
  transition: box-shadow 0.2s, transform 0.15s;
}
.grid-card:hover {
  box-shadow: 0 6px 24px rgba(15,40,98,0.12);
  transform: translateY(-2px);
}
.grid-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
.student-avatar {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 12px;
}
.grid-name {
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  color: #0f2862;
  margin-bottom: 2px;
}
.grid-info { font-size: 0.8rem; color: #9ca3af; }
.grid-card-actions {
  margin-top: 1rem;
  border-top: 1px solid #f0f4f8;
  padding-top: 0.8rem;
}
.grid-action-btn {
  border-radius: 8px;
  font-size: 0.78rem;
  color: #6b7280 !important;
  background: #f8fafc;
  padding: 0 10px;
}
.grid-action-primary {
  color: #1a3fa6 !important;
  background: #eff6ff !important;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .search-input { width: 100%; order: 3; }
  .stats-row { padding: 1rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
}
</style>

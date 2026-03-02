<template>
  <q-page class="edigital-page">
    <!-- Top Bar -->
    <div class="page-topbar row items-center q-px-xl q-py-md">
      <q-btn
        flat
        round
        dense
        icon="arrow_back_ios_new"
        class="back-btn q-mr-md"
        @click="$router.back()"
      />

      <div class="col">
        <q-breadcrumbs
          class="breadcrumb-nav"
          active-color="primary"
          separator="›"
        >
          <q-breadcrumbs-el
            label="Dashboard"
            icon="home"
            to="/"
            class="breadcrumb-link"
          />
          <q-breadcrumbs-el label="Gestão Académica" class="breadcrumb-link" />
          <q-breadcrumbs-el :label="pageTitle" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="school" size="1.3rem" color="white" />
          </div>
          <span>{{ pageTitle }}</span>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <!-- Search -->
        <q-input
          v-model="filter"
          dense
          outlined
          :placeholder="`Pesquisar ${pageTitle.toLowerCase()}...`"
          class="search-input"
          debounce="300"
          clearable
        >
          <template #prepend>
            <q-icon name="search" color="grey-5" size="1.1rem" />
          </template>
        </q-input>

        <!-- Refresh -->
        <q-btn
          flat
          round
          dense
          icon="refresh"
          class="action-icon-btn"
          @click="refresh"
        />

        <!-- Add -->
        <q-btn
          unelevated
          icon="add"
          :label="`Adicionar ${pageTitle.slice(0, -1)}`"
          class="new-btn"
          no-caps
          @click="addProgram"
        />
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row q-px-xl q-mb-lg row q-gutter-md">
      <div class="stat-card col" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="`background:${stat.color}18`">
          <q-icon
            :name="stat.icon"
            size="1.3rem"
            :style="`color:${stat.color}`"
          />
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
          <!-- Toolbar -->
          <div
            class="table-toolbar row items-center justify-between q-px-lg q-py-md"
          >
            <div class="row items-center q-gutter-xs">
              <span class="table-count">{{ filteredCourses.length }}</span>
              <span class="table-count-label"
                >{{ pageTitle.toLowerCase() }} encontrados</span
              >
            </div>

            <div class="row items-center q-gutter-xs">
              <q-btn
                flat
                round
                dense
                icon="view_list"
                :color="viewMode === 'list' ? 'primary' : 'grey-5'"
                size="sm"
                @click="viewMode = 'list'"
              />
              <q-btn
                flat
                round
                dense
                icon="grid_view"
                :color="viewMode === 'grid' ? 'primary' : 'grey-5'"
                size="sm"
                @click="viewMode = 'grid'"
              />
            </div>
          </div>

          <q-separator />

          <!-- LIST VIEW -->
          <q-table
            v-if="viewMode === 'list'"
            class="edigital-table no-shadow"
            :rows="courses"
            :columns="columns"
            row-key="id"
            :filter="filter"
            v-model:pagination="pagination"
            flat
          >
            <template #body-cell-actions="props">
              <q-td :props="props">
                <div class="row no-wrap items-center q-gutter-xs">
                  <q-btn
                    flat
                    round
                    dense
                    icon="settings"
                    class="tbl-btn tbl-btn-secondary"
                    @click="settingsProgram(props.row)"
                  />

                  <q-btn
                    flat
                    round
                    dense
                    icon="edit"
                    class="tbl-btn tbl-btn-primary"
                    @click="editCourse(props.row)"
                  />

                  <q-btn
                    flat
                    round
                    dense
                    icon="delete"
                    class="tbl-btn"
                    color="negative"
                    @click="deleteCourse(props.row)"
                  />
                </div>
              </q-td>
            </template>
          </q-table>

          <!-- GRID VIEW -->
          <div v-else class="grid-view q-pa-lg row q-gutter-md">
            <div
              v-for="course in filteredCourses"
              :key="course.id"
              class="grid-card col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div class="grid-card-header">
                <q-avatar size="48px" class="student-avatar">
                  <q-icon name="menu_book" color="white" />
                </q-avatar>
              </div>

              <div class="grid-card-body">
                <div class="grid-name">{{ course.name }}</div>
                <div class="grid-info">ID: {{ course.id }}</div>
              </div>

              <div class="grid-card-actions row q-gutter-xs">
                <q-btn
                  flat
                  dense
                  no-caps
                  icon="settings"
                  label="Configurar"
                  class="grid-action-btn"
                  @click="settingsProgram(course)"
                />

                <q-btn
                  flat
                  dense
                  no-caps
                  icon="edit"
                  label="Editar"
                  class="grid-action-btn grid-action-primary"
                  @click="editCourse(course)"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import Tables from "src/components/Tables.vue";
import { useCourseStores } from "src/pages/course/store";
import useNotify from "src/composables/UseNotify";
import getColumns from "../components/ProgramColumns";
import { computed } from "vue";

const columns = computed(() => getColumns());

/* setup router */
const router = useRouter();
const route = useRoute();

/* Setup store */
const courseStores = useCourseStores();
const { notifyError } = useNotify();

const filter = ref("");
const viewMode = ref("list");
const pagination = ref({ rowsPerPage: 10 });

const pageTitle = computed(() => getProgram(programUpdated.value));

/* setup data */
const { program, educationId } = route.params;
const educationIdUpdated = ref(route.params.educationId || educationId);
const courses = ref([]);
const programUpdated = ref(route.params.program || program);
const title = ref(programUpdated);

const stats = computed(() => [
  {
    label: "Total",
    value: courses.value.length,
    icon: "menu_book",
    color: "#1a3fa6",
  },
  {
    label: "Activos",
    value: courses.value.filter((c) => c.status === "Activo").length,
    icon: "check_circle",
    color: "#21b573",
  },
  {
    label: "Inactivos",
    value: courses.value.filter((c) => c.status !== "Activo").length,
    icon: "cancel",
    color: "#f57c00",
  },
]);

const filteredCourses = computed(() => {
  if (!filter.value) return courses.value;
  const q = filter.value.toLowerCase();
  return courses.value.filter((c) => c.name?.toLowerCase().includes(q));
});

const refresh = () => fetchCourses();

const fetchCourses = async () => {
  try {
    await courseStores.list({ educationId: educationIdUpdated.value });
    courses.value = courseStores.courses;
  } catch (error) {
    notifyError("Erro ao buscar cursos");
  }
};

const addProgram = () => {
  router.push({
    name: "create-program",
    params: { educationId: educationIdUpdated.value, program: program },
  });
};

const editCourse = (row) => {
  router.push({
    name: "edit-program",
    params: { id: educationIdUpdated.value, courseId: row.id },
  });
};

const deleteCourse = async (course) => {};

const settingsProgram = (item) => {
  console.log(item)
  router.push({
    name: "settings-program",
    params: {
      educationId: educationIdUpdated.value,
      program: programUpdated.value,
      internshipId: item.id,
    },
  });
};

onBeforeRouteUpdate((to) => {
  educationIdUpdated.value = to.params.educationId || educationId;
  programUpdated.value = to.params.program || program;
  fetchCourses();
  getProgram(programUpdated.value);
});

const getProgram = (name) => {
  switch (name) {
    case "internships":
      return "Estagios";
    case "classes":
      return "classes";
    case "classes":
      return "classes";
    case "courses":
      return "Cursos";
    default:
      return "help_outline";
  }
};

onMounted(() => {
  fetchCourses();
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
.back-btn:hover {
  background: #e0e8f7;
}

.breadcrumb-nav {
  font-size: 0.78rem;
}
.breadcrumb-link {
  color: #9ca3af !important;
}
.breadcrumb-active {
  color: #1a3fa6 !important;
  font-weight: 600;
}

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

.search-input {
  width: 220px;
}
.search-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
  height: 38px;
}

.action-icon-btn {
  background: #f0f4f8;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  transition: background 0.2s;
}
.action-icon-btn:hover {
  background: #e0e8f7;
}

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
  transition:
    box-shadow 0.2s,
    transform 0.15s;
}
.new-btn:hover {
  box-shadow: 0 6px 18px rgba(26, 63, 166, 0.35);
  transform: translateY(-1px);
}

/* ── Stats ── */
.stats-row {
  padding-top: 1.2rem;
}
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
.stat-card:hover {
  box-shadow: 0 4px 20px rgba(15, 40, 98, 0.1);
}
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
  box-shadow: 0 2px 20px rgba(15, 40, 98, 0.07);
  border: 1px solid #edf0f5;
}

.table-toolbar {
  background: #fafbfd;
  border-bottom: 1px solid #f0f0f0;
}
.table-count {
  font-family: "Sora", sans-serif;
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
  width: 32px;
  height: 32px;
  transition: background 0.15s;
}
.tbl-btn-primary {
  color: #1a3fa6 !important;
}
.tbl-btn-primary:hover {
  background: #e8f0fe !important;
}
.tbl-btn-secondary {
  color: #6b7280 !important;
}
.tbl-btn-secondary:hover {
  background: #f3f4f6 !important;
}

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
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.05);
  transition:
    box-shadow 0.2s,
    transform 0.15s;
}
.grid-card:hover {
  box-shadow: 0 6px 24px rgba(15, 40, 98, 0.12);
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
  font-family: "Sora", sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  color: #0f2862;
  margin-bottom: 2px;
}
.grid-info {
  font-size: 0.8rem;
  color: #9ca3af;
}
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
  .page-topbar {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .search-input {
    width: 100%;
    order: 3;
  }
  .stats-row {
    padding: 1rem;
  }
  .edigital-page .q-px-xl {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
</style>

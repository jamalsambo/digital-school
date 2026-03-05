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
          <q-breadcrumbs-el label="Ensino por Turma" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="school" size="1.3rem" color="white" />
          </div>
          <span>Ensino por Turma</span>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <!-- Search -->
        <q-input
          v-model="filter"
          dense outlined
          placeholder="Pesquisar turma ou disciplina..."
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
          flat round dense icon="refresh"
          class="action-icon-btn"
          :loading="loading"
          @click="fetchEmployeeTeachings"
        >
          <q-tooltip>Actualizar</q-tooltip>
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

          <!-- Toolbar -->
          <div class="table-toolbar row items-center justify-between q-px-lg q-py-md">
            <div class="row items-center q-gutter-xs">
              <span class="table-count">{{ filteredTeachings.length }}</span>
              <span class="table-count-label">turma(s) encontrada(s)</span>
            </div>
          </div>

          <q-separator />

          <!-- Loading -->
          <div v-if="loading" class="column items-center q-pa-xl">
            <q-spinner-dots color="primary" size="2.5rem" />
            <div class="text-grey-5 q-mt-sm" style="font-size:0.85rem">A carregar ensinamentos...</div>
          </div>

          <!-- Empty -->
          <div v-else-if="!filteredTeachings.length" class="empty-state">
            <div class="empty-icon-wrap q-mb-md">
              <q-icon name="school" size="2.5rem" color="white" />
            </div>
            <div class="empty-title">Nenhuma turma encontrada</div>
            <div class="empty-sub">
              {{ filter ? 'Tente outro termo de pesquisa' : 'Não existem disciplinas atribuídas' }}
            </div>
          </div>

          <!-- Content -->
          <div v-else class="q-pa-lg q-gutter-md">
            <div
              v-for="teaching in filteredTeachings"
              :key="teaching.classEntity.id"
              class="class-block"
            >
              <!-- Class Header -->
              <div class="class-block-header row items-center q-px-lg q-py-sm">
                <div class="class-avatar q-mr-md">
                  <q-icon name="class" color="white" size="1.1rem" />
                </div>
                <div class="col">
                  <div class="class-name">{{ teaching.classEntity.name }}</div>
                  <div class="class-sub">
                    {{ teaching.disciplines.reduce((acc, g) => acc + g.list.length, 0) }} disciplina(s) ·
                    {{ teaching.disciplines.length }} ciclo(s)
                  </div>
                </div>
                <q-chip dense class="class-chip">
                  <q-icon name="groups" size="0.9rem" class="q-mr-xs" />
                  {{ teaching.classEntity.name }}
                </q-chip>
              </div>

              <q-separator />

              <!-- Ciclos e Disciplinas -->
              <div class="q-pa-lg q-gutter-md">
                <div
                  v-for="group in teaching.disciplines"
                  :key="group.cicle"
                  class="cicle-block"
                >
                  <!-- Cicle Label -->
                  <div class="cicle-label row items-center q-gutter-xs q-mb-sm">
                    <div class="cicle-badge">
                      <q-icon name="rotate_right" size="0.85rem" color="white" />
                    </div>
                    <span>Ciclo {{ group.cicle }}</span>
                  </div>

                  <!-- Discipline List -->
                  <div class="discipline-list q-gutter-sm">
                    <div
                      v-for="discipline in group.list"
                      :key="discipline.id"
                      class="discipline-row row items-center"
                    >
                      <div class="discipline-icon-wrap q-mr-md">
                        <q-icon name="menu_book" size="1rem" color="white" />
                      </div>

                      <div class="col">
                        <div class="discipline-name">{{ discipline.name }}</div>
                        <div class="discipline-sub">Ciclo {{ discipline.cicle }}</div>
                      </div>

                      <!-- Actions -->
                      <div class="row no-wrap q-gutter-xs">
                        <q-btn
                          flat round dense
                          icon="crisis_alert"
                          class="disc-btn disc-btn-green"
                          @click="attendances(teaching.classEntity, discipline)"
                        >
                          <q-tooltip>Ver Presenças</q-tooltip>
                        </q-btn>
                        <q-btn
                          flat round dense
                          icon="groups"
                          class="disc-btn disc-btn-red"
                          @click="evolution(teaching.classEntity, discipline)"
                        >
                          <q-tooltip>Ver Evolução</q-tooltip>
                        </q-btn>
                        <q-btn
                          flat round dense
                          icon="group_add"
                          class="disc-btn disc-btn-green"
                          @click="handleShowGroups(teaching.classEntity, discipline)"
                        >
                          <q-tooltip>Gerir Grupos</q-tooltip>
                        </q-btn>
                        <q-btn
                          flat round dense
                          icon="add_task"
                          class="disc-btn disc-btn-blue"
                          @click="handleShowTasks(teaching.classEntity, discipline)"
                        >
                          <q-tooltip>Nova Tarefa</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEmployeeStores } from "../stores";
import useNotify from "src/composables/UseNotify";

/* ── Router / Store ── */
const route = useRoute();
const router = useRouter();
const employeeStores = useEmployeeStores();
const { notifyError } = useNotify();

/* ── Params ── */
const { id } = route.params;

/* ── State ── */
const teachings = ref([]);
const filter = ref("");
const loading = ref(false);

/* ── Computed ── */
const filteredTeachings = computed(() => {
  if (!filter.value) return teachings.value;
  const q = filter.value.toLowerCase();
  return teachings.value.filter(
    (t) =>
      t.classEntity.name.toLowerCase().includes(q) ||
      t.disciplines.some((g) =>
        g.list.some((d) => d.name.toLowerCase().includes(q))
      )
  );
});

const stats = computed(() => [
  {
    label: "Turmas",
    value: teachings.value.length,
    icon: "class",
    color: "#1a3fa6",
  },
  {
    label: "Disciplinas",
    value: teachings.value.reduce(
      (acc, t) => acc + t.disciplines.reduce((a, g) => a + g.list.length, 0),
      0
    ),
    icon: "menu_book",
    color: "#21b573",
  },
  {
    label: "Ciclos",
    value: teachings.value.reduce((acc, t) => acc + t.disciplines.length, 0),
    icon: "rotate_right",
    color: "#f59e0b",
  },
]);

/* ── Methods ── */
const attendances = (classe, discipline) => {
  router.push({
    name: "class-attendances",
    params: { classe: classe.id, discipline: discipline.id },
  });
};

const evolution = (classe, discipline) => {
  router.push({
    name: "evolution-create",
    params: { classe: classe.id, discipline: discipline.id },
  });
};

const handleShowTasks = (classe, discipline) => {
  router.push({
    name: "tasks",
    params: { classeId: classe.id, disciplineId: discipline.id },
  });
};

const handleShowGroups = (classe, discipline) => {
  router.push({
    name: "groups",
    params: { classe: classe.id, disciplineId: discipline.id },
  });
};

const groupDataByClass = (data) => {
  const grouped = {};
  data.forEach((item) => {
    const className = item.classEntity.name;
    const activity = item.developmentAreaActivity;
    if (!grouped[className]) {
      grouped[className] = { classEntity: item.classEntity, disciplines: {} };
    }
    const cicle = activity.cicle;
    if (!grouped[className].disciplines[cicle]) {
      grouped[className].disciplines[cicle] = [];
    }
    grouped[className].disciplines[cicle].push({
      name: activity.activity.name,
      id: activity.id,
      cicle: activity.cicle,
    });
  });
  return Object.values(grouped).map((group) => ({
    ...group,
    disciplines: Object.entries(group.disciplines).map(([cicle, list]) => ({
      cicle,
      list,
    })),
  }));
};

const fetchEmployeeTeachings = async () => {
  loading.value = true;
  try {
    await employeeStores.findTeachings(id);
    teachings.value = groupDataByClass(employeeStores.teachings);
  } catch (error) {
    notifyError("Falha ao carregar as disciplinas.");
  } finally {
    loading.value = false;
  }
};

/* ── Lifecycle ── */
onMounted(() => {
  fetchEmployeeTeachings();
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

.search-input { width: 260px; }
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
.table-count { font-family: "Sora", sans-serif; font-weight: 700; font-size: 1rem; color: #0f2862; }
.table-count-label { font-size: 0.82rem; color: #9ca3af; }

/* ── Class Block ── */
.class-block {
  background: white;
  border-radius: 14px;
  border: 1px solid #edf0f5;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.04);
  transition: box-shadow 0.2s;
}
.class-block:hover { box-shadow: 0 4px 20px rgba(15, 40, 98, 0.09); }
.class-block-header {
  background: #fafbfd;
  border-bottom: 1px solid #f0f0f0;
  padding: 0.9rem 1.2rem;
}
.class-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.class-name {
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #0f2862;
}
.class-sub { font-size: 0.75rem; color: #9ca3af; margin-top: 2px; }
.class-chip {
  background: #eff6ff;
  color: #1a3fa6;
  font-weight: 600;
  font-size: 0.75rem;
  border-radius: 8px;
}

/* ── Cicle Block ── */
.cicle-block { background: #fafbfd; border-radius: 10px; padding: 0.8rem 1rem; }
.cicle-label {
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
}
.cicle-badge {
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Discipline Row ── */
.discipline-row {
  background: white;
  border-radius: 10px;
  border: 1px solid #edf0f5;
  padding: 0.7rem 1rem;
  transition: box-shadow 0.15s, transform 0.1s;
}
.discipline-row:hover {
  box-shadow: 0 4px 14px rgba(15, 40, 98, 0.08);
  transform: translateX(2px);
}
.discipline-icon-wrap {
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.discipline-name {
  font-family: "Sora", sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  color: #0f2862;
}
.discipline-sub { font-size: 0.74rem; color: #9ca3af; margin-top: 1px; }

/* ── Discipline Action Buttons ── */
.disc-btn {
  border-radius: 8px !important;
  width: 32px;
  height: 32px;
  transition: background 0.15s;
}
.disc-btn-green { color: #21b573 !important; }
.disc-btn-green:hover { background: #dcfce7 !important; }
.disc-btn-red { color: #ef4444 !important; }
.disc-btn-red:hover { background: #fee2e2 !important; }
.disc-btn-blue { color: #1a3fa6 !important; }
.disc-btn-blue:hover { background: #e8f0fe !important; }

/* ── Empty State ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 2rem;
  text-align: center;
}
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
  font-size: 1rem;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 4px;
}
.empty-sub { font-size: 0.82rem; color: #d1d5db; max-width: 280px; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .search-input { width: 100%; order: 3; }
  .stats-row { padding: 1rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
}
</style>

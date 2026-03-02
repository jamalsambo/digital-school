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
        <div class="row items-center gap-sm">
          <q-breadcrumbs class="breadcrumb-nav" active-color="primary" separator="›">
            <q-breadcrumbs-el label="Dashboard" icon="home" to="/" class="breadcrumb-link" />
            <q-breadcrumbs-el label="Gestão de Entidades" class="breadcrumb-link" />
            <q-breadcrumbs-el label="Instituições" class="breadcrumb-active" />
          </q-breadcrumbs>
        </div>
        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="business" size="1.3rem" color="white" />
          </div>
          <span>Instituições</span>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <!-- Search -->
        <q-input
          v-model="search"
          dense
          outlined
          placeholder="Pesquisar instituição..."
          class="search-input"
          clearable
        >
          <template #prepend>
            <q-icon name="search" color="grey-5" size="1.1rem" />
          </template>
        </q-input>

        <!-- Filter -->
        <q-btn flat round dense icon="tune" color="grey-6" class="action-icon-btn">
          <q-tooltip>Filtrar</q-tooltip>
          <q-menu>
            <q-list style="min-width:180px">
              <q-item-label header class="text-caption text-weight-bold">Estado</q-item-label>
              <q-item clickable v-close-popup @click="filterStatus = null">
                <q-item-section>Todos</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="filterStatus = 'Activo'">
                <q-item-section><q-chip color="positive" text-color="white" size="sm" dense>Activo</q-chip></q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="filterStatus = 'Inactivo'">
                <q-item-section><q-chip color="negative" text-color="white" size="sm" dense>Inactivo</q-chip></q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- Refresh -->
        <q-btn flat round dense icon="refresh" color="grey-6" class="action-icon-btn" @click="refresh">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>

        <!-- Nova Instituição -->
        <q-btn
          v-if="authStore.isSuper"
          unelevated
          icon="add"
          label="Nova Instituição"
          class="new-btn"
          no-caps
          @click="createInstitution"
        />
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row q-px-xl q-mb-lg row q-gutter-md">
      <div class="stat-card col" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="`background:${stat.color}18`">
          <q-icon :name="stat.icon" :color="stat.color.replace('#','')" size="1.3rem" :style="`color:${stat.color}`" />
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

          <!-- Table Header -->
          <div class="table-toolbar row items-center justify-between q-px-lg q-py-md">
            <div class="row items-center q-gutter-xs">
              <span class="table-count">{{ filteredRows.length }}</span>
              <span class="table-count-label">instituições encontradas</span>
              <q-chip v-if="filterStatus" :color="filterStatus==='Activo'?'positive':'negative'" text-color="white" size="sm" dense removable @remove="filterStatus=null">
                {{ filterStatus }}
              </q-chip>
            </div>
            <div class="row items-center q-gutter-xs">
              <q-btn flat round dense icon="view_list" :color="viewMode==='list'?'primary':'grey-5'" size="sm" @click="viewMode='list'" />
              <q-btn flat round dense icon="grid_view" :color="viewMode==='grid'?'primary':'grey-5'" size="sm" @click="viewMode='grid'" />
            </div>
          </div>

          <q-separator />

          <!-- List View -->
          <Tables v-if="viewMode==='list'" :columns="columns" :rows="filteredRows" :loading="loading">

            <template #body-cell-status="props">
              <q-td :props="props">
                <div class="status-badge" :class="props.row.status === 'Activo' ? 'status-active' : 'status-inactive'">
                  <span class="status-dot"></span>
                  {{ props.row.status }}
                </div>
              </q-td>
            </template>

            <template #actions="{ props }">
              <div class="row no-wrap items-center q-gutter-xs">

                <q-btn flat round dense icon="settings" class="tbl-btn tbl-btn-secondary" @click="settingsInstitution(props.row)">
                  <q-tooltip>Configurar Instituição</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="props.row.status === 'Activo' && authStore.hasEditInstitution"
                  flat round dense icon="edit"
                  class="tbl-btn tbl-btn-primary"
                  @click="editInstitution(props.row)"
                >
                  <q-tooltip>Editar Dados</q-tooltip>
                </q-btn>

                <q-btn-dropdown flat round dense dropdown-icon="more_vert" no-icon-animation class="tbl-btn tbl-btn-grey">
                  <q-list class="dropdown-list">

                    <q-item-label header class="text-caption text-grey-6 q-pb-xs">Acções</q-item-label>

                    <q-item clickable v-close-popup @click="handleLisEmployees(props.row)" class="dropdown-item">
                      <q-item-section avatar><div class="action-icon-circle bg-blue-1"><q-icon name="group" color="blue-8" size="1rem" /></div></q-item-section>
                      <q-item-section>
                        <q-item-label>Ver Funcionários</q-item-label>
                        <q-item-label caption>Lista de colaboradores</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="createEmployee(props.row)" class="dropdown-item">
                      <q-item-section avatar><div class="action-icon-circle bg-green-1"><q-icon name="person_add" color="green-8" size="1rem" /></div></q-item-section>
                      <q-item-section>
                        <q-item-label>Adicionar Utilizador</q-item-label>
                        <q-item-label caption>Novo acesso ao sistema</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-if="!props.row.parentId" clickable v-close-popup @click="createSucursal(props.row)" class="dropdown-item">
                      <q-item-section avatar><div class="action-icon-circle bg-orange-1"><q-icon name="account_tree" color="orange-8" size="1rem" /></div></q-item-section>
                      <q-item-section>
                        <q-item-label>Criar Sucursal</q-item-label>
                        <q-item-label caption>Nova filial associada</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="handleSettingsSite(props.row)" class="dropdown-item">
                      <q-item-section avatar><div class="action-icon-circle bg-indigo-1"><q-icon name="language" color="indigo-8" size="1rem" /></div></q-item-section>
                      <q-item-section>
                        <q-item-label>Configurar Site</q-item-label>
                        <q-item-label caption>Presença digital</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-separator class="q-my-xs" />

                    <q-item v-if="authStore.isSuper" clickable v-close-popup @click="deleteInstitution(props.row)" class="dropdown-item dropdown-danger">
                      <q-item-section avatar><div class="action-icon-circle bg-red-1"><q-icon name="delete_sweep" color="negative" size="1rem" /></div></q-item-section>
                      <q-item-section>
                        <q-item-label class="text-negative">Desactivar Instituição</q-item-label>
                        <q-item-label caption>Operação reversível</q-item-label>
                      </q-item-section>
                    </q-item>

                  </q-list>
                </q-btn-dropdown>

              </div>
            </template>

          </Tables>

          <!-- Grid View -->
          <div v-else class="grid-view q-pa-lg row q-gutter-md">
            <div
              v-for="row in filteredRows"
              :key="row.id"
              class="grid-card col-12 col-sm-6 col-md-4"
            >
              <div class="grid-card-header">
                <div class="grid-avatar">
                  <q-icon name="business" color="white" size="1.5rem" />
                </div>
                <div class="status-badge q-ml-auto" :class="row.status === 'Activo' ? 'status-active' : 'status-inactive'">
                  <span class="status-dot"></span>{{ row.status }}
                </div>
              </div>
              <div class="grid-card-body">
                <div class="grid-name">{{ row.name }}</div>
                <div class="grid-info">{{ row.type || 'Instituição' }}</div>
              </div>
              <div class="grid-card-actions row q-gutter-xs">
                <q-btn flat dense no-caps icon="settings" label="Config." class="grid-action-btn" @click="settingsInstitution(row)" />
                <q-btn flat dense no-caps icon="edit" label="Editar" class="grid-action-btn grid-action-primary" @click="editInstitution(row)" />
              </div>
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
import { useInstitutionStores } from "../store";
import { useAuthStore } from "src/pages/auth/store";
import useNotify from "src/composables/UseNotify";
import Tables from "src/components/Tables.vue";
import columns from "../components/InstitutionColumns";
import { useEmployeeStores } from "src/pages/employee/stores";

/* ── Router & Stores ── */
const router = useRouter();
const institutuinStores = useInstitutionStores();
const authStore = useAuthStore();
const employeeStores = useEmployeeStores();
const { notifyError, notifySuccess } = useNotify();

/* ── Data ── */
const { institutionId } = authStore.user;
const institutions = ref([]);

/* ── UI State ── */
const search = ref('');
const filterStatus = ref(null);
const viewMode = ref('list');
const loading = ref(false);

/* ── Computed ── */
const stats = computed(() => [
  { label: 'Total',     value: institutions.value.length,                                       icon: 'business',      color: '#1a3fa6' },
  { label: 'Activas',   value: institutions.value.filter(i => i.status === 'Activo').length,    icon: 'check_circle',  color: '#21b573' },
  { label: 'Inactivas', value: institutions.value.filter(i => i.status !== 'Activo').length,    icon: 'cancel',        color: '#e53935' },
  { label: 'Sucursais', value: institutions.value.filter(i => i.parentId).length,               icon: 'account_tree',  color: '#f57c00' },
]);

const filteredRows = computed(() => {
  let rows = institutions.value;
  if (filterStatus.value) rows = rows.filter(r => r.status === filterStatus.value);
  if (search.value)       rows = rows.filter(r => r.name?.toLowerCase().includes(search.value.toLowerCase()));
  return rows;
});

/* ── Methods ── */
const createInstitution = () => {
  router.push({ name: "create-institution" });
};

const editInstitution = (institution) => {
  router.push({
    name: "edit-institution",
    params: { institutionId: institution.id },
  });
};

const createSucursal = (institution) => {
  router.push({
    name: "create-branch",
    params: { parent: institution.id },
    state: { name: institution.name },
  });
};

const deleteInstitution = async (institution) => {
  try {
    await institutuinStores.update(institution.id, { status: "Desactivo" });
    notifySuccess(`Instituição "${institution.name}" desactivada com sucesso!`);
    await fetchInstitutions();
  } catch (error) {
    notifyError("Erro ao desactivar instituição.");
  }
};

const createEmployee = async (institution) => {
  try {
    await employeeStores.create({ institutionId: institution.id, teacher: "Sim" });
    router.push({
      name: "create-employee",
      params: { id: employeeStores.employee.id, created: "create" },
    });
  } catch (error) {
    notifyError("Erro ao criar funcionário.");
  }
};

const settingsInstitution = (institution) => {
  router.push({
    name: "settings-institution",
    params: { institutionId: institution.id },
  });
};

const handleSettingsSite = (row) => {
  router.push({
    name: "settings-site",
    params: { id: row.id },
  });
};

const handleLisEmployees = (row) => {
  router.push({
    name: "institution-employees",
    params: { institutionId: row.id },
  });
};

/* ── Fetch ── */
const fetchInstitutions = async () => {
  loading.value = true;
  try {
    if (authStore?.isSuper) {
      await institutuinStores.list();
    } else {
      await institutuinStores.list({ institutionId });
    }
    institutions.value = institutuinStores.institutions;
  } catch (error) {
    notifyError("Erro ao carregar Instituições.");
  } finally {
    loading.value = false;
  }
};

const refresh = () => fetchInstitutions();

onMounted(async () => {
  await fetchInstitutions();
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

/* ── Status Badge ── */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.03em;
}
.status-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-active {
  background: #dcfce7;
  color: #15803d;
}
.status-active .status-dot { background: #22c55e; }
.status-inactive {
  background: #fee2e2;
  color: #b91c1c;
}
.status-inactive .status-dot { background: #ef4444; }

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
.tbl-btn-grey { color: #6b7280 !important; }
.tbl-btn-grey:hover { background: #f3f4f6 !important; }

/* ── Dropdown ── */
.dropdown-list { padding: 6px; }
.dropdown-item { border-radius: 8px; margin-bottom: 2px; transition: background 0.15s; }
.dropdown-item:hover { background: #f8fafc; }
.dropdown-danger:hover { background: #fff5f5 !important; }
.action-icon-circle {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
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
.grid-card-header { display: flex; align-items: center; margin-bottom: 1rem; }
.grid-avatar {
  width: 46px; height: 46px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.grid-name {
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: #0f2862;
  margin-bottom: 2px;
}
.grid-info { font-size: 0.8rem; color: #9ca3af; }
.grid-card-actions { margin-top: 1rem; border-top: 1px solid #f0f4f8; padding-top: 0.8rem; }
.grid-action-btn {
  border-radius: 8px;
  font-size: 0.78rem;
  color: #6b7280 !important;
  background: #f8fafc;
  padding: 0 10px;
}
.grid-action-primary { color: #1a3fa6 !important; background: #eff6ff !important; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .search-input { width: 100%; order: 3; }
  .stats-row { padding: 1rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
}
</style>

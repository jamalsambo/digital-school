<template>
  <q-page class="edigital-page">

    <!-- ── Dialog Criar / Editar ── -->
    <q-dialog v-model="medium" persistent>
      <q-card class="dialog-card">

        <div class="dialog-header row items-center q-px-lg q-py-md">
          <div class="dialog-header-icon q-mr-md">
            <q-icon name="assessment" size="1.1rem" color="white" />
          </div>
          <div>
            <div class="dialog-title">{{ evolutionType ? 'Editar Tipo de Avaliação' : 'Adicionar Tipo de Avaliação' }}</div>
            <div class="dialog-sub">Preencha os campos abaixo para {{ evolutionType ? 'actualizar' : 'registar' }} o tipo</div>
          </div>
          <q-space />
          <q-btn flat round dense icon="close" class="dialog-close-btn" @click="toggleModal" />
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <q-form ref="formRef" @submit.prevent="onSubmit">

            <div class="section-label q-mb-md">Informações do Tipo</div>

            <div class="row q-col-gutter-md q-mb-lg">
              <!-- Nome -->
              <div class="col-md-6 col-12">
                <div class="field-label">Nome da Avaliação <span class="required">*</span></div>
                <q-input
                  v-model="form.name"
                  placeholder="Ex: Avaliação Contínua"
                  outlined dense
                  class="edigital-input"
                  :rules="[(val) => !!val || 'O nome é obrigatório.']"
                />
              </div>

              <!-- Tipo -->
              <div class="col-md-6 col-12">
                <div class="field-label">Tipo de Avaliação <span class="required">*</span></div>
                <q-select
                  v-model="form.type"
                  :options="['Normal', 'Exame']"
                  outlined dense
                  class="edigital-input"
                  :rules="[(val) => !!val || 'Selecione um tipo.']"
                />
              </div>
            </div>

            <q-separator class="q-mb-lg" />

            <div class="row justify-end q-gutter-sm">
              <q-btn
                label="Cancelar"
                icon="close"
                class="cancel-btn"
                no-caps flat
                @click="toggleModal"
              />
              <q-btn
                :label="evolutionType ? 'Actualizar' : 'Guardar'"
                icon="save"
                class="save-btn"
                no-caps
                type="submit"
                :loading="loading"
              />
            </div>

          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

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
          <q-breadcrumbs-el label="Avaliações" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Tipos de Avaliação" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="assessment" size="1.3rem" color="white" />
          </div>
          <span>Tipos de Avaliação</span>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <!-- Search -->
        <q-input
          v-model="filter"
          dense outlined
          placeholder="Pesquisar tipos..."
          class="search-input"
          debounce="300"
          clearable
        >
          <template #prepend>
            <q-icon name="search" color="grey-5" size="1.1rem" />
          </template>
        </q-input>

        <!-- Refresh -->
        <q-btn flat round dense icon="refresh" class="action-icon-btn" @click="fetchEvolutionTypes" />

        <!-- Add -->
        <q-btn
          unelevated
          icon="add"
          label="Adicionar Tipo"
          class="new-btn"
          no-caps
          @click="addEvolutionType"
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

    <!-- Table Card -->
    <div class="q-px-xl q-pb-xl">
      <q-card class="table-card" flat>
        <q-card-section class="q-pa-none">

          <!-- Toolbar -->
          <div class="table-toolbar row items-center justify-between q-px-lg q-py-md">
            <div class="row items-center q-gutter-xs">
              <span class="table-count">{{ filteredTypes.length }}</span>
              <span class="table-count-label">tipos encontrados</span>
            </div>
            <div class="row items-center q-gutter-xs">
              <q-btn
                flat round dense icon="view_list"
                :color="viewMode === 'list' ? 'primary' : 'grey-5'"
                size="sm" @click="viewMode = 'list'"
              />
              <q-btn
                flat round dense icon="grid_view"
                :color="viewMode === 'grid' ? 'primary' : 'grey-5'"
                size="sm" @click="viewMode = 'grid'"
              />
            </div>
          </div>

          <q-separator />

          <!-- LIST VIEW -->
          <q-table
            v-if="viewMode === 'list'"
            class="edigital-table no-shadow"
            :rows="evolutionTypes"
            :columns="columns"
            row-key="id"
            :filter="filter"
            v-model:pagination="pagination"
            flat
          >
            <template #body-cell-type="props">
              <q-td :props="props">
                <q-chip
                  dense
                  :class="props.row.type === 'Exame' ? 'chip-exame' : 'chip-normal'"
                >
                  {{ props.row.type }}
                </q-chip>
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props">
                <div class="row no-wrap items-center q-gutter-xs">
                  <q-btn
                    flat round dense icon="edit"
                    class="tbl-btn tbl-btn-primary"
                    @click="editEvolutionType(props)"
                  />
                  <q-btn
                    flat round dense icon="delete"
                    class="tbl-btn" color="negative"
                    @click="deleteEvolutionType(props.row)"
                  />
                </div>
              </q-td>
            </template>
          </q-table>

          <!-- GRID VIEW -->
          <div v-else class="grid-view q-pa-lg row q-gutter-md">
            <div
              v-for="item in filteredTypes"
              :key="item.id"
              class="grid-card col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div class="grid-card-header">
                <q-avatar size="48px" class="type-avatar">
                  <q-icon name="assessment" color="white" />
                </q-avatar>
                <q-chip
                  dense size="sm"
                  :class="item.type === 'Exame' ? 'chip-exame q-ml-sm' : 'chip-normal q-ml-sm'"
                >
                  {{ item.type }}
                </q-chip>
              </div>

              <div class="grid-card-body">
                <div class="grid-name">{{ item.name }}</div>
                <div class="grid-info row items-center q-gutter-xs q-mt-xs">
                  <q-icon name="label" size="0.9rem" color="grey-5" />
                  <span>Tipo de Avaliação</span>
                </div>
              </div>

              <div class="grid-card-actions row q-gutter-xs">
                <q-btn
                  flat dense no-caps icon="edit" label="Editar"
                  class="grid-action-btn grid-action-primary"
                  @click="editEvolutionType({ row: item })"
                />
                <q-btn
                  flat dense no-caps icon="delete" label="Eliminar"
                  class="grid-action-btn" color="negative"
                  @click="deleteEvolutionType(item)"
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
import { ref, computed, onMounted } from "vue";
import { useEvolutionStores } from "../stores";
import columns from "../components/columns/Types";
import useNotify from "src/composables/UseNotify";

/* ── Store ── */
const evolutionStores = useEvolutionStores();
const { notifyError, notifySuccess } = useNotify();

/* ── State ── */
const evolutionTypes = ref([]);
const evolutionType = ref(null);
const medium = ref(false);
const loading = ref(false);
const filter = ref("");
const viewMode = ref("list");
const pagination = ref({ rowsPerPage: 10 });
const formRef = ref(null);

const form = ref({
  name: "",
  type: "",
});

/* ── Computed ── */
const filteredTypes = computed(() => {
  if (!filter.value) return evolutionTypes.value;
  const q = filter.value.toLowerCase();
  return evolutionTypes.value.filter((t) => t.name?.toLowerCase().includes(q));
});

const stats = computed(() => [
  {
    label: "Total",
    value: evolutionTypes.value.length,
    icon: "assessment",
    color: "#1a3fa6",
  },
  {
    label: "Normal",
    value: evolutionTypes.value.filter((t) => t.type === "Normal").length,
    icon: "check_circle",
    color: "#21b573",
  },
  {
    label: "Exame",
    value: evolutionTypes.value.filter((t) => t.type === "Exame").length,
    icon: "quiz",
    color: "#f57c00",
  },
]);

/* ── Methods ── */
const toggleModal = () => {
  medium.value = !medium.value;
  if (!medium.value) {
    evolutionType.value = null;
    form.value = { name: "", type: "" };
  }
};

const addEvolutionType = () => {
  evolutionType.value = null;
  form.value = { name: "", type: "" };
  toggleModal();
};

const editEvolutionType = (props) => {
  evolutionType.value = props.row;
  form.value.name = props.row.name;
  form.value.type = props.row.type;
  toggleModal();
};

const deleteEvolutionType = async (item) => {
  // TODO: implementar lógica de eliminação
};

const onSubmit = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    if (evolutionType.value) {
      await evolutionStores.updateType(evolutionType.value.id, form.value);
      notifySuccess("Tipo de avaliação actualizado com sucesso!");
    } else {
      await evolutionStores.createType(form.value);
      notifySuccess("Tipo de avaliação criado com sucesso!");
    }
    toggleModal();
    await fetchEvolutionTypes();
  } catch (error) {
    notifyError("Erro ao guardar tipo de avaliação");
  } finally {
    loading.value = false;
  }
};

const fetchEvolutionTypes = async () => {
  try {
    await evolutionStores.list();
    evolutionTypes.value = evolutionStores.evolutionTypes;
  } catch (error) {
    notifyError("Erro ao buscar dados");
  }
};

/* ── Lifecycle ── */
onMounted(async () => {
  await fetchEvolutionTypes();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap");

.edigital-page {
  min-height: 100vh;
  background: #f0f4f8;
  font-family: "DM Sans", sans-serif;
}

/* ── Dialog ── */
.dialog-card {
  width: 600px;
  max-width: 92vw;
  border-radius: 16px !important;
  overflow: hidden;
}
.dialog-header {
  background: #fafbfd;
  border-bottom: 1px solid #f0f0f0;
}
.dialog-header-icon {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dialog-title {
  font-family: "Sora", sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f2862;
}
.dialog-sub {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 1px;
}
.dialog-close-btn {
  background: #f0f4f8;
  color: #6b7280 !important;
  border-radius: 8px;
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

.search-input { width: 220px; }
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
  transition: box-shadow 0.2s, transform 0.15s;
}
.new-btn:hover {
  box-shadow: 0 6px 18px rgba(26, 63, 166, 0.35);
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
.edigital-table :deep(tbody tr) { transition: background 0.15s; }
.edigital-table :deep(tbody tr:hover) { background: #f5f8ff !important; }
.edigital-table :deep(tbody tr td) {
  font-size: 0.875rem;
  color: #374151;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}

/* ── Table Buttons ── */
.tbl-btn { border-radius: 8px !important; width: 32px; height: 32px; transition: background 0.15s; }
.tbl-btn-primary { color: #1a3fa6 !important; }
.tbl-btn-primary:hover { background: #e8f0fe !important; }

/* ── Type Chips ── */
.chip-normal {
  background: #dcfce7;
  color: #16a34a;
  font-weight: 700;
  font-size: 0.72rem;
  border-radius: 6px;
}
.chip-exame {
  background: #fff7ed;
  color: #ea580c;
  font-weight: 700;
  font-size: 0.72rem;
  border-radius: 6px;
}

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
.edigital-input :deep(.q-field__control:hover) {
  border-color: #1a3fa6;
}

/* ── Buttons ── */
.cancel-btn {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #6b7280 !important;
  padding: 0 20px;
  height: 40px;
  font-weight: 600;
  transition: background 0.2s;
}
.cancel-btn:hover { background: #f3f4f6 !important; }

.save-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white !important;
  border-radius: 10px;
  padding: 0 24px;
  height: 40px;
  font-family: "Sora", sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  transition: box-shadow 0.2s, transform 0.15s;
}
.save-btn:hover {
  box-shadow: 0 6px 18px rgba(26, 63, 166, 0.35);
  transform: translateY(-1px);
}

/* ── Grid View ── */
.grid-card {
  background: white;
  border-radius: 14px;
  border: 1px solid #edf0f5;
  padding: 1.2rem;
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.05);
  transition: box-shadow 0.2s, transform 0.15s;
}
.grid-card:hover { box-shadow: 0 6px 24px rgba(15, 40, 98, 0.12); transform: translateY(-2px); }
.grid-card-header { display: flex; align-items: center; margin-bottom: 1rem; }
.type-avatar {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 12px;
}
.grid-name { font-family: "Sora", sans-serif; font-weight: 600; font-size: 0.95rem; color: #0f2862; }
.grid-info { font-size: 0.8rem; color: #9ca3af; }
.grid-card-actions { margin-top: 1rem; border-top: 1px solid #f0f4f8; padding-top: 0.8rem; }
.grid-action-btn { border-radius: 8px; font-size: 0.78rem; color: #6b7280 !important; background: #f8fafc; padding: 0 10px; }
.grid-action-primary { color: #1a3fa6 !important; background: #eff6ff !important; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .search-input { width: 100%; order: 3; }
  .stats-row { padding: 1rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
}
</style>

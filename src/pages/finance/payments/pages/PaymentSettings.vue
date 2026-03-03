<template>
  <q-page class="edigital-page">

    <PenaltyRulesComponent
      ref="penaltyRulesChild"
      :payment-type-selected="paymentTypeSelected"
      :fetch-payment-types="fetchPaymentTypes"
    />

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
          <q-breadcrumbs-el label="Instituição" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Configuração de Pagamentos" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="payments" size="1.3rem" color="white" />
          </div>
          <span>Configuração de Pagamentos</span>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <q-btn flat round dense icon="refresh" class="action-icon-btn" @click="fetchPaymentTypes" />
        <q-btn
          v-if="!isEditing"
          unelevated icon="add"
          label="Adicionar Tipo"
          class="new-btn"
          no-caps
          @click="toggleEdit"
        />
        <q-btn
          v-else
          icon="close"
          label="Cancelar"
          class="cancel-btn"
          no-caps flat
          @click="toggleEdit"
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

      <!-- Formulário de Criação -->
      <q-card v-if="isEditing" class="form-card" flat>

        <div class="form-card-header row items-center q-px-lg q-py-md">
          <div class="form-header-icon q-mr-md">
            <q-icon name="add_card" size="1.2rem" color="white" />
          </div>
          <div>
            <div class="form-header-title">Criar Tipo de Pagamento</div>
            <div class="form-header-sub">Preencha os campos abaixo para registar o novo tipo</div>
          </div>
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <FormPaymentTypesComponent
            :education-level-id="institution.educationLevel.id"
            :institution-id="institution.id"
            :fetch-payment-types="fetchPaymentTypes"
            :toggle-edit="toggleEdit"
          >
            <template #actions>
              <q-separator class="q-mb-lg" />
              <div class="row justify-end q-gutter-sm">
                <q-btn
                  label="Cancelar"
                  icon="close"
                  class="cancel-btn"
                  no-caps flat
                  @click="toggleEdit"
                />
                <q-btn
                  label="Guardar"
                  icon="save"
                  class="save-btn"
                  no-caps
                  type="submit"
                />
              </div>
            </template>
          </FormPaymentTypesComponent>
        </q-card-section>
      </q-card>

      <!-- Tabela de Tipos de Pagamento -->
      <q-card class="table-card" flat>
        <q-card-section class="q-pa-none">

          <!-- Toolbar -->
          <div class="table-toolbar row items-center justify-between q-px-lg q-py-md">
            <div class="row items-center q-gutter-xs">
              <span class="table-count">{{ paymentTypes.length }}</span>
              <span class="table-count-label">tipos de pagamento registados</span>
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
            :rows="paymentTypes"
            :columns="columnsPaymentTypes"
            row-key="id"
            v-model:pagination="pagination"
            flat
          >
            <template #body-cell-actions="props">
              <q-td :props="props">
                <div class="row no-wrap items-center q-gutter-xs">
                  <q-btn
                    flat round dense icon="gavel"
                    class="tbl-btn tbl-btn-secondary"
                    @click="addPenaltyRules(props)"
                  >
                    <q-tooltip>Regras de Multa</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat round dense icon="edit"
                    class="tbl-btn tbl-btn-primary"
                    @click="editPaymentType(props.row)"
                  >
                    <q-tooltip>Editar Tipo</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </template>
          </q-table>

          <!-- GRID VIEW -->
          <div v-else class="grid-view q-pa-lg row q-gutter-md">
            <div
              v-for="type in paymentTypes"
              :key="type.id"
              class="grid-card col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div class="grid-card-header">
                <q-avatar size="48px" class="payment-avatar">
                  <q-icon name="payments" color="white" />
                </q-avatar>
              </div>

              <div class="grid-card-body">
                <div class="grid-name">{{ type.name }}</div>
                <div class="grid-info row items-center q-gutter-xs q-mt-xs">
                  <q-icon name="label" size="0.9rem" color="grey-5" />
                  <span>Tipo de Pagamento</span>
                </div>
              </div>

              <div class="grid-card-actions row q-gutter-xs">
                <q-btn
                  flat dense no-caps icon="gavel" label="Multas"
                  class="grid-action-btn"
                  @click="addPenaltyRules({ row: type })"
                />
                <q-btn
                  flat dense no-caps icon="edit" label="Editar"
                  class="grid-action-btn grid-action-primary"
                  @click="editPaymentType(type)"
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
import { computed, onMounted, ref } from "vue";
import { useInstitutionStores } from "src/pages/institution/store";
import { usePaymentStores } from "../stores";
import Tables from "src/components/Tables.vue";
import FormPaymentTypesComponent from "../components/forms/PaymentTypes.vue";
import columnsPaymentTypes from "../components/columns/PaymentTypes";
import PenaltyRulesComponent from "../components/modal/PenaltyRules.vue";
import useNotify from "src/composables/UseNotify";

/* ── Store ── */
const paymentStores = usePaymentStores();
const institutionStores = useInstitutionStores();
const { notifyError } = useNotify();

/* ── State ── */
const isEditing = ref(false);
const paymentTypes = ref([]);
const penaltyRulesChild = ref(null);
const paymentTypeSelected = ref(null);
const viewMode = ref("list");
const pagination = ref({ rowsPerPage: 10 });

/* ── Computed ── */
const institution = computed(() => institutionStores.institution);

const stats = computed(() => [
  {
    label: "Total",
    value: paymentTypes.value.length,
    icon: "payments",
    color: "#1a3fa6",
  },
  {
    label: "Com Multas",
    value: paymentTypes.value.filter((p) => p.hasPenalty).length,
    icon: "gavel",
    color: "#f57c00",
  },
  {
    label: "Sem Multas",
    value: paymentTypes.value.filter((p) => !p.hasPenalty).length,
    icon: "check_circle",
    color: "#21b573",
  },
]);

/* ── Methods ── */
const fetchPaymentTypes = async () => {
  try {
    await paymentStores.findPaymentTypes();
    paymentTypes.value = paymentStores.paymentTypes;
  } catch (error) {
    notifyError("Erro ao carregar tipos de pagamentos");
  }
};

const addPenaltyRules = (props) => {
  penaltyRulesChild.value.modalRules = true;
  paymentTypeSelected.value = props.row;
};

const editPaymentType = (row) => {
  // TODO: implementar lógica de edição
};

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

/* ── Lifecycle ── */
onMounted(() => {
  fetchPaymentTypes();
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

.cancel-btn {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #6b7280 !important;
  padding: 0 20px;
  height: 38px;
  font-weight: 600;
  transition: background 0.2s;
}
.cancel-btn:hover { background: #f3f4f6 !important; }

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
.tbl-btn-secondary { color: #6b7280 !important; }
.tbl-btn-secondary:hover { background: #f3f4f6 !important; }

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
.payment-avatar {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 12px;
}
.grid-name { font-family: "Sora", sans-serif; font-weight: 600; font-size: 0.95rem; color: #0f2862; }
.grid-info { font-size: 0.8rem; color: #9ca3af; }
.grid-card-actions { margin-top: 1rem; border-top: 1px solid #f0f4f8; padding-top: 0.8rem; }
.grid-action-btn { border-radius: 8px; font-size: 0.78rem; color: #6b7280 !important; background: #f8fafc; padding: 0 10px; }
.grid-action-primary { color: #1a3fa6 !important; background: #eff6ff !important; }

/* ── Buttons ── */
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

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .stats-row { padding: 1rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
}
</style>

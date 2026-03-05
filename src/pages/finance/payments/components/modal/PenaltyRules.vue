<template>
  <q-dialog v-model="modalRules" persistent>
    <q-card class="dialog-card">

      <!-- Dialog Header -->
      <div class="dialog-header row items-center q-px-lg q-py-md">
        <div class="dialog-header-icon q-mr-md">
          <q-icon name="gavel" size="1.1rem" color="white" />
        </div>
        <div class="col">
          <div class="dialog-title">Regras de Multa</div>
          <div class="dialog-sub">
            {{ isEditing ? (form.id ? 'Editar regra existente' : 'Criar nova regra de multa') : `${rows.length} regra(s) configurada(s)` }}
          </div>
        </div>
        <q-btn
          v-if="!isEditing"
          unelevated icon="add"
          label="Adicionar"
          class="new-btn-sm"
          no-caps
          @click="toggleEdit"
        />
        <q-btn
          v-else
          flat round dense icon="close"
          class="dialog-close-btn"
          @click="toggleEdit"
        />
      </div>

      <q-separator />

      <!-- Lista de Regras -->
      <q-card-section v-if="!isEditing" class="q-pa-none">

        <!-- Toolbar -->
        <div class="table-toolbar row items-center justify-between q-px-lg q-py-sm">
          <div class="row items-center q-gutter-xs">
            <span class="table-count">{{ rows.length }}</span>
            <span class="table-count-label">regra(s) de multa</span>
          </div>
        </div>

        <q-separator />

        <q-table
          :rows="rows"
          :columns="PenaltyRulesColumns"
          row-key="id"
          class="edigital-table"
          flat
          :pagination="{ rowsPerPage: 5 }"
        >
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat round dense icon="edit"
                class="tbl-btn tbl-btn-primary"
                @click="editPenalty(props)"
              >
                <q-tooltip>Editar Regra</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>

      </q-card-section>

      <!-- Formulário -->
      <q-card-section v-else class="q-pa-lg">

        <div class="section-label q-mb-md">
          {{ form.id ? 'Editar Regra' : 'Nova Regra de Multa' }}
        </div>

        <PenaltyRulesForm
          :payment-type-selected="paymentTypeSelected"
          :toggle-edit="toggleEdit"
          :fetch-payment-types="fetchPaymentTypes"
          :form="form"
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
                :label="form.id ? 'Actualizar' : 'Guardar'"
                icon="save"
                class="save-btn"
                no-caps
                type="submit"
              />
            </div>
          </template>
        </PenaltyRulesForm>

      </q-card-section>

      <!-- Footer -->
      <q-separator />
      <div class="dialog-footer row justify-end q-px-lg q-py-sm">
        <q-btn
          flat no-caps
          label="Fechar"
          icon="close"
          class="cancel-btn"
          v-close-popup
        />
      </div>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import PenaltyRulesForm from "../forms/PenaltyRules.vue";
import PenaltyRulesColumns from "../columns/PenaltyRules";
import { usePaymentStores } from "../../stores";

/* ── Store ── */
const paymentStores = usePaymentStores();

/* ── Props ── */
const props = defineProps({
  paymentTypeSelected: {
    type: Object,
    required: true,
  },
  fetchPaymentTypes: {
    type: Function,
    required: true,
  },
});

/* ── State ── */
const modalRules = ref(false);
const isEditing = ref(false);

const form = ref({
  daysMin: "",
  daysMax: "",
  penaltyRate: "",
});

/* ── Computed ── */
const rows = computed(() =>
  paymentStores.paymentTypes
    .filter((pt) => pt.id === props.paymentTypeSelected?.id)
    .flatMap((pt) => pt.rules ?? [])
);

/* ── Methods ── */
const editPenalty = (p) => {
  form.value = { ...p.row };
  isEditing.value = true;
};

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  form.value = { daysMin: "", daysMax: "", penaltyRate: "" };
};

/* ── Lifecycle ── */
onMounted(() => {
  props.fetchPaymentTypes();
});

/* ── Expose ── */
defineExpose({ modalRules });
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap");

/* ── Dialog ── */
.dialog-card {
  width: 700px;
  max-width: 92vw;
  border-radius: 16px !important;
  overflow: hidden;
  font-family: "DM Sans", sans-serif;
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
.dialog-sub { font-size: 0.75rem; color: #9ca3af; margin-top: 1px; }
.dialog-close-btn {
  background: #f0f4f8;
  color: #6b7280 !important;
  border-radius: 8px;
}

/* ── New Button Small ── */
.new-btn-sm {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  color: white;
  border-radius: 8px;
  padding: 0 14px;
  height: 34px;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: "Sora", sans-serif;
  transition: box-shadow 0.2s, transform 0.15s;
}
.new-btn-sm:hover {
  box-shadow: 0 4px 14px rgba(26, 63, 166, 0.35);
  transform: translateY(-1px);
}

/* ── Toolbar ── */
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
.table-count-label { font-size: 0.82rem; color: #9ca3af; }

/* ── Table ── */
.edigital-table :deep(thead tr th) {
  font-family: "Sora", sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  background: #fafbfd;
  border-bottom: 2px solid #edf0f5;
  padding: 12px 16px;
}
.edigital-table :deep(tbody tr) { transition: background 0.15s; }
.edigital-table :deep(tbody tr:hover) { background: #f5f8ff !important; }
.edigital-table :deep(tbody tr td) {
  font-size: 0.875rem;
  color: #374151;
  padding: 11px 16px;
  border-bottom: 1px solid #f3f4f6;
}

/* ── Table Buttons ── */
.tbl-btn { border-radius: 8px !important; width: 32px; height: 32px; transition: background 0.15s; }
.tbl-btn-primary { color: #1a3fa6 !important; }
.tbl-btn-primary:hover { background: #e8f0fe !important; }

/* ── Form ── */
.section-label {
  font-family: "Sora", sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
}

/* ── Buttons ── */
.cancel-btn {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #6b7280 !important;
  padding: 0 16px;
  height: 38px;
  font-weight: 600;
  transition: background 0.2s;
}
.cancel-btn:hover { background: #f3f4f6 !important; }

.save-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white !important;
  border-radius: 10px;
  padding: 0 22px;
  height: 38px;
  font-family: "Sora", sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  transition: box-shadow 0.2s, transform 0.15s;
}
.save-btn:hover {
  box-shadow: 0 6px 18px rgba(26, 63, 166, 0.35);
  transform: translateY(-1px);
}

/* ── Footer ── */
.dialog-footer { background: #fafbfd; }
</style>

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
          <q-breadcrumbs-el label="Financeiro" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Gestão de Facturas" class="breadcrumb-active" />
        </q-breadcrumbs>
        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="receipt_long" size="1.3rem" color="white" />
          </div>
          <span>Gestão de Facturas</span>
        </div>
      </div>

      <div class="col-auto">
        <q-btn
          v-if="student && classe && paymentTypeSelected"
          unelevated no-caps
          icon="receipt_long"
          label="Gerar Factura"
          class="new-btn"
          @click="generateInvoice = true"
        />
      </div>
    </div>

    <div class="q-px-xl q-pb-xl">

      <!-- ── Search Panel ── -->
      <div class="section-block q-mt-lg q-mb-lg">
        <div class="section-header-bar row items-center q-px-lg q-py-md">
          <div class="section-icon-wrap q-mr-sm">
            <q-icon name="search" size="1rem" color="white" />
          </div>
          <div>
            <div class="section-title">Pesquisa de Facturas</div>
            <div class="section-sub">Seleccione o estudante, estágio e tipo de pagamento para pesquisar</div>
          </div>
        </div>
        <q-separator />

        <div class="q-pa-lg">
          <div class="row q-col-gutter-md">

            <!-- Student -->
            <div class="col-md-4 col-sm-12 col-xs-12">
              <label class="field-label">Estudante</label>
              <q-select
                v-model="student"
                use-input hide-selected fill-input
                input-debounce="0"
                :options="options"
                @filter="filterFn"
                @update:model-value="updateStudentSelect"
                option-label="name"
                outlined dense clearable
                placeholder="Pesquisar estudante..."
                class="custom-input"
              >
                <template #prepend><q-icon name="person_search" color="primary" /></template>
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">Nenhum resultado encontrado</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <!-- Classe / Stage -->
            <div class="col-md-4 col-sm-12 col-xs-12">
              <label class="field-label">Estágio / Turma</label>
              <q-select
                v-model="classe"
                :options="stages"
                option-label="classe.name"
                option-value="classe.id"
                @update:model-value="updateClasseSelect"
                outlined dense clearable map-options
                :disable="!student"
                class="custom-input"
              >
                <template #prepend><q-icon name="class" color="primary" /></template>
                <template #selected>
                  <span v-if="classe">{{ classe.classe.name }} — {{ classe.classe.course.name }}</span>
                  <span v-else class="text-grey-5">Seleccione um estágio</span>
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

            <!-- Payment Type -->
            <div class="col-md-4 col-sm-12 col-xs-12">
              <label class="field-label">Tipo de Pagamento</label>
              <q-select
                v-model="paymentTypeSelected"
                :options="paymentTypes"
                option-label="name"
                option-value="id"
                outlined dense clearable map-options
                :disable="!classe"
                class="custom-input"
              >
                <template #prepend><q-icon name="category" color="primary" /></template>
              </q-select>
            </div>

          </div>

          <!-- Search action -->
          <div class="row justify-end q-mt-md">
            <q-btn
              unelevated no-caps
              icon="search"
              label="Pesquisar Facturas"
              class="search-btn"
              :disable="!student || !classe || !paymentTypeSelected"
              :loading="loadingInvoices"
              @click="fetchInvoices"
            >
              <template #loading><q-spinner-dots color="white" /></template>
            </q-btn>
          </div>
        </div>
      </div>

      <!-- ── Generate Invoice Panel ── -->
      <q-slide-transition>
        <div v-if="generateInvoice" class="section-block q-mb-lg">
          <div class="section-header-bar row items-center justify-between q-px-lg q-py-md">
            <div class="row items-center">
              <div class="section-icon-wrap q-mr-sm" style="background:linear-gradient(135deg,#21b573,#0d7040)">
                <q-icon name="add_circle" size="1rem" color="white" />
              </div>
              <div>
                <div class="section-title">Nova Factura</div>
                <div class="section-sub">
                  Gerar factura para
                  <strong>{{ student?.name }}</strong>
                  — {{ classe?.classe?.name }}
                </div>
              </div>
            </div>
            <q-btn flat round dense icon="close" color="grey-5" @click="generateInvoice = false">
              <q-tooltip>Fechar</q-tooltip>
            </q-btn>
          </div>

          <q-separator />

          <div class="q-pa-lg">
            <div class="row q-col-gutter-md items-end">

              <!-- Month select -->
              <div class="col-md-4 col-sm-12 col-xs-12">
                <label class="field-label">Mês de Referência</label>
                <q-select
                  v-model="selectedMonth"
                  :options="months"
                  option-label="label"
                  option-value="value"
                  outlined dense clearable map-options
                  class="custom-input"
                >
                  <template #prepend><q-icon name="calendar_month" color="positive" /></template>
                </q-select>
              </div>

              <!-- Amount preview -->
              <div class="col-md-4 col-sm-12 col-xs-12" v-if="amount">
                <div class="invoice-preview-card">
                  <div class="invoice-preview-label">Valor da Mensalidade</div>
                  <div class="invoice-preview-value">{{ formatMZN(amount) }}</div>
                </div>
              </div>

              <!-- Month preview -->
              <div class="col-md-4 col-sm-12 col-xs-12" v-if="selectedMonth">
                <div class="invoice-preview-card invoice-preview-green">
                  <div class="invoice-preview-label">Referência</div>
                  <div class="invoice-preview-value" style="color:#0d7040">
                    {{ selectedMonth.label }} / {{ year }}
                  </div>
                </div>
              </div>

            </div>

            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn flat no-caps label="Cancelar" icon="close" color="grey-6" class="cancel-btn" @click="generateInvoice = false" />
              <q-btn
                v-if="selectedMonth"
                unelevated no-caps
                icon="save"
                label="Gerar Factura"
                class="generate-btn"
                :loading="saving"
                @click="handleRowClick"
              >
                <template #loading><q-spinner-dots color="white" /></template>
              </q-btn>
            </div>
          </div>
        </div>
      </q-slide-transition>

      <!-- ── Invoices Table ── -->
      <div class="section-block">
        <div class="section-header-bar row items-center justify-between q-px-lg q-py-md">
          <div class="row items-center">
            <div class="section-icon-wrap q-mr-sm" style="background:linear-gradient(135deg,#1565c0,#0288d1)">
              <q-icon name="table_view" size="1rem" color="white" />
            </div>
            <div>
              <div class="section-title">Lista de Facturas</div>
              <div class="section-sub">
                <span v-if="invoices.length">{{ invoices.length }} factura(s) encontrada(s)</span>
                <span v-else>Pesquise para visualizar as facturas</span>
              </div>
            </div>
          </div>
          <!-- Stats pills -->
          <div class="row q-gutter-xs" v-if="invoices.length">
            <div class="stat-pill pill-pending">
              <q-icon name="pending" size="0.8rem" />
              {{ invoices.filter(i => i.status === 'Pendente').length }} Pendentes
            </div>
            <div class="stat-pill pill-paid">
              <q-icon name="check_circle" size="0.8rem" />
              {{ invoices.filter(i => i.status === 'Pago').length }} Pagas
            </div>
          </div>
        </div>

        <q-separator />

        <!-- Loading state -->
        <div v-if="loadingInvoices" class="column items-center q-pa-xl">
          <q-spinner-dots color="primary" size="2.5rem" />
          <div class="text-grey-5 q-mt-sm" style="font-size:0.85rem">A carregar facturas...</div>
        </div>

        <!-- Empty state -->
        <div v-else-if="!invoices.length" class="empty-state">
          <q-icon name="receipt_long" size="3.5rem" color="grey-3" class="q-mb-sm" />
          <div class="empty-title">Nenhuma factura encontrada</div>
          <div class="empty-sub">Pesquise por estudante, estágio e tipo de pagamento</div>
        </div>

        <!-- Table -->
        <div v-else class="q-pa-md">
          <InvoiceTable :invoices="invoices" :handle-row-click="handleRowClick" class="edigital-table" />
        </div>

      </div>

    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "src/pages/auth/store";
import { useStudentStores } from "src/pages/student/store";
import { usePaymentStores } from "../../payments/stores";
import { useInvoiceStores } from "../stores";
import useNotify from "src/composables/UseNotify";
import InvoiceTable from "../components/InvoiceTable.vue";
import * as moment from "moment";

/* ── Stores ── */
const authStore = useAuthStore();
const studentStores = useStudentStores();
const paymentStores = usePaymentStores();
const invoiceStores = useInvoiceStores();
const { notifyError, notifySuccess } = useNotify();

/* ── Data ── */
const students            = ref([]);
const student             = ref(null);
const classe              = ref(null);
const amount              = ref(null);
const options             = ref([]);
const stages              = ref([]);
const invoices            = ref([]);
const paymentTypes        = ref([]);
const paymentTypeSelected = ref(null);
const year                = ref(parseInt(new Date().getFullYear()));
const selectedMonth       = ref(null);
const generateInvoice     = ref(false);
const loadingInvoices     = ref(false);
const saving              = ref(false);

/* ── Helpers ── */
const formatMZN = (val) =>
  new Intl.NumberFormat("pt-MZ", { style: "currency", currency: "MZN" }).format(val || 0);

/* ── Months list ── */
const months = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(2025, i, 1);
  const label = date.toLocaleString("pt-BR", { month: "long" });
  return { label: label.charAt(0).toUpperCase() + label.slice(1), value: i };
});

/* ── Methods ── */
const handleRowClick = async () => {
  saving.value = true;
  const issueDate = moment({ year: year.value, month: selectedMonth.value.value, day: 1 });
  const dueDate = issueDate.clone().add(1, "month");

  const payload = {
    paymentTypeId: paymentTypeSelected.value.id,
    classId:       classe.value.classe.id,
    studentId:     student.value.id,
    issueDate:     issueDate.toDate(),
    dueDate:       dueDate.toDate(),
    month:         selectedMonth.value.label,
    amount:        parseInt(classe.value.classe.monthlyFee),
    status:        "Pendente",
    total:         parseInt(classe.value.classe.monthlyFee),
    note:          `Factura de ${paymentTypeSelected.value.name} referente ao mês de ${selectedMonth.value.label}`,
    year:          parseInt(new Date().getFullYear()),
    employeeId:    authStore.user.employeeId,
  };

  try {
    await invoiceStores.create(payload);
    await fetchInvoices();
    notifySuccess(`Factura de ${selectedMonth.value.label} gerada com sucesso!`);
    generateInvoice.value = false;
    selectedMonth.value = null;
  } catch (error) {
    notifyError(`Erro ao gerar factura de ${selectedMonth.value.label}!`);
  } finally {
    saving.value = false;
  }
};

const fetchInvoices = async () => {
  loadingInvoices.value = true;
  try {
    await invoiceStores.find({
      classId:       classe.value.classe.id,
      paymentTypeId: paymentTypeSelected.value.id,
      studentId:     student.value.id,
    });
    invoices.value = invoiceStores.invoices.invoices;
  } catch (error) {
    notifyError("Erro ao pesquisar facturas.");
  } finally {
    loadingInvoices.value = false;
  }
};

const updateStudentSelect = (val) => {
  stages.value = val?.enrollments ?? [];
  classe.value = null;
  paymentTypeSelected.value = null;
  invoices.value = [];
};

const updateClasseSelect = (val) => {
  amount.value = val?.classe?.monthlyFee ?? null;
};

const fetchStudents = async () => {
  try {
    await studentStores.list();
    students.value = studentStores.students.map((s) => ({
      id: s.id,
      name: s?.basicInformation?.fullName ?? "—",
      ...s,
    }));
    options.value = students.value;
  } catch (error) {
    notifyError("Erro ao carregar estudantes.");
  }
};

const fetchPaymentTypes = async () => {
  try {
    await paymentStores.findPaymentTypes();
    paymentTypes.value = paymentStores.paymentTypes;
  } catch (error) {
    notifyError("Erro ao carregar tipos de pagamento.");
  }
};

const filterFn = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = students.value.filter((v) =>
      v.name.toLowerCase().includes(needle)
    );
  });
};

onMounted(async () => {
  await fetchStudents();
  await fetchPaymentTypes();
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

/* ── New Button ── */
.new-btn {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  color: white;
  border-radius: 10px;
  padding: 0 18px;
  height: 38px;
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  transition: box-shadow 0.2s, transform 0.15s;
}
.new-btn:hover {
  box-shadow: 0 6px 20px rgba(26,63,166,0.35);
  transform: translateY(-1px);
}

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

/* ── Fields ── */
.field-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
}
.custom-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
}
.custom-input :deep(.q-field--focused .q-field__control:before) {
  border-color: #1a3fa6;
}

/* ── Search Button ── */
.search-btn {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  color: white;
  border-radius: 10px;
  padding: 0 22px;
  height: 40px;
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  transition: box-shadow 0.2s, transform 0.15s;
}
.search-btn:hover {
  box-shadow: 0 6px 18px rgba(26,63,166,0.3);
  transform: translateY(-1px);
}
.search-btn:disabled { opacity: 0.5; transform: none; box-shadow: none; }

/* ── Generate Button ── */
.generate-btn {
  background: linear-gradient(135deg, #21b573, #0d7040);
  color: white;
  border-radius: 10px;
  padding: 0 20px;
  height: 38px;
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  transition: box-shadow 0.2s, transform 0.15s;
}
.generate-btn:hover {
  box-shadow: 0 6px 18px rgba(33,181,115,0.35);
  transform: translateY(-1px);
}

/* ── Cancel ── */
.cancel-btn {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  height: 38px;
  padding: 0 16px;
}
.cancel-btn:hover { background: #f3f4f6; }

/* ── Invoice Preview Cards ── */
.invoice-preview-card {
  background: #f8fafc;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  padding: 0.9rem 1.1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.invoice-preview-green { background: #f0fdf4; border-color: #bbf7d0; }
.invoice-preview-label {
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}
.invoice-preview-value {
  font-family: 'Sora', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f2862;
}

/* ── Stat Pills ── */
.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}
.pill-pending { background: #fef3c7; color: #92400e; }
.pill-paid    { background: #dcfce7; color: #15803d; }

/* ── Empty State ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 2rem;
  text-align: center;
}
.empty-title {
  font-family: 'Sora', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 4px;
}
.empty-sub { font-size: 0.8rem; color: #d1d5db; }

/* ── Table ── */
.edigital-table :deep(thead tr th) {
  font-family: 'Sora', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  background: #fafbfd;
  padding: 12px 16px;
}
.edigital-table :deep(tbody tr:hover) { background: #f5f8ff !important; }
.edigital-table :deep(tbody tr td) {
  font-size: 0.875rem;
  color: #374151;
  padding: 11px 16px;
  border-bottom: 1px solid #f3f4f6;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
}
</style>

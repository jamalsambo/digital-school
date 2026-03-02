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
          <q-breadcrumbs-el label="Gestão de Recibos" class="breadcrumb-active" />
        </q-breadcrumbs>
        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="receipt_long" size="1.3rem" color="white" />
          </div>
          <span>Gestão de Recibos</span>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <q-btn flat round dense icon="refresh" color="grey-6" class="action-icon-btn" @click="onMountedRefresh">
          <q-tooltip>Actualizar Dados</q-tooltip>
        </q-btn>
        <q-chip icon="info_outline" color="blue-1" text-color="blue-9" size="sm">
          Gerir e controlar recibos emitidos
        </q-chip>
      </div>
    </div>

    <!-- ── Stats Row ── -->
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

    <div class="q-px-xl q-pb-md">

      <!-- ── Search Panel ── -->
      <q-card class="section-card q-mb-lg" flat>
        <q-card-section class="section-header row items-center q-pb-sm">
          <div class="section-icon-wrap q-mr-sm">
            <q-icon name="manage_search" size="1rem" color="white" />
          </div>
          <div>
            <div class="section-title">Filtros de Pesquisa</div>
            <div class="section-sub">Seleccione os critérios para listar as facturas</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">

            <!-- Estudante -->
            <q-select
              class="col-md-4 col-sm-12 col-xs-12"
              v-model="student"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              :options="options"
              @filter="filterFn"
              outlined dense
              label="Estudante"
              option-label="name"
              map-options
              clearable
              @update:model-value="updateStudentSelect"
            >
              <template #prepend><q-icon name="person_search" color="primary" /></template>
              <template #no-option>
                <q-item><q-item-section class="text-grey">Sem resultados</q-item-section></q-item>
              </template>
            </q-select>

            <!-- Estágio / Classe -->
            <q-select
              class="col-md-4 col-sm-12 col-xs-12"
              v-model="classe"
              :options="stages"
              label="Estágio / Classe"
              option-label="classe.name"
              option-value="classe.id"
              dense outlined map-options clearable
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

            <!-- Tipo de Pagamento -->
            <q-select
              class="col-md-4 col-sm-12 col-xs-12"
              label="Tipo de Pagamento"
              option-label="name"
              option-value="id"
              v-model="paymentTypeSelected"
              :options="paymentTypes"
              map-options outlined dense clearable
              @update:model-value="updatePaymentTypeSelect"
            >
              <template #prepend><q-icon name="category" color="primary" /></template>
            </q-select>

          </div>

          <div class="row justify-end q-mt-md">
            <q-btn
              label="Pesquisar Facturas"
              icon="search"
              color="primary"
              unelevated no-caps
              class="search-btn"
              :loading="loadingInvoices"
              :disable="!student || !classe || !paymentTypeSelected"
              @click="fetchInvoices"
            >
              <template #loading><q-spinner-dots color="white" /></template>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>

      <!-- ── Invoices Table ── -->
      <q-card class="section-card q-mb-lg" flat>
        <q-card-section class="section-header row items-center justify-between q-pb-sm">
          <div class="row items-center">
            <div class="section-icon-wrap q-mr-sm">
              <q-icon name="table_chart" size="1rem" color="white" />
            </div>
            <div>
              <div class="section-title">Facturas</div>
              <div class="section-sub">{{ invoices.length }} factura(s) encontrada(s)</div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none">
          <q-table
            :rows="invoices"
            :columns="columns"
            row-key="id"
            flat
            :loading="loadingInvoices"
            :pagination="{ rowsPerPage: 10 }"
            :grid="$q.screen.lt.md"
            class="edigital-table"
          >
            <template #loading>
              <q-inner-loading showing color="primary" />
            </template>

            <template #no-data>
              <div class="full-width column flex-center q-pa-xl text-grey-5">
                <q-icon name="receipt_long" size="4rem" class="q-mb-md" />
                <div class="text-h6 text-weight-medium">Nenhuma factura encontrada</div>
                <div class="text-caption q-mt-xs">Use os filtros acima para pesquisar facturas</div>
              </div>
            </template>

            <!-- ── Desktop Body ── -->
            <template #body="props">
              <q-tr :props="props" class="table-row">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
                <q-td auto-width>
                  <q-btn flat round dense icon="delete_outline" class="tbl-btn tbl-btn-danger" @click.stop="deleteInvoice(props.row)">
                    <q-tooltip>Remover Factura</q-tooltip>
                  </q-btn>
                </q-td>
                <q-td auto-width>
                  <q-btn flat round dense :icon="props.expand ? 'expand_less' : 'expand_more'" class="tbl-btn tbl-btn-primary" @click.stop="props.expand = !props.expand">
                    <q-tooltip>{{ props.expand ? 'Recolher' : 'Ver Detalhes' }}</q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>

              <!-- Expanded Row -->
              <q-tr v-show="props.expand" :props="props">
                <q-td colspan="100%" class="q-pa-none">
                  <div class="expanded-section">
                    <div class="row q-col-gutter-md">

                      <!-- Items -->
                      <div class="col-md-6 col-xs-12" v-if="props.row.items?.length">
                        <div class="expand-title row items-center q-mb-sm">
                          <q-icon name="list_alt" color="primary" class="q-mr-xs" />
                          Items da Factura
                        </div>
                        <q-list dense bordered class="expanded-list rounded-borders">
                          <q-item v-for="(item, idx) in props.row.items" :key="idx">
                            <q-item-section>
                              <q-item-label class="text-weight-medium">{{ formatToMZN(item.amount) }}</q-item-label>
                              <q-item-label caption>{{ item.description }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>

                      <!-- Multas -->
                      <div class="col-md-6 col-xs-12">
                        <div class="expand-title row items-center q-mb-sm">
                          <q-icon name="gavel" color="negative" class="q-mr-xs" />
                          Multas Aplicadas
                        </div>
                        <q-list dense bordered class="expanded-list rounded-borders" v-if="props.row.penalties?.length">
                          <q-item v-for="(fine, idx) in props.row.penalties" :key="idx">
                            <q-item-section>
                              <q-item-label class="text-weight-medium">{{ formatToMZN(fine.amount) }}</q-item-label>
                              <q-item-label caption>{{ fine.paymentNote }}</q-item-label>
                              <q-item-label caption>{{ formatDate(fine?.createdAt) }}</q-item-label>
                              <q-item-label caption>
                                <q-chip :color="fine?.status ? 'positive' : 'negative'" text-color="white" size="xs" dense>
                                  {{ fine?.status ? 'Paga' : 'Não Paga' }}
                                </q-chip>
                              </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-btn flat round dense icon="delete_outline" color="negative" size="sm" @click.stop="deletePenalty(props.row.id, fine.id)">
                                <q-tooltip>Remover Multa</q-tooltip>
                              </q-btn>
                            </q-item-section>
                          </q-item>
                        </q-list>
                        <div v-else class="text-caption text-grey-5 q-pa-sm">Nenhuma multa aplicada</div>
                      </div>

                    </div>
                  </div>
                </q-td>
              </q-tr>
            </template>

            <!-- ── Mobile Card ── -->
            <template #item="props">
              <q-card class="mobile-card q-mb-sm col-xs-12" bordered flat>
                <q-card-section>
                  <div v-for="col in props.cols" :key="col.name" class="q-mb-xs">
                    <div class="text-caption text-grey-6 text-weight-bold">{{ col.label }}</div>
                    <div class="text-body2 text-grey-9">{{ col.value }}</div>
                  </div>
                  <div class="row q-gutter-sm q-mt-sm">
                    <q-btn flat dense round icon="delete_outline" color="negative" @click.stop="deleteInvoice(props.row)" />
                    <q-btn flat dense round :icon="props.expand ? 'expand_less' : 'expand_more'" color="primary" @click.stop="props.expand = !props.expand" />
                  </div>
                </q-card-section>
                <q-slide-transition>
                  <div v-show="props.expand" class="expanded-section q-pa-md">
                    <div v-if="props.row.items?.length" class="q-mb-md">
                      <div class="expand-title q-mb-sm"><q-icon name="list_alt" color="primary" class="q-mr-xs" />Items da Factura</div>
                      <q-list dense bordered class="rounded-borders">
                        <q-item v-for="(item, idx) in props.row.items" :key="idx">
                          <q-item-section>
                            <q-item-label>{{ formatToMZN(item.amount) }}</q-item-label>
                            <q-item-label caption>{{ item.description }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                    <div v-if="props.row.penalties?.length">
                      <div class="expand-title q-mb-sm"><q-icon name="gavel" color="negative" class="q-mr-xs" />Multas</div>
                      <q-list dense bordered class="rounded-borders">
                        <q-item v-for="(fine, idx) in props.row.penalties" :key="idx">
                          <q-item-section>
                            <q-item-label>{{ formatToMZN(fine.amount) }}</q-item-label>
                            <q-item-label caption>{{ fine.paymentNote }} · {{ formatDate(fine?.createdAt) }}</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-btn flat round dense icon="delete_outline" color="negative" size="sm" @click.stop="deletePenalty(props.row.id, fine.id)" />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </div>
                </q-slide-transition>
              </q-card>
            </template>

            <!-- ── Footer Summary ── -->
            <template #bottom>
              <div class="summary-footer full-width">
                <div class="summary-grid">
                  <div class="summary-item">
                    <span class="summary-label">Total Facturas</span>
                    <span class="summary-value">{{ summary?.totalInvoices ?? '—' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Total Items</span>
                    <span class="summary-value">{{ summary?.totalItems ?? '—' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Total Multas</span>
                    <span class="summary-value text-negative">{{ summary?.totalPenalties ?? '—' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Sub Total</span>
                    <span class="summary-value">{{ summary?.totalOriginal ?? '—' }}</span>
                  </div>
                  <div class="summary-item summary-total">
                    <span class="summary-label">Total Geral</span>
                    <span class="summary-value-big">{{ summary?.totalFinal ?? '—' }}</span>
                  </div>
                </div>
              </div>
            </template>

          </q-table>
        </q-card-section>
      </q-card>

      <!-- ── Payment Panel ── -->
      <q-card class="section-card q-mb-xl" flat v-if="invoices.length > 0">
        <q-card-section class="section-header row items-center q-pb-sm">
          <div class="section-icon-wrap q-mr-sm" style="background: linear-gradient(135deg,#21b573,#0d7040)">
            <q-icon name="payments" size="1rem" color="white" />
          </div>
          <div>
            <div class="section-title">Método de Pagamento</div>
            <div class="section-sub">Seleccione o método e confirme o pagamento</div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md items-end">

            <q-select
              class="col-md-5 col-sm-12 col-xs-12"
              label="Método de Pagamento *"
              v-model="method"
              :options="['Mpesa','eMola','mKesh','Numerário','Depósito Bancário','Cartão Bancário','Cheque Bancário','Transferência']"
              outlined dense clearable required
            >
              <template #prepend><q-icon name="account_balance_wallet" color="primary" /></template>
            </q-select>

            <q-input
              class="col-md-4 col-sm-12 col-xs-12"
              label="Número do Documento"
              v-model="code"
              outlined dense
            >
              <template #prepend><q-icon name="tag" color="primary" /></template>
            </q-input>

            <div class="col-auto row q-gutter-sm" v-if="method">
              <q-btn
                label="Pagar"
                icon="check_circle"
                color="positive"
                unelevated no-caps
                class="pay-btn"
                :loading="paying"
                @click="handlePaid"
              >
                <template #loading><q-spinner-dots color="white" /></template>
              </q-btn>
              <q-btn
                label="Pagar e Imprimir"
                icon="print"
                color="primary"
                unelevated no-caps
                class="pay-btn"
                :loading="printing"
                @click="handlePaidPrint"
              >
                <template #loading><q-spinner-dots color="white" /></template>
              </q-btn>
            </div>

          </div>

          <!-- Totals Summary -->
          <div class="totals-strip q-mt-lg row q-gutter-md" v-if="invoices.length">
            <div class="total-pill">
              <span class="total-pill-label">Mensalidades</span>
              <span class="total-pill-value">{{ formatToMZN(totalMonthFees) }}</span>
            </div>
            <div class="total-pill">
              <span class="total-pill-label">Multas</span>
              <span class="total-pill-value text-negative">{{ formatToMZN(totalPenalty) }}</span>
            </div>
            <div class="total-pill total-pill-main">
              <span class="total-pill-label">Total a Pagar</span>
              <span class="total-pill-value-big">{{ formatToMZN(totalPayments) }}</span>
            </div>
          </div>
        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "src/pages/auth/store";
import { useStudentStores } from "src/pages/student/store";
import { usePaymentStores } from "../../payments/stores";
import { useInvoiceStores } from "../../invoice/stores";
import { useReceiptStores } from "../stores";
import columns from "../components/InvoiceColumns";
import useNotify from "src/composables/UseNotify";
import scripts from "src/composables/Scripts";
import { useRouter } from "vue-router";

/* ── Router & Stores ── */
const router = useRouter();
const authStore = useAuthStore();
const studentStores = useStudentStores();
const paymentStores = usePaymentStores();
const invoiceStores = useInvoiceStores();
const receiptStores = useReceiptStores();
const { notifyError, notifySuccess } = useNotify();
const { formatDate, formatToMZN } = scripts();

/* ── Data ── */
const students = ref([]);
const student = ref(null);
const classe = ref(null);
const options = ref([]);
const stages = ref([]);
const invoices = ref([]);
const paymentTypes = ref([]);
const paymentTypeSelected = ref(null);
const code = ref(null);
const method = ref(null);
const receipt = ref(null);
const paymentTypeFind = ref(null);
const summary = ref(null);

/* ── UI State ── */
const loadingInvoices = ref(false);
const paying = ref(false);
const printing = ref(false);

/* ── Computed ── */
const stats = computed(() => [
  { label: "Total Facturas",  value: invoices.value.length,                                          icon: "receipt_long",   color: "#1a3fa6" },
  { label: "Pendentes",       value: invoices.value.filter(i => i.status === "Pendente").length,     icon: "pending_actions", color: "#f57c00" },
  { label: "Parciais",        value: invoices.value.filter(i => i.status === "Parcial").length,      icon: "incomplete_circle", color: "#7b1fa2" },
  { label: "Total a Pagar",   value: formatToMZN(totalPayments.value),                               icon: "payments",       color: "#21b573" },
]);

const totalMonthFees = computed(() =>
  invoices.value
    .filter(v => v.status === "Pendente")
    .reduce((acc, v) => acc + parseFloat(v.total || 0), 0)
);

const totalPenalty = computed(() =>
  invoices.value.reduce((acc, v) => {
    const pen = v.penalts?.reduce((s, p) => s + parseFloat(p.amount || 0), 0) || 0;
    return acc + pen;
  }, 0)
);

const totalPayments = computed(() =>
  parseFloat(totalMonthFees.value) + parseFloat(totalPenalty.value)
);

/* ── Methods ── */
const fetchInvoices = async () => {
  loadingInvoices.value = true;
  try {
    await invoiceStores.find({
      classId: classe.value.classe.id,
      paymentTypeId: paymentTypeSelected.value.id,
      studentId: student.value.id,
    });
    invoices.value = invoiceStores.invoices.invoices.filter(v =>
      ["Pendente", "Parcial"].includes(v.status)
    );
    summary.value = invoiceStores.invoices.summary;
  } catch (error) {
    notifyError("Erro ao buscar facturas.");
  } finally {
    loadingInvoices.value = false;
  }
};

const handlePaid = async () => {
  paying.value = true;
  try {
    const payload = {
      transactionCode: code.value || "",
      paymentMethod: method.value,
      studentId: student.value.id,
      note: "",
      institutionId: authStore.user.institutionId,
    };
    const invoice = invoices.value.map(inv => ({
      id: inv.id,
      originalTotal: inv.originalTotal,
      items: inv.items,
      penalties: inv.penalties,
    }));
    await receiptStores.create({ receiptData: payload, invoice });
    receipt.value = receiptStores.receipt;
    if (!receipt.value) {
      notifyError("Ocorreu um erro no pagamento da factura.");
      return;
    }
    notifySuccess("Pagamento efectuado com sucesso!");
  } catch (error) {
    notifyError("Erro ao realizar o pagamento.");
  } finally {
    paying.value = false;
  }
};

const handlePaidPrint = async () => {
  printing.value = true;
  try {
    await handlePaid();
    if (receipt.value) {
      router.push({ name: "print-receipt", params: { receiptId: receipt.value } });
    }
  } finally {
    printing.value = false;
  }
};

const deleteInvoice = (invoice) => {
  invoices.value = invoices.value.filter(i => i.id !== invoice.id);
};

const deletePenalty = (invoiceId, penaltyId) => {
  const invoice = invoices.value.find(inv => inv.id === invoiceId);
  if (!invoice) return;
  invoice.penalts = invoice.penalts?.filter(p => p.id !== penaltyId);
};

const updateStudentSelect = (val) => {
  stages.value = val?.enrollments ?? [];
  classe.value = null;
};

const updatePaymentTypeSelect = () => {
  paymentTypeFind.value = paymentTypes.value.find(p => p.name === "Mensalidade");
};

const filterFn = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = students.value.filter(v => v.name.toLowerCase().includes(needle));
  });
};

const fetchStudents = async () => {
  try {
    await studentStores.list();
    students.value = studentStores.students.map(s => ({
      id: s.id,
      name: s?.basicInformation?.fullName ?? "—",
      ...s,
    }));
    options.value = students.value;
  } catch (error) {
    notifyError("Erro ao buscar estudantes.");
  }
};

const fetchPaymentTypes = async () => {
  try {
    await paymentStores.findPaymentTypes();
    paymentTypes.value = paymentStores.paymentTypes;
  } catch (error) {
    notifyError("Erro ao carregar os tipos de pagamento.");
  }
};

const onMountedRefresh = async () => {
  await fetchStudents();
  await fetchPaymentTypes();
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
  font-size: 1.4rem;
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

/* ── Section Cards ── */
.section-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(15,40,98,0.07);
  border: 1px solid #edf0f5;
  background: white;
}
.section-header { background: #fafbfd; }
.section-icon-wrap {
  width: 30px; height: 30px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.section-title {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #0f2862;
}
.section-sub { font-size: 0.75rem; color: #9ca3af; }

/* ── Search Button ── */
.search-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white;
  border-radius: 10px;
  padding: 0 20px;
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
.tbl-btn { border-radius: 8px !important; width: 30px; height: 30px; }
.tbl-btn-primary { color: #1a3fa6 !important; }
.tbl-btn-primary:hover { background: #e8f0fe !important; }
.tbl-btn-danger { color: #dc2626 !important; }
.tbl-btn-danger:hover { background: #fee2e2 !important; }

/* ── Expanded Row ── */
.expanded-section {
  background: #f8fafc;
  border-top: 2px solid #edf0f5;
  padding: 1.2rem 1.5rem;
}
.expand-title {
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  color: #374151;
}
.expanded-list { background: white; border-radius: 8px; }

/* ── Summary Footer ── */
.summary-footer {
  background: #f8fafc;
  border-top: 2px solid #edf0f5;
  padding: 1rem 1.5rem;
}
.summary-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: flex-end;
  align-items: center;
}
.summary-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}
.summary-label {
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.summary-value {
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  color: #0f2862;
}
.summary-total { border-left: 2px solid #edf0f5; padding-left: 1.5rem; }
.summary-value-big {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 1.2rem;
  color: #1a3fa6;
}

/* ── Mobile Card ── */
.mobile-card { border-radius: 12px; }

/* ── Payment Section ── */
.pay-btn {
  border-radius: 10px;
  padding: 0 18px;
  height: 40px;
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  transition: box-shadow 0.2s, transform 0.15s;
}
.pay-btn:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.15); transform: translateY(-1px); }

/* ── Totals Strip ── */
.totals-strip { flex-wrap: wrap; }
.total-pill {
  background: #f8fafc;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  padding: 0.7rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 130px;
}
.total-pill-main {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border: none;
}
.total-pill-label {
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.total-pill-main .total-pill-label { color: rgba(255,255,255,0.7); }
.total-pill-value {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: #0f2862;
}
.total-pill-value-big {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 1.2rem;
  color: white;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .stats-row { padding: 1rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
  .summary-grid { justify-content: flex-start; }
}
</style>

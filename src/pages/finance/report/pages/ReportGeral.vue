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
          <q-breadcrumbs-el label="Relatório Financeiro" class="breadcrumb-active" />
        </q-breadcrumbs>
        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="insert_chart" size="1.3rem" color="white" />
          </div>
          <span>Relatório Financeiro</span>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <q-chip icon="event_note" color="blue-1" text-color="blue-9" size="sm" dense>
          Período: {{ formatPeriod(startDate, endDate) }}
        </q-chip>
      </div>
    </div>

    <div class="q-px-xl q-pb-xl">

      <!-- ── Filter Panel ── -->
      <div class="section-block q-mt-lg q-mb-lg">
        <div class="section-header-bar row items-center q-px-lg q-py-md">
          <div class="section-icon-wrap q-mr-sm">
            <q-icon name="tune" size="1rem" color="white" />
          </div>
          <div>
            <div class="section-title">Filtro de Período</div>
            <div class="section-sub">Seleccione o intervalo de datas para gerar o relatório</div>
          </div>
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-md items-end">

            <!-- Start Date -->
            <div class="col-md-4 col-sm-12 col-xs-12">
              <label class="field-label">Data de Início</label>
              <q-input
                v-model="startDate"
                mask="####-##-##"
                outlined dense
                color="primary"
                placeholder="AAAA-MM-DD"
                class="custom-input"
              >
                <template #prepend>
                  <q-icon name="event_available" color="primary" />
                </template>
                <template #append>
                  <q-icon name="calendar_month" class="cursor-pointer" color="grey-5">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="startDate" mask="YYYY-MM-DD" color="primary" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <!-- End Date -->
            <div class="col-md-4 col-sm-12 col-xs-12">
              <label class="field-label">Data de Fim</label>
              <q-input
                v-model="endDate"
                mask="####-##-##"
                outlined dense
                color="primary"
                placeholder="AAAA-MM-DD"
                class="custom-input"
              >
                <template #prepend>
                  <q-icon name="event_busy" color="primary" />
                </template>
                <template #append>
                  <q-icon name="calendar_month" class="cursor-pointer" color="grey-5">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="endDate" mask="YYYY-MM-DD" color="primary" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <!-- Quick Filters -->
            <div class="col-md-4 col-sm-12 col-xs-12 row q-gutter-sm items-center">
              <q-btn
                flat dense no-caps size="sm"
                label="Este mês"
                class="quick-filter-btn"
                @click="setThisMonth"
              />
              <q-btn
                flat dense no-caps size="sm"
                label="Este ano"
                class="quick-filter-btn"
                @click="setThisYear"
              />
              <q-btn
                flat dense no-caps size="sm"
                label="Mês passado"
                class="quick-filter-btn"
                @click="setLastMonth"
              />
            </div>
          </div>

          <div class="row justify-end q-mt-md">
            <q-btn
              label="Gerar Relatório"
              icon="analytics"
              unelevated no-caps
              class="generate-btn"
              :loading="loading"
              @click="gerarRelatorio"
            >
              <template #loading><q-spinner-dots color="white" /></template>
            </q-btn>
          </div>
        </q-card-section>
      </div>

      <!-- ── KPI Cards ── -->
      <div class="q-mb-lg">
        <div class="subsection-label q-mb-md">Resumo do Período</div>

        <div class="kpi-grid">

          <!-- Receitas -->
          <div class="kpi-card">
            <div class="kpi-accent" style="background:linear-gradient(90deg,#21b573,#16a34a)"></div>
            <div class="kpi-header">
              <div class="kpi-icon-wrap" style="background:rgba(33,181,115,0.12)">
                <q-icon name="trending_up" size="1.3rem" style="color:#21b573" />
              </div>
              <div class="kpi-badge kpi-badge-green">Receita</div>
            </div>
            <div class="kpi-value" style="color:#0d7040">
              {{ formatToMZN(report?.paidAmountPayment || 0) }}
            </div>
            <div class="kpi-label">Receitas Totais</div>
            <div class="kpi-footer kpi-footer-green">
              <q-icon name="arrow_upward" size="0.85rem" />
              <span>Entradas no período</span>
            </div>
          </div>

          <!-- Despesas -->
          <div class="kpi-card">
            <div class="kpi-accent" style="background:linear-gradient(90deg,#dc2626,#ef4444)"></div>
            <div class="kpi-header">
              <div class="kpi-icon-wrap" style="background:rgba(220,38,38,0.10)">
                <q-icon name="trending_down" size="1.3rem" style="color:#dc2626" />
              </div>
              <div class="kpi-badge kpi-badge-red">Despesa</div>
            </div>
            <div class="kpi-value" style="color:#b91c1c">
              {{ formatToMZN(report?.amoutExpenses || 0) }}
            </div>
            <div class="kpi-label">Despesas Totais</div>
            <div class="kpi-footer kpi-footer-red">
              <q-icon name="arrow_downward" size="0.85rem" />
              <span>Saídas no período</span>
            </div>
          </div>

          <!-- Saldo -->
          <div class="kpi-card kpi-card-highlight">
            <div class="kpi-accent" :style="`background:linear-gradient(90deg,${saldo >= 0 ? '#1a3fa6,#0288d1' : '#dc2626,#ef4444'})`"></div>
            <div class="kpi-header">
              <div class="kpi-icon-wrap" style="background:rgba(26,63,166,0.12)">
                <q-icon name="account_balance" size="1.3rem" style="color:#1a3fa6" />
              </div>
              <div class="kpi-badge kpi-badge-blue">Saldo</div>
            </div>
            <div class="kpi-value" :style="`color:${saldo >= 0 ? '#0f2862' : '#b91c1c'}`">
              {{ formatToMZN(saldo) }}
            </div>
            <div class="kpi-label">Saldo do Período</div>
            <div class="kpi-footer" :class="saldo >= 0 ? 'kpi-footer-blue' : 'kpi-footer-red'">
              <q-icon :name="saldo >= 0 ? 'check_circle' : 'warning_amber'" size="0.85rem" />
              <span>{{ saldo >= 0 ? 'Resultado positivo' : 'Resultado negativo' }}</span>
            </div>
          </div>

        </div>
      </div>

      <!-- ── Visual Balance Bar ── -->
      <div class="section-block q-mb-lg" v-if="report?.paidAmountPayment || report?.amoutExpenses">
        <div class="section-header-bar row items-center q-px-lg q-py-md">
          <div class="section-icon-wrap q-mr-sm" style="background:linear-gradient(135deg,#1565c0,#0288d1)">
            <q-icon name="equalizer" size="1rem" color="white" />
          </div>
          <div>
            <div class="section-title">Balanço Visual</div>
            <div class="section-sub">Proporção entre receitas e despesas no período</div>
          </div>
        </div>
        <q-separator />
        <div class="q-pa-lg">
          <div class="balance-bar-wrap">
            <div class="balance-bar">
              <div
                class="balance-fill balance-income"
                :style="`width:${incomePercent}%`"
              >
                <span v-if="incomePercent > 12">{{ incomePercent.toFixed(0) }}%</span>
              </div>
              <div
                class="balance-fill balance-expense"
                :style="`width:${expensePercent}%`"
              >
                <span v-if="expensePercent > 12">{{ expensePercent.toFixed(0) }}%</span>
              </div>
            </div>
          </div>
          <div class="balance-legend row q-gutter-md q-mt-md">
            <div class="legend-item">
              <div class="legend-dot" style="background:#21b573"></div>
              <span>Receitas — {{ formatToMZN(report?.paidAmountPayment || 0) }}</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot" style="background:#dc2626"></div>
              <span>Despesas — {{ formatToMZN(report?.amoutExpenses || 0) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Empty State ── -->
      <div v-if="!report?.paidAmountPayment && !report?.amoutExpenses && !loading" class="empty-state">
        <q-icon name="insert_chart_outlined" size="4rem" color="grey-4" class="q-mb-md" />
        <div class="empty-title">Sem dados para o período seleccionado</div>
        <div class="empty-sub">Ajuste as datas e clique em "Gerar Relatório"</div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useFinanceReportStores } from "../stores";
import Card from "src/components/dashboard/Card.vue";
import scripts from "src/composables/Scripts";

/* ── Stores ── */
const financeReportStores = useFinanceReportStores();
const { formatToMZN } = scripts();

/* ── Date Helpers ── */
const currentDate = new Date();
const year  = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day   = String(currentDate.getDate()).padStart(2, "0");

/* ── Data ── */
const report    = ref({});
const loading   = ref(false);
const startDate = ref(`${year}-${month}-01`);
const endDate   = ref(`${year}-${month}-${day}`);

/* ── Computed ── */
const saldo = computed(() =>
  (report.value?.paidAmountPayment || 0) - (report.value?.amoutExpenses || 0)
);

const totalFlow = computed(() =>
  (report.value?.paidAmountPayment || 0) + (report.value?.amoutExpenses || 0)
);

const incomePercent = computed(() =>
  totalFlow.value ? ((report.value?.paidAmountPayment || 0) / totalFlow.value) * 100 : 0
);

const expensePercent = computed(() =>
  totalFlow.value ? ((report.value?.amoutExpenses || 0) / totalFlow.value) * 100 : 0
);

/* ── Helpers ── */
const formatPeriod = (start, end) => {
  if (!start || !end) return "—";
  const fmt = (d) => new Date(d).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
  return `${fmt(start)} → ${fmt(end)}`;
};

const setThisMonth = () => {
  startDate.value = `${year}-${month}-01`;
  endDate.value   = `${year}-${month}-${day}`;
};

const setThisYear = () => {
  startDate.value = `${year}-01-01`;
  endDate.value   = `${year}-12-31`;
};

const setLastMonth = () => {
  const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  startDate.value = `${d.getFullYear()}-${m}-01`;
  endDate.value   = `${d.getFullYear()}-${m}-${String(lastDay).padStart(2, "0")}`;
};

/* ── Fetch ── */
const gerarRelatorio = async () => {
  loading.value = true;
  try {
    await financeReportStores.findFinanceReport(startDate.value, endDate.value);
    report.value = financeReportStores.report;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(gerarRelatorio);
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
  letter-spacing: 0.02em;
}
.custom-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
}
.custom-input :deep(.q-field--focused .q-field__control:before) {
  border-color: #1a3fa6;
}

/* ── Quick Filters ── */
.quick-filter-btn {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280 !important;
  font-size: 0.75rem;
  background: white;
  padding: 0 10px;
  height: 30px;
  transition: border-color 0.2s, color 0.2s;
}
.quick-filter-btn:hover {
  border-color: #1a3fa6;
  color: #1a3fa6 !important;
  background: #eff6ff;
}

/* ── Generate Button ── */
.generate-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white;
  border-radius: 10px;
  padding: 0 24px;
  height: 42px;
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  transition: box-shadow 0.2s, transform 0.15s;
}
.generate-btn:hover {
  box-shadow: 0 6px 20px rgba(26,63,166,0.35);
  transform: translateY(-1px);
}

/* ── Subsection Label ── */
.subsection-label {
  font-family: 'Sora', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9ca3af;
}

/* ── KPI Grid ── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.kpi-card {
  background: white;
  border-radius: 16px;
  padding: 1.4rem;
  border: 1px solid #edf0f5;
  box-shadow: 0 2px 16px rgba(15,40,98,0.06);
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.15s;
}
.kpi-card:hover {
  box-shadow: 0 8px 28px rgba(15,40,98,0.12);
  transform: translateY(-2px);
}
.kpi-card-highlight {
  border: 1.5px solid #c7d7f5;
  background: linear-gradient(160deg, #f8faff 0%, #ffffff 100%);
}

.kpi-accent {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  border-radius: 16px 16px 0 0;
}

.kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.kpi-icon-wrap {
  width: 42px; height: 42px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.kpi-badge {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 20px;
}
.kpi-badge-green { background: #dcfce7; color: #15803d; }
.kpi-badge-red   { background: #fee2e2; color: #b91c1c; }
.kpi-badge-blue  { background: #dbeafe; color: #1d4ed8; }

.kpi-value {
  font-family: 'Sora', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}
.kpi-label {
  font-size: 0.8rem;
  color: #9ca3af;
  font-weight: 500;
  margin-bottom: 1rem;
}
.kpi-footer {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 8px;
}
.kpi-footer-green { background: #f0fdf4; color: #15803d; }
.kpi-footer-red   { background: #fff5f5; color: #b91c1c; }
.kpi-footer-blue  { background: #eff6ff; color: #1d4ed8; }

/* ── Balance Bar ── */
.balance-bar-wrap { width: 100%; }
.balance-bar {
  height: 36px;
  border-radius: 12px;
  overflow: hidden;
  background: #f0f4f8;
  display: flex;
}
.balance-fill {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Sora', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  color: white;
  transition: width 0.8s ease;
}
.balance-income  { background: linear-gradient(90deg, #21b573, #16a34a); }
.balance-expense { background: linear-gradient(90deg, #dc2626, #ef4444); }

.balance-legend { flex-wrap: wrap; }
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: #374151;
  font-weight: 500;
}
.legend-dot {
  width: 10px; height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

/* ── Empty State ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}
.empty-title {
  font-family: 'Sora', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 4px;
}
.empty-sub { font-size: 0.82rem; color: #d1d5db; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
  .kpi-grid { grid-template-columns: 1fr; }
}
@media (min-width: 769px) and (max-width: 1024px) {
  .kpi-grid { grid-template-columns: 1fr 1fr; }
}
</style>

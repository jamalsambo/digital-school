<template>
  <q-page class="dash-page">

    <!-- ═══════════════════════════════════════
         HERO BANNER
    ═══════════════════════════════════════ -->
    <div class="hero-banner">
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="hero-orb hero-orb-3"></div>

      <div class="hero-content q-px-xl row items-center justify-between">
        <div class="hero-left">
          <div class="hero-badge">
            <q-icon name="school" size="0.9rem" />
            Ano Lectivo {{ new Date().getFullYear() }}
          </div>
          <h1 class="hero-title">
            Bem-vindo,<br />
            <span class="hero-name">{{ institutionStores?.institution?.name || 'E-Digital' }}</span>
          </h1>
          <p class="hero-subtitle">
            Painel de controlo institucional · {{ formatDate(new Date()) }}
          </p>
        </div>

        <div class="hero-right row q-gutter-md">
          <div class="hero-stat-pill" v-if="authStore.hasViewStudents">
            <q-icon name="people" size="1.1rem" color="white" />
            <div>
              <div class="pill-value">{{ studentSummary?.totalStudents ?? '—' }}</div>
              <div class="pill-label">Estudantes</div>
            </div>
          </div>
          <div class="hero-stat-pill" v-if="authStore.hasViewEmployees">
            <q-icon name="badge" size="1.1rem" color="white" />
            <div>
              <div class="pill-value">{{ employeeCount ?? '—' }}</div>
              <div class="pill-label">Professores</div>
            </div>
          </div>
          <div class="hero-stat-pill" v-if="authStore.hasViewStudents">
            <q-icon name="how_to_reg" size="1.1rem" color="white" />
            <div>
              <div class="pill-value">{{ studentActive?.total ?? '—' }}</div>
              <div class="pill-label">Activos</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════
         EMPLOYEE / ADMIN DASHBOARD
    ══════════════════════════════════════ -->
    <div v-if="authStore.isEmployee && !authStore.isTeacher" class="q-px-xl q-pb-xl">

      <!-- Quick Links -->
      <div class="q-mb-xl">
        <div class="subsection-label q-mb-md">Atalhos Rápidos</div>
        <div class="quick-links-grid">

          <div class="quick-card" @click="goTo('students')">
            <div class="qc-icon-wrap" style="background:linear-gradient(135deg,#1a3fa6,#0f2862)">
              <q-icon name="group_add" size="1.5rem" color="white" />
            </div>
            <div class="qc-label">Cadastrar Aluno</div>
            <q-icon name="arrow_forward_ios" size="0.75rem" color="grey-5" class="qc-arrow" />
          </div>

          <div class="quick-card" @click="goTo('student-reports')">
            <div class="qc-icon-wrap" style="background:linear-gradient(135deg,#7b1fa2,#4a148c)">
              <q-icon name="assessment" size="1.5rem" color="white" />
            </div>
            <div class="qc-label">Relatório de Alunos</div>
            <q-icon name="arrow_forward_ios" size="0.75rem" color="grey-5" class="qc-arrow" />
          </div>

          <div class="quick-card" v-if="authStore.hasViewReceipts" @click="goTo('invoices')">
            <div class="qc-icon-wrap" style="background:linear-gradient(135deg,#21b573,#0d7040)">
              <q-icon name="receipt_long" size="1.5rem" color="white" />
            </div>
            <div class="qc-label">Gerar Factura</div>
            <q-icon name="arrow_forward_ios" size="0.75rem" color="grey-5" class="qc-arrow" />
          </div>

          <div class="quick-card" v-if="authStore.hasViewInvoices" @click="goTo('receipts')">
            <div class="qc-icon-wrap" style="background:linear-gradient(135deg,#f57c00,#e65100)">
              <q-icon name="receipt" size="1.5rem" color="white" />
            </div>
            <div class="qc-label">Emitir Recibo</div>
            <q-icon name="arrow_forward_ios" size="0.75rem" color="grey-5" class="qc-arrow" />
          </div>

        </div>
      </div>

      <!-- Financial KPIs -->
      <div class="q-mb-xl" v-if="authStore.hasViewGlobalPayments">
        <div class="subsection-label q-mb-md">Resumo Financeiro</div>
        <div class="kpi-grid">

          <div class="kpi-card kpi-blue">
            <div class="kpi-header">
              <div class="kpi-icon-wrap">
                <q-icon name="payments" size="1.2rem" color="white" />
              </div>
              <span class="kpi-trend up">
                <q-icon name="trending_up" size="0.9rem" />
              </span>
            </div>
            <div class="kpi-value">{{ formatToMZN(financialSummary?.totalPaidAmount || 0) }}</div>
            <div class="kpi-label">Total de Pagamentos</div>
            <div class="kpi-bar"><div class="kpi-bar-fill" style="width:100%;background:#1a3fa6"></div></div>
          </div>

          <div class="kpi-card kpi-green">
            <div class="kpi-header">
              <div class="kpi-icon-wrap" style="background:rgba(33,181,115,0.15)">
                <q-icon name="attach_money" size="1.2rem" color="white" style="color:#21b573!important" />
              </div>
              <span class="kpi-trend up" style="color:#21b573;background:#dcfce7">
                <q-icon name="trending_up" size="0.9rem" />
              </span>
            </div>
            <div class="kpi-value" style="color:#0d7040">{{ formatToMZN(financialSummary?.successfulPayments?.amount || 0) }}</div>
            <div class="kpi-label">Pagamentos Realizados</div>
            <div class="kpi-bar"><div class="kpi-bar-fill" style="width:75%;background:#21b573"></div></div>
          </div>

          <div class="kpi-card kpi-red">
            <div class="kpi-header">
              <div class="kpi-icon-wrap" style="background:rgba(220,38,38,0.12)">
                <q-icon name="credit_card_off" size="1.2rem" style="color:#dc2626!important" />
              </div>
              <span class="kpi-trend down">
                <q-icon name="trending_down" size="0.9rem" />
              </span>
            </div>
            <div class="kpi-value" style="color:#b91c1c">{{ formatToMZN(financialSummary?.overduePayments?.amount || 0) }}</div>
            <div class="kpi-label">Pagamentos Atrasados</div>
            <div class="kpi-bar"><div class="kpi-bar-fill" style="width:30%;background:#dc2626"></div></div>
          </div>

          <div class="kpi-card kpi-yellow">
            <div class="kpi-header">
              <div class="kpi-icon-wrap" style="background:rgba(217,119,6,0.12)">
                <q-icon name="pending_actions" size="1.2rem" style="color:#d97706!important" />
              </div>
              <span class="kpi-trend neutral" style="color:#d97706;background:#fef3c7">
                <q-icon name="remove" size="0.9rem" />
              </span>
            </div>
            <div class="kpi-value" style="color:#92400e">{{ formatToMZN(financialSummary?.parcialPayments?.amount || 0) }}</div>
            <div class="kpi-label">Pagamentos Parciais</div>
            <div class="kpi-bar"><div class="kpi-bar-fill" style="width:45%;background:#d97706"></div></div>
          </div>

        </div>
      </div>

      <!-- Annual + Daily -->
      <div class="q-mb-xl" v-if="authStore?.hasViewPaymentsYear || authStore?.hasViewExpensesYear">
        <div class="subsection-label q-mb-md">Análise Anual</div>
        <div class="row q-col-gutter-md">
          <div class="col-md-6 col-xs-12" v-if="authStore?.hasViewPaymentsYear">
            <div class="flow-card flow-in">
              <div class="flow-icon-wrap">
                <q-icon name="south_west" size="1.2rem" color="white" />
              </div>
              <div>
                <div class="flow-label">Entradas este ano</div>
                <div class="flow-value">{{ formatToMZN(financialSummary?.paymentsPaidYear?.amount || 0) }}</div>
              </div>
              <div class="flow-badge flow-badge-in">Receita</div>
            </div>
          </div>
          <div class="col-md-6 col-xs-12" v-if="authStore?.hasViewExpensesYear">
            <div class="flow-card flow-out">
              <div class="flow-icon-wrap" style="background:rgba(220,38,38,0.15)">
                <q-icon name="north_east" size="1.2rem" style="color:#dc2626!important" />
              </div>
              <div>
                <div class="flow-label">Despesas este ano</div>
                <div class="flow-value" style="color:#b91c1c">{{ totalExpenses }}</div>
              </div>
              <div class="flow-badge flow-badge-out">Despesa</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Today + Month mini stats -->
      <div class="q-mb-xl" v-if="authStore?.hasViewPaymentsDay || authStore?.hasViewPaymentsMonth || authStore?.hasViewExpensesDay || authStore?.hasViewExpensesMonth">
        <div class="subsection-label q-mb-md">Movimentos do Período</div>
        <div class="mini-grid">

          <div class="mini-card" v-if="authStore?.hasViewPaymentsDay">
            <div class="mini-icon mini-in"><q-icon name="today" size="1rem" color="white" /></div>
            <div class="mini-label">A receber hoje</div>
            <div class="mini-value">{{ formatToMZN(financialSummary?.paymentsPaidToday?.amount || 0) }}</div>
          </div>

          <div class="mini-card" v-if="authStore.hasViewPaymentsMonth">
            <div class="mini-icon mini-in"><q-icon name="calendar_month" size="1rem" color="white" /></div>
            <div class="mini-label">A receber este mês</div>
            <div class="mini-value">{{ formatToMZN(financialSummary?.paymentsPaidThisMonth?.amount || 0) }}</div>
          </div>

          <div class="mini-card" v-if="authStore?.hasViewExpensesDay">
            <div class="mini-icon mini-out"><q-icon name="today" size="1rem" color="white" /></div>
            <div class="mini-label">A pagar hoje</div>
            <div class="mini-value mini-red">{{ totalExpensesToday }}</div>
          </div>

          <div class="mini-card" v-if="authStore?.hasViewExpensesMonth">
            <div class="mini-icon mini-out"><q-icon name="calendar_month" size="1rem" color="white" /></div>
            <div class="mini-label">A pagar este mês</div>
            <div class="mini-value mini-red">{{ totalExpensesMonth }}</div>
          </div>

        </div>
      </div>

      <!-- Late payments -->
      <div class="q-mb-xl" v-if="authStore?.hasViewPaymentsLate || authStore?.hasViewExpensesLate">
        <div class="subsection-label q-mb-md">Atrasos do Mês</div>
        <div class="row q-col-gutter-md">
          <div class="col-md-6 col-xs-12" v-if="authStore?.hasViewPaymentsLate">
            <div class="late-card late-blue">
              <div class="late-icon"><q-icon name="schedule_send" size="1.3rem" color="white" /></div>
              <div>
                <div class="late-title">Pagamentos em atraso do mês</div>
                <div class="late-value">{{ formatToMZN(financialSummary?.paymentsDueThisMonth?.amount || 0) }}</div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-xs-12" v-if="authStore?.hasViewExpensesLate">
            <div class="late-card late-red">
              <div class="late-icon" style="background:rgba(220,38,38,0.15)"><q-icon name="warning_amber" size="1.3rem" color="negative" /></div>
              <div>
                <div class="late-title">Despesas em atraso do mês</div>
                <div class="late-value" style="color:#b91c1c">{{ totalExpensesMonthLate }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div v-if="authStore?.hasViewGlobalPayments">
        <div class="subsection-label q-mb-md">Análise Gráfica</div>
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-md-6 col-xs-12">
            <div class="chart-card">
              <div class="chart-card-header">
                <div class="chart-card-title">Comparação Anual de Pagamentos</div>
                <q-icon name="bar_chart" color="primary" />
              </div>
              <q-separator class="q-mb-md" />
              <ComparativeYearPaymentsChart :yearly-comparison="yearlyComparison" />
            </div>
          </div>
          <div class="col-md-6 col-xs-12">
            <div class="chart-card">
              <div class="chart-card-header">
                <div class="chart-card-title">Pagamentos Diários</div>
                <q-icon name="show_chart" color="primary" />
              </div>
              <q-separator class="q-mb-md" />
              <DailyPaymentsChart :daily-payments="dailyPayments" />
            </div>
          </div>
        </div>
        <div class="chart-card q-mb-lg">
          <div class="chart-card-header">
            <div class="chart-card-title">Evolução Mensal de Pagamentos</div>
            <q-icon name="timeline" color="primary" />
          </div>
          <q-separator class="q-mb-md" />
          <InteractiveLinePieChart :monthly-payments="yearlyComparison?.currentYear.monthlyPayments" />
        </div>
      </div>

    </div>

    <!-- ══════════════════════════════════════
         TEACHER DASHBOARD
    ══════════════════════════════════════ -->
    <div v-if="user?.userType === 'Funcionario' && user?.teacher.toLowerCase() === 'sim'" class="q-px-xl q-pb-xl">
      <TeachearDash />
    </div>

    <!-- ══════════════════════════════════════
         STUDENT DASHBOARD
    ══════════════════════════════════════ -->
    <div v-if="authStore?.isStudent" class="q-px-xl q-pb-xl">
      <StudantDash />
    </div>

    <!-- ══════════════════════════════════════
         GUARDIAN DASHBOARD
    ══════════════════════════════════════ -->
    <div v-if="authStore?.isGuardian" class="q-px-xl q-pb-xl">
      <GuardianDash />
    </div>

  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useExpenseStores } from "./finance/expense/store";
import { useEmployeeStores } from "src/pages/employee/stores";
import { useInstitutionStores } from "src/pages/institution/store";
import { useDashboardStores } from "./dashboard/store";
import Card from "src/components/dashboard/Card.vue";
import SubCard from "src/components/dashboard/Sub-Card.vue";
import InOutCard from "src/components/dashboard/InOut-Card.vue";
import Teachers from "src/components/dashboard/Teachers.vue";
import scripts from "src/composables/Scripts";
import useNotify from "src/composables/UseNotify";
import { useAuthStore } from "src/pages/auth/store";
import TeachearDash from "./TeachearDash.vue";
import StudantDash from "./StudentDash.vue";
import GuardianDash from "./GuardianDash.vue";
import teacherImg from "src/assets/teacher.png";
import studentImg from "src/assets/student.png";
import { useRouter } from "vue-router";
import DailyPaymentsChart from "./dashboard/components/DailyPaymentsChart.vue";
import ComparativeYearPaymentsChart from "./dashboard/components/ComparativeYearPaymentsChart.vue";
import InteractiveLinePieChart from "./dashboard/components/InteractiveLinePieChart.vue";

/* ── Router & Stores ── */
const router = useRouter();
const authStore = useAuthStore();
const institutionStores = useInstitutionStores();
const expensesStores = useExpenseStores();
const employeeStores = useEmployeeStores();
const dashboardStores = useDashboardStores();

const { formatToMZN } = scripts();
const { notifyError } = useNotify();

/* ── Data ── */
const user = computed(() => authStore.user);
const expenses = ref([]);
const currentDate = new Date();
const employeeCount = ref(0);
const dailyPayments = ref([]);
const yearlyComparison = ref(null);
const studentSummary = ref(null);
const financialSummary = ref(null);
const studentActive = ref(null);

/* ── Helpers ── */
const formatDate = (d) => d.toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/* ── Computed Expenses ── */
const totalExpenses = computed(() =>
  formatToMZN(
    expenses.value
      .filter(e => new Date(e.date).getFullYear() === currentDate.getFullYear() && e.status === "Pago")
      .reduce((acc, e) => acc + parseInt(e.amount), 0)
  )
);

const totalExpensesToday = computed(() =>
  formatToMZN(
    expenses.value
      .filter(e => new Date(e.date).toDateString() === currentDate.toDateString() && e.status === "Pago")
      .reduce((acc, e) => acc + parseInt(e.amount), 0)
  )
);

const totalExpensesMonth = computed(() =>
  formatToMZN(
    expenses.value
      .filter(e =>
        new Date(e.date).getFullYear() === currentDate.getFullYear() &&
        new Date(e.date).getMonth() === currentDate.getMonth() &&
        e.status === "Pago"
      )
      .reduce((acc, e) => acc + parseInt(e.amount), 0)
  )
);

const totalExpensesMonthLate = computed(() =>
  formatToMZN(
    expenses.value
      .filter(e =>
        new Date(e.date).getFullYear() === currentDate.getFullYear() &&
        new Date(e.date).getMonth() === currentDate.getMonth() &&
        e.status === "Atrasado"
      )
      .reduce((acc, e) => acc + parseInt(e.amount), 0)
  )
);

/* ── Navigation ── */
const goTo = (route) => {
  router.push({ name: route, params: { institutionId: user.value.institutionId } });
};

/* ── Fetch ── */
const fetchExpenses = async () => {
  try {
    await expensesStores.findAll();
    expenses.value = expensesStores.expenses;
  } catch (error) {
    notifyError("Erro ao buscar despesas.");
  }
};

const fetchData = async () => {
  try {
    if (authStore.isEmployee && !authStore.isTeacher) {
      await dashboardStores.getStudentStatusSummary();
      studentSummary.value = dashboardStores.studentStatusSummary;
      studentActive.value = studentSummary.value?.byStatus?.find(f => f.status === "Activo");

      await dashboardStores.getFinancialSummary();
      financialSummary.value = dashboardStores.financialSummary;
    }
  } catch (error) {
    notifyError("Erro ao carregar dados do dashboard.");
  }
};

onMounted(async () => {
  await fetchData();
  await fetchExpenses();
  await employeeStores.count();
  employeeCount.value = employeeStores.employeeCount;
  yearlyComparison.value = financialSummary.value?.yearlyComparison;
  dailyPayments.value = financialSummary.value?.dailyPayments ?? [];
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

/* ════════════════════════════════════
   BASE
════════════════════════════════════ */
.dash-page {
  min-height: 100vh;
  background: #eef2f7;
  font-family: 'DM Sans', sans-serif;
}

/* ════════════════════════════════════
   HERO BANNER
════════════════════════════════════ */
.hero-banner {
  background: linear-gradient(130deg, #0a1f5c 0%, #1a3fa6 45%, #1565c0 75%, #0288d1 100%);
  padding: 2.5rem 3rem;
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 8px 40px rgba(10,31,92,0.3);
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.hero-orb-1 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
  top: -120px; right: 10%;
}
.hero-orb-2 {
  width: 250px; height: 250px;
  background: radial-gradient(circle, rgba(2,136,209,0.2) 0%, transparent 70%);
  bottom: -80px; left: 30%;
}
.hero-orb-3 {
  width: 160px; height: 160px;
  border: 1.5px solid rgba(255,255,255,0.08);
  bottom: 20px; right: 5%;
}

.hero-content { position: relative; z-index: 2; flex-wrap: wrap; gap: 1.5rem; }

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.9);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.hero-title {
  font-family: 'Sora', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  color: rgba(255,255,255,0.6);
  margin: 0 0 0.5rem 0;
  line-height: 1.1;
  letter-spacing: -1px;
}
.hero-name {
  color: #ffffff;
  display: block;
}
.hero-subtitle {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.55);
  margin: 0;
  text-transform: capitalize;
}

.hero-right { flex-wrap: wrap; }
.hero-stat-pill {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  backdrop-filter: blur(8px);
  border-radius: 14px;
  padding: 0.8rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 110px;
  transition: background 0.2s;
}
.hero-stat-pill:hover { background: rgba(255,255,255,0.16); }
.pill-value {
  font-family: 'Sora', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}
.pill-label {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.6);
  margin-top: 2px;
  font-weight: 500;
}

/* ════════════════════════════════════
   SECTION LABELS
════════════════════════════════════ */
.subsection-label {
  font-family: 'Sora', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9ca3af;
}

/* ════════════════════════════════════
   QUICK LINKS
════════════════════════════════════ */
.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.9rem;
}

.quick-card {
  background: white;
  border-radius: 14px;
  padding: 1.1rem 1.2rem;
  border: 1px solid #edf0f5;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(15,40,98,0.05);
  transition: box-shadow 0.2s, transform 0.15s, border-color 0.2s;
  position: relative;
}
.quick-card:hover {
  box-shadow: 0 8px 28px rgba(15,40,98,0.13);
  transform: translateY(-2px);
  border-color: #c7d7f5;
}
.qc-icon-wrap {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.qc-label {
  font-family: 'Sora', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  flex: 1;
}
.qc-arrow {
  opacity: 0.4;
  transition: opacity 0.2s, transform 0.2s;
}
.quick-card:hover .qc-arrow {
  opacity: 0.8;
  transform: translateX(3px);
}

/* ════════════════════════════════════
   KPI CARDS
════════════════════════════════════ */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.kpi-card {
  background: white;
  border-radius: 16px;
  padding: 1.3rem;
  border: 1px solid #edf0f5;
  box-shadow: 0 2px 16px rgba(15,40,98,0.06);
  transition: box-shadow 0.2s, transform 0.15s;
  position: relative;
  overflow: hidden;
}
.kpi-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
}
.kpi-blue::before { background: linear-gradient(90deg, #1a3fa6, #0288d1); }
.kpi-green::before { background: linear-gradient(90deg, #21b573, #16a34a); }
.kpi-red::before { background: linear-gradient(90deg, #dc2626, #ef4444); }
.kpi-yellow::before { background: linear-gradient(90deg, #d97706, #f59e0b); }

.kpi-card:hover {
  box-shadow: 0 8px 28px rgba(15,40,98,0.12);
  transform: translateY(-2px);
}

.kpi-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.kpi-icon-wrap {
  width: 38px; height: 38px;
  border-radius: 10px;
  background: rgba(26,63,166,0.12);
  display: flex; align-items: center; justify-content: center;
}
.kpi-trend {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
  display: flex; align-items: center; gap: 2px;
}
.kpi-trend.up { color: #15803d; background: #dcfce7; }
.kpi-trend.down { color: #b91c1c; background: #fee2e2; }
.kpi-trend.neutral { color: #92400e; background: #fef3c7; }

.kpi-value {
  font-family: 'Sora', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f2862;
  line-height: 1;
  margin-bottom: 4px;
}
.kpi-label {
  font-size: 0.78rem;
  color: #9ca3af;
  font-weight: 500;
  margin-bottom: 1rem;
}
.kpi-bar {
  height: 4px;
  background: #f0f4f8;
  border-radius: 4px;
  overflow: hidden;
}
.kpi-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease;
}

/* ════════════════════════════════════
   FLOW CARDS (Annual)
════════════════════════════════════ */
.flow-card {
  background: white;
  border-radius: 16px;
  padding: 1.3rem 1.5rem;
  border: 1px solid #edf0f5;
  box-shadow: 0 2px 16px rgba(15,40,98,0.06);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}
.flow-card:hover { box-shadow: 0 6px 24px rgba(15,40,98,0.12); }
.flow-icon-wrap {
  width: 48px; height: 48px;
  border-radius: 14px;
  background: rgba(33,181,115,0.12);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.flow-label { font-size: 0.8rem; color: #9ca3af; font-weight: 500; margin-bottom: 2px; }
.flow-value { font-family: 'Sora', sans-serif; font-size: 1.4rem; font-weight: 700; color: #0d7040; }
.flow-out .flow-value { color: #b91c1c; }
.flow-badge {
  margin-left: auto;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 20px;
}
.flow-badge-in { background: #dcfce7; color: #15803d; }
.flow-badge-out { background: #fee2e2; color: #b91c1c; }

/* ════════════════════════════════════
   MINI CARDS
════════════════════════════════════ */
.mini-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.9rem;
}
.mini-card {
  background: white;
  border-radius: 14px;
  padding: 1.1rem;
  border: 1px solid #edf0f5;
  box-shadow: 0 2px 12px rgba(15,40,98,0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: box-shadow 0.2s, transform 0.15s;
}
.mini-card:hover { box-shadow: 0 6px 20px rgba(15,40,98,0.10); transform: translateY(-2px); }
.mini-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.mini-in { background: linear-gradient(135deg, #21b573, #0d7040); }
.mini-out { background: linear-gradient(135deg, #dc2626, #991b1b); }
.mini-label { font-size: 0.78rem; color: #9ca3af; font-weight: 500; }
.mini-value {
  font-family: 'Sora', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f2862;
}
.mini-red { color: #b91c1c; }

/* ════════════════════════════════════
   LATE CARDS
════════════════════════════════════ */
.late-card {
  background: white;
  border-radius: 16px;
  padding: 1.3rem 1.5rem;
  border: 1px solid #edf0f5;
  box-shadow: 0 2px 16px rgba(15,40,98,0.06);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: box-shadow 0.2s;
}
.late-card:hover { box-shadow: 0 6px 24px rgba(15,40,98,0.12); }
.late-icon {
  width: 48px; height: 48px;
  border-radius: 14px;
  background: rgba(26,63,166,0.10);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.late-title { font-size: 0.82rem; color: #9ca3af; font-weight: 500; margin-bottom: 4px; }
.late-value { font-family: 'Sora', sans-serif; font-size: 1.4rem; font-weight: 700; color: #0f2862; }
.late-red .late-value { color: #b91c1c; }

/* ════════════════════════════════════
   CHART CARDS
════════════════════════════════════ */
.chart-card {
  background: white;
  border-radius: 16px;
  padding: 1.3rem 1.5rem;
  border: 1px solid #edf0f5;
  box-shadow: 0 2px 16px rgba(15,40,98,0.06);
  margin-bottom: 1rem;
  transition: box-shadow 0.2s;
}
.chart-card:hover { box-shadow: 0 6px 24px rgba(15,40,98,0.10); }
.chart-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}
.chart-card-title {
  font-family: 'Sora', sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  color: #0f2862;
}

/* ════════════════════════════════════
   RESPONSIVE
════════════════════════════════════ */
@media (max-width: 768px) {
  .hero-banner { padding: 1.8rem 1.2rem; }
  .hero-title { font-size: 1.6rem; }
  .hero-right { display: none; }
  .dash-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
  .kpi-grid, .quick-links-grid, .mini-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 480px) {
  .kpi-grid, .quick-links-grid, .mini-grid { grid-template-columns: 1fr; }
}
</style>

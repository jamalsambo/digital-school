<template>
  <q-page padding>
    <div
      class="bg-white text-dark shadow-sm q-pa-md row justify-between items-center"
    >
      <div class="text-bold text-primary">
        {{ institutionStores?.institution?.name }}
      </div>

      <div class="text-bold text-primary row items-center">
        <span>Ano lectivo {{ new Date().getFullYear() }}</span>
        <q-icon name="school" size="20px" class="q-ml-sm text-primary" />
      </div>
    </div>
    <div v-if="authStore.isEmployee && !authStore.isTeacher">
      <div class="quick-links-container q-mt-md">
        <q-card flat class="quick-links">
          <q-card-section class="text-center">
            <div class="text-h6 text-weight-bold">Atalhos Rápidos</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row justify-around">
            <q-btn unelevated class="quick-link" @click="goTo('students')">
              <q-icon name="group_add" size="md" />
              <span>Cadastrar Novo Aluno</span>
            </q-btn>
            <q-btn
              unelevated
              class="quick-link"
              @click="goTo('student-reports')"
            >
              <q-icon name="assignment" size="md" />
              <span>Relatório de Alunos</span>
            </q-btn>
            <q-btn
              unelevated
              class="quick-link"
              @click="goTo('invoices')"
              v-if="authStore.hasViewReceipts"
            >
              <q-icon name="receipt_long" size="md" />
              <span>Gerar Fatura</span>
            </q-btn>
            <q-btn
              unelevated
              class="quick-link"
              @click="goTo('receipts')"
              v-if="authStore.hasViewInvoices"
            >
              <q-icon name="receipt" size="md" />
              <span>Emitir Recibo</span>
            </q-btn>
          </q-card-section>
        </q-card>
      </div>

      <div class="row q-col-gutter-x-md q-mt-lg">
        <div
          class="col-md-4 col-sm-12 col-xs-12"
          v-if="authStore.hasViewEmployees"
        >
          <Teachers
            :item="{
              title: 'Professores',
              value: employeeCount,
              color1: '#17a2b8',
              color2: '#17a2c1',
              img: teacherImg,
            }"
          />
        </div>
        <div
          class="col-md-4 col-sm-12 col-xs-12"
          v-if="authStore.hasViewStudents"
        >
          <Teachers
            :item="{
              title: 'Estudantes',
              value: studentSummary?.totalStudents,
              color1: '#17a2b8',
              color2: '#17a2c1',
              img: studentImg,
            }"
          />
        </div>
        <div
          class="col-md-4 col-sm-12 col-xs-12"
          v-if="authStore.hasViewStudents"
        >
          <Teachers
            :item="{
              title: 'Estudantes activos',
              value: studentActive?.total,
              color1: '#17a2b8',
              color2: '#17a2c1',
              img: studentImg,
            }"
          />
        </div>
      </div>
      <div
        class="row q-col-gutter-x-md q-mt-lg"
        v-if="
          authStore.hasViewGlobalPayments &&
          authStore.hasViewGlobalPayments &&
          authStore.hasViewGlobalPayments
        "
      >
        <div
          class="col-md-3 col-sm-12 col-xs-12"
          v-if="authStore.hasViewGlobalPayments"
        >
          <Card
            :item="{
              title: 'Total de pagamentos',
              icon: 'payments',
              value: formatToMZN(financialSummary?.totalPaidAmount || 0),
              color1: '#20c999',
              color2: '#20c991',
            }"
          />
        </div>
        <div
          class="col-md-3 col-sm-12 col-xs-12"
          v-if="authStore.hasViewGlobalPayments"
        >
          <Card
            :item="{
              title: 'Pagamentos realizados',
              icon: 'attach_money',
              value: formatToMZN(
                financialSummary?.successfulPayments?.amount || 0
              ),
              color1: '#28a745',
              color2: '#28a745',
            }"
          />
        </div>
        <div
          class="col-md-3 col-sm-12 col-xs-12"
          v-if="authStore.hasViewGlobalPayments"
        >
          <Card
            :item="{
              title: 'Pagamentos atrasados',
              icon: 'credit_card_off',
              value: formatToMZN(
                financialSummary?.overduePayments?.amount || 0
              ),
              color1: '#dc3545',
              color2: '#dc3545',
            }"
          />
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12">
          <Card
            :item="{
              title: 'Pagamentos parcias',
              icon: 'credit_card_off',
              value: formatToMZN(
                financialSummary?.parcialPayments?.amount || 0
              ),
              color1: '#DAA520',
              color2: '#DAA520',
            }"
          />
        </div>
      </div>
      <div class="row q-col-gutter-x-md q-mt-lg">
        <div
          class="col-md-6 col-sm-12 col-xs-12"
          v-if="authStore?.hasViewPaymentsYear"
        >
          <Card
            :item="{
              title: 'Entradas realizadas este ano',
              icon: 'payments',
              value: formatToMZN(
                financialSummary?.paymentsPaidYear?.amount || 0
              ),
              color1: '#17a2b8',
              color2: '#17a2b8',
            }"
          />
        </div>
        <div
          class="col-md-6 col-sm-12 col-xs-12"
          v-if="authStore?.hasViewExpensesYear"
        >
          <Card
            :item="{
              title: 'Despesas realizadas este ano',
              icon: 'payments',
              value: totalExpenses,
              color1: '#17a2b8',
              color2: '#17a2b8',
            }"
          />
        </div>
      </div>
      <div class="row q-col-gutter-x-md q-mt-lg">
        <div
          class="col-md-3 col-sm-12 col-xs-12"
          v-if="authStore?.hasViewPaymentsDay"
        >
          <SubCard
            :item="{
              title: 'A receber hoje',
              value: formatToMZN(
                financialSummary?.paymentsPaidToday?.amount || 0
              ),
              color1: '#007bff',
              color2: '#1e90ff',
              icon: 'south_west',
            }"
          />
        </div>
        <div
          class="col-md-3 col-sm-12 col-xs-12"
          v-if="authStore.hasViewPaymentsMonth"
        >
          <SubCard
            :item="{
              title: 'A receber este mes',
              value: formatToMZN(
                financialSummary?.paymentsPaidThisMonth?.amount || 0
              ),
              color1: '#007bff',
              color2: '#1e90ff',
              icon: 'south_west',
            }"
          />
        </div>
        <div
          class="col-md-3 col-sm-12 col-xs-12"
          v-if="authStore?.hasViewExpensesDay"
        >
          <SubCard
            :item="{
              title: 'A pagar hoje',
              value: totalExpensesToday,
              color1: '#dc3545',
              color2: '#dc3545',
              icon: 'north_east',
            }"
          />
        </div>
        <div
          class="col-md-3 col-sm-12 col-xs-12"
          v-if="authStore?.hasViewExpensesMonth"
        >
          <SubCard
            :item="{
              title: 'A pagar este mes',
              value: totalExpensesMonth,
              color1: '#dc3545',
              color2: '#dc3545',
              icon: 'north_east',
            }"
          />
        </div>
      </div>
      <div class="row q-col-gutter-x-md q-mt-lg">
        <div
          class="col-md-6 col-sm-12 col-xs-12"
          v-if="authStore?.hasViewPaymentsLate"
        >
          <InOutCard
            :item="{
              title: 'Pagamentos em atraso do mes',
              value: formatToMZN(
                financialSummary?.paymentsDueThisMonth?.amount || 0
              ),
              color1: '#008080',
              color2: '#28a745',
            }"
          />
        </div>
        <div
          class="col-md-6 col-sm-12 col-xs-12"
          v-if="authStore?.hasViewExpensesLate"
        >
          <InOutCard
            :item="{
              title: 'Despensas em atraso do mes',
              value: totalExpensesMonthLate,
              color1: 'red',
              color2: '#28a745',
            }"
          />
        </div>
      </div>
      <!-- Graficos de barras anuais e diarios -->
      <div
        class="row q-col-gutter-x-md q-mt-lg"
        v-if="authStore?.hasViewGlobalPayments"
      >
        <div
          class="col-md-6 col-sm-12 col-xs-12"
          v-if="authStore?.hasViewGlobalPayments"
        >
          <!-- Grafico de comparacao de ano actual e anterior -->
          <q-card>
            <q-card-section>
              <ComparativeYearPaymentsChart
                :yearly-comparison="yearlyComparison"
              />
            </q-card-section>
          </q-card>
        </div>
        <div
          class="col-md-6 col-sm-12 col-xs-12"
          v-if="authStore?.hasViewGlobalPayments"
        >
          <q-card>
            <q-card-section>
              <DailyPaymentsChart :daily-payments="dailyPayments" />
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div
        class="row q-col-gutter-x-md q-mt-lg"
        v-if="authStore?.hasViewGlobalPayments"
      >
        <InteractiveLinePieChart
          :monthly-payments="yearlyComparison?.currentYear.monthlyPayments"
        />
      </div>

      <!-- <div class="row q-col-gutter-x-md q-mt-lg">
        <div class="col-md-6 col-sm-12 col-xs-12">
          <q-card class="col-5 q-pa-md">
            <div class="row justify-between items-center">
              <div class="text-bold">Activities & Events</div>
              <q-btn outline rounded color="green" label="View All" size="sm" />
            </div>

            <q-separator class="q-my-sm" />

            <q-list bordered>
              <q-item v-for="(event, index) in events" :key="index" clickable>
                <q-item-section>
                  <q-item-label class="text-primary">{{ event }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
        <div
          class="row q-gutter-md justify-center col-md-6 col-sm-12 col-xs-12"
        >
          <q-card
            v-for="(student, index) in ranking"
            :key="index"
            class="col-3 q-pa-md text-center shadow-2"
            :style="{
              backgroundColor: student.bgColor,
              color: 'white',
              borderRadius: '12px',
            }"
          >
            <q-icon name="account_circle" size="50px" class="q-mb-sm" />
            <div class="text-bold">{{ student.name }}</div>
            <div class="text-h6">{{ student.score }}%</div>
            <q-chip
              :color="student.badgeColor"
              text-color="white"
              class="q-mt-sm"
            >
              {{ student.rank }}
            </q-chip>
          </q-card>
        </div>
      </div> -->

      <!-- <div class="row q-col-gutter-x-md q-mt-lg">
        <div class="col-md-12 col-sm-12 col-xs-12">
          <q-card class="q-pa-md">
            <q-card-section>
              <div class="text-h6 text-center">Divisão de alunos por curso</div>
            </q-card-section>
            <q-card-section>
              <canvas ref="chartCanvas"></canvas>
            </q-card-section>
          </q-card>
        </div>
      </div> -->
    </div>

    <div
      v-if="
        user?.userType === 'Funcionario' &&
        user?.teacher.toLowerCase() === 'sim'
      "
    >
      <TeachearDash />
    </div>

    <div v-if="authStore?.isStudent">
      <StudantDash />
    </div>

    <div v-if="authStore?.isGuardian">
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

const router = useRouter();

/* use store */
const authStore = useAuthStore();
const institutionStores = useInstitutionStores();
const expensesStores = useExpenseStores();
const employeeStores = useEmployeeStores();

const dashboardStores = useDashboardStores();

const { formatToMZN } = scripts();
const { notifyError } = useNotify();

/* use data */
const user = computed(() => authStore.user);
const expenses = ref([]);
const currentDate = new Date();
const employeeCount = ref(0);
const dailyPayments = ref([]);
const yearlyComparison = ref(null);

/* computed */

const totalExpenses = computed(() =>
  formatToMZN(
    expenses.value
      .filter(
        (expense) =>
          new Date(expense.date).getFullYear() === new Date().getFullYear() &&
          expense.status === "Pago"
      ) // Filtro
      .reduce((acc, value) => acc + parseInt(value.amount), 0)
  )
);

const totalExpensesToday = computed(() =>
  formatToMZN(
    expenses.value
      .filter(
        (expense) =>
          new Date(expense.date) === currentDate && expense.status === "Pago"
      ) // Filtro
      .reduce((acc, value) => acc + parseInt(value.amount), 0)
  )
);

const totalExpensesMonth = computed(() =>
  formatToMZN(
    expenses.value
      .filter(
        (expense) =>
          new Date(expense.date).getFullYear() === currentDate.getFullYear() &&
          new Date(expense.date).getMonth() === currentDate.getMonth() &&
          expense.status === "Pago"
      ) // Filtro
      .reduce((acc, value) => acc + parseInt(value.amount), 0)
  )
);

const totalExpensesMonthLate = computed(() =>
  formatToMZN(
    expenses.value
      .filter(
        (expense) =>
          new Date(expense.date).getFullYear() === currentDate.getFullYear() &&
          new Date(expense.date).getMonth() === currentDate.getMonth() &&
          expense.status === "Atrasado"
      ) // Filtro
      .reduce((acc, value) => acc + parseInt(value.amount), 0)
  )
);

const goTo = (route) => {
  router.push({
    name: route,
    params: { institutionId: user.value.institutionId },
  });
};
/* fetch data */
const fetchExpenses = async () => {
  try {
    await expensesStores.findAll();
    expenses.value = expensesStores.expenses;
  } catch (error) {
    notifyError("Erro ao buscar despesas");
  }
};

const studentSummary = ref();
const financialSummary = ref();
const studentActive = ref(0);

const fetchData = async () => {
  try {
    if (authStore.isEmployee && !authStore.isTeacher) {
      await dashboardStores.getStudentStatusSummary();
      studentSummary.value = dashboardStores.studentStatusSummary;
      studentActive.value = studentSummary.value.byStatus.find(
        (f) => f.status === "Activo"
      );

      await dashboardStores.getFinancialSummary();
      financialSummary.value = dashboardStores.financialSummary;
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchData();
  await fetchExpenses();

  await employeeStores.count();
  employeeCount.value = employeeStores.employeeCount;

  yearlyComparison.value = financialSummary.value?.yearlyComparison;
  dailyPayments.value = financialSummary.value.dailyPayments;
});
</script>
<style scoped>
.text-primary {
  color: #2c1e5d;
}
canvas {
  height: 300px;
}
.quick-links-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.quick-links {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 10px;
  width: 80%;
}

.quick-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 10px;
  border-radius: 10px;
  width: 160px;
  height: 80px;
  text-transform: none;
}
.quick-link span {
  font-size: 14px;
  margin-top: 5px;
}
</style>

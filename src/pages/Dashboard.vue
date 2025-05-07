<template>
  <q-page padding>
    <div
      class="bg-white text-dark shadow-sm q-pa-md row justify-between items-center"
    >
      <div class="text-bold text-primary">
        Bem vindo a Escola Sedundaria geral
      </div>

      <div class="text-bold text-primary row items-center">
        <span>Ano lectivo {{ new Date().getFullYear() }}</span>
        <q-icon name="school" size="20px" class="q-ml-sm text-primary" />
      </div>
    </div>

    <div v-if="userStores.isEmployee &&  !userStores.isTeacher">
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
            <q-btn unelevated class="quick-link" @click="goTo('invoices')" v-if="userStores.hasViewReceipts">
              <q-icon name="receipt_long" size="md" />
              <span>Gerar Fatura</span>
            </q-btn>
            <q-btn unelevated class="quick-link" @click="goTo('receipts')" v-if="userStores.hasViewInvoices">
              <q-icon name="receipt" size="md" />
              <span>Emitir Recibo</span>
            </q-btn>
          </q-card-section>
        </q-card>
      </div>

      <div class="row q-col-gutter-x-md q-mt-lg">
        <div class="col-md-4 col-sm-12 col-xs-12"
        v-if="userStores.hasViewEmployees"
        >
          <Teachers
            :item="{
              title: 'Professores',
              value: employees?.length,
              color1: '#17a2b8',
              color2: '#17a2c1',
              img: teacherImg,
            }"
          />
        </div>
        <div class="col-md-4 col-sm-12 col-xs-12"
          v-if="userStores.hasViewStudents"
        >
          <Teachers
            :item="{
              title: 'Estudantes',
              value: students?.length,
              color1: '#17a2b8',
              color2: '#17a2c1',
              img: studentImg,
            }"
          />
        </div>
        <div class="col-md-4 col-sm-12 col-xs-12"
         v-if="userStores.hasViewStudents"
        >
          <Teachers
            :item="{
              title: 'Estudantes activos',
              value: students?.length,
              color1: '#17a2b8',
              color2: '#17a2c1',
              img: studentImg,
            }"
          />
        </div>
      </div>
      <div class="row q-col-gutter-x-md q-mt-lg"
      v-if="userStores.hasViewGlobalPayments &&  userStores.hasViewGlobalPayments && userStores.hasViewGlobalPayments"
      >
        <div class="col-md-3 col-sm-12 col-xs-12" v-if="userStores.hasViewGlobalPayments">
          <Card :item="itemTotalPayment" />
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12" v-if="userStores.hasViewGlobalPayments">
          <Card :item="itemTotalPaymentDone" />
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12" v-if="userStores.hasViewGlobalPayments">
          <Card :item="itemTotalPaymentLate" />
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12">
          <Card :item="itemUsers" />
        </div>
      </div>
      <div class="row q-col-gutter-x-md q-mt-lg">
        <div class="col-md-6 col-sm-12 col-xs-12" v-if="userStores.hasViewPaymentsYear">
          <Card :item="itemPaymentToYear" />
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12" v-if="userStores.hasViewExpensesYear">
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
        <div class="col-md-3 col-sm-12 col-xs-12" v-if="userStores.hasViewPaymentsDay">
          <SubCard
            :item="{
              title: 'A receber hoje',
              value: totalPaymentsToday,
              color1: '#007bff',
              color2: '#1e90ff',
              icon: 'south_west',
            }"
          />
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12" v-if="userStores.hasViewPaymentsMonth">
          <SubCard
            :item="{
              title: 'A receber este mes',
              value: totalPaymentsMonth,
              color1: '#007bff',
              color2: '#1e90ff',
              icon: 'south_west',
            }"
          />
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12" v-if="userStores.hasViewExpensesDay">
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
        <div class="col-md-3 col-sm-12 col-xs-12" v-if="userStores.hasViewExpensesMonth">
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
        <div class="col-md-6 col-sm-12 col-xs-12" v-if="userStores.hasViewPaymentsLate">
          <InOutCard
            :item="{
              title: 'Pagamentos em atraso do mes',
              value: totalPaymentsLateMonth,
              color1: '#008080',
              color2: '#28a745',
            }"
          />
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12" v-if="userStores.hasViewExpensesLate">
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
      <div class="row q-col-gutter-x-md q-mt-lg"  v-if="userStores.hasViewGlobalPayments">
        <div class="col-md-6 col-sm-12 col-xs-12" v-if="userStores.hasViewGlobalPayments">
          <!-- Grafico de comparacao de ano actual e anterior -->
          <q-card>
            <q-card-section>
              <canvas ref="chartReportTwoYear"></canvas>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12" v-if="userStores.hasViewGlobalPayments">
          <q-card>
            <q-card-section>
              <canvas ref="chartReportDaily"></canvas>
            </q-card-section>
          </q-card>
        </div>
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

      <div class="row q-col-gutter-x-md q-mt-lg">
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
      </div>
    </div>

    <div
      v-if="
        user?.userType === 'Funcionario' &&
        user?.teacher.toLowerCase() === 'sim'
      "
    >
      <TeachearDash />
    </div>

    <div v-if="userStores.isStudent">
      <StudantDash />
    </div>

    <div v-if="userStores.isGuardian">
      <GuardianDash />
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useInvoiceStores } from "./finance/invoice/stores";
import { useUserStores } from "./user/store";
import { useExpenseStores } from "./finance/expense/store";
import { useInstitutionStores } from "./institution/store";
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
import Chart from "chart.js/auto";
import { useRouter } from "vue-router";

const router = useRouter();

/* use store */
const authStore = useAuthStore();
const invoiceStores = useInvoiceStores();
const expensesStores = useExpenseStores();
const userStores = useUserStores();
const institutionStores = useInstitutionStores();
const { formatToMZN } = scripts();
const { notifyError } = useNotify();

/* use data */
const chartCanvas = ref(null);
const chartReportTwoYear = ref(null);
const chartReportDaily = ref(null);
const user = computed(() => authStore.user);
const invoices = ref([]);
const expenses = ref([]);
const users = ref();
const employees = computed(() => institutionStores.institution.employees);
const students = computed(() => institutionStores.institution.students);
const currentDate = new Date();
const month = currentDate.toLocaleString("pt-BR", { month: "long" });
const valuesPerMonthCurrentYear = ref(new Array(12).fill(0)); // [0, 0, ..., 0]
const valuesPerMonthLastYear = ref(new Array(12).fill(0)); // [0, 0, ..., 0]
// const dailyLabels = Array.from({ length: 31 }, (_, i) => i + 1);
const currentYear = currentDate.getFullYear();
const lastYear = currentYear - 1;
const valuesPerDayCurrentYear = ref({});

const events = ref([
  "Elimination Game",
  "Freshman Orientation",
  "Spring Sports Rally",
]);

const ranking = ref([
  {
    name: "Rovan Hossam",
    score: 99.88,
    rank: "1st",
    bgColor: "#28a745",
    badgeColor: "green",
  },
  {
    name: "Rony Beyablo",
    score: 98.17,
    rank: "2nd",
    bgColor: "#6f42c1",
    badgeColor: "purple",
  },
  {
    name: "Adam Hisham",
    score: 97.32,
    rank: "3rd",
    bgColor: "#ffc107",
    badgeColor: "orange",
  },
]);

const monthlyLabels = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

/* computed */
const totalPayments = computed(() =>
  formatToMZN(
    invoices.value.reduce((acc, value) => {
      return acc + parseInt(value.total);
    }, 0)
  )
);

const totalPaymentsToday = computed(() =>
  formatToMZN(
    invoices.value
      .filter(
        (payment) =>
          new Date(payment.updatedAt).getFullYear() ===
            currentDate.getFullYear() &&
          new Date(payment.updatedAt).getMonth() === currentDate.getMonth() &&
          new Date(payment.updatedAt).getDate() === currentDate.getDate() &&
          payment.status === "Pago"
      )
      .reduce((acc, value) => {
        return acc + parseInt(value.paidAmount);
      }, 0)
  )
);

const totalPaymentsMonth = computed(() =>
  formatToMZN(
    invoices.value
      .filter(
        (payment) =>
          payment.month.toLowerCase() === month.toLowerCase() &&
          payment.status === "Pago"
      )
      .reduce((acc, value) => {
        return acc + parseFloat(value.paidAmount);
      }, 0)
  )
);

const totalPaymentsDone = computed(() =>
  formatToMZN(
    invoices.value
      .filter((payment) => payment.status === "Pago") // Filtra apenas os atrasados
      .reduce((acc, value) => {
        return acc + parseInt(value.paidAmount);
      }, 0)
  )
);

const totalPaymentsLate = computed(() =>
  formatToMZN(
    invoices.value
      .filter(
        (invoice) =>
          invoice.status === "Pendente" || invoice.status === "Parcial"
      )
      .reduce((acc, invoice) => {
        const restante =
          parseFloat(invoice.total) - parseFloat(invoice.paidAmount || 0);
        return acc + (restante > 0 ? restante : 0); // Evita valores negativos
      }, 0)
  )
);

const totalPaymentsLateMonth = computed(() =>
  formatToMZN(
    invoices.value
      .filter(
        (invoice) =>
          (invoice.status === "Pendente" || invoice.status === "Parcial") &&
          invoice.month.toLowerCase() === month.toLowerCase()
      )
      .reduce((acc, invoice) => {
        const restante =
          parseFloat(invoice.total) - parseFloat(invoice.paidAmount || 0);
        return acc + (restante > 0 ? restante : 0); // Evita valores negativos
      }, 0)
  )
);

const totalPaymentToYear = computed(() =>
  formatToMZN(
    invoices.value
      .filter(
        (payment) =>
          payment.year === new Date().getFullYear() && payment.status === "Pago"
      ) // Filtro
      .reduce((acc, value) => acc + parseInt(value.paidAmount), 0)
  )
);

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

const distributedStudents = computed(() => {

  const distributedStudents = {};
  const totalStudents = students.value?.length;

  students.value?.forEach((student) => {
    student.enrollments.forEach((enrollment) => {
      const studentClass = enrollment.classe;
    distributedStudents[studentClass.course.name] = (distributedStudents[studentClass] || 0) + 1;
    })
  });

  return { ...distributedStudents };
})
const goTo = (route) => {
  router.push({
    name: route,
    params: { institutionId: user.value.institutionId },
  });
};
/* fetch data */
const fetchInvoices = async () => {
  try {
    await invoiceStores.find();
    invoices.value = invoiceStores.invoices;

    invoices.value.forEach((invoice) => {
      const data = new Date(invoice.issueDate); // ou fatura.dueDate
      const mesIndex = data.getMonth(); // 0 = Janeiro, 1 = Fevereiro, ...
      const invoiceYear = data.getFullYear();
      const invoiceDay = data.toISOString().split("T")[0];
      const paidAmount = parseInt(invoice.paidAmount || 0);

      if (invoiceYear === currentYear) {
        valuesPerMonthCurrentYear.value[mesIndex] += parseInt(
          invoice.paidAmount || 0
        );
        if (!valuesPerDayCurrentYear.value[invoiceDay]) {
          valuesPerDayCurrentYear.value[invoiceDay] = 0;
        }
        valuesPerDayCurrentYear.value[invoiceDay] += paidAmount;
      } else if (invoiceYear === lastYear) {
        valuesPerMonthLastYear.value[mesIndex] += parseInt(
          invoice.paidAmount || 0
        );
      }
    });
  } catch (error) {
    notifyError("Erro ao buscar pagamentos");
  }
};

const fetchExpenses = async () => {
  try {
    await expensesStores.findAll();
    expenses.value = expensesStores.expenses;
  } catch (error) {
    notifyError("Erro ao buscar despesas");
  }
};

const fetchUsers = async () => {
  try {
    await userStores.findAll();
    users.value = userStores.users.length;
  } catch (error) {
    notifyError("Erro ao buscar utilizadores");
  }
};

onMounted(async () => {
  await fetchInvoices();
  fetchUsers();
  fetchExpenses();

  new Chart(chartCanvas.value, {
    type: "bar",
    data: {
      // labels: ["INFO", "ELET", "MECA", "SEGU", "MEAM", "SEIN"],
      datasets: [
        {
          label: "Total de alunos",
          data: distributedStudents.value,
          backgroundColor: "#2E3192", // Azul escuro
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });

  const comparativeChart = chartReportTwoYear.value.getContext("2d");
  new Chart(comparativeChart, {
    type: "line", // Tipo de gráfico
    data: {
      labels: monthlyLabels, // Meses
      datasets: [
        {
          label: new Date().getFullYear() - 1, // Ano anterior
          data: valuesPerMonthLastYear.value, // Exemplos de valores de pagamento para o ano de 2024
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
        {
          label: new Date().getFullYear(), // Ano atual
          data: valuesPerMonthCurrentYear.value, // Exemplos de valores de pagamento para o ano de 2025
          borderColor: "rgba(153, 102, 255, 1)",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: `Comparação de Pagamentos: ${
            new Date().getFullYear() - 1
          } vs  ${new Date().getFullYear()} `,
        },
      },
    },
  });

  const dailyChart = chartReportDaily.value.getContext("2d");
  new Chart(dailyChart, {
    type: "line", // Tipo de gráfico
    data: {
      datasets: [
        {
          label: new Date().getFullYear(), // Ano anterior
          data: valuesPerDayCurrentYear.value, // Exemplos de valores de pagamento para o ano de 2024
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: `Pagamentos diarios`,
        },
      },
    },
  });
});

const itemTotalPayment = ref({
  title: "Total de pagamentos",
  icon: "payments",
  value: totalPayments,
  color1: "#20c999",
  color2: "#20c991",
});

const itemTotalPaymentDone = ref({
  title: "Pagamentos realizados",
  icon: "attach_money",
  value: totalPaymentsDone,
  color1: "#28a745",
  color2: "#28a745",
});

const itemTotalPaymentLate = ref({
  title: "Pagamentos atrasados",
  icon: "credit_card_off",
  value: totalPaymentsLate,
  color1: "#dc3545",
  color2: "#dc3545",
});

const itemUsers = ref({
  title: "Utilizadores",
  icon: "person",
  value: users,
  color1: "#6c757d",
  color2: "#6c757d",
});

const itemPaymentToYear = ref({
  title: "Entradas realizadas este ano",
  icon: "payments",
  value: totalPaymentToYear,
  color1: "#17a2b8",
  color2: "#17a2b8",
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

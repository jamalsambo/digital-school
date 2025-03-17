<template>
  <q-page padding>
    <div
      v-if="
        user.userDetails.userType.name === 'Funcionario'
        && user.userDetails.teacher?.toLowerCase() === 'nao'
      "
    >
      <div class="text-h6 q-mb-lg">Painel de Controlo</div>
      <div class="row q-col-gutter-x-md">
        <div class="col-md-3 col-sm-12 col-xs-12">
          <Card :item="itemTotalPayment" />
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12">
          <Card :item="itemTotalPaymentDone" />
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12">
          <Card :item="itemTotalPaymentLate" />
        </div>
        <div class="col-md-3 col-sm-12 col-xs-12">
          <Card :item="itemUsers" />
        </div>
      </div>
      <div class="row q-col-gutter-x-md q-mt-lg">
        <div class="col-md-6 col-sm-12 col-xs-12">
          <Card :item="itemPaymentToYear" />
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12">
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
        <div class="col-md-3 col-sm-12 col-xs-12">
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
        <div class="col-md-3 col-sm-12 col-xs-12">
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
        <div class="col-md-3 col-sm-12 col-xs-12">
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
        <div class="col-md-3 col-sm-12 col-xs-12">
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
        <div class="col-md-6 col-sm-12 col-xs-12">
          <InOutCard
            :item="{
              title: 'Pagamentos em atraso do mes',
              value: totalPaymentsLateMonth,
              color1: '#008080',
              color2: '#28a745',
            }"
          />
        </div>
        <div class="col-md-6 col-sm-12 col-xs-12">
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
      <div class="row q-col-gutter-x-md q-mt-lg">
        <div class="col-md-12">
          <Graphic :payments="payments" />
        </div>
      </div>
    </div>

    <div  v-if="
            user.userDetails.userType.name === 'Funcionario' &&
            user.userDetails.teacher?.toLowerCase() === 'sim'
          ">
      <TeachearDash/>
    </div>

    <div v-if="user.userDetails.userType.name === 'Estudante'">
      <StudantDash/>
    </div>

    <div v-if="user.userDetails.userType.name === 'Visitante'">
      <GuardianDash/>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { usePaymentStores } from "./finance/payments/stores";
import { useUserStores } from "./user/store";
import { useExpenseStores } from "./finance/expense/store";
import Card from "src/components/dashboard/Card.vue";
import SubCard from "src/components/dashboard/Sub-Card.vue";
import InOutCard from "src/components/dashboard/InOut-Card.vue";
import scripts from "src/composables/Scripts";
import useNotify from "src/composables/UseNotify";
import Graphic from "src/components/dashboard/Graphic.vue";
import { useAuthStore } from "src/pages/auth/store";
import TeachearDash from "./TeachearDash.vue";
import StudantDash from "./StudentDash.vue";
import GuardianDash from "./GuardianDash.vue";
/* use store */
const authStore = useAuthStore();
const paymentsStores = usePaymentStores();
const expensesStores = useExpenseStores();
const userStores = useUserStores();
const { formatToMZN } = scripts();
const { notifyError } = useNotify();

/* use data */
const user = computed(() => authStore.user);
const payments = ref([]);
const expenses = ref([]);
const users = ref();
const currentDate = new Date();
const month = currentDate.toLocaleString("pt-BR", { month: "long" });
const teste = computed(() => payments.value);

/* computed */
const totalPayments = computed(() =>
  formatToMZN(
    payments.value.reduce((acc, value) => {
      const totalPenalty =
        value.penalts?.reduce((sum, p) => sum + parseInt(p.amount), 0) || 0; // Soma todas as penalidades do array
      return acc + parseInt(value.amount) + totalPenalty;
    }, 0)
  )
);

const totalPaymentsToday = computed(() =>
  formatToMZN(
    payments.value
      .filter(
        (payment) =>
          new Date(payment.paymentDate).getFullYear() === currentDate.getFullYear() &&
          new Date(payment.paymentDate).getMonth() === currentDate.getMonth() &&
          new Date(payment.paymentDate).getDate() === currentDate.getDate() &&
          payment.status === "Pago",
      )
      .reduce((acc, value) => {
        const totalPenalty = value.penalts?.reduce((sum, p) => sum + parseInt(p.amount), 0) || 0; // Soma todas as penalidades do array
        return acc + parseInt(value.amount) + totalPenalty;
      }, 0)
  )
);

const totalPaymentsMonth = computed(() =>
  formatToMZN(
    payments.value
      .filter((payment) => payment.month === month && payment.status === "Pago")
      .reduce((acc, value) => {
        const totalPenalty =
          value.penalts?.reduce((sum, p) => sum + parseInt(p.amount), 0) || 0; // Soma todas as penalidades do array
        return acc + parseInt(value.amount) + totalPenalty;
      }, 0)
  )
);

const totalPaymentsDone = computed(() =>
  formatToMZN(
    payments.value
      .filter((payment) => payment.status === "Pago") // Filtra apenas os atrasados
      .reduce((acc, value) => {
        const totalPenalty =
          value.penalts
            ?.filter((p) => p.status === true)
            .reduce((sum, p) => sum + parseInt(p.amount), 0) || 0; // Soma todas as penalidades do array
        return acc + parseInt(value.amount) + totalPenalty;
      }, 0)
  )
);

const totalPaymentsLate = computed(() =>
  formatToMZN(
    payments.value
      .filter((payment) => payment.status === "Atrasado") // Filtra apenas os atrasados
      .reduce((acc, value) => {
        const totalPenalty =
          value.penalts
            ?.filter((p) => p.status === false)
            .reduce((sum, p) => sum + parseInt(p.amount), 0) || 0; // Soma todas as penalidades do array
        return acc + parseInt(value.amount) + totalPenalty;
      }, 0)
  )
);
const totalPaymentsLateMonth = computed(() =>
  formatToMZN(
    payments.value
      .filter(
        (payment) => payment.status === "Atrasado" && payment.month === month
      ) // Filtra apenas os atrasados
      .reduce((acc, value) => {
        const totalPenalty =
          value.penalts
            ?.filter((p) => p.status === false)
            .reduce((sum, p) => sum + parseInt(p.amount), 0) || 0; // Soma todas as penalidades do array
        return acc + parseInt(value.amount) + totalPenalty;
      }, 0)
  )
);

const totalPaymentToYear = computed(() =>
  formatToMZN(
    payments.value
      .filter(
        (payment) =>
          payment.year === new Date().getFullYear().toString() &&
          payment.status === "Pago"
      ) // Filtro
      .reduce((acc, value) => acc + parseInt(value.amount), 0)
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

/* fetch data */
const fetchPayments = async () => {
  try {
    await paymentsStores.findAll();
    payments.value = paymentsStores.payments;
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

onMounted(async() => {
  await fetchPayments();
  fetchUsers();
  fetchExpenses();
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

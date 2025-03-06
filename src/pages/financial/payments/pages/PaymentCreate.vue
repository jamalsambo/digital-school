<template>
  <q-dialog v-model="medium" persistent>
    <q-card style="width: 900px; max-width: 80vw">
      <OrderSummary :invoice-data="invoiceData" :handle-modal="handleModal" />
    </q-card>
  </q-dialog>
  <q-page padding>
    <q-card-section>
      <div class="text-h6">
        <span v-if="view"> Pagamentos</span>
        <span v-else> Novo pagamento</span>
      </div>
    </q-card-section>
    <q-card flat bordered class="q-pa-md shadow-2">
      <span class="text-weight-bold">Informações de tipo de pagamento</span>
      <q-separator spaced />
      <div class="row q-col-gutter-md">
        <q-select
          class="col-md-6 col-sm-12 col-xs-12"
          label="Tipo de Pagamento"
          option-label="name"
          option-value="id"
          v-model="paymentTypeSelected"
          :options="paymentTypes"
          map-options
          outlined
          @update:model-value="updateValue"
          dense
          clearable=""
        />
        <q-input
          class="col-md-4 col-sm-12 col-xs-12"
          label="Ano lectivo *"
          v-model="year"
          type="number"
          outlined
          dense
        />
        <q-btn
          v-if="paymentTypeSelected"
          label="Buscar"
          color="primary"
          type="button"
          flat
          outline
          @click="handleSearchPayments"
        />
      </div>
    </q-card>
    <q-card flat bordered class="q-pa-md shadow-2 q-mt-md">
      <span class="text-weight-bold">Pagamentos</span>
      <Tables :rows="payments" :columns="PaymentsColumns">
        <template #penalts="{ penalts }">
          <q-list dense>
            <q-item v-for="penalty in penalts" :key="penalty.id">
              <q-item-section>
                <q-checkbox
                  v-if="!view"
                  class="col-auto"
                  v-model="penalty.status"
                  :val="penalty.id"
                  :label="penalty.amount"
                  @update:model-value="handlePenaltyPaid(penalty)"
                />
                <q-checkbox
                  v-else
                  class="col-auto"
                  v-model="penalty.status"
                  :val="penalty.id"
                  :label="penalty.amount"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </template>
        <template #actions="{ props }" v-if="!view">
          <div class="row q-gutter-sm float-right">
            <q-checkbox
              v-if="props.row.payment.status !== 'Pago'"
              v-model="props.row.payment.status"
              class="col-auto"
              :val="props"
              label="Pagar"
              @update:model-value="handleMonthPaid(props)"
            />
          </div>
        </template>
      </Tables>
    </q-card>
    <q-card flat bordered class="q-pa-md shadow-2 q-mt-md" v-if="!view">
      <q-card-section class="text-center q-pb-sm">
        <div class="text-h6">Resumo</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-list dense bordered class="justify-end">
          <q-item>
            <q-item-section>📋 Total Meses Pagos</q-item-section>
            <q-item-section side>{{
              totalMonthPaySelect.length
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>📌 Total Multas Pagas</q-item-section>
            <q-item-section side>{{
              totalPenaltyPaySelect.length
            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>💵 Total de Multas</q-item-section>
            <q-item-section side>{{ totalAmoutPenalty }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>✔️ Total de Mensalidades</q-item-section>
            <q-item-section side>{{ totalAmountMonth }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>✔️ Total</q-item-section>
            <q-item-section side>{{ totalPaid }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
    <q-card flat bordered class="q-pa-md shadow-2 q-mt-md" v-if="!view">
      <span class="text-weight-bold">Método de pagamento</span>
      <q-separator spaced />
      <div class="row q-col-gutter-md">
        <q-select
          class="col-md-6 col-sm-12 col-xs-12"
          label="Metodo de Pagamento *"
          option-label="name"
          option-value="id"
          v-model="method"
          :options="[
            'Mpesa',
            'eMola',
            'mKesh',
            'Numerário',
            'Depósito Bancário',
            'Cartão Bancário',
            'Cheque Bancário',
            'Transferência',
          ]"
          outlined
          required
          dense
          clearable=""
        />
        <q-input
          class="col-md-4 col-sm-12 col-xs-12"
          label="Número do Documento"
          v-model="code"
          outlined
          dense
        />
        <q-btn
          v-if="
            method &&
            paymentTypeSelected &&
            year &&
            totalMonthPaySelect.length > 0
          "
          label="Pagar"
          color="primary"
          type="button"
          flat
          outline
          @click="handlePaid"
        />
      </div>
    </q-card>
  </q-page>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import Tables from "src/components/Tables.vue";
import PaymentsColumns from "../components/columns/Payments";
import { usePaymentStores } from "../stores";
import { useStudentStores } from "src/pages/student/store";
import { useAuthStore } from "src/pages/auth/store";
import useNotify from "src/composables/UseNotify";
import scripts from "src/composables/Scripts";
import OrderSummary from "src/components/register/order_summary/View.vue";

/* use stores */
const route = useRoute();
const paymentStores = usePaymentStores();
const studentStores = useStudentStores();
const authStore = useAuthStore();
const { notifyError, notifySuccess } = useNotify();
const { filterEnrollmentsByYear } = scripts();

/* define data */
const { id, view } = route.params;
const studentId = ref(route.params.id || id);
const student = ref();
const payments = ref([]);
const paymentTypes = ref([]);
const year = ref(parseInt(new Date().getFullYear()));
const paymentTypeSelected = ref(null);
const method = ref();
const code = ref();
const medium = ref(false);
const invoiceId = ref();
const invoiceData = ref();
const months = ref([
  { id: 0, month: "Janeiro" },
  { id: 1, month: "Fevereiro" },
  { id: 2, month: "Março" },
  { id: 3, month: "Abril" },
  { id: 4, month: "Maio" },
  { id: 5, month: "Junho" },
  { id: 6, month: "Julho" },
  { id: 7, month: "Agosto" },
  { id: 8, month: "Setembro" },
  { id: 9, month: "Outubro" },
  { id: 10, month: "Novembro" },
  { id: 11, month: "Dezembro" },
]);

/* Data resume */
const totalMonthPaySelect = ref([]);
const totalPenaltyPaySelect = ref([]);
const totalAmoutPenalty = ref(0);
const totalAmountMonth = ref(0);
const totalPaid = computed(() => {
  return totalAmoutPenalty.value + totalAmountMonth.value;
});

/* Methods */

const handlePenaltyPaid = (penalty) => {
  if (penalty.status) {
    // Adiciona o item à lista de selecionados
    totalPenaltyPaySelect.value.push(penalty);
    totalAmoutPenalty.value += parseInt(penalty.amount); // Soma o valor 'amount'
  } else {
    // Remove o item da lista de selecionados
    const index = totalPenaltyPaySelect.value.findIndex(
      (item) => item.id === penalty.id
    );

    if (index !== -1) {
      totalAmoutPenalty.value -= totalPenaltyPaySelect.value[index].amount; // Subtrai o valor 'amount'
      totalPenaltyPaySelect.value.splice(index, 1); // Remove o item da lista
    }
  }
};

const handleMonthPaid = (fee) => {
  if (fee.row.payment.status) {
    // Adiciona o item à lista de selecionados
    totalMonthPaySelect.value.push(fee);
    totalAmountMonth.value += parseInt(fee.row.payment.amount); // Soma o valor 'amount'
  } else {
    // Remove o item da lista de selecionados
    const index = totalMonthPaySelect.value.findIndex(
      (item) => item.id === fee.id
    );

    if (index !== -1) {
      totalAmountMonth.value -=
        totalMonthPaySelect.value[index].row.payment.amount; // Subtrai o valor 'amount'
      totalMonthPaySelect.value.splice(index, 1); // Remove o item da lista
    }
  }
};
/* Funcao para buscar pagaments do estudante */
const fetchPayments = async () => {
  try {
    await studentStores.findOne(studentId.value);
    student.value = studentStores.student;
    const enrollments = studentStores.student.enrollments;
    const enrollmentsByYear = filterEnrollmentsByYear(enrollments, year.value);
    const paymentStudent = studentStores.student.payments;
    const studentPaymentType =
      student.value.studentPaymentTypes.find(
        (s) => s.paymentTypeId === paymentTypeSelected.value.id
      ) || null;

    const amount =
      studentPaymentType && studentPaymentType.amount !== null
        ? studentPaymentType.amount
        : enrollmentsByYear.monthlyFee;

    payments.value = months.value.map((month) => {
      const payment = paymentStudent.find(
        (p) =>
          p.month === month.month &&
          p.paymentTypeId === paymentTypeSelected.value.id &&
          p.year === year.value.toString() &&
          p.studentId === studentId.value
      );

      return {
        month: month,
        payment: payment || {
          amount: amount,
          status: false,
        },
      };
    });
  } catch (error) {
    notifyError("Ocorreu um erro ao carregar os pagamentos");
  }
};

const fetchPaymentTypes = async () => {
  try {
    await paymentStores.findPaymentTypes();
    paymentTypes.value = paymentStores.paymentTypes.filter((paymentType) => paymentType.name !== "Matricula");
  } catch (error) {
    notifyError("Ocorreu um erro ao carregar os tipos de pagamento");
  }
};

const handlePaid = async () => {
  try {
    /* Primeiro cria a factura */
    const startDate = new Date(year.value, 0);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const payloadInvoice = {
      institutionId: authStore.user.userDetails.institutionId,
      employeeId: authStore.user.userDetails.id,
      studentId: studentId.value,
      issueDate: new Date(),
      totalValue: totalPaid.value.toString(),
      tax: "5",
      netvalue: totalPaid.value.toString(),
      paymentDate: new Date(),
      paymentMethod: method.value,
      status: "Pago",
      paymentReference: code.value || "N/A",
    };

    await paymentStores.createInvoice(payloadInvoice);

    if (paymentStores.invoice.id) {
      invoiceId.value = paymentStores.invoice.id;

      if (totalMonthPaySelect.value.length > 0) {
        totalMonthPaySelect.value.forEach(async (payment) => {
          const startDate = new Date(year.value, payment.row.month.id);
          const endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 1);

          const payload = {
            paymentTypeId: paymentTypeSelected.value.id,
            amount: payment.row.payment.amount,
            method: method.value,
            status: "Pago",
            paymentDate: new Date(),
            dueDate: endDate,
            paymentNote: `${paymentTypeSelected.value.name} de referente o mes de ${payment.row.month.month}`,
            month: payment.row.month.month,
            year: year.value.toString(),
            studentId: studentId.value,
            code: code.value || "",
          };

          const payloadInvoiceItem = {
            invoiceId: paymentStores.invoice.id,
            description: `${paymentTypeSelected.value.name} referente o mes de ${payment.row.month.month}`,
            quantity: 1,
            unitPrice: payment.row.payment.amount,
            tax: "5",
            amount: payment.row.payment.amount,
          };

          if (payment.row.payment.id) {
            /* para o caso de haver pagamento ja gerado geralmento pelo sistema, */
            await paymentStores.update(payment.row.payment.id, payload);
          } else {
            await paymentStores.create(payload);
          }
          await paymentStores.createInvoiceItems(payloadInvoiceItem);
        });
      }

      if (totalPenaltyPaySelect.value.length > 0) {
        totalPenaltyPaySelect.value.forEach(async (penalty) => {
          const payloadInvoiceItemPenalty = {
            invoiceId: paymentStores.invoice.id,
            description: penalty.paymentNote,
            quantity: 1,
            unitPrice: penalty.amount,
            tax: "5",
            amount: penalty.amount,
          };

          await paymentStores.updatePenalty(penalty.id, {
            status: penalty.status,
          });

          await paymentStores.createInvoiceItems(payloadInvoiceItemPenalty);
        });
      }

      await paymentStores.findInvoiceById(invoiceId.value);
      invoiceData.value = paymentStores.invoiceItens;
      handleModal();
      notifySuccess("Pagamento efectuado com sucesso");
      onReset();
    }
  } catch (error) {
    console.error(error);
    notifyError("Ocorreu um erro no pagameno");
  }
};

const handleModal = () => {
  medium.value = !medium.value;
};

const onReset = () => {
  paymentTypeSelected.value = "";
  method.value = "";
  code.value = "";
};

const handleSearchPayments = () => {
  fetchPayments();
};

onBeforeRouteUpdate((to) => {
  studentId.value = to.params.id || id;
});

onMounted(() => {
  fetchPaymentTypes();
});
</script>

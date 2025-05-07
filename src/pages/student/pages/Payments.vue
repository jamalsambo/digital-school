<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h5">Controle de pagamentos</div>
        <div class="text-subtitle1">
          Gerir e controlar os seus pagamentos
        </div>
        <q-separator spaced />
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle1">Informações de pesquisa</div>
        <q-card flat bordered class="q-pa-md shadow-2">
          <q-select
              class="col-md-4 col-sm-12 col-xs-12"
              label="Tipo de Pagamento"
              option-label="name"
              option-value="id"
              v-model="paymentTypeSelected"
              :options="paymentTypes"
              map-options
              outlined
              dense
              clearable=""
              @update:model-value="handleFetchInvoices"
            />
          </q-card>
      </q-card-section>
      <q-card-section>
        <q-card flat bordered class="q-pa-md shadow-2">
          <InvoiceTable :invoices="invoices" :handle-row-click="handleRowClick"/>
        </q-card>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { usePaymentStores } from 'src/pages/finance/payments/stores';
import { useStudentStores } from '../store';
import { useInvoiceStores } from 'src/pages/finance/invoice/stores';
import InvoiceTable from 'src/pages/finance/invoice/components/InvoiceTable.vue';
import { useRoute } from 'vue-router';
import scripts from 'src/composables/Scripts';

/* setup route */
const route = useRoute()

/* setup stores */
const paymentStores = usePaymentStores();
const studentStores = useStudentStores()
const invoiceStores = useInvoiceStores()
const {filterEnrollmentsByYear  } = scripts()

/* setup data */
const { studentId } = route.params
const paymentTypeSelected = ref(null)

const paymentTypes = ref([])
const invoices = ref([])
const student = ref(null)
const enrollments = ref([])
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

/* setup computed */
const actualEnrollment = computed(() =>
  filterEnrollmentsByYear(enrollments.value, new Date().getFullYear())
);

/* fetch data */
const handleFetchInvoices = async () => {
  try {
    await invoiceStores.find({
      classId:  actualEnrollment.value?.classe?.id,
      paymentTypeId: paymentTypeSelected.value.id,
      studentId: studentId,
    });

    if (paymentTypeSelected.value.name === "Matricula") {
      invoices.value = invoiceStores.invoices;
    } else {
      invoices.value = months.value.map((month) => {
        const invoice = invoiceStores.invoices.find(
          (inv) => inv.month.toLowerCase() === month.month.toLowerCase()
        );
        return {
          ...month,
          ...invoice,
          amount: invoice ? invoice.amount : actualEnrollment.value?.classe?.monthlyFee,
        };
      });
    }
  } catch (error) {
    console.log(error);
  }
};
/* 🔄 Fetch data */
const fetchStudentData = async () => {
  try {
    await studentStores.findOne(studentId);
    student.value = studentStores.student;
    enrollments.value = student.value.enrollments;

  } catch (error) {
    notifyError('Erro ao carregar o estudante.');
  }
};
const fetchPaymentTypes = async () => {
  try {
    await paymentStores.findPaymentTypes();
    paymentTypes.value = paymentStores.paymentTypes;
  } catch (error) {
    notifyError("Ocorreu um erro ao carregar os tipos de pagamento");
  }
};

onMounted( async () => {
 await fetchPaymentTypes()
 await fetchStudentData()
})
</script>

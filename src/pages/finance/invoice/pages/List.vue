<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h5">Gestão de Facturas</div>
        <div class="text-subtitle1">
          Gerir e controlar as facturas emitidas.
        </div>
        <q-separator spaced />
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle1">Informações de pesquisa</div>
        <q-card flat bordered class="q-pa-md shadow-2">
          <div class="row q-col-gutter-sm">
            <q-select
              class="col-md-4 col-sm-12 col-xs-12"
              v-model="student"
              use-input
              hide-selected
              input-debounce="0"
              :options="options"
              @filter="filterFn"
              hint="Filtro de Estudantes"
              outlined
              label="Estudantes"
              option-label="name"
              fill-input
              dense
              map-options
              @update:model-value="updateStudentSelect"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              class="col-md-4 col-sm-12 col-xs-12"
              v-model="classe"
              :options="stages"
              label="Estagios"
              option-label="classe.name"
              option-value="classe.id"
              dense
              outlined
              map-options
              @update:model-value="updateClasseSelect"
            >
              <template v-slot:selected>
                <span v-if="classe"
                  >{{ classe.classe.name }} -
                  {{ classe.classe.course.name }}</span
                >
                <span v-else>Selecione um estágio</span>
              </template>

              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.classe.name }}</q-item-label>
                    <q-item-label caption>{{
                      scope.opt.classe.course.name
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
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
            />
            <div class="row q-mt-md justify-end">
              <q-btn
                label="Pesquisar"
                color="primary"
                flat
                dense
                type="submit"
                @click="fetchInvoices"
              />
            </div>
          </div>
        </q-card>
      </q-card-section>
    </q-card>
    <q-card class="q-mt-lg">
      <q-card-section>
        <q-card flat bordered class="q-pa-md shadow-2">
          <InvoiceTable :invoices="invoices" :handle-row-click="handleRowClick"/>
        </q-card>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStudentStores } from "src/pages/student/store";
import { usePaymentStores } from "../../payments/stores";
import { useInvoiceStores } from "../stores";
import useNotify from "src/composables/UseNotify";
import InvoiceTable from "../components/InvoiceTable.vue";

/* setup stores */
const studentStores = useStudentStores();
const paymentStores = usePaymentStores();
const invoiceStores = useInvoiceStores();
const { notifyError, notifySuccess } = useNotify();

/* setup data */
const students = ref([]);
const student = ref(null);
const classe = ref();
const amount = ref(null);
const options = ref(students.value);
const stages = ref([]);
const invoices = ref([]);
const paymentTypes = ref([]);
const paymentTypeSelected = ref(null);
const year = ref(parseInt(new Date().getFullYear()));
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

/* setup methods */
const handleRowClick = async (month,amount) => {
  const startDate = new Date(year.value);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const payload = {
    paymentTypeId: paymentTypeSelected.value.id,
    classId: classe.value.classe.id,
    studentId: student.value.id,
    issueDate: new Date(),
    dueDate: endDate,
    month: month,
    amount: parseInt(amount),
    status: "Pendente",
    total: parseInt(amount),
    note: `Factura referente ao de ${month}`,
    year: parseInt(new Date().getFullYear())
  };

  try {
    await invoiceStores.create(payload);
    await fetchInvoices();
    notifySuccess(
      `Factura referente ao de ${month} gerado com sucesso!`
    );
  } catch (error) {
    notifyError(
      `Erro a gerar factura referente ao de ${month}!`
    );
  }
};

const fetchInvoices = async () => {
  try {
    await invoiceStores.find({
      classId: classe.value.classe.id,
      paymentTypeId: paymentTypeSelected.value.id,
      studentId: student.value.id,
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
          amount: invoice ? invoice.amount : amount,
        };
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateStudentSelect = (student) => {
  stages.value = student.enrollments;
  // invoices.value = student.invoices;
};

const updateClasseSelect = (classe) => {
  amount.value = classe.classe.monthlyFee;
};

const fetchStudents = async () => {
  try {
    await studentStores.list();
    students.value = studentStores.students.map((student) => {
      return {
        id: student.id,
        name: student?.basicInformation?.fullName ?? "Default",
        ...student,
      };
    });
  } catch (error) {
    console.log(error);
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

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = students.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

onMounted(async () => {
  await fetchStudents();
  await fetchPaymentTypes();
});
</script>

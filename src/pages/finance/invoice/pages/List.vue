<template>
  <q-page padding>
{{ selectedDate }}
    <q-card>
      <q-card-section>
        <div class="row items-center justify-between">
          <div>
            <div class="text-h5">Gestão de Facturas</div>
            <div class="text-subtitle1">
              Gerir e controlar as facturas emitidas.
            </div>
          </div>

          <q-btn
          v-if="student && classe && paymentTypeSelected"
            label="Gerar Factura"
            color="primary"
            icon="receipt_long"
            @click="generateInvoice = true"
            class="q-ml-md"
          />
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

    <q-card class="q-mt-lg" v-if="generateInvoice">
      <q-card-section>
        <div class="text-h5">Gerar Facturas</div>
        <q-select
          class="col-md-grow col-sm-12 col-xs-12"
          label="Selecione o mes"
          option-label="label"
          option-value="id"
          v-model="selectedMonth"
          :options="months"
          map-options
          outlined
          dense
          clearable=""
        />
        <div class="row justify-end q-gutter-sm q-mt-sm">
          <q-btn
            label="Cancelar"
            color="negative"
            flat
            icon="cancel"
            @click="generateInvoice= false"
          />
          <q-btn
          v-if="selectedMonth"
            label="Gerar"
            color="primary"
            icon="save"
            flat
            @click="handleRowClick"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-lg">
      <q-card-section>
        <q-card flat bordered class="q-pa-md shadow-2">
          <InvoiceTable
            :invoices="invoices"
            :handle-row-click="handleRowClick"
          />
        </q-card>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "src/pages/auth/store";
import { useStudentStores } from "src/pages/student/store";
import { usePaymentStores } from "../../payments/stores";
import { useInvoiceStores } from "../stores";
import useNotify from "src/composables/UseNotify";
import InvoiceTable from "../components/InvoiceTable.vue";
import * as moment from 'moment';


/* setup stores */
const authStore = useAuthStore()
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
const selectedMonth = ref(null);
const generateInvoice = ref(false)


/* setup methods */
const handleRowClick = async () => {
  const issueDate = moment({ year: year.value, month: selectedMonth.value.value, day: 1 })
const dueDate = issueDate.clone().add(1, 'month')


  const payload = {
    paymentTypeId: paymentTypeSelected.value.id,
    classId: classe.value.classe.id,
    studentId: student.value.id,
    issueDate: issueDate.toDate(),
    dueDate: dueDate.toDate(),
    month: selectedMonth.value.label,
    amount: parseInt(classe.value.classe.monthlyFee),
    status: "Pendente",
    total: parseInt(classe.value.classe.monthlyFee),
    note: `Factura de ${paymentTypeSelected.value.name} referente ao mes de ${selectedMonth.value.label}`,
    year: parseInt(new Date().getFullYear()),
    employeeId: authStore.user.employeeId
  };

  try {
    await invoiceStores.create(payload);
    await fetchInvoices();
    notifySuccess(`Factura referente ao mes de ${selectedMonth.value} gerado com sucesso!`);
    generateInvoice.value = false
  } catch (error) {
    notifyError(`Erro a gerar factura referente ao de ${selectedMonth.value}!`);
  }


};

const fetchInvoices = async () => {
  try {
    await invoiceStores.find({
      classId: classe.value.classe.id,
      paymentTypeId: paymentTypeSelected.value.id,
      studentId: student.value.id,
    });

    invoices.value = invoiceStores.invoices.invoices;
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

const months = [];

for (let i = 0; i < 12; i++) {
  const date = new Date(2025, i, 1)
  const monthName = date.toLocaleString('pt-BR', { month: 'long' })
  months.push({
    label: monthName.charAt(0).toUpperCase() + monthName.slice(1),
    value: i // mês de 1 a 12
  })
}

onMounted(async () => {
  await fetchStudents();
  await fetchPaymentTypes();
});
</script>

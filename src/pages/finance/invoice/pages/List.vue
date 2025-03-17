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
              option-label="name"
              option-value="id"
              dense
              outlined
              map-options
              @update:model-value="updateClasseSelect"
            >
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
          <q-table
            title="Facturas"
            :rows="invoices"
            :columns="columns"
            row-key="id"
            flat
            bordered
            :pagination="{ rowsPerPage: 10 }"
              @row-click="handleRowClick"
          >
            <!-- Configuração da expansão -->
            <template  v-slot:body="props">
              <q-tr :props="props">
                <!-- Colunas principais -->
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>

                <!-- Botão para expandir -->
                <q-td auto-width>
                  <q-btn
                    size="sm"
                    color="primary"
                    round
                    @click="props.expand = !props.expand"
                    :icon="props.expand ? 'remove' : 'add'"
                  />
                </q-td>
              </q-tr>

              <!-- Linha expandida com multas -->
              <q-tr v-show="props.expand" :props="props">
                <q-td colspan="100%">
                  <div class="q-pa-md bg-grey-2">
                    <div class="text-h6 q-mb-md">Multas Aplicadas</div>

                    <q-list bordered v-if="props.row.penalts">
                      <q-item
                        v-for="(fine, index) in props.row.penalts"
                        :key="index"
                      >
                        <q-item-section>
                          <q-item-label>{{
                            fine.amount
                          }}</q-item-label>
                          <q-item-label caption>{{ fine.paymentNote }}</q-item-label>
                          <q-item-label caption>{{
                            fine?.createdAt
                          }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>

                    <div v-else class="text-caption text-grey">
                      Nenhuma multa aplicada
                    </div>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
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
import columns from "../components/InvoiceColumns";
import useNotify from "src/composables/UseNotify";

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
const handleRowClick = (row) => {
  console.log(row)
  // const startDate = new Date(year.value, props.row.month.id);
  // const endDate = new Date(startDate);
  // endDate.setMonth(endDate.getMonth() + 1);

  // const payload = {
  //   paymentTypeId: paymentTypeSelected.value.id,
  //   classId: classe.value.classe.id,
  //   studentId: student.value.id,
  //   issueDate: new Date(),
  //   dueDate: endDate,
  //   month: props.row.month.month,
  //   amount: props.row.amount,
  //   status: "Pendente",
  //   note: `Factura referente ao de ${props.row.month.month}`,
  // };

  // try {
  //   await invoiceStores.create(payload);
  //   await fetchInvoices();
  //   notifySuccess(
  //     `Factura referente ao de ${props.row.month.month} gerado com sucesso!`
  //   );
  // } catch (error) {
  //   notifyError(
  //     `Erro a gerar factura referente ao de ${props.row.month.month}!`
  //   );
  // }
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

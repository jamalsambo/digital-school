<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h5">Gestão de recibos</div>
        <div class="text-subtitle1">Gerir e controlar as recibos emitidas.</div>
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
                no-caps
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
            <template v-slot:body="props">
              <q-tr :props="props">
                <!-- Colunas principais -->
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>

                <q-td auto-width>
                  <q-btn
                    flat
                    dense
                    round
                    color="red"
                    icon="delete"
                    @click="deleteInvoice(props.row)"
                  />
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
                          <q-item-label>{{ fine.amount }}</q-item-label>
                          <q-item-label caption>{{
                            fine.paymentNote
                          }}</q-item-label>
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
            <!-- Configuração da expansão -->
          </q-table>
        </q-card>
      </q-card-section>
    </q-card>
    <q-card flat bordered class="q-pa-md shadow-2 q-mt-md">
      <q-card-section class="text-center q-pb-sm">
        <div class="text-h6">Resumo</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-list dense bordered class="justify-end">
          <q-item>
            <q-item-section>📋 Total Meses Pagos</q-item-section>
            <q-item-section side>{{

            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>📌 Total Multas Pagas</q-item-section>
            <q-item-section side>{{

            }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>💵 Total de Multas</q-item-section>
            <q-item-section side>{{  }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>✔️ Total de Mensalidades</q-item-section>
            <q-item-section side>{{  }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>✔️ Total</q-item-section>
            <q-item-section side>{{  }}</q-item-section>
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
import { onMounted, ref } from "vue";
import { useStudentStores } from "src/pages/student/store";
import { usePaymentStores } from "../../payments/stores";
import { useInvoiceStores } from "../../invoice/stores";
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

/* setup methods */

const fetchInvoices = async () => {
  try {
    await invoiceStores.find({
      classId: classe.value.classe.id,
      paymentTypeId: paymentTypeSelected.value.id,
      studentId: student.value.id,
    });

      invoices.value = invoiceStores.invoices.filter((value) => value.status === "Pendente")

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

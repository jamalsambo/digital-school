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
              label="Estágios"
              option-label="classe.name"
              option-value="classe.id"
              dense
              outlined
              map-options
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
              clearable
              @update:model-value="updatePaymentTypeSelect"
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
                    <div class="q-pa-md bg-grey-2" v-if="props.row.items">
                      <div class="text-h6 q-mb-md">Items da factura</div>

                      <q-list bordered v-if="props.row.items">
                        <q-item
                          v-for="(iten, index) in props.row.items"
                          :key="index"
                        >
                          <q-item-section>
                            <q-item-label>{{ iten.amount }}</q-item-label>
                            <q-item-label caption>{{
                              iten.description
                            }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>

                      <div v-else class="text-caption text-grey">
                        Nenhuma multa aplicada
                      </div>
                    </div>
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
                            formatDate(fine?.createdAt)
                          }}</q-item-label>
                          <q-item-label caption>{{
                            fine?.status ? "Paga" : "Nao Paga"
                          }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-btn
                            flat
                            dense
                            round
                            color="red"
                            icon="delete"
                            @click="deletePenalty(props.row.id, fine.id)"
                          />
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
            <template v-slot:bottom>
              <div class="q-pa-md bg-grey-2 text-right">
                <div>
                  Total facturas pagos: <strong>{{ invoices.length }}</strong>
                </div>
                <div>
                  Total de multas:
                  <strong>{{ totalPenalty }}</strong>
                </div>
                <div>
                  Total de mensalidades:
                  <strong>{{ totalMonthFees }}</strong>
                </div>
                <div>
                  Total Geral: <strong>{{ totalPayments }}</strong>
                </div>
              </div>
            </template>
          </q-table>
        </q-card>
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
          v-if="method"
          label="Pagar"
          color="primary"
          type="button"
          flat
          dense
          outline
          @click="handlePaid"
        />
        <q-btn
          v-if="method"
          label="Impimir"
          color="secondary"
          type="button"
          flat
          dense
          outline
          @click="handlePaidPrint"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { cloneVNode, computed, onMounted, ref } from "vue";
import { useStudentStores } from "src/pages/student/store";
import { usePaymentStores } from "../../payments/stores";
import { useInvoiceStores } from "../../invoice/stores";
import { useReceiptStores } from "../stores";
import columns from "../components/InvoiceColumns";
import useNotify from "src/composables/UseNotify";
import scripts from "src/composables/Scripts";
import { useRouter } from "vue-router";

/* setup router */
const router = useRouter();

/* setup stores */
const studentStores = useStudentStores();
const paymentStores = usePaymentStores();
const invoiceStores = useInvoiceStores();
const receiptStores = useReceiptStores();
const { notifyError, notifySuccess } = useNotify();
const { formatDate, formatToMZN } = scripts();

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
const code = ref(null);
const method = ref(null);
const receiptId = ref();
const paymentTypeFind = ref();

/* setup methods */
const fetchInvoices = async () => {
  try {
    await invoiceStores.find({
      classId: classe.value.classe.id,
      paymentTypeId: paymentTypeSelected.value.id,
      studentId: student.value.id,
    });

    invoices.value = invoiceStores.invoices.filter((value) =>
      ["Pendente", "Parcial"].includes(value.status)
    );
  } catch (error) {
    notifyError("Erro ao buscar facturas");
  }
};

const handlePaid = async () => {
  try {
    const payloadReceipt = {
      transactionCode: code.value || "",
      paymentMethod: method.value,
      studentId: student.value.id,
      note: "",
    };
    const monthFristPay = new Date(
      classe.value.classe?.startDate
    ).toLocaleString("pt-BR", { month: "long" });

    if ((method.value = "Mpesa")) {
      const responseMpesa = await paymentStores.payMpsa({
        amount: parseInt(classe.value.classe.monthlyFee),
        msisdn: 258845751142,
        transactionRef: "T12344C",
        thirdPartyRef: `ref4`,
      });
      if (responseMpesa.output_ResponseCode === "INS-0") {
        await receiptStores.create(payloadReceipt);
        receiptId.value = receiptStores.receipt.id;
      }
    }
    if (receiptId.value) {
      const requests = invoices.value.map(async (invoice) => {
        const totalPenalty =
          invoice.penalts?.reduce((sum, p) => sum + parseInt(p.amount), 0) || 0;

        if (invoice.status === "Parcial") {
          await paymentStores.create({
            invoiceId: invoice.id,
            receiptId: receiptId.value,
            amount: totalPenalty, // Mantém valores decimais
            paymentDate: new Date(),
          });
          const paid = parseInt(invoice.paidAmount) + totalPenalty;

          if (paymentStores.payment.id) {
            await invoiceStores.update(invoice.id, {
              status: "Pago",
              paidAmount: paid,
            });
            await paymentStores.updateInvoicePenalts(invoice.id, {
              status: true,
            });
          }
        } else {
          const paid = parseInt(invoice.amount) + totalPenalty;

          if (paid >= parseInt(invoice.total)) invoice.status = "Pago";
          else if (paid > 0) invoice.status = "Parcial";
          else invoice.status = "Pendente";

          await paymentStores.create({
            invoiceId: invoice.id,
            receiptId: receiptId.value,
            amount: parseInt(paid), // Mantém valores decimais
            paymentDate: new Date(),
          });

          if (paymentStores.payment.id) {
            await invoiceStores.update(invoice.id, {
              status: invoice.status,
              paidAmount: paid,
            });
            if (invoice.status === "Pago") {
              if (totalPenalty > 0) {
                await paymentStores.updateInvoicePenalts(invoice.id, {
                  status: true,
                });
              }
              if (
                classe.value.classe.monthlyFeeIncluse &&
                paymentTypeSelected.value.name === "Matricula"
              ) {
                const payload = {
                  paymentTypeId: paymentTypeFind.value.id,
                  classId: classe.value.classe.id,
                  studentId: student.value.id,
                  issueDate: new Date(),
                  dueDate: classe.value.classe.endDate,
                  month: monthFristPay,
                  amount: parseInt(classe.value.classe.monthlyFee),
                  paidAmount: parseInt(classe.value.classe.monthlyFee),
                  total: parseInt(classe.value.classe.monthlyFee),
                  status: "Pago",
                  year: new Date().getFullYear(),
                  note: `Factura de Mensalidade referente o mes de ${monthFristPay}`,
                };
                await invoiceStores.create(payload);
              }
            }
          }
        }
      });

      await Promise.all(requests);
      notifySuccess("Pagamento realizado com sucesso!");
    }

    // Recarregar as facturas
    await fetchInvoices();
  } catch (error) {
    console.log(error);
    notifyError("Erro ao realizar o pagamento");
  }
};

const handlePaidPrint = async () => {
  await handlePaid();
  router.push({
    name: "print-receipt",
    params: { receiptId: receiptId.value },
  });
};

const deleteInvoice = (invoice) => {
  invoices.value = invoices.value.filter((i) => i.id !== invoice.id);
};

const deletePenalty = (invoiceId, penaltyId) => {
  const invoice = invoices.value.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    console.warn("Fatura não encontrada!");
    return;
  }

  invoice.penalts = invoice.penalts.filter(
    (penalty) => penalty.id !== penaltyId
  );
};

const updateStudentSelect = (student) => {
  stages.value = student.enrollments;
};
const updatePaymentTypeSelect = () => {
  paymentTypeFind.value = paymentTypes.value.find(
    (p) => p.name === "Matricula"
  );
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
    notifyError("Error ao buscar estudantes");
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

/* computed */
const totalPayments = computed(
  () => parseFloat(totalMonthFees.value) + parseFloat(totalPenalty.value)
);
const totalMonthFees = computed(() =>
  invoices.value
    .filter((value) => value.status === "Pendente")
    .reduce((acc, value) => {
      return acc + parseFloat(value.amount);
    }, 0)
);
const totalPenalty = computed(() =>
  invoices.value.reduce((acc, value) => {
    const totalPenalty =
      value.penalts?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0; // Soma todas as penalidades do array
    return acc + totalPenalty;
  }, 0)
);

onMounted(async () => {
  await fetchStudents();
  await fetchPaymentTypes();
});
</script>

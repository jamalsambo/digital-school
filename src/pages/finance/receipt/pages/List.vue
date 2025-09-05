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
            :grid="$q.screen.lt.md"
          >
            <!-- 🎯 MODO CARD (mobile) -->
            <template v-slot:item="props">
              <q-card class="q-mb-sm col-xs-12">
                <q-card-section>
                  <!-- Dados principais -->
                  <div
                    v-for="col in props.cols"
                    :key="col.name"
                    class="q-mb-xs"
                  >
                    <div class="text-caption text-grey-8">{{ col.label }}</div>
                    <div class="text-body2">{{ col.value }}</div>
                  </div>

                  <!-- Ações -->
                  <div class="row q-gutter-sm q-mt-sm">
                    <q-btn
                      flat
                      dense
                      round
                      color="red"
                      icon="delete"
                      @click.stop="deleteInvoice(props.row)"
                    />
                    <q-btn
                      size="sm"
                      color="primary"
                      round
                      @click.stop="props.expand = !props.expand"
                      :icon="props.expand ? 'remove' : 'add'"
                    />
                  </div>
                </q-card-section>

                <!-- Expansão -->
                <q-slide-transition>
                  <div v-show="props.expand" class="q-pa-sm bg-grey-2">
                    <!-- Items -->
                    <div v-if="props.row.items?.length">
                      <div class="text-subtitle2 q-mb-sm">Items da factura</div>
                      <q-list dense bordered>
                        <q-item
                          v-for="(item, idx) in props.row.items"
                          :key="idx"
                        >
                          <q-item-section>
                            <q-item-label>{{ item.amount }}</q-item-label>
                            <q-item-label caption>{{
                              item.description
                            }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>

                    <!-- Multas -->
                    <div class="q-mt-sm" v-if="props.row.penalties?.length">
                      <div class="text-subtitle2 q-mb-sm">Multas Aplicadas</div>
                      <q-list dense bordered>
                        <q-item
                          v-for="(fine, idx) in props.row.penalties"
                          :key="idx"
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
                              @click.stop="deletePenalty(props.row.id, fine.id)"
                            />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </div>
                </q-slide-transition>
              </q-card>
            </template>

            <!-- 🖥️ MODO TABELA (desktop) -->
            <template v-slot:body="props">
              <q-tr :props="props">
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
                    @click.stop="deleteInvoice(props.row)"
                  />
                </q-td>

                <q-td auto-width>
                  <q-btn
                    size="sm"
                    color="primary"
                    round
                    @click.stop="props.expand = !props.expand"
                    :icon="props.expand ? 'remove' : 'add'"
                  />
                </q-td>
              </q-tr>

              <!-- Conteúdo expandido -->
              <q-tr v-show="props.expand" :props="props">
                <q-td colspan="100%">
                  <div class="q-pa-md bg-grey-2">
                    <div v-if="props.row.items?.length">
                      <div class="text-h6 q-mb-md">Items da factura</div>
                      <q-list bordered>
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
                    </div>

                    <div class="text-h6 q-mb-md">Multas Aplicadas</div>
                    <q-list bordered v-if="props.row.penalties?.length">
                      <q-item
                        v-for="(fine, index) in props.row.penalties"
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
                            @click.stop="deletePenalty(props.row.id, fine.id)"
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

            <!-- Rodapé -->
            <template v-slot:bottom>
              <div class="q-pa-md bg-grey-2 text-right">
                <div>
                  Total facturas pagos:
                  <strong>{{ summary.totalInvoices }}</strong>
                </div>
                <div>
                  Total de items da factura:
                  <strong>{{ summary.totalItems }}</strong>
                </div>
                <div>
                  Total de multas: <strong>{{ summary.totalPenalties }}</strong>
                </div>
                <div>
                  Total Sub Total: <strong>{{ summary.totalOriginal }}</strong>
                </div>
                <div>
                  Total Geral: <strong>{{ summary.totalFinal }}</strong>
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
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "src/pages/auth/store";
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
const authStore = useAuthStore();
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
const options = ref(students.value);
const stages = ref([]);
const invoices = ref([]);
const paymentTypes = ref([]);
const paymentTypeSelected = ref(null);
const code = ref(null);
const method = ref(null);
const receipt = ref();
const paymentTypeFind = ref();
const summary = ref(null);

/* setup methods */
const fetchInvoices = async () => {
  try {
    await invoiceStores.find({
      classId: classe.value.classe.id,
      paymentTypeId: paymentTypeSelected.value.id,
      studentId: student.value.id,
    });

    invoices.value = invoiceStores.invoices.invoices.filter((value) =>
      ["Pendente", "Parcial"].includes(value.status)
    );
    summary.value = invoiceStores.invoices.summary;
  } catch (error) {
    notifyError("Erro ao buscar facturas");
  }
};

const handlePaid = async () => {
  try {
    const payload = {
      transactionCode: code.value || "",
      paymentMethod: method.value,
      studentId: student.value.id,
      note: "",
      institutionId: authStore.user.institutionId,
    };
    const invoice = invoices.value.map((invoice) => {
      return {
        id: invoice.id,
        originalTotal: invoice.originalTotal,
        items: invoice.items,
        penalties: invoice.penalties,
      };
    });
    await receiptStores.create({
      receiptData: payload,
      invoice: invoice,
    });
     receipt.value = receiptStores.receipt
    if (!receipt.value) {
      notifyError("Ocorreu um erro no pagamento da factura");
    }

    notifySuccess("Pagamento efetuado com sucesso");
  } catch (error) {
    console.log(error);
    notifyError("Erro ao realizar o pagamento");
  }
};

const handlePaidPrint = async () => {
  await handlePaid();
  if (receipt.value)
    router.push({
      name: "print-receipt",
      params: { receiptId: receipt.value },
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
    (p) => p.name === "Mensalidade"
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
      return acc + parseFloat(value.total);
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

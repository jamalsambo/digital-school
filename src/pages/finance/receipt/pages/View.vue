<template>
  <q-page padding="">
    <div class="invoice-container" ref="invoiceContent" padding="">
      <q-card flat bordered class="q-pa-md shadow-2">
        <div class="row justify-between items-center">
          <div>
            <q-img
              :src="`http://localhost:4000/upload/${institution?.logo}`"
              width="100px"
            />
            <div class="text-h6">{{ institution?.name }}</div>
            <div class="text-caption">
              Cidade da {{ institution?.district?.name }} -
              {{ institution?.neighborhood }} - {{ institution?.address }}
              <div class="text-caption">
                {{ institution?.mainContact }}
                {{ `- ` + institution?.alternativeContact }}
                {{ `- ` + institution?.fixed }}
              </div>
            </div>
            <div class="text-caption">{{ institution?.email }}</div>
            <div class="text-caption">NUIT: {{ institution?.nuit }}</div>
          </div>
          <qrcode-generator value="https://example.com" size="100" />
        </div>
        <q-separator class="q-my-md" />
        <div class="row q-col-gutter-x-sm">
          <div class="col-md-8" style="border: 1px solid #ccc">
            <div class="row justify-between">
              <div>Estudante</div>
              <div style="margin-right: 5px">{{ student?.number }}</div>
            </div>

            <div class="row justify-between">
              <div>Nome</div>
              <div style="margin-right: 5px">
                {{ student?.basicInformation?.fullName }}
              </div>
            </div>

            <div class="row justify-between">
              <div>Classe</div>
              <div style="margin-right: 5px">
                {{ classe?.course?.name }}
              </div>
            </div>

            <div class="row justify-between">
              <div>Turma</div>
              <div style="margin-right: 5px">{{ classe?.name }}</div>
            </div>
          </div>

          <div class="col-md-4" style="border: 1px solid #ccc">
            <div class="row justify-between">
              <div>Documento:</div>
              <div style="margin-right: 5px">Recibo</div>
            </div>

            <div class="row justify-between">
              <div>Número</div>
              <div style="margin-right: 5px">{{ receipt?.number }}</div>
            </div>

            <div class="row justify-between">
              <div>Data de emissão</div>
              <div style="margin-right: 5px">
                {{ formatDate(receipt?.createdAt) }}
              </div>
            </div>

            <div class="row justify-between">
              <div>Operador</div>
              <div style="margin-right: 5px">
                {{ authStore.user.userDetails?.basicInformation?.fullName }}
              </div>
            </div>
          </div>
        </div>
        <q-separator class="q-my-md" />
        <q-markup-table bordered separator="cell" class="q-mb-md" dense>
          <!-- Cabeçalho -->
          <thead>
            <tr class="bg-grey-4">
              <th class="text-left">Método de pagamento</th>

              <th class="text-left">Número de documento bancário</th>
            </tr>
          </thead>

          <!-- Linhas -->
          <tbody>
            <!-- Primeira Linha (Exemplo) -->
            <tr>
              <td>{{ receipt?.paymentMethod }}</td>
              <td>{{ receipt?.transactionCode }}</td>
            </tr>
            <!-- Adicione mais linhas conforme necessário -->
          </tbody>
        </q-markup-table>
        <q-table
          :rows="invoices"
          :columns="mensalidadeColumns"
          hide-bottom
          bordered
          dense
          separator="cell"
          class="bold-header"
        >
        </q-table>
        <div class="row justify-end q-mt-md">
          <div class="col-auto text-right">
            <div class="text-h7">Total da factura: {{ total }}</div>
            <div class="text-h7">Total alocado: {{ totalPaid }}</div>
            <div class="text-h7">
              Total: {{ totalPaid }} <q-separator spaced />
            </div>

            <div class="text-h7">
              <strong>São:</strong>
              {{ numberForExtension(totalPaid) }} Meticais
            </div>
          </div>
        </div>

        <div class="row justify-between q-mt-lg" style="font-size: 10px">
          <div>
            <span class="text-italic">Educar</span><br />
            <span>Documento Processado por Computador</span>
          </div>
          <span>Pagina 1/1</span>
          <div>
            <span
              >Impresso por:
              {{
                authStore?.user?.userDetails?.basicInformation?.fullName
              }} </span
            ><br />
            <span>Data: {{ formatDate(new Date()) }}</span>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
  <div class="row justify-end q-gutter-sm">
    <q-btn
      label="Voltar"
      color="secondary"
      icon="back"
      type="button"
      flat
      @click="router.back()"
    />
    <q-btn
      label="Imprimir"
      color="positive"
      icon="print"
      type="button"
      flat
      @click="exportToPDF"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAuthStore } from "src/pages/auth/store";
import { useReceiptStores } from "../stores";
import scripts from "src/composables/Scripts";
import { useRoute, useRouter } from "vue-router";

/* use stores */
const route = useRoute();
const router = useRouter();

/* use stores */
const authStore = useAuthStore();
const receiptStores = useReceiptStores();
const { getActiveClass, formatDate, formatToMZN, numberForExtension } =
  scripts();

/* Data */
const { receiptId} = route.params

const institution = computed(() => authStore.user.userDetails.institution);
const student = ref();
const receipt = ref();
const classe = ref();
const invoices = ref([]);

/* Fetch data */
const fetchReceipt = async () => {
  try {
    await receiptStores.findOne(receiptId);
    receipt.value = receiptStores.receipt;
    student.value = receipt.value.student;
    classe.value = getActiveClass(student.value.enrollments);
    invoices.value = receipt.value.payments;
  } catch (error) {
    console.error("Erro ao carregar o recibo:", error);
  }
};

const totalPaid = computed(() =>
  invoices.value.reduce((acc, value) => {
    return acc + parseFloat(value.invoice.paidAmount);
  }, 0)
);

const total = computed(() =>
  invoices.value.reduce((acc, value) => {
    return acc + parseFloat(value.invoice.total);
  }, 0)
);

const exportToPDF = async () => {
  const invoiceContent = document.querySelector(".invoice-container");
  try {
    // Capturar o conteúdo como uma imagem
    const canvas = await html2canvas(invoiceContent, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Criar o PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Adicionar a imagem ao PDF
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Acionar a janela de impressão
    pdf.autoPrint();

    // Abrir o PDF em uma nova aba para impressão
    const pdfBlob = pdf.output("bloburl");
    window.open(pdfBlob, "_blank");
    props.handleModal();
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
  }
};

const mensalidadeColumns = [
  {
    name: "number",
    align: "left",
    label: "Documento",
    field: (row) => row.invoice.number,
    headerStyle: "font-weight: bold",
  },
  {
    name: "note",
    align: "left",
    label: "Descrição",
    field: (row) => row.invoice.note,
    headerStyle: "font-weight: bold",
  },
  {
    name: "issueDate",
    align: "left",
    label: "Data de emissão",
    field: (row) => formatDate(row.invoice.issueDate),
    headerStyle: "font-weight: bold",
  },
  {
    name: "amount",
    align: "left",
    label: "Valor total ",
    field: (row) => row.invoice.total,
    headerStyle: "font-weight: bold",
  },
  {
    name: "total",
    align: "left",
    label: "Valor pago",
    field: (row) => row.amount,
    headerStyle: "font-weight: bold",
  },
  {
    name: "total",
    align: "left",
    label: "Valor pendente",
    field: (row) =>
      parseFloat(row.invoice.total) - parseFloat(row.invoice.paidAmount),
    headerStyle: "font-weight: bold",
  },
];

onMounted(async () => {
  await fetchReceipt();
});
</script>

<style scoped>
.q-card {
  font-family: "Garamond", serif;
}

.bold-header .q-table__top th {
  font-weight: bold;
}

/* Estilos personalizados */
.q-table th {
  font-weight: bold;
  background-color: #f0f0f0;
}

.q-table td,
.q-table th {
  border: 1px solid #ddd;
}
</style>

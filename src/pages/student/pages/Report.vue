<template>
  <q-page padding>
    <div>
      <q-card>
        <q-card-section>
          <q-select
                v-model="selectedMonth"
                :options="months"
                label="Selecione o estudante"
                outlined
                dense
                class="q-mb-sm"
                clearable=""
              />
        </q-card-section>
      </q-card>
    </div>
    <div class="row q-col-gutter-x-md q-mt-lg">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section>
            <canvas ref="chartCanvas"></canvas>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section>
            <canvas ref="unitChartCanvas1"></canvas>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12 q-mt-md">
        <q-card>
          <q-card-section>
            <h6>Pagamentos</h6>
            <canvas ref="paymentChartCanvas"></canvas>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12 q-mt-md">
        <q-card>
          <q-card-section>
            <h6>Relatório de Pagamentos Mensais</h6>
            <q-table
              :rows="rows"
              :columns="columns"
              row-key="month"
              flat
              bordered
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12 q-mt-md">
        <q-card>
          <q-card-section>
            <h6>Relatório de Assiduidade</h6>
            <q-table
              :rows="rows1"
              :columns="columns1"
              row-key="month"
              flat
              bordered
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12 q-mt-md">
        <q-card>
          <q-card-section>
            <h6>Relatório de Presenças por Dia</h6>

            <div class="q-mb-md">
              <q-select
                v-model="selectedMonth"
                :options="months"
                label="Filtrar por Mês"
                outlined
                dense
                class="q-mb-sm"
                clearable=""
              />
              <div>
                <q-toggle v-model="showPresent" label="Mostrar Presentes" />
                <q-toggle v-model="showAbsent" label="Mostrar Faltas" />
                <q-toggle
                  v-model="showJustified"
                  label="Mostrar Justificadas"
                />
              </div>
            </div>

            <q-table
              :rows="filteredRows"
              :columns="columns2"
              row-key="day"
              flat
              bordered
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// Filtros
const selectedMonth = ref(null);
const showPresent = ref(true);
const showAbsent = ref(true);
const showJustified = ref(true);

const chartCanvas = ref(null);
const unitChartCanvas1 = ref(null);
const paymentChartCanvas = ref(null);
// Definição das colunas da tabela
const columns = [
  {
    name: "month",
    required: true,
    label: "Mês",
    align: "left",
    field: "month",
  },
  {
    name: "paymentStatus",
    label: "Status do Pagamento",
    align: "center",
    field: "paymentStatus",
  },
  {
    name: "fine",
    label: "Multa",
    align: "center",
    field: "fine",
  },
  {
    name: "fineStatus",
    label: "Status da Multa",
    align: "center",
    field: "fineStatus",
  },
];

// Dados dos pagamentos mensais
const rows = [
  {
    month: "Janeiro",
    paymentStatus: "Pago",
    fine: "Não",
    fineStatus: "-",
  },
  {
    month: "Fevereiro",
    paymentStatus: "Pago",
    fine: "Sim",
    fineStatus: "Paga",
  },
  {
    month: "Março",
    paymentStatus: "Não Pago",
    fine: "Sim",
    fineStatus: "Não Paga",
  },
  {
    month: "Abril",
    paymentStatus: "Pago",
    fine: "Não",
    fineStatus: "-",
  },
];

const columns1 = [
  {
    name: "month",
    required: true,
    label: "Mês",
    align: "left",
    field: "month",
  },
  {
    name: "totalDays",
    label: "Dias Totais",
    align: "center",
    field: "totalDays",
  },
  {
    name: "presences",
    label: "Presenças",
    align: "center",
    field: "presences",
  },
  {
    name: "absences",
    label: "Faltas",
    align: "center",
    field: "absences",
  },
  {
    name: "attendanceRate",
    label: "Taxa de Presença",
    align: "center",
    field: "attendanceRate",
  },
];

// Dados das presenças por mês
const rows1 = [
  {
    month: "Janeiro",
    totalDays: 22,
    presences: 20,
    absences: 2,
    attendanceRate: "90.9%",
  },
  {
    month: "Fevereiro",
    totalDays: 20,
    presences: 18,
    absences: 2,
    attendanceRate: "90%",
  },
  {
    month: "Março",
    totalDays: 23,
    presences: 21,
    absences: 2,
    attendanceRate: "91.3%",
  },
];

const columns2 = [
  {
    name: "day",
    required: true,
    label: "Dia",
    align: "left",
    field: "day",
  },
  {
    name: "status",
    label: "Status",
    align: "center",
    field: "status",
  },
  {
    name: "justification",
    label: "Justificativa",
    align: "center",
    field: "justification",
  },
];

// Dados das presenças por dia
const rows2 = [
  { day: "01/01", status: "Presente", justification: "-" },
  { day: "02/01", status: "Falta", justification: "Problema de saúde" },
  { day: "03/01", status: "Presente", justification: "-" },
  { day: "04/01", status: "Falta", justification: "Viagem familiar" },
  { day: "05/01", status: "Presente", justification: "-" },
  { day: "06/01", status: "Presente", justification: "-" },
  { day: "07/01", status: "Falta", justification: "Falta justificada" },
  { day: "08/01", status: "Presente", justification: "-" },
  { day: "09/01", status: "Presente", justification: "-" },
  { day: "10/01", status: "Falta", justification: "Problema de transporte" },
];

const months = [
  { label: 'Janeiro 2023', value: '01/2023' },
  { label: 'Fevereiro 2023', value: '02/2023' },
];

// Filtrar os dados
const filteredRows = computed(() => {
  return rows2.filter(row => {
    const matchesMonth = selectedMonth.value ? row.day.includes(selectedMonth.value.value) : true;
    const matchesStatus =
      (showPresent.value && row.status === 'Presente') ||
      (showAbsent.value && row.status === 'Falta') ||
      (showJustified.value && row.justification !== '-');
    return matchesMonth && matchesStatus;
  });
});

onMounted(() => {
  const globalCtx = chartCanvas.value.getContext("2d");
  new Chart(globalCtx, {
    type: "line",
    data: {
      labels: ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Trimestre 4"],
      datasets: [
        {
          label: "Matemática",
          data: [85, 78, 92, 88],
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
        {
          label: "Português",
          data: [70, 82, 90, 85],
          borderColor: "rgba(153, 102, 255, 1)",
          fill: false,
        },
        {
          label: "Ciências",
          data: [88, 84, 79, 93],
          borderColor: "rgba(255, 159, 64, 1)",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Notas Globais do Trimestre",
        },
      },
    },
  });

  const unitCtx1 = unitChartCanvas1.value.getContext("2d");
  new Chart(unitCtx1, {
    type: "line",
    data: {
      labels: ["Matemática", "Português", "Ciências"],
      datasets: [
        {
          label: "1 Avaliacao",
          data: [85, 78, 92],
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
        {
          label: "2 Avaliacao",
          data: [70, 82, 90],
          borderColor: "rgba(153, 102, 255, 1)",
          fill: false,
        },
        {
          label: "2 Avaliacao",
          data: [88, 84, 79, 93],
          borderColor: "rgba(255, 159, 64, 1)",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Notas Unitárias",
        },
      },
    },
  });

  const globalPayments = paymentChartCanvas.value.getContext("2d");
  new Chart(globalPayments, {
    type: "bar",
    data: {
      labels: ["Matrícula", "Mensalidades", "Transportes"],
      datasets: [
        {
          label: "Valores dos Pagamentos",
          data: [500, 1200, 300], // Exemplo de valores
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)", // Matrícula
            "rgba(153, 102, 255, 0.2)", // Mensalidades
            "rgba(255, 159, 64, 0.2)", // Transportes
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)", // Matrícula
            "rgba(153, 102, 255, 1)", // Mensalidades
            "rgba(255, 159, 64, 1)", // Transportes
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Pagamentos - Matrícula, Mensalidades e Transportes",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Valor (R$)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Tipo de Pagamento",
          },
        },
      },
    },
  });
});
</script>

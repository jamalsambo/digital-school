<template>
  <q-card class="q-pa-md bg-white shadow-2">
    <q-card-section class="text-center text-h6">
      Pagamentos mensais de {{ chartLabel }}
    </q-card-section>

    <q-card-section class="row q-col-gutter-md">
      <!-- Gráfico de Linha com Select acima -->
      <div class="col-md-9 col-xs-12">
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-subtitle2">Gráfico de Pagamentos</div>
          <q-select
            v-model="selectedMonth"
            :options="months"
            dense
            outlined
            hide-bottom-space
            style="width: 120px"
            label="Mês"
            emit-value
            map-options
            @update:model-value="handlePieClick(selectedMonth)"
          />
        </div>
        <canvas ref="lineCanvas"></canvas>
      </div>

      <!-- Gráfico de Pizza -->
      <div class="col-md-3 col-xs-12">
        <canvas class="q-mt-lg" ref="pieCanvas"></canvas>
      </div>
    </q-card-section>

    <q-card-section class="text-center">
      <q-btn
        label="Limpar filtro"
        color="primary"
        @click="resetFilter"
        v-if="selectedMonth"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  monthlyPayments: { type: Array, default: () => [] },
});

const lineCanvas = ref(null);
const pieCanvas = ref(null);

const lineChart = ref(null);
const pieChart = ref(null);
const chartLabel = ref("todos os meses");
const months = ref([]);
const selectedMonth = ref(null);

const allPayments = ref([]);
const filteredPayments = ref([]);

const renderLineChart = () => {
  if (lineChart.value) lineChart.value.destroy();

  months.value = filteredPayments.value.map((p) => p.month);
  const labels = months.value;
  const values = filteredPayments.value.map((p) => p.amount);

  lineChart.value = new Chart(lineCanvas.value, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `Pagamentos de ${chartLabel.value}`,
          data: values,
          borderColor: "#42A5F5",
          backgroundColor: "rgba(66,165,245,0.2)",
          tension: 0.3,
          pointBackgroundColor: "#1976D2",
          pointRadius: 4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          onClick: (event, elements) => {
            console.log(event);
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Valor (MTN)" },
        },
        x: {
          title: { display: true, text: "Mês" },
        },
      },
    },
  });
};

const renderPieChart = () => {
  if (pieChart.value) pieChart.value.destroy();

  const labels = Array.from(
    new Set(
      filteredPayments.value.flatMap((month) =>
        month.paymentTypes.map((pt) => pt.name)
      )
    )
  );
  const data = Array.from(
    new Set(
      filteredPayments.value.flatMap((month) =>
        month.paymentTypes.map((pt) => pt.amount)
      )
    )
  );
  const colors = [
    "#42A5F5",
    "#66BB6A",
    "#FFA726",
    "#AB47BC",
    "#FF7043",
    "#26C6DA",
    "#EF5350",
    "#9CCC65",
    "#FFCA28",
    "#5C6BC0",
    "#26A69A",
    "#EC407A",
  ];

  pieChart.value = new Chart(pieCanvas.value, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
};

const handlePieClick = (month) => {
  chartLabel.value = month;
  filteredPayments.value = props.monthlyPayments.filter(
    (p) => p.month === month
  );
  renderLineChart();
  renderPieChart();
};

const resetFilter = () => {
  selectedMonth.value = null;
  chartLabel.value = "todos os meses";
  filteredPayments.value = allPayments.value;
  renderLineChart();
    renderPieChart();
};

onMounted(() => {
  allPayments.value = props.monthlyPayments;
  filteredPayments.value = [...props.monthlyPayments];
  renderLineChart();
  renderPieChart();
});

watch(
  () => props.monthlyPayments,
  () => {
    allPayments.value = props.monthlyPayments;
    filteredPayments.value = selectedMonth.value
      ? props.monthlyPayments.filter((p) => p.month === selectedMonth.value)
      : props.monthlyPayments;
    renderLineChart();
    renderPieChart();
  }
);
</script>

<style scoped>
.q-card {
  width: 100%;
}
canvas {
  height: 400px !important;
}
</style>

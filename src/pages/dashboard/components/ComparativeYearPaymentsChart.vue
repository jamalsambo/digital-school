<template>
  <q-card class="q-pa-md bg-white shadow-2">
    <q-card-section>
      <canvas ref="chartCanvas"></canvas>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  yearlyComparison: { type: Object, default: () => {} },
});

const chartCanvas = ref(null);
const chartInstance = ref(null);
;
const months = ref([]);
const currentYearData = ref([]);
const previousYearData = ref([]);

const renderChart = () => {
  // Destroi gráfico anterior se existir
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  chartInstance.value = new Chart(chartCanvas.value, {
    type: "line",
    data: {
      labels: months.value,
      datasets: [
           {
          label: `Ano ${props.yearlyComparison?.previousYear.year}`,
          data: previousYearData.value,
          borderColor: "gray",
          backgroundColor: "rgba(128,128,128,0.2)",
          tension: 0.3,
        },
        {
          label: `Ano ${props.yearlyComparison?.currentYear.year}`,
          data: currentYearData.value,
          borderColor: "blue",
          backgroundColor: "rgba(0,0,255,0.2)",
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        title: {
          display: true,
          text: 'Comparativo Anual de Pagamentos'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Valor (MTN)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Meses",
          },
        },
      },
    },
  });
};

onMounted(() => {
  updateChart();
});

// Caso os dados possam mudar dinamicamente
watch(() => props.yearlyComparison, () => {
  updateChart();
}, { deep: true });

const updateChart = () => {
  months.value = props.yearlyComparison?.currentYear.monthlyPayments.map((p) => p.month);
  currentYearData.value = props.yearlyComparison?.currentYear.monthlyPayments.map(
    (p) => p.amount
  );
  previousYearData.value = props.yearlyComparison?.previousYear.monthlyPayments.map(
    (p) => p.amount
  );
  renderChart();
};
</script>

<style scoped>

canvas {
  height: 400px;
}
</style>

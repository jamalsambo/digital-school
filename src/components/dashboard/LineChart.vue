<template>
  <q-card class="q-pa-md bg-white shadow-2">
    <q-card-section class="text-center text-h6">
      {{ title }}
      <q-select v-model="selectedYear" :options="years" dense class="q-ml-md" />
    </q-card-section>
    <q-card-section>
      <canvas ref="chartCanvas"></canvas>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  title: String,
  labels: Array,
  dataset1: Object,
  dataset2: Object,
});

const chartCanvas = ref(null);
const chartInstance = ref(null);
const selectedYear = ref("2024");
const years = ["2022", "2023", "2024"];

onMounted(() => {
  renderChart();
});

watch(selectedYear, () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  renderChart();
});

const renderChart = () => {
  chartInstance.value = new Chart(chartCanvas.value, {
    type: "bar",
    data: {
      labels: props.labels,
      datasets: [props.dataset1, props.dataset2],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
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
  });
};
</script>

<style scoped>
.q-card {
  width: 100%;
  max-width: 600px;
  margin: auto;
}
canvas {
  height: 300px;
}
</style>

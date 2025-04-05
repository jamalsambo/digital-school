<template>
  <q-card class="chart-container">
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
      <canvas ref="chartCanvas"></canvas>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { defineProps, onMounted, onBeforeUnmount, watch, ref } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  data: Array,
  title: String,
  labelKey: String,
  valueKey: String
});

const chartCanvas = ref(null);
let chartInstance = null;

const createChart = () => {
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.data.labels = props.data.map(item => item[props.labelKey]);
    chartInstance.data.datasets[0].data = props.data.map(item => item[props.valueKey]);
    chartInstance.update(); // Apenas atualiza o gráfico sem recriar
  } else {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'line',
      data: {
        labels: props.data.map(item => item[props.labelKey]),
        datasets: [{
          label: props.title,
          data: props.data.map(item => item[props.valueKey]),
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
};

// Atualiza os dados sem recriar o gráfico
watch(() => props.data, () => {
  createChart();
}, { deep: true });

onMounted(() => {
  createChart();
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 500px;
  height: 300px;
}
</style>

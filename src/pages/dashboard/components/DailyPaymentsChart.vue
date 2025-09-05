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
  dailyPayments: { type: Array, default: () => [] },
});

const chartCanvas = ref(null);
const chartInstance = ref(null);

const days = ref([]);
const payments = ref([]);

const renderChart = () => {
  // Destroi gráfico anterior se existir
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  chartInstance.value = new Chart(chartCanvas.value, {
    type: "line",
    data: {
      labels: days.value,
      datasets: [
          {
       label: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        data: payments.value,
        borderColor: '#42A5F5', // azul suave
        backgroundColor: 'rgba(66, 165, 245, 0.2)', // azul com transparência
        tension: 0.3,
        pointBackgroundColor: '#1976D2', // pontos mais escuros
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
          position: "top",
        },
        title: {
          display: true,
          text: ' Pagamentos Diários'
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
            text: "Dia",
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
watch(() => props.dailyPayments, () => {
  updateChart();
}, { deep: true });

const updateChart = () => {
  days.value = props.dailyPayments.map(p => p.day);
  payments.value = props.dailyPayments.map(p => p.amount);
  renderChart();
};
</script>

<style scoped>

canvas {
  height: 400px;
}
</style>

<template>
  <q-card class="q-pa-md">
    <div ref="chartRef" class="chart-container"></div>
  </q-card>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  payments: {
    type: Array,
    required: true,
  },
});

const chartRef = ref(null);

const paymentData = props.payments;

// Função para processar os dados
const processPayments = (data) => {
  const paymentStats = {};

  data.forEach((payment) => {
    const month = payment.month;
    const typeName = payment.type.name;

    if (!paymentStats[month]) {
      paymentStats[month] = {};
    }

    if (!paymentStats[month][typeName]) {
      paymentStats[month][typeName] = 0;
    }

    paymentStats[month][typeName]++;
  });

  return paymentStats;
};

onMounted(() => {
  const processedData = processPayments(paymentData);

  // Obter os meses em ordem
  const monthOrder = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  const months = monthOrder.filter((m) =>
    Object.keys(processedData).includes(m)
  );

  // Obter os tipos de pagamento únicos
  const paymentTypes = [...new Set(paymentData.map((p) => p.type.name))];

  // Criar séries de dados para cada tipo de pagamento
  const seriesData = paymentTypes.map((type) => ({
    name: type,
    type: "bar",
    stack: "total",
    data: months.map((month) => processedData[month]?.[type] || 0),
  }));

  const chart = echarts.init(chartRef.value);

  chart.setOption({
    title: { text: "Pagamentos por Mês e Tipo" },
    tooltip: { trigger: "axis" },
    legend: { data: paymentTypes },
    xAxis: {
      type: "category",
      data: months,
    },
    yAxis: { type: "value" },
    series: seriesData,
  });

  window.addEventListener("resize", () => chart.resize());
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>

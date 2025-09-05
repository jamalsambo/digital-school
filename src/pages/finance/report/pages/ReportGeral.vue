<template>
  <q-page padding>
    <q-card class="q-pa-lg shadow-2 rounded-borders bg-grey-1">
      <!-- Cabeçalho -->
      <q-card-section class="row items-center q-gutter-sm">
        <q-icon name="insert_chart" size="md" color="primary" />
        <div class="text-h6 text-primary">
          Filtro de Período do Relatório Financeiro
        </div>
      </q-card-section>

      <q-separator />

      <!-- Seleção de Datas -->
      <q-card-section class="row q-col-gutter-md">
        <!-- Data Início -->
        <q-input
          v-model="startDate"
          label="Data de Início"
          mask="####-##-##"
          outlined
          dense
          color="primary"
          class="col-12 col-md-6"
        >
          <template #prepend>
            <q-icon name="event" />
          </template>
          <template #append>
            <q-icon name="calendar_month" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="startDate" mask="YYYY-MM-DD" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- Data Fim -->
        <q-input
          v-model="endDate"
          label="Data de Fim"
          mask="####-##-##"
          outlined
          dense
          color="primary"
          class="col-12 col-md-6"
        >
          <template #prepend>
            <q-icon name="event" />
          </template>
          <template #append>
            <q-icon name="calendar_month" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="endDate" mask="YYYY-MM-DD" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>

      <!-- Ação -->
      <q-card-actions align="right">
        <q-btn
          label="Gerar Relatório"
          color="primary"
          icon="analytics"
          no-caps
          unelevated
          class="q-px-md"
          @click="gerarRelatorio"
        />
      </q-card-actions>
    </q-card>
    <q-card class="q-pa-sm shadow-2 rounded-borders bg-grey-1 q-mt-md">
      <div class="row q-col-gutter-x-md q-mt-lg">
        <div class="col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <Card
            :item="{
              title: 'Receitas totais',
              icon: 'trending_up',
              value: formatToMZN(report?.paidAmountPayment || 0),
              color1: '#2ecc71',
              color2: '#28a745',
            }"
          />
        </div>
        <div class="col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <Card
            :item="{
              title: 'Despesas totais',
              icon: 'trending_down',
              value: formatToMZN(report?.amoutExpenses || 0),
              color1: '#dc3545',
              color2: '#e74c3c',
            }"
          />
        </div>
        <div class="col-md-4 col-sm-12 col-xs-12">
          <Card
            :item="{
              title: 'Saldo do período',
              icon: 'equalizer',
              value: formatToMZN(report?.paidAmountPayment - report.amoutExpenses || 0),
              color1: '#17a2b8',
              color2: '#3498db',
            }"
          />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useFinanceReportStores } from "../stores";
import Card from "src/components/dashboard/Card.vue";
import scripts from "src/composables/Scripts";

/* setup stores */
const financeReportStores = useFinanceReportStores();
const { formatToMZN } = scripts();
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');

/* setup dada */
const report = ref({});
const startDate = ref(`${year}-${month}-01`);
const endDate = ref(`${year}-${month}-${day}`);

const gerarRelatorio = async () => {
  try {
    await financeReportStores.findFinanceReport(startDate.value, endDate.value);
    report.value = financeReportStores.report;
  } catch (error) {
    console.log(error);
  }
};

onMounted(gerarRelatorio)
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>

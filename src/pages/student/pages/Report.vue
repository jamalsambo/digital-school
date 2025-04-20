<template>
  <q-page padding>
    <div>
      <q-card>
        <q-card-section>
          <q-select
            v-model="student"
            :options="students"
            label="Selecione o estudante"
            option-label="name"
            outlined
            dense
            class="q-mb-sm"
            clearable=""
            @update:model-value="updateStudent(student)"
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
            <q-select
              class="q-pa-none"
              v-model="cicloSelecionado"
              :options="ciclosDisponiveis"
              label="Selecionar Ciclo"
              @update:model-value="renderChart"
              dense
            />

            <canvas ref="unitChartCanvas1"></canvas>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12 q-mt-md">
        <q-card>
          <q-card-section>
            <h6>Pagamentos</h6>
            <canvas id="graficoPagamentos" width="400" height="200"></canvas>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12 q-mt-md">
        <q-card>
          <q-card-section>
            <h6>Relatório de Pagamentos Mensais</h6>
            <q-table
              :rows="invoices"
              :columns="columnsPayments"
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
              :rows="summaryAttendances"
              :columns="columnsSummaryAttendances"
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
              :columns="columnsAttedanceDay"
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
import { useStudentStores } from "../store";
import { useInstitutionStores } from "src/pages/institution/store";
import scripts from "../scripits";
import columnsPayments from "../components/ColumnsPaymentsReport";
import columnsAttedanceDay from "../components/ColumnsAttendancesReports";
import columnsSummaryAttendances from "../components/ColumnsSummaryAttendances";

Chart.register(...registerables);

/* ==== STORES & SCRIPTS ==== */
const studentsStores = useStudentStores();
const institutionStores = useInstitutionStores();
const { groupedByCicleFinalNotes } = scripts();

/* ==== REATIVIDADE PRINCIPAL ==== */
const students = ref([]);
const student = ref(null);
const evolutions = ref([]);
const invoices = ref([]);
const attendances = ref([]);
const summaryAttendances = ref([]);

const institution = computed(() => institutionStores.institution);
const cicloSelecionado = ref(1);
const ciclosDisponiveis = computed(() => Array.from({ length: institution.value.regime }, (_, i) => i + 1))

const selectedMonth = ref(null);
const showPresent = ref(true);
const showAbsent = ref(true);
const showJustified = ref(true);

const chartCanvas = ref(null);
const unitChartCanvas1 = ref(null);
let chart;

const months = [
  { label: "Janeiro 2023", value: "01/2023" },
  { label: "Fevereiro 2023", value: "02/2023" },
];

/* ==== FUNÇÃO PRINCIPAL: Quando Estudante é Selecionado ==== */
const updateStudent = (value) => {
  student.value = value;
  evolutions.value = value.evolutions;
  invoices.value = value.invoices;
  attendances.value = value.attendances;

  drawNotasGlobaisChart(value.evolutions);
  drawGraficoPagamentos();
  summaryAttendances.value = processarFrequenciasPorMes(attendances.value);

  const ciclos = [...new Set(value.evolutions.map((e) => e.cicle))];
  cicloSelecionado.value = ciclos[0] || 1;
  renderChart();
};

/* ==== GRÁFICO: Notas Globais por Trimestre ==== */
const drawNotasGlobaisChart = (evolutions) => {
  const result = groupedByCicleFinalNotes(evolutions);
  const labels = Object.keys(result);

  const disciplinas = new Set();
  labels.forEach((cicle) => {
    Object.keys(result[cicle]).forEach((disciplina) => disciplinas.add(disciplina));
  });

  const datasets = Array.from(disciplinas).map((disciplina) => {
    const data = labels.map((cicle) => result[cicle][disciplina]?.avg ?? null);
    return {
      label: disciplina,
      data,
      borderColor: randomColor(),
      fill: false,
    };
  });

  const ctx = chartCanvas.value.getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Notas Globais do Trimestre" },
      },
    },
  });
};

/* ==== GRÁFICO: Notas por Ciclo ==== */
const gerarDadosPorCiclo = (cicle) => {
  const filtrados = evolutions.value.filter((e) => e.cicle === cicle);
  const disciplinasMap = {};

  filtrados.forEach(({ developmentAreaActivity, evolutionType, note }) => {
    const disciplina = developmentAreaActivity.activity.name;
    const avaliacao = evolutionType.name;

    if (!disciplinasMap[disciplina]) {
      disciplinasMap[disciplina] = {};
    }

    disciplinasMap[disciplina][avaliacao] = Number(note);
  });

  const labels = Object.keys(disciplinasMap);
  const avaliacaoSet = new Set();

  Object.values(disciplinasMap).forEach((avals) => {
    Object.keys(avals).forEach((av) => avaliacaoSet.add(av));
  });

  const avaliacoes = Array.from(avaliacaoSet);

  const datasets = avaliacoes.map((avaliacao, index) => ({
    label: avaliacao,
    data: labels.map((disciplina) => disciplinasMap[disciplina][avaliacao] || 0),
    borderColor: [
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(255, 99, 132, 1)",
    ][index % 4],
    fill: false,
  }));

  return { labels, datasets };
};

const renderChart = () => {
  const { labels, datasets } = gerarDadosPorCiclo(cicloSelecionado.value);
  if (chart) chart.destroy();

  const ctx = unitChartCanvas1.value.getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: `Notas Unitárias - Ciclo ${cicloSelecionado.value}` },
      },
    },
  });
};

/* ==== GRÁFICO: Pagamentos ==== */
const drawGraficoPagamentos = () => {
  const agrupado = invoices.value.reduce((acc, invoice) => {
    const tipo = invoice.paymentType.name;
    acc[tipo] = (acc[tipo] || 0) + parseInt(invoice.amount);
    return acc;
  }, {});

  const labels = Object.keys(agrupado);
  const valores = Object.values(agrupado);
  const backgroundColors = gerarCores(labels.length);
  const borderColors = backgroundColors.map((cor) => cor.replace("0.2", "1"));

  const ctx = document.getElementById("graficoPagamentos").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Total por Tipo de Pagamento",
        data: valores,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Totais de Pagamentos Agrupados por Tipo" },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Valor Total (R$)" },
        },
        x: {
          title: { display: true, text: "Tipo de Pagamento" },
        },
      },
    },
  });
};

/* ==== PROCESSADOR: Frequências Mensais ==== */
const processarFrequenciasPorMes = (attendances) => {
  const resumo = {};

  attendances.forEach(({ classAttendance, status }) => {
    const data = new Date(classAttendance.classDate);
    const mesAno = data.toLocaleString("pt-PT", { month: "long", year: "numeric" });

    if (!resumo[mesAno]) {
      resumo[mesAno] = { month: mesAno, totalDays: 0, presences: 0, absences: 0 };
    }

    resumo[mesAno].totalDays++;
    status === "Presente"
      ? resumo[mesAno].presences++
      : resumo[mesAno].absences++;
  });

  return Object.values(resumo).map((mes) => ({
    ...mes,
    attendanceRate: ((mes.presences / mes.totalDays) * 100).toFixed(2) + "%",
  }));
};

/* ==== UTILS ==== */
const gerarCores = (quantidade) =>
  Array.from({ length: quantidade }, () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  });

const randomColor = () =>
  `rgba(${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)}, 1)`;

/* ==== FETCH INICIAL ==== */
const fetchStudents = async () => {
  try {
    await studentsStores.list();
    students.value = studentsStores.students.map((s) => ({
      name: s.basicInformation?.fullName || "NA",
      id: s.id,
      ...s,
    }));
  } catch (error) {
    console.error("Erro ao carregar estudantes:", error);
  }
};

/* ==== FILTRO TABELA DE PRESENÇAS ==== */
const filteredRows = computed(() => {
  return attendances.value.filter((row) => {
    const matchesMonth = selectedMonth.value
      ? row.day.includes(selectedMonth.value.value)
      : true;

    const matchesStatus =
      (showPresent.value && row.status === "Presente") ||
      (showAbsent.value && row.status === "Ausente") ||
      (showJustified.value && row.justification !== "-");

    return matchesMonth && matchesStatus;
  });
});

/* ==== ON MOUNT ==== */
onMounted(fetchStudents);
</script>


<template>
  <q-page class="edigital-page">

    <!-- Top Bar -->
    <div class="page-topbar row items-center q-px-xl q-py-md">
      <q-btn
        flat round dense
        icon="arrow_back_ios_new"
        class="back-btn q-mr-md"
        @click="$router.back()"
      />

      <div class="col">
        <q-breadcrumbs class="breadcrumb-nav" active-color="primary" separator="›">
          <q-breadcrumbs-el label="Dashboard" icon="home" to="/" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Estudantes" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Relatório" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="assessment" size="1.3rem" color="white" />
          </div>
          <span>Relatório do Estudante</span>
        </div>
      </div>
    </div>

    <div class="q-px-xl q-pb-xl q-pt-lg q-gutter-lg">

      <!-- Selector de Estudante -->
      <q-card class="form-card" flat>
        <div class="form-card-header row items-center q-px-lg q-py-md">
          <div class="form-header-icon q-mr-md">
            <q-icon name="person_search" size="1.2rem" color="white" />
          </div>
          <div>
            <div class="form-header-title">Selecionar Estudante</div>
            <div class="form-header-sub">Escolha um estudante para visualizar o relatório completo</div>
          </div>
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-md items-end">
            <div class="col-md-6 col-12">
              <div class="field-label">Estudante</div>
              <q-select
                v-model="student"
                :options="students"
                option-label="name"
                placeholder="Selecione o estudante..."
                outlined dense
                class="edigital-input"
                clearable
                @update:model-value="updateStudent"
              >
                <template #prepend>
                  <q-icon name="person_search" color="grey-5" size="1rem" />
                </template>
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">Nenhum resultado</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>

          <!-- Student Pill -->
          <div class="student-pill row items-center q-gutter-sm q-mt-md" v-if="student">
            <q-avatar size="36px" class="student-pill-avatar">
              <q-icon name="person" color="white" size="1.1rem" />
            </q-avatar>
            <div>
              <div class="student-pill-name">{{ student.name }}</div>
              <div class="student-pill-sub">
                {{ evolutions.length }} evolução(ões) · {{ invoices.length }} pagamento(s) · {{ attendances.length }} presença(s)
              </div>
            </div>
            <q-space />
            <q-btn flat round dense icon="close" size="sm" color="grey-5" @click="clearStudent" />
          </div>
        </q-card-section>
      </q-card>

      <!-- Empty State -->
      <q-card v-if="!student" class="form-card empty-card" flat>
        <q-card-section class="column items-center q-py-xl">
          <div class="empty-icon-wrap q-mb-md">
            <q-icon name="assessment" size="3rem" color="white" />
          </div>
          <div class="empty-title">Nenhum estudante seleccionado</div>
          <div class="empty-sub">Selecione um estudante acima para visualizar o relatório completo</div>
        </q-card-section>
      </q-card>

      <template v-else>

        <!-- Stats Row -->
        <div class="row q-gutter-md">
          <div class="stat-card col" v-for="stat in stats" :key="stat.label">
            <div class="stat-icon" :style="`background:${stat.color}18`">
              <q-icon :name="stat.icon" size="1.3rem" :style="`color:${stat.color}`" />
            </div>
            <div>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- Gráficos Row -->
        <div class="row q-col-gutter-md">

          <!-- Notas Globais -->
          <div class="col-md-6 col-12">
            <q-card class="chart-card" flat>
              <div class="chart-header row items-center q-px-lg q-py-md">
                <div class="chart-header-icon q-mr-sm">
                  <q-icon name="show_chart" size="1rem" color="white" />
                </div>
                <div>
                  <div class="chart-title">Notas Globais por Trimestre</div>
                  <div class="chart-sub">Evolução por disciplina</div>
                </div>
              </div>
              <q-separator />
              <q-card-section class="q-pa-lg">
                <canvas ref="chartCanvas"></canvas>
              </q-card-section>
            </q-card>
          </div>

          <!-- Notas por Ciclo -->
          <div class="col-md-6 col-12">
            <q-card class="chart-card" flat>
              <div class="chart-header row items-center q-px-lg q-py-md">
                <div class="chart-header-icon q-mr-sm">
                  <q-icon name="bar_chart" size="1rem" color="white" />
                </div>
                <div>
                  <div class="chart-title">Notas Unitárias por Ciclo</div>
                  <div class="chart-sub">Filtrar por ciclo lectivo</div>
                </div>
              </div>
              <q-separator />
              <q-card-section class="q-pa-lg">
                <div class="field-label q-mb-sm">Ciclo</div>
                <q-select
                  v-model="cicloSelecionado"
                  :options="ciclosDisponiveis"
                  outlined dense
                  class="edigital-input q-mb-md"
                  @update:model-value="renderChart"
                />
                <canvas ref="unitChartCanvas1"></canvas>
              </q-card-section>
            </q-card>
          </div>

        </div>

        <!-- Gráfico Pagamentos -->
        <q-card class="chart-card" flat>
          <div class="chart-header row items-center q-px-lg q-py-md">
            <div class="chart-header-icon q-mr-sm">
              <q-icon name="payments" size="1rem" color="white" />
            </div>
            <div>
              <div class="chart-title">Pagamentos por Tipo</div>
              <div class="chart-sub">Totais agrupados por tipo de pagamento</div>
            </div>
          </div>
          <q-separator />
          <q-card-section class="q-pa-lg">
            <canvas id="graficoPagamentos" width="400" height="120"></canvas>
          </q-card-section>
        </q-card>

        <!-- Tabela Pagamentos Mensais -->
        <q-card class="table-card" flat>
          <q-card-section class="q-pa-none">
            <div class="table-toolbar row items-center q-px-lg q-py-md">
              <div class="table-section-icon q-mr-sm">
                <q-icon name="receipt_long" size="1rem" color="white" />
              </div>
              <div>
                <div class="table-section-title">Relatório de Pagamentos Mensais</div>
                <div class="table-count-label">{{ invoices.length }} registo(s)</div>
              </div>
            </div>
            <q-separator />
            <q-table
              :rows="invoices"
              :columns="columnsPayments"
              row-key="month"
              class="edigital-table"
              flat
              v-model:pagination="pagination"
            />
          </q-card-section>
        </q-card>

        <!-- Tabela Assiduidade -->
        <q-card class="table-card" flat>
          <q-card-section class="q-pa-none">
            <div class="table-toolbar row items-center q-px-lg q-py-md">
              <div class="table-section-icon q-mr-sm">
                <q-icon name="event_available" size="1rem" color="white" />
              </div>
              <div>
                <div class="table-section-title">Relatório de Assiduidade</div>
                <div class="table-count-label">{{ summaryAttendances.length }} mês(es)</div>
              </div>
            </div>
            <q-separator />
            <q-table
              :rows="summaryAttendances"
              :columns="columnsSummaryAttendances"
              row-key="month"
              class="edigital-table"
              flat
              v-model:pagination="pagination"
            />
          </q-card-section>
        </q-card>

        <!-- Tabela Presenças por Dia -->
        <q-card class="table-card" flat>
          <q-card-section class="q-pa-none">
            <div class="table-toolbar row items-center justify-between q-px-lg q-py-md">
              <div class="row items-center">
                <div class="table-section-icon q-mr-sm">
                  <q-icon name="calendar_today" size="1rem" color="white" />
                </div>
                <div>
                  <div class="table-section-title">Relatório de Presenças por Dia</div>
                  <div class="table-count-label">{{ filteredRows.length }} registo(s)</div>
                </div>
              </div>

              <!-- Filtros -->
              <div class="row items-center q-gutter-sm">
                <q-select
                  v-model="selectedMonth"
                  :options="months"
                  placeholder="Filtrar por mês"
                  outlined dense clearable
                  class="edigital-input month-select"
                />
                <q-chip
                  :outline="!showPresent"
                  clickable
                  :color="showPresent ? 'positive' : 'grey-4'"
                  text-color="white"
                  dense
                  @click="showPresent = !showPresent"
                >
                  Presentes
                </q-chip>
                <q-chip
                  :outline="!showAbsent"
                  clickable
                  :color="showAbsent ? 'negative' : 'grey-4'"
                  text-color="white"
                  dense
                  @click="showAbsent = !showAbsent"
                >
                  Faltas
                </q-chip>
                <q-chip
                  :outline="!showJustified"
                  clickable
                  :color="showJustified ? 'warning' : 'grey-4'"
                  text-color="white"
                  dense
                  @click="showJustified = !showJustified"
                >
                  Justificadas
                </q-chip>
              </div>
            </div>

            <q-separator />
            <q-table
              :rows="filteredRows"
              :columns="columnsAttedanceDay"
              row-key="day"
              class="edigital-table"
              flat
              v-model:pagination="pagination"
            />
          </q-card-section>
        </q-card>

      </template>
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
import useNotify from "src/composables/UseNotify";

Chart.register(...registerables);

/* ── Stores ── */
const studentsStores = useStudentStores();
const institutionStores = useInstitutionStores();
const { groupedByCicleFinalNotes } = scripts();
const { notifyError } = useNotify();

/* ── State ── */
const students = ref([]);
const student = ref(null);
const evolutions = ref([]);
const invoices = ref([]);
const attendances = ref([]);
const summaryAttendances = ref([]);
const cicloSelecionado = ref(1);
const selectedMonth = ref(null);
const showPresent = ref(true);
const showAbsent = ref(true);
const showJustified = ref(true);
const pagination = ref({ rowsPerPage: 10 });

const chartCanvas = ref(null);
const unitChartCanvas1 = ref(null);
let chart;

/* ── Options ── */
const months = [
  { label: "Janeiro 2023", value: "01/2023" },
  { label: "Fevereiro 2023", value: "02/2023" },
];

/* ── Computed ── */
const institution = computed(() => institutionStores.institution);

const ciclosDisponiveis = computed(() =>
  Array.from({ length: institution.value.regime }, (_, i) => i + 1)
);

const stats = computed(() => [
  {
    label: "Evoluções",
    value: evolutions.value.length,
    icon: "school",
    color: "#1a3fa6",
  },
  {
    label: "Pagamentos",
    value: invoices.value.length,
    icon: "payments",
    color: "#21b573",
  },
  {
    label: "Presenças",
    value: attendances.value.filter((a) => a.status === "Presente").length,
    icon: "event_available",
    color: "#f59e0b",
  },
  {
    label: "Faltas",
    value: attendances.value.filter((a) => a.status !== "Presente").length,
    icon: "event_busy",
    color: "#ef4444",
  },
]);

const filteredRows = computed(() => {
  return attendances.value.filter((row) => {
    const matchesMonth = selectedMonth.value
      ? row.day?.includes(selectedMonth.value.value)
      : true;
    const matchesStatus =
      (showPresent.value && row.status === "Presente") ||
      (showAbsent.value && row.status === "Ausente") ||
      (showJustified.value && row.justification !== "-");
    return matchesMonth && matchesStatus;
  });
});

/* ── Methods ── */
const clearStudent = () => {
  student.value = null;
  evolutions.value = [];
  invoices.value = [];
  attendances.value = [];
  summaryAttendances.value = [];
};

const updateStudent = (value) => {
  if (!value) return clearStudent();
  evolutions.value = value.evolutions ?? [];
  invoices.value = value.invoices ?? [];
  attendances.value = value.attendances ?? [];

  drawNotasGlobaisChart(evolutions.value);
  drawGraficoPagamentos();
  summaryAttendances.value = processarFrequenciasPorMes(attendances.value);

  const ciclos = [...new Set(evolutions.value.map((e) => e.cicle))];
  cicloSelecionado.value = ciclos[0] || 1;
  renderChart();
};

/* ── Charts ── */
const drawNotasGlobaisChart = (evolutions) => {
  const result = groupedByCicleFinalNotes(evolutions);
  const labels = Object.keys(result);

  const disciplinas = new Set();
  labels.forEach((cicle) => {
    Object.keys(result[cicle]).forEach((d) => disciplinas.add(d));
  });

  const datasets = Array.from(disciplinas).map((disciplina) => ({
    label: disciplina,
    data: labels.map((cicle) => result[cicle][disciplina]?.avg ?? null),
    borderColor: randomColor(),
    fill: false,
  }));

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

const gerarDadosPorCiclo = (cicle) => {
  const filtrados = evolutions.value.filter((e) => e.cicle === cicle);
  const disciplinasMap = {};

  filtrados.forEach(({ developmentAreaActivity, evolutionType, note }) => {
    const disciplina = developmentAreaActivity.activity.name;
    const avaliacao = evolutionType.name;
    if (!disciplinasMap[disciplina]) disciplinasMap[disciplina] = {};
    disciplinasMap[disciplina][avaliacao] = Number(note);
  });

  const labels = Object.keys(disciplinasMap);
  const avaliacaoSet = new Set();
  Object.values(disciplinasMap).forEach((avals) => {
    Object.keys(avals).forEach((av) => avaliacaoSet.add(av));
  });

  const colors = [
    "rgba(75,192,192,1)",
    "rgba(153,102,255,1)",
    "rgba(255,159,64,1)",
    "rgba(255,99,132,1)",
  ];

  const datasets = Array.from(avaliacaoSet).map((avaliacao, i) => ({
    label: avaliacao,
    data: labels.map((d) => disciplinasMap[d][avaliacao] || 0),
    borderColor: colors[i % 4],
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

const drawGraficoPagamentos = () => {
  const agrupado = invoices.value.reduce((acc, invoice) => {
    const tipo = invoice.paymentType.name;
    acc[tipo] = (acc[tipo] || 0) + parseInt(invoice.amount);
    return acc;
  }, {});

  const labels = Object.keys(agrupado);
  const valores = Object.values(agrupado);
  const backgroundColors = gerarCores(labels.length);
  const borderColors = backgroundColors.map((c) => c.replace("0.2", "1"));

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
        y: { beginAtZero: true, title: { display: true, text: "Valor Total" } },
        x: { title: { display: true, text: "Tipo de Pagamento" } },
      },
    },
  });
};

/* ── Utils ── */
const processarFrequenciasPorMes = (attendances) => {
  const resumo = {};
  attendances.forEach(({ classAttendance, status }) => {
    const data = new Date(classAttendance.classDate);
    const mesAno = data.toLocaleString("pt-PT", { month: "long", year: "numeric" });
    if (!resumo[mesAno]) {
      resumo[mesAno] = { month: mesAno, totalDays: 0, presences: 0, absences: 0 };
    }
    resumo[mesAno].totalDays++;
    status === "Presente" ? resumo[mesAno].presences++ : resumo[mesAno].absences++;
  });
  return Object.values(resumo).map((mes) => ({
    ...mes,
    attendanceRate: ((mes.presences / mes.totalDays) * 100).toFixed(2) + "%",
  }));
};

const gerarCores = (n) =>
  Array.from({ length: n }, () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.2)`;
  });

const randomColor = () =>
  `rgba(${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},1)`;

/* ── Fetch ── */
const fetchStudents = async () => {
  try {
    await studentsStores.list();
    students.value = studentsStores.students.map((s) => ({
      name: s.basicInformation?.fullName || "—",
      id: s.id,
      ...s,
    }));
  } catch (error) {
    notifyError("Erro ao carregar estudantes");
  }
};

/* ── Lifecycle ── */
onMounted(fetchStudents);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap");

.edigital-page {
  min-height: 100vh;
  background: #f0f4f8;
  font-family: "DM Sans", sans-serif;
}

/* ── Top Bar ── */
.page-topbar {
  background: #ffffff;
  border-bottom: 1px solid #e8edf3;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.06);
}
.back-btn {
  background: #f0f4f8;
  color: #1a3fa6 !important;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  transition: background 0.2s;
}
.back-btn:hover { background: #e0e8f7; }

.breadcrumb-nav { font-size: 0.78rem; }
.breadcrumb-link { color: #9ca3af !important; }
.breadcrumb-active { color: #1a3fa6 !important; font-weight: 600; }

.page-title {
  font-family: "Sora", sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f2862;
}
.title-icon-wrap {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Form Card ── */
.form-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(15, 40, 98, 0.07);
  border: 1px solid #edf0f5;
}
.form-card-header {
  background: #fafbfd;
  border-bottom: 1px solid #f0f0f0;
}
.form-header-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.form-header-title {
  font-family: "Sora", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #0f2862;
}
.form-header-sub { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; }

.field-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}
.edigital-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
}
.edigital-input :deep(.q-field__control:hover) { border-color: #1a3fa6; }
.month-select { width: 180px; }

/* ── Stats ── */
.stat-card {
  background: white;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.05);
  border: 1px solid #edf0f5;
  transition: box-shadow 0.2s;
}
.stat-card:hover { box-shadow: 0 4px 20px rgba(15, 40, 98, 0.1); }
.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-value {
  font-family: "Sora", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f2862;
  line-height: 1;
}
.stat-label { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; font-weight: 500; }

/* ── Chart Cards ── */
.chart-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(15, 40, 98, 0.07);
  border: 1px solid #edf0f5;
}
.chart-header {
  background: #fafbfd;
  border-bottom: 1px solid #f0f0f0;
}
.chart-header-icon {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.chart-title {
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f2862;
}
.chart-sub { font-size: 0.74rem; color: #9ca3af; }

/* ── Table Cards ── */
.table-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(15, 40, 98, 0.07);
  border: 1px solid #edf0f5;
}
.table-toolbar {
  background: #fafbfd;
  border-bottom: 1px solid #f0f0f0;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.table-section-icon {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.table-section-title {
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f2862;
}
.table-count-label { font-size: 0.74rem; color: #9ca3af; }

/* ── Quasar Table overrides ── */
.edigital-table :deep(thead tr th) {
  font-family: "Sora", sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  background: #fafbfd;
  border-bottom: 2px solid #edf0f5;
  padding: 14px 16px;
}
.edigital-table :deep(tbody tr) { transition: background 0.15s; }
.edigital-table :deep(tbody tr:hover) { background: #f5f8ff !important; }
.edigital-table :deep(tbody tr td) {
  font-size: 0.875rem;
  color: #374151;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}

/* ── Student Pill ── */
.student-pill {
  background: #f0f6ff;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  padding: 0.75rem 1rem;
}
.student-pill-avatar {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 10px;
}
.student-pill-name {
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f2862;
}
.student-pill-sub { font-size: 0.75rem; color: #9ca3af; }

/* ── Empty State ── */
.empty-card { background: white; }
.empty-icon-wrap {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-title {
  font-family: "Sora", sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f2862;
  margin-bottom: 6px;
}
.empty-sub { font-size: 0.85rem; color: #9ca3af; text-align: center; max-width: 320px; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
  .month-select { width: 100%; }
}
</style>

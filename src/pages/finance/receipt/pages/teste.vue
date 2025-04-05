<template>
  <div class="print-container q-pa-xl">
    <!-- Cabeçalho Institucional -->
    <div class="header text-center q-mb-xl">
      <div class="row items-center">
        <div class="col-3">
          <img
            src="https://via.placeholder.com/150x150?text=Logo+Escola"
            class="school-logo"
            alt="Logo da Escola"
          >
        </div>
        <div class="col-6">
          <div class="text-h3 text-weight-bold">{{ schoolData.name }}</div>
          <div class="text-subtitle1">CNPJ: {{ schoolData.cnpj }} | Telefone: {{ schoolData.phone }}</div>
          <div class="text-subtitle1">{{ schoolData.address }}</div>
        </div>
        <div class="col-3 text-right">

        </div>
      </div>
    </div>

    <!-- Dados do Aluno -->
    <div class="student-info q-mb-xl">
      <div class="info-box q-pa-md">
        <div class="row q-col-gutter-lg">
          <div class="col-4"><strong>Nome:</strong> {{ studentData.name }}</div>
          <div class="col-2"><strong>RA:</strong> {{ studentData.id }}</div>
          <div class="col-3"><strong>Nascimento:</strong> {{ studentData.birthDate }}</div>
          <div class="col-3"><strong>Turma:</strong> {{ studentData.class }}</div>
        </div>
      </div>
    </div>

    <!-- Quadro de Resultados -->
    <div class="results-section">
      <q-table
        :rows="grades"
        :columns="columns"
        hide-pagination
        flat
        bordered
        class="grades-table"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="getStatusColor(props.row.average)"
              :label="getStatusText(props.row.average)"
            />
          </q-td>
        </template>
      </q-table>

      <!-- Legenda -->
      <div class="legend q-mt-md">
        <div class="text-caption">
          <q-icon name="circle" color="green"/> Aprovado (≥ 7.0) |
          <q-icon name="circle" color="orange"/> Recuperação (≥ 5.0 e < 7.0) |
          <q-icon name="circle" color="red"/> Reprovado (< 5.0)
        </div>
      </div>
    </div>

    <!-- Informações Complementares -->
    <div class="additional-info q-mt-xl">
      <div class="row q-col-gutter-xl">
        <div class="col-6">
          <div class="info-box q-pa-md">
            <div class="text-h6 q-mb-md">Desempenho por Área</div>
            <apexchart
              type="radar"
              height="300"
              :options="chartOptions"
              :series="chartSeries"
            />
          </div>
        </div>

        <div class="col-6">
          <div class="info-box q-pa-md">
            <div class="text-h6 q-mb-md">Dados Complementares</div>
            <div class="q-mb-sm"><strong>Total de Faltas:</strong> {{ studentData.absences }}</div>
            <div class="q-mb-sm"><strong>Frequência:</strong> {{ attendancePercentage }}%</div>
            <div class="q-mb-sm"><strong>Horas Complementares:</strong> {{ studentData.complementaryHours }}</div>
            <div class="border-top q-pt-md">
              <div class="text-weight-bold">Observações Pedagógicas:</div>
              <div class="q-mt-sm">{{ studentData.remarks }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rodapé Institucional -->
    <div class="footer q-mt-xl">
      <div class="signature-area row q-col-gutter-xl">
        <div class="col-6 text-center">
          <div class="border-top q-pt-md">Assinatura do Coordenador Pedagógico</div>
          <div class="signature-line q-mt-md"></div>
          <div class="text-caption">{{ schoolData.coordinatorName }}</div>
        </div>
        <div class="col-6 text-center">
          <div class="border-top q-pt-md">Assinatura do Responsável</div>
          <div class="signature-line q-mt-md"></div>
          <div class="text-caption">Data: _____/_____/_____</div>
        </div>
      </div>

      <div class="disclaimer q-mt-xl text-caption text-center">
        {{ schoolData.reportDisclaimer }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';


// Dados configuráveis
const schoolData = ref({
  name: 'Colégio Estadual Educacional Moderno',
  cnpj: '12.345.678/0001-99',
  phone: '(11) 9999-9999',
  address: 'Rua das Flores, 123 - Centro - São Paulo/SP',
  coordinatorName: 'Prof.ª Maria da Silva',
  reportDisclaimer: 'Documento válido somente com assinatura e carimbo. Em caso de dúvidas, contatar a secretaria escolar.'
});

const studentData = ref({
  name: 'João Carlos Pereira',
  id: '2024.1234',
  birthDate: '15/03/2012',
  class: '8º Ano A - Matutino',
  absences: 12,
  complementaryHours: 45,
  remarks: 'O aluno demonstrou excelente desenvolvimento nas atividades práticas, porém precisa reforçar a participação em trabalhos em grupo.'
});

const grades = ref([
  { subject: 'Língua Portuguesa', grade1: 8.5, grade2: 7.0, grade3: 9.2, average: 8.2 },
  { subject: 'Matemática', grade1: 9.0, grade2: 8.5, grade3: 7.8, average: 8.4 },
  { subject: 'História', grade1: 7.5, grade2: 8.0, grade3: 8.5, average: 8.0 },
  { subject: 'Ciências', grade1: 8.0, grade2: 8.0, grade3: 8.0, average: 8.0 }
]);

// Cálculos
const attendancePercentage = computed(() => {
  const totalDays = 200; // Total de dias letivos
  return (((totalDays - studentData.value.absences) / totalDays) * 100).toFixed(1);
});


// Configuração do gráfico
const chartOptions = ref({
  chart: {
    type: 'radar',
    toolbar: { show: false }
  },
  xaxis: {
    categories: grades.value.map(g => g.subject)
  },
  yaxis: {
    min: 0,
    max: 10,
    tickAmount: 5
  },
  dataLabels: {
    enabled: true
  }
});

const chartSeries = ref([{
  name: 'Desempenho',
  data: grades.value.map(g => g.average)
}]);

// Configuração da tabela
const columns = [
  { name: 'subject', label: 'Disciplina', align: 'left', field: 'subject' },
  { name: 'grade1', label: 'Aval. 1', field: 'grade1', align: 'center' },
  { name: 'grade2', label: 'Aval. 2', field: 'grade2', align: 'center' },
  { name: 'grade3', label: 'Aval. 3', field: 'grade3', align: 'center' },
  { name: 'average', label: 'Média', field: 'average', align: 'center' },
  { name: 'status', label: 'Situação', align: 'center' }
];

// Funções auxiliares
const getStatusColor = (average) => {
  if (average >= 7) return 'green';
  if (average >= 5) return 'orange';
  return 'red';
};

const getStatusText = (average) => {
  if (average >= 7) return 'Aprovado';
  if (average >= 5) return 'Recuperação';
  return 'Reprovado';
};
</script>

<style scoped>
@media print {
  .print-container {
    width: 210mm !important;
    min-height: 297mm !important;
    padding: 15mm !important;
    font-size: 12pt !important;
  }

  .school-logo {
    filter: grayscale(100%);
  }

  .qrcode {
    opacity: 0.9;
  }

  .signature-line {
    border-bottom: 1px solid #000;
    width: 70%;
    margin: 15px auto;
  }

  .info-box {
    border: 1px solid #ddd !important;
    border-radius: 4px;
  }
}

.header {
  border-bottom: 2px solid #000;
  padding-bottom: 20px;
}

.student-info {
  font-size: 1.1rem;
}

.grades-table {
  font-size: 0.95rem;
}

.grades-table :deep(th) {
  background-color: #f8f9fa !important;
  font-weight: 600;
}

.disclaimer {
  margin-top: 30px;
  color: #666;
  font-style: italic;
}

.signature-area {
  margin-top: 50px;
  padding-top: 20px;
  border-top: 2px solid #000;
}

.chart-container {
  height: 300px;
}
</style>

<template>
  <q-page class="q-pa-md informative-note-page">
    <q-card class="informative-note-card shadow-2">
      <q-card-section class="text-center q-pb-none">
        <div class="row items-center justify-center q-gutter-md">
          <q-img src="~assets/mozambique_coat_of_arms.png" alt="Emblema de Moçambique" class="coat-of-arms" width="70px" height="70px" />
          <div>
            <div class="text-h6 text-uppercase text-weight-bold">República de Moçambique</div>
            <div class="text-subtitle1 text-weight-medium">Ministério da Educação e Desenvolvimento Humano</div>
            <div class="text-subtitle2 text-weight-regular">{{ institutionName }}</div>
            <div class="text-caption">Registo n.º: {{ institutionRegistration }}</div>
          </div>
        </div>
        <q-separator class="q-my-md" />
        <div class="text-h5 text-uppercase text-weight-bolder certificate-title q-mb-md">
          Nota Informativa - {{ periodName }}
        </div>
        <div class="text-subtitle1 text-weight-medium q-mb-sm">Ano Letivo: {{ academicYear }}</div>
      </q-card-section>

      <q-card-section class="q-pt-sm certificate-details">
        <div class="q-mb-md">
          <div class="text-body1 text-weight-bold">Informações do Estudante:</div>
          <q-list dense>
            <q-item>
              <q-item-section avatar><q-icon name="person" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label>Nome Completo:</q-item-label>
                <q-item-label caption class="text-weight-bold">{{ student.fullName }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="tag" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label>N.º de Registo:</q-item-label>
                <q-item-label caption class="text-weight-bold">{{ student.registrationNumber }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="school" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label>Classe/Curso:</q-item-label>
                <q-item-label caption class="text-weight-bold">{{ student.courseName }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <q-separator class="q-my-md" />

        <div class="text-h6 q-mb-sm text-weight-bold">Desempenho por Disciplina ({{ periodName }}):</div>
        <q-list bordered separator>
          <q-item v-for="(disciplineData, disciplineName) in processedPeriodData.disciplinas" :key="disciplineName">
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ disciplineName }}</q-item-label>
              <q-item-label caption>
                Média do Período:
                <span :class="disciplineData.mediaFinalDisciplina >= processedPeriodData.notaMinimaParaTransitar ? 'text-positive' : 'text-negative'">
                  {{ disciplineData.mediaAnualDepoisExame }} valores
                </span>
                <span v-if="disciplineData.temExame" class="q-ml-sm">(Inclui nota de exame: {{ disciplineData.notaExame }})</span>
              </q-item-label>
              <q-item-label caption v-if="disciplineData.evolutionsExame && disciplineData.evolutionsExame.length > 0">
                <q-expansion-item
                  dense
                  label="Ver Detalhes do Exame"
                  class="text-caption text-blue-8"
                  header-class="q-pa-none"
                >
                  <q-card>
                    <q-card-section class="q-pa-sm">
                      <div v-for="(evolution, idx) in disciplineData.evolutionsExame" :key="idx">
                        Nota: {{ evolution.note }} ({{ evolution.evolutionTypeName }} em {{ evolution.dateCompletion }})
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon
                :name="disciplineData.mediaFinalDisciplina >= processedPeriodData.notaMinimaParaTransitar ? 'check_circle' : 'cancel'"
                :color="disciplineData.mediaFinalDisciplina >= processedPeriodData.notaMinimaParaTransitar ? 'positive' : 'negative'"
                size="sm"
              >
                <q-tooltip>
                  {{ disciplineData.mediaFinalDisciplina >= processedPeriodData.notaMinimaParaTransitar ? 'Aprovado neste período' : 'Nota abaixo do mínimo neste período' }}
                </q-tooltip>
              </q-icon>
            </q-item-section>
          </q-item>
          
        </q-list>

        <q-separator class="q-my-md" />

        <div class="text-h6 q-mb-sm text-weight-bold">Observações Gerais:</div>
        <div class="q-mb-md text-justify text-body2">
          Esta nota informativa resume o desempenho acadêmico do(a) estudante
          **{{ student.fullName }}** durante o **{{ periodName }}** do ano letivo
          **{{ academicYear }}**. Encorajamos os pais/encarregados de educação a
          reverem estes resultados e a contactarem a escola para qualquer esclarecimento ou apoio.
        </div>

        <div class="row justify-between q-mt-xl text-center signatures">
          <div class="col-5">
            <q-separator class="q-mb-sm" />
            <div class="text-weight-bold">O(A) Coordenador(a) da Classe</div>
            <div class="text-caption">(Nome e Assinatura)</div>
          </div>
          <div class="col-5">
            <q-separator class="q-mb-sm" />
            <div class="text-weight-bold">O(A) Secretário(a) Escolar</div>
            <div class="text-caption">(Nome e Assinatura)</div>
          </div>
        </div>

        <div class="q-mt-xl text-caption text-grey-7">
          <div class="row justify-between">
            <div>{{ issueLocation }}, {{ issueDate }}</div>
            <div>Ref.º: <span class="text-weight-bold">{{ noteReference }}</span></div>
          </div>
        </div>

      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { date } from 'quasar';

// --- Dados de Exemplo ---
const institutionName = ref('Escola Chiveve');
const institutionRegistration = ref('MINEDH/ESJM/2024/001');
const periodName = ref('1.º Trimestre'); // Ou '1.º Semestre', '2.º Trimestre', etc.
const academicYear = ref('2024/2025');
const issueLocation = ref('Beira'); // Adaptação para Beira, Sofala, Moçambique
const issueDate = ref(date.formatDate(Date.now(), 'DD de MMMM de YYYY'));
const noteReference = ref(`NI-${academicYear.value.split('/')[0]}-${periodName.value.replace(/[^0-9]/g, '')}-001`); // Ex: NI-2024-1-001

const student = ref({
  fullName: 'Maria de Fátima da Silva',
  registrationNumber: '2024/EST/0056',
  courseName: '10.ª Classe',
});

// Dados acadêmicos para um período específico (ex: 1º Trimestre/Semestre)
// É crucial que esta estrutura contenha APENAS os dados do período desejado.
// Se o rawAcademicData original contém todos os ciclos, você precisará filtrá-lo.
const rawPeriodAcademicData = {
  "1": { // Ano 1
    "cicles": {
      "1": { // Ciclo/Trimestre 1 (ou o que representa o seu período)
        "activities": [
          {
            "id": "dab868a8-d380-4fec-a2db-a5c016da98ef",
            "activity": { "name": "Biologia" },
            "exame": false,
            "averageNormal": 16.1,
            "evolutions": []
          },
          {
            "id": "dfdc8a16-b897-4f4b-870c-61cb471a8117",
            "activity": { "name": "Física" },
            "exame": true, // Indica que a disciplina tem exame (seja no período ou no final)
            "averageNormal": 15, // Média das avaliações normais do período
            "evolutions": [
              {
                "note": "8", // Nota do exame (se houver um exame neste período)
                "courseEvolutionType": {
                  "evolutionType": { "type": "Exame", "name": "Exame Trimestral" }
                },
                "dateCompletion": "2025-06-10"
              }
            ]
          },
          {
            "id": "7f19741a-f82f-4fac-8ee3-54711de5c837",
            "activity": { "name": "Química" },
            "exame": true, // Esta tem exame, mas a nota pode ser 0 se não for feita no período
            "averageNormal": 9,
            "evolutions": [
              {
                "note": "11",
                "courseEvolutionType": {
                  "evolutionType": { "type": "Exame", "name": "Exame Trimestral" }
                },
                "dateCompletion": "2025-06-12"
              }
            ]
          },
          {
            "id": "bba31b4d-4b82-4f5d-ba6f-4bdbdfd04f58",
            "activity": { "name": "Português" },
            "exame": false,
            "averageNormal": 12, // Nota do período
            "evolutions": []
          },
           {
            "id": "d1687140-d663-4deb-a914-455cf472d4ab",
            "activity": { "name": "Matemática" },
            "exame": false,
            "averageNormal": 7, // Nota do período - propositadamente baixa para testar "negativa"
            "evolutions": []
          }
        ]
      }
      // Outros ciclos/trimestres podem estar aqui, mas para a nota informativa,
      // você passaria apenas o ciclo/trimestre relevante para o `processarDadosAcademicos`.
    }
  }
};


// Re-utilizando a função de processamento de dados acadêmicos (adaptada para o contexto do período)
// ATENÇÃO: Esta função considera 'averageNormal' como a base e 'exame' para cálculo final.
// Certifique-se de que a estrutura de dados 'rawPeriodAcademicData' alimente corretamente
// as notas do período desejado.

const processedPeriodData = ref({});

function processarDadosAcademicos(data) {
  const resultados = {};
  let totalGlobalMediasFinais = 0;
  let countDisciplinasComMediaFinal = 0;
  let temNotaNegativa = false;
  const notaMinimaParaTransitar = 10; // Criterio de "aprovação" por disciplina no período

  for (const yearKey in data) {
    const yearData = data[yearKey];

    if (yearData.cicles) {
      for (const cicleKey in yearData.cicles) {
        // CORREÇÃO CRUCIAL: Acesso correto aos dados do ciclo
        const cicleData = yearData.cicles[cicleKey];

        if (cicleData.activities) {
          cicleData.activities.forEach(activity => {
            const disciplineName = activity.activity.name;

            if (!resultados[disciplineName]) {
              resultados[disciplineName] = {
                totalNotasNormais: 0,
                countNotasNormais: 0,
                notaExame: null,
                temExame: false, // Indica se a disciplina está configurada para ter exame
                evolutionsExame: [],
                mediaFinalDisciplina: null // Para armazenar o valor numérico da média final
              };
            }

            // A variável `exame` no `activity` indica se a disciplina está configurada para ter exame
            if (activity.exame === true) {
                resultados[disciplineName].temExame = true;
            }

            // Considerar averageNormal para o cálculo da média normal do período
            if (activity.averageNormal !== null && typeof activity.averageNormal === 'number') {
              resultados[disciplineName].totalNotasNormais += activity.averageNormal;
              resultados[disciplineName].countNotasNormais += 1;
            }

            // Filtrar evolutions do tipo 'exame' e capturar a nota (se houver exame no período)
            if (activity.evolutions && activity.evolutions.length > 0) {
              activity.evolutions.forEach(evolution => {
                if (evolution.courseEvolutionType && evolution.courseEvolutionType.evolutionType && evolution.courseEvolutionType.evolutionType.type === 'Exame') {
                  const exameNote = parseFloat(evolution.note);
                  if (!isNaN(exameNote)) {
                    resultados[disciplineName].notaExame = exameNote;
                    resultados[disciplineName].evolutionsExame.push({
                      note: evolution.note,
                      dateCompletion: evolution.dateCompletion,
                      evolutionTypeName: evolution.courseEvolutionType.evolutionType.name
                    });
                  }
                }
              });
            }
          });
        }
      }
    }
  }

  // Calcular a média final para cada disciplina e verificar notas negativas
  const mediasAnuaisFinais = {}; // Renomeado para mediasPeriodoFinais no conceito
  for (const discipline in resultados) {
    const { totalNotasNormais, countNotasNormais, notaExame, temExame, evolutionsExame } = resultados[discipline];

    // Calcula a média das notas normais do período. Se não houver, será 0.
    let mediaPeriodoNormal = countNotasNormais > 0 ? (totalNotasNormais / countNotasNormais) : 0;
    let mediaFinalCalculadaNoPeriodo;

    // Se a disciplina tem exame (e a nota do exame existe para o período), recalcular.
    // A ponderação (2 * normal + exame) / 3 pode ser ajustada para o cálculo trimestral.
    // Para uma Nota Informativa, pode-se simplesmente mostrar a média das avaliações do período.
    // Se quiser manter a lógica de "exame no período", a lógica abaixo serve.
    if (temExame && notaExame !== null) { // Apenas se houver exame E nota de exame para o período
        const notaExameConsiderada = notaExame; // Já é um número ou 0
        mediaFinalCalculadaNoPeriodo = (2 * mediaPeriodoNormal + notaExameConsiderada) / 3;
    } else {
        mediaFinalCalculadaNoPeriodo = mediaPeriodoNormal; // Apenas a média das notas normais do período
    }


    // Aqui, para a nota informativa, não vamos acumular para uma "média global final"
    // no sentido de transição de classe, mas sim uma média do período.
    // Se quiser uma "média do período", acumule aqui.
    totalGlobalMediasFinais += mediaFinalCalculadaNoPeriodo; // Usado para a média geral do período
    countDisciplinasComMediaFinal += 1; // Contador de disciplinas com dados

    if (mediaFinalCalculadaNoPeriodo < notaMinimaParaTransitar) {
        temNotaNegativa = true;
    }

    mediasAnuaisFinais[discipline] = {
      mediaAnualAntesExame: mediaPeriodoNormal.toFixed(2), // Média das avaliações "normais" do período
      mediaAnualDepoisExame: mediaFinalCalculadaNoPeriodo.toFixed(2), // Média final do período (com exame, se aplicável)
      notaExame: notaExame !== null ? notaExame.toFixed(2) : '0.00',
      temExame: temExame,
      evolutionsExame: evolutionsExame,
      mediaFinalDisciplina: mediaFinalCalculadaNoPeriodo // Valor numérico para a verificação de aprovação
    };
  }

  // Média global do período (média das médias finais das disciplinas do período)
  const mediaGlobalFinal = countDisciplinasComMediaFinal > 0 ? (totalGlobalMediasFinais / countDisciplinasComMediaFinal) : 0;

  // Para uma nota informativa, o "transitaDeClasse" pode ser substituído por um "Status no Período"
  // indicando se o aluno está com bom aproveitamento geral no período.
  let statusAproveitamentoPeriodo = false;
  if (mediaGlobalFinal >= notaMinimaParaTransitar && !temNotaNegativa) {
      statusAproveitamentoPeriodo = true;
  }

  return {
    disciplinas: mediasAnuaisFinais,
    mediaGlobalFinal: mediaGlobalFinal.toFixed(2), // Média das médias das disciplinas no período
    transitaDeClasse: statusAproveitamentoPeriodo, // Reutilizado para indicar "Bom aproveitamento no período"
    temNotaNegativa: temNotaNegativa, // Indica se há alguma disciplina abaixo do mínimo no período
    notaMinimaParaTransitar: notaMinimaParaTransitar
  };
}

onMounted(() => {
  processedPeriodData.value = processarDadosAcademicos(rawPeriodAcademicData);
});
</script>

<style lang="scss" scoped>
.informative-note-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 20px;
}

.informative-note-card {
  width: 100%;
  max-width: 700px; /* Um pouco menor que o certificado */
  background: white;
  padding: 30px;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif; /* Fonte mais moderna */
  color: #333;
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.coat-of-arms {
  max-width: 80px;
  height: auto;
  margin-right: 15px;
}

.certificate-title { // Reutilizado, mas pode ser renomeado para informative-note-title
  color: #004d40; /* Um verde escuro ou azul para títulos */
  font-size: 1.8em;
  margin-top: 0;
}

.certificate-details { // Reutilizado, mas pode ser renomeado
  line-height: 1.6;
  font-size: 1em;
}

.signatures {
  margin-top: 50px;
}

.signatures > div {
  width: 45%; // Ajuste para 2 colunas
  display: inline-block;
}

.q-separator {
  background-color: #eee;
  height: 1px;
}

// Cores para feedback visual
.text-positive {
  color: #21ba45;
}
.text-negative {
  color: #c10015;
}
.text-info {
  color: #00bfff;
}
.text-primary {
  color: #1976d2;
}
.text-success {
  color: #21ba45;
}
.text-warning {
  color: #f2c037;
}

/* Estilos para impressão */
@media print {
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .informative-note-page {
    padding: 0;
    margin: 0;
    box-shadow: none;
    background-color: white;
  }
  .informative-note-card {
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    width: 210mm; /* A4 width */
    height: 297mm; /* A4 height */
    margin: 0;
    padding: 20mm;
  }
}
</style>
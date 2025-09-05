<template>
  <q-card>
    <q-card-section>
      <q-expansion-item
        v-for="(yearGroup, year) in studentHistory"
        :key="year"
        :label="`Ano ${year}`"
        expand-separator
        icon="event"
        header-class="bg-primary text-white text-weight-bold"
      >
        <div class="q-pa-sm">
          <q-expansion-item
            v-for="(cicleGroup, indexCicle) in yearGroup.cicles"
            :key="indexCicle"
            :label="indexCicle"
            expand-separator
            icon="school"
            header-class="bg-grey-2 text-dark text-weight-medium"
            class="q-mb-md"
          >
            <q-card flat bordered class="q-pa-md rounded-borders shadow-1">
              <q-table
                v-if="$q.screen.gt.sm"
                flat
                :rows="cicleGroup.activities"
                :columns="columns"
                row-key="id"
                hide-pagination
                :rows-per-page-options="[0]"
                class="q-table--no-wrap"
              >
                <template #body="props">
                  <q-tr :props="props">
                    <q-td
                      >{{ props.row.activity.name }}-
                      {{ props.row.participation }}</q-td
                    >

                    <!-- Notas -->
                    <q-td>
                      <div
                        v-for="(e, index) in props.row.evolutions"
                        :key="index"
                        class="q-mb-sm"
                      >
                        <div class="row items-center q-gutter-sm">
                          <div
                            v-if="!props.row.participation"
                            class="text-subtitle2 text-weight-medium"
                          >
                            {{
                              `${e.courseEvolutionType.evolutionType.name} - ${e.courseEvolutionType.weight}%`
                            }}
                          </div>
                          <div class="row items-center q-gutter-xs">
                            <q-chip
                              dense
                              class="q-mt-xs"
                              text-color="black"
                              v-if="e.note && !props.row.participation"
                            >
                              {{ e.note }}
                            </q-chip>
                            <q-chip
                              dense
                              class="q-mt-xs"
                              :color="
                                e.observations === 'Bom' ? 'green' : 'orange'
                              "
                              text-color="white"
                              v-if="props.row.participation"
                            >
                              {{ e.participation }}
                            </q-chip>
                            <q-btn
                              v-if="e.items.length"
                              flat
                              dense
                              round
                              :icon="
                                expanded === e.id
                                  ? 'expand_less'
                                  : 'expand_more'
                              "
                              @click="toggleExpand(e.id)"
                            />
                          </div>
                        </div>

                        <!-- Itens detalhados -->
                        <div
                          v-show="expanded === e.id"
                          class="q-mt-sm bg-grey-2 q-pa-sm rounded-borders"
                        >
                          <div v-for="(item, i) in e.items" :key="i">
                            <q-chip dense class="q-mt-xs" text-color="black">
                              {{
                                `${item.courseEvolutionTypeItem.name} - ${item.note}`
                              }}
                            </q-chip>
                          </div>
                        </div>
                      </div>
                    </q-td>

                    <!-- Médias -->
                    <q-td>{{ props.row.averageNormal }}</q-td>
                    <!-- <q-td>{{
                          props.row.exame
                            ? props.row.averageWithExame ?? "-"
                            : "-"
                        }}</q-td> -->
                    <q-td>
                      <div
                      v-if="!props.row.participation"
                      >
                        {{
                          props.row.averageNormal >= 10
                            ? "Aprovado"
                            : props.row.exame
                            ? props.row.averageWithExame >= 10
                              ? "Aprovado"
                              : "Reprovado"
                            : "Reprovado"
                        }}
                      </div>
                    </q-td>

                    <!-- Ação -->
                    <q-td>
                      <q-btn
                        color="primary"
                        size="sm"
                        unelevated
                        dense
                        label="Lançar Nota"
                        icon="edit"
                        class="q-mr-sm"
                        @click="launchGrades(props.row.id)"
                      />
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-card>
          </q-expansion-item>
        </div>
      </q-expansion-item>
    </q-card-section>
  </q-card>
  <q-card>
    <div class="q-pa-md">
      <h5 class="text-h5 q-my-md">Detalhes por Disciplina</h5>
      <q-list bordered separator class="rounded-borders">
        <q-item
          v-for="(data, discipline) in processedData.disciplinas"
          :key="discipline"
        >
          <q-item-section>
            <q-item-label class="text-h6 text-weight-bold">{{
              discipline
            }}</q-item-label>

            <q-item-label caption>
              Disciplina com Exame:
              <span
                :class="data.temExame ? 'text-positive' : 'text-negative'"
                >{{ data.temExame ? "Sim" : "Não" }}</span
              >
            </q-item-label>

            <template v-if="data.temExame">
              <q-item-label caption>
                Média Anual (Antes do Exame):
                <span class="text-info">{{ data.mediaAnualAntesExame }}</span>
              </q-item-label>
              <q-item-label caption>
                Nota do Exame:
                <span class="text-primary">{{ data.notaExame }}</span>
              </q-item-label>
              <q-item-label caption>
                Média Anual (Depois do Exame):
                <span
                  :class="
                    data.mediaFinalDisciplina >=
                    processedData.notaMinimaParaTransitar
                      ? 'text-success'
                      : 'text-negative'
                  "
                >
                  {{ data.mediaAnualDepoisExame }}
                </span>
              </q-item-label>
            </template>
            <template v-else>
              <q-item-label caption>
                Média Anual:
                <span
                  :class="
                    data.mediaFinalDisciplina >=
                    processedData.notaMinimaParaTransitar
                      ? 'text-success'
                      : 'text-negative'
                  "
                >
                  {{ data.mediaAnualAntesExame }}
                </span>
              </q-item-label>
            </template>

            <div v-if="data.evolutionsExame.length > 0" class="q-mt-sm">
              <q-item-label class="text-subtitle2 q-mb-xs"
                >Evoluções (Tipo 'Exame'):</q-item-label
              >
              <q-list dense>
                <q-item
                  v-for="(evolution, index) in data.evolutionsExame"
                  :key="index"
                  class="q-pl-md"
                >
                  <q-item-section>
                    <q-item-label>Nota: {{ evolution.note }}</q-item-label>
                    <q-item-label caption
                      >Tipo: {{ evolution.evolutionTypeName }}</q-item-label
                    >
                    <q-item-label caption
                      >Data: {{ evolution.dateCompletion }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div v-else-if="data.temExame" class="q-mt-sm">
              <q-item-label caption class="text-warning">
                Esta disciplina está configurada para ter exame, mas nenhuma
                nota de exame foi encontrada. Considerada como 0.
              </q-item-label>
            </div>
          </q-item-section>
        </q-item>

        <q-item v-if="Object.keys(processedData.disciplinas).length === 0">
          <q-item-section>
            <q-item-label
              >Nenhum dado de disciplina encontrado para
              processamento.</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-card>
  <q-card class="q-mt-md shadow-2" flat bordered>
    <q-card-section>
      <div class="text-h6">Status de Transição do Estudante</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-item>
        <q-item-section>
          <q-item-label class="text-subtitle1 text-weight-bold"
            >Média Global Final:</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <q-item-label
            :class="
              processedData.mediaGlobalFinal >=
              processedData.notaMinimaParaTransitar
                ? 'text-positive'
                : 'text-negative'
            "
          >
            {{ processedData.mediaGlobalFinal }} valores
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label class="text-subtitle1 text-weight-bold"
            >Alguma Disciplina com Nota Negativa (abaixo de
            {{ processedData.notaMinimaParaTransitar }}):</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <q-item-label
            :class="
              processedData.temNotaNegativa ? 'text-negative' : 'text-positive'
            "
          >
            {{ processedData.temNotaNegativa ? "Sim" : "Não" }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="q-mt-md">
        <q-item-section>
          <q-item-label class="text-h5 text-weight-bold"
            >Transita de Classe?</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <q-item-label
            :class="
              processedData.transitaDeClasse
                ? 'text-h5 text-positive'
                : 'text-h5 text-negative'
            "
          >
            {{ processedData.transitaDeClasse ? "SIM" : "NÃO" }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { computed, ref } from "vue";
import { useAuthStore } from "src/pages/auth/store";
import { useInstitutionStores } from "src/pages/institution/store";
import getColumns from "./ColumnsControl";
import scripts from "src/composables/Scripts";

const authStore = useAuthStore();
const institutionStore = useInstitutionStores();

const istechnical = institutionStore.istechnical;
const isInfantil = institutionStore.isInfantil;
const isHigh = institutionStore.isHigh;
const { getRegimeName } = scripts();

const showDialog = ref(false);
const text = ref(null);

const columns = computed(() => getColumns());
const processedData = computed(() =>
  processarDadosAcademicos(props.studentHistory)
);

const props = defineProps({
  launchGrades: { type: Function, required: true },
  studentHistory: { type: Object, required: true },
});

const expanded = ref(null);

function toggleExpand(id) {
  expanded.value = expanded.value === id ? null : id;
}

const handleShowObservation = (value) => {
  text.value = value;
  showDialog.value = true;
};

// Função que define a lógica de processamento
const processarDadosAcademicos = (data) => {
  const resultados = {};
  let totalGlobalMediasFinais = 0;
  let countDisciplinasComMediaFinal = 0;
  let temNotaNegativa = false;
  const notaMinimaParaTransitar = 10; // Definindo a nota mínima para transitar

  for (const yearKey in data) {
    const yearData = data[yearKey];

    if (yearData.cicles) {
      for (const cicleKey in yearData.cicles) {
        // CORREÇÃO AQUI: Acesso correto aos dados do ciclo
        const cicleData = yearData.cicles[cicleKey]; // Antes estava yearData[cicleKey]

        if (cicleData.activities) {
          cicleData.activities.forEach((activity) => {
            const disciplineName = activity.activity.name;

            if (!resultados[disciplineName]) {
              resultados[disciplineName] = {
                totalNotasNormais: 0,
                countNotasNormais: 0,
                notaExame: null,
                temExame: false,
                evolutionsExame: [],
                mediaFinalDisciplina: null, // Para armazenar o valor numérico da média final
              };
            }

            if (activity.exame === true) {
              resultados[disciplineName].temExame = true;
            }

            // Apenas adiciona se averageNormal for um número válido.
            // Se for null ou não número, ele simplesmente não entra na soma normal.
            if (
              activity.averageNormal !== null &&
              typeof activity.averageNormal === "number"
            ) {
              resultados[disciplineName].totalNotasNormais +=
                activity.averageNormal;
              resultados[disciplineName].countNotasNormais += 1;
            }

            if (activity.evolutions && activity.evolutions.length > 0) {
              activity.evolutions.forEach((evolution) => {
                if (
                  evolution.courseEvolutionType &&
                  evolution.courseEvolutionType.evolutionType &&
                  evolution.courseEvolutionType.evolutionType.type === "Exame"
                ) {
                  const exameNote = parseFloat(evolution.note);
                  if (!isNaN(exameNote)) {
                    resultados[disciplineName].notaExame = exameNote;
                    resultados[disciplineName].evolutionsExame.push({
                      note: evolution.note,
                      dateCompletion: evolution.dateCompletion,
                      evolutionTypeName:
                        evolution.courseEvolutionType.evolutionType.name,
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

  const mediasAnuaisFinais = {};
  for (const discipline in resultados) {
    const {
      totalNotasNormais,
      countNotasNormais,
      notaExame,
      temExame,
      evolutionsExame,
    } = resultados[discipline];

    // Calcula a média anual ANTES do exame. Se não houver notas normais, considera 0.
    let mediaAnualAntesExame =
      countNotasNormais > 0 ? totalNotasNormais / countNotasNormais : 0;
    let mediaFinalCalculada;

    // Se a disciplina tem exame
    if (temExame) {
      // Se a nota do exame for null ou não for um número, considera 0 para o exame.
      const notaExameConsiderada = notaExame !== null ? notaExame : 0;
      mediaFinalCalculada =
        (2 * mediaAnualAntesExame + notaExameConsiderada) / 3;
    } else {
      // Se a disciplina não tem exame, a média final é a média normal.
      mediaFinalCalculada = mediaAnualAntesExame;
    }

    // Adiciona a média final da disciplina (já considerando 0 para notas ausentes)
    // ao total global e incrementa o contador.
    totalGlobalMediasFinais += mediaFinalCalculada;
    countDisciplinasComMediaFinal += 1;

    // Verifica se a nota final da disciplina é negativa.
    if (mediaFinalCalculada < notaMinimaParaTransitar) {
      temNotaNegativa = true;
    }

    mediasAnuaisFinais[discipline] = {
      mediaAnualAntesExame: mediaAnualAntesExame.toFixed(2),
      mediaAnualDepoisExame: mediaFinalCalculada.toFixed(2),
      notaExame: notaExame !== null ? notaExame.toFixed(2) : "0.00",
      temExame: temExame,
      evolutionsExame: evolutionsExame,
      mediaFinalDisciplina: mediaFinalCalculada, // Armazena o valor numérico para verificação
    };
  }

  // Calcular a média global final
  const mediaGlobalFinal =
    countDisciplinasComMediaFinal > 0
      ? totalGlobalMediasFinais / countDisciplinasComMediaFinal
      : 0;

  // Determinar o status de transição
  let transitaDeClasse = false;
  // A condição `countDisciplinasComMediaFinal > 0` já garante que há disciplinas para avaliar.
  if (mediaGlobalFinal >= notaMinimaParaTransitar && !temNotaNegativa) {
    transitaDeClasse = true;
  }

  return {
    disciplinas: mediasAnuaisFinais,
    mediaGlobalFinal: mediaGlobalFinal.toFixed(2),
    transitaDeClasse: transitaDeClasse,
    temNotaNegativa: temNotaNegativa,
    notaMinimaParaTransitar: notaMinimaParaTransitar,
  };
};
</script>

<template>
  <q-dialog v-model="showDialog">
    <q-card style="max-width: 500px; width: 100%">
      <q-card-section class="text-h6"> Conteúdo Completo </q-card-section>

      <q-card-section>
        <div style="white-space: pre-wrap">{{ text }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Fechar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-card-section class="q-gutter-md">
    <q-expansion-item
      v-for="(yearGroup, indexYear) in disciplines"
      :key="indexYear"
      :label="`Ano ${yearGroup.year}`"
      expand-separator
      icon="event"
      header-class="bg-primary text-white text-weight-bold"
    >
      <div class="q-pa-sm">
        <q-expansion-item
          v-for="(cicleGroup, indexCicle) in yearGroup.cicles"
          :key="indexCicle"
          :label="`${getRegimeName(regime)} ${cicleGroup.cicle}`"
          expand-separator
          icon="school"
          header-class="bg-grey-2 text-dark text-weight-medium"
          class="q-mb-md"
        >
          <q-card flat bordered class="q-pa-md rounded-borders shadow-1">
            <div class="q-mt-md">
              <!-- DESKTOP (TABELA) -->
              <q-table
                v-if="$q.screen.gt.sm"
                flat
                :rows="cicleGroup.activities"
                :columns="columns"
                row-key="id"
                :rows-per-page-options="[0]"
                hide-pagination
                class="q-table--no-wrap"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td>{{ props.row.name }}</q-td>
                    <q-td>
                      <div
                        v-for="(e, index) in props.row.evolutions"
                        :key="index"
                        class="q-mb-sm"
                      >
                        <div
                          v-if="e.evolutionType.type === 'Normal'"
                          class="row items-center q-gutter-sm"
                        >
                          <div class="text-subtitle2 text-weight-medium">
                            {{ e.evolutionType.name }}
                          </div>
                          <div
                            v-if="!isInfantil"
                            class="row items-center q-gutter-sm"
                          >
                            <q-chip
                              dense
                              class="q-mt-xs"
                              :color="getColor(e.note)"
                              text-color="white"
                              v-if="e.note"
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
                              {{ e.observations }}
                            </q-chip>
                          </div>
                          <div v-else>
                            <q-btn
                              color="primary"
                              icon="visibility"
                              dense
                              flat
                              unelevated
                              @click="handleShowObservation(e.observations)"
                            >
                              <q-tooltip> Observação do educador </q-tooltip>
                            </q-btn>
                          </div>
                        </div>
                      </div>
                    </q-td>
                    <q-td v-if="isHigh || istechnical">
                      <q-badge
                        v-if="
                          props.row.exame &&
                          !getFinalGradeStatus(props.row.evolutions).approved
                        "
                        color="red"
                        :label="
                          getFinalGradeStatus(props.row.evolutions).mediaFinal
                        "
                        class="q-px-sm"
                      />
                      <q-badge
                        v-else
                        :color="
                          getFinalGradeStatus(props.row.evolutions).approved
                            ? 'green'
                            : 'red'
                        "
                        :label="getFinalGradeStatus(props.row.evolutions).label"
                        class="q-px-sm"
                      />
                    </q-td>
                    <q-td v-if="isHigh || istechnical">
                      <q-badge
                        :label="props.row.exame ? 'Com exame' : 'Sem exame'"
                        color="grey-6"
                        text-color="black"
                        class="text-caption"
                        outline
                      />
                    </q-td>
                    <q-td>
                      <q-btn
                        v-if="userStores.hasPostEvolutionGrade"
                        color="primary"
                        size="sm"
                        unelevated
                        dense
                        label="Lançar nota"
                        icon="edit"
                        class="q-mr-sm"
                        @click="
                          launchGrades(
                            props.row.id,
                            yearGroup.year,
                            cicleGroup.cicle,
                            props.row.participation
                          )
                        "
                      />
                      <q-btn
                        v-if="istechnical"
                        flat
                        dense
                        round
                        :icon="
                          expanded === props.row.id
                            ? 'expand_less'
                            : 'expand_more'
                        "
                        @click="toggleExpand(props.row.id)"
                      />
                    </q-td>
                  </q-tr>
                  <q-tr>
                    <q-slide-transition>
                      <div v-show="expanded === props.row.id" class="q-pa-sm">
                        <q-separator class="q-my-sm" />
                        <div>
                          Detalhes adicionais da disciplina:
                          <div
                            v-for="(e, index) in props.row.evolutions"
                            :key="index"
                            class="q-mb-sm"
                          >
                            <div
                              v-if="e.evolutionType.type === 'Exame'"
                              class="row items-center q-gutter-sm"
                            >
                              <div class="text-subtitle2 text-weight-medium">
                                {{ e.evolutionType.name }}
                              </div>

                              <div
                                v-if="!isInfantil"
                                class="row items-center q-gutter-sm"
                              >
                                <q-chip
                                  dense
                                  :color="getColor(e.note)"
                                  text-color="white"
                                  v-if="e.note"
                                >
                                  {{ e.note }}
                                </q-chip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-slide-transition>
                  </q-tr>
                </template>
              </q-table>

              <!-- MOBILE (CARDS) -->
              <div v-else>
                <q-card
                  v-for="activity in cicleGroup.activities"
                  :key="activity.id"
                  flat
                  bordered
                  class="q-mb-md"
                >
                  <q-card-section>
                    <div class="text-h6 text-primary q-mb-sm">
                      {{ activity.name }}
                    </div>

                    <div
                      v-for="(e, i) in activity.evolutions"
                      :key="i"
                      class="q-mb-sm"
                    >
                    <div
                          v-if="e.evolutionType.type === 'Normal'"
                          class="row items-center q-gutter-sm"
                        >
                          <div class="text-subtitle2 text-weight-medium">
                            {{ e.evolutionType.name }}
                          </div>
                          <div
                            v-if="!isInfantil"
                            class="row items-center q-gutter-sm"
                          >
                            <q-chip
                              dense
                              class="q-mt-xs"
                              :color="getColor(e.note)"
                              text-color="white"
                              v-if="e.note"
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
                              v-if="activity?.participation"
                            >
                              {{ e.observations }}
                            </q-chip>
                          </div>
                          <div v-else>
                            <q-btn
                              color="primary"
                              icon="visibility"
                              dense
                              flat
                              unelevated
                              @click="handleShowObservation(e.observations)"
                            >
                              <q-tooltip> Observação do educador </q-tooltip>
                            </q-btn>
                          </div>
                        </div>
                    </div>

                    <div class="q-mt-sm" v-if="istechnical || isHigh">
                      <div class="text-caption text-weight-medium">
                        Situação
                      </div>
                      <q-badge
                        v-if="
                          activity.exame &&
                          !getFinalGradeStatus(activity.evolutions).approved
                        "
                        color="red"
                        :label="
                          getFinalGradeStatus(activity.evolutions).mediaFinal
                        "
                        class="q-px-sm"
                      />
                      <q-badge
                        v-else
                        :color="
                          getFinalGradeStatus(activity.evolutions).approved
                            ? 'green'
                            : 'red'
                        "
                        :label="getFinalGradeStatus(activity.evolutions).label"
                        class="q-px-sm"
                      />
                    </div>

                    <div class="q-mt-sm" v-if="istechnical || isHigh">
                      <div class="text-caption text-weight-medium">Exame</div>
                      <q-badge
                        :label="activity.exame ? 'Com exame' : 'Sem exame'"
                        color="grey-6"
                        text-color="black"
                        outline
                      />
                    </div>

                    <div class="q-mt-md">
                      <q-btn
                        v-if="userStores.hasPostEvolutionGrade"
                        color="primary"
                        size="sm"
                        unelevated
                        dense
                        label="Lançar nota"
                        icon="edit"
                        class="q-mr-sm"
                        @click="
                          launchGrades(
                            activity.id,
                            yearGroup.year,
                            cicleGroup.cicle,
                            activity.participation
                          )
                        "
                      />
                      <q-btn
                        v-if="istechnical"
                        flat
                        dense
                        round
                        :icon="
                          expanded === activity.id
                            ? 'expand_less'
                            : 'expand_more'
                        "
                        @click="toggleExpand(activity.id)"
                      />
                    </div>
                  </q-card-section>

                  <q-slide-transition>
                    <div v-show="expanded === activity.id" class="q-pa-sm">
                      <q-separator class="q-my-sm" />
                      <div>
                        Detalhes adicionais da disciplina:
                        <div
                          v-for="(e, i) in activity.evolutions"
                          :key="i"
                          class="q-mb-sm"
                        >
                        <div
                              v-if="e.evolutionType.type === 'Exame'"
                              class="row items-center q-gutter-sm"
                            >
                              <div class="text-subtitle2 text-weight-medium">
                                {{ e.evolutionType.name }}
                              </div>

                              <div
                                v-if="!isInfantil"
                                class="row items-center q-gutter-sm"
                              >
                                <q-chip
                                  dense
                                  :color="getColor(e.note)"
                                  text-color="white"
                                  v-if="e.note"
                                >
                                  {{ e.note }}
                                </q-chip>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </q-slide-transition>
                </q-card>
              </div>
            </div>
          </q-card>
        </q-expansion-item>
      </div>
    </q-expansion-item>
  </q-card-section>
</template>
<script setup>
import { computed, ref } from "vue";
import { useInstitutionStores } from "src/pages/institution/store";
import { useUserStores } from "src/pages/user/store";
import getColumns from "../components/ColumnsControl";
import scripts from "src/composables/Scripts";

const institutionStore = useInstitutionStores();
const userStores = useUserStores();

const istechnical = institutionStore.istechnical;
const isInfantil = institutionStore.isInfantil;
const isHigh = institutionStore.isHigh;
const { getRegimeName } = scripts();

const showDialog = ref(false);
const text = ref(null);

const columns = computed(() => getColumns());

const props = defineProps({
  disciplines: { type: Array, required: true },
  getFinalGradeStatus: { type: Function },
  launchGrades: { type: Function, required: true },
  getColor: { type: Function },
  institutionType: { type: String },
  regime: { type: String },
});

const expanded = ref(null);

function toggleExpand(id) {
  expanded.value = expanded.value === id ? null : id;
}

const handleShowObservation = (value) => {
  text.value = value;
  showDialog.value = true;
};
</script>

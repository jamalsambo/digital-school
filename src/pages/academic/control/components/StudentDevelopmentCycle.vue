<template>
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
          :label="`Semestre ${cicleGroup.cicle}`"
          expand-separator
          icon="school"
          header-class="bg-grey-2 text-dark text-weight-medium"
          class="q-mb-md"
        >
          <q-card flat bordered class="q-pa-md rounded-borders shadow-1">
            <q-table
              flat
              :rows="cicleGroup.activities"
              :columns="columns"
              row-key="disciplina"
              :rows-per-page-options="[0]"
              hide-pagination
              class="q-mt-md"
            >
              <!-- NOTAS -->
              <template v-slot:body-cell-notas="props">
                <q-td :props="props">
                  <div
                    v-for="(e, index) in props.row.evolutions"
                    :key="index"
                    class="q-mb-sm"
                  >
                    <div class="text-subtitle2 text-weight-medium">
                      {{ e.evolutionType.name }}
                    </div>
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
                      :color="e.observations === 'Bom' ? 'green' : 'orange'"
                      text-color="white"
                      v-if=" props.row.participation"
                    >
                      {{ e.observations}}
                    </q-chip>
                  </div>
                </q-td>
              </template>

              <!-- SITUAÇÃO -->
              <template v-slot:body-cell-situacao="props">
                <q-td :props="props">
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
              </template>

              <!-- EXAME -->
              <template v-slot:body-cell-exame="props">
                <q-td :props="props">
                  <q-badge
                    :label="props.row.exame ? 'Com exame' : 'Sem exame'"
                    color="grey-3"
                    text-color="black"
                    class="text-caption"
                    outline
                  />
                </q-td>
              </template>

              <!-- ACTIONS -->
              <template v-slot:body-cell-actions="props">
                <q-btn
                  color="primary"
                  size="sm"
                  unelevated
                  dense
                  label="Lançar nota"
                  @click="launchGrades(props.row.id, yearGroup.year, cicleGroup.cicle, props.row.participation)"
                  icon="edit"
                  class="q-mt-sm"
                />
              </template>
            </q-table>
          </q-card>
        </q-expansion-item>
      </div>
    </q-expansion-item>
  </q-card-section>
</template>
<script setup>
import columns from "../components/ColumnsControl";
const props = defineProps({
  disciplines: { type: Array, required: true },
  getFinalGradeStatus: { type: Function},
  launchGrades: { type: Function},
  getColor: { type: Function}
});
</script>

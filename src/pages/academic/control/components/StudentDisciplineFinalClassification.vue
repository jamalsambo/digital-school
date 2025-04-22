<template>
  <q-list bordered class="rounded-borders shadow-1 q-pa-sm">
    <div class="text-h6 q-mb-lg">Classificaçao final por disciplina</div>
    <q-separator spaced="" />
    <q-item
      v-for="(item, index) in finalAverages"
      :key="index"
      class="q-mb-md q-pa-sm bg-grey-1 rounded-borders"
    >
      <!-- Cabeçalho da disciplina -->
      <q-item-section>
        <q-item-label class="text-subtitle1 text-primary text-weight-bold">
          {{ item.discipline }}
        </q-item-label>
        <q-item-label>
          <q-chip
            :color="
              item.status === 'Admitido' ||  item.status === 'Aprovado'
                ? 'green'
                : item.status === 'Dispensado'
                ? 'orange'
                : item.participation
                ? 'blue'
                : 'red'
            "
            text-color="white"
            outline
            class="text-weight-medium"
          >
            {{ !item.participation ? item.status : "Participou" }}
          </q-chip>
        </q-item-label>
        <q-item-label caption class="q-mt-xs" v-if="!item.participation ">
          Média final:
          <span class="text-weight-medium">{{ item.finalAverage }}</span>
        </q-item-label>
      </q-item-section>

      <!-- Lista de avaliações do exame -->
      <q-item-section class="q-mt-md full-width">
        <div
          v-for="(exam, examIndex) in item.examEvolutions"
          :key="examIndex"
          class="q-pa-sm q-mb-sm bg-white rounded-borders shadow-1"
        >
          <div class="row justify-between items-center">
            <div>
              <div class="text-weight-medium">
                {{ exam.evolutionType }}
              </div>
              <div class="text-caption text-grey-8">Nota: {{ exam.note }}</div>
            </div>
            <q-chip
              :color="exam.note >= 10 ? 'green' : 'red'"
              text-color="white"
              dense
              class="text-weight-medium"
            >
              {{ exam.note >= 10 ? "Aprovado" : "Reprovado" }}
            </q-chip>
          </div>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup>
const props = defineProps({
  finalAverages: { type: Array, required: true}
})
</script>

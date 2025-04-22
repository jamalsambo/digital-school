<template>
  <div class=" max-w-md mx-auto bg-white rounded-2xl rounded-borders shadow-1 q-pa-sm">
    <h5 class="font-semibold text-gray-800 border-b pb-2">Resumo Final</h5>

    <div class="flex items-center justify-between">
      <span class="text-gray-600">Média Final::</span>
      <span class="text-lg font-bold text-blue-600">{{ analysis.finalAverage }} - {{ analysis.situation }}</span>
    </div>

    <div v-if="analysis.hasExam" class="mt-4">
      <p class="text-gray-700 font-medium">Disciplinas Reprovadas:</p>
      <p class="text-sm text-gray-500 mb-2">Total: {{ analysis.totalFailed }}</p>

      <ul class="space-y-1">
        <li
          v-for="(subject, index) in analysis.failedSubjects"
          :key="index"
          class="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm"
        >
          {{ subject }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  averages: { type: Array, required: true }
})
const analysis = computed(() => {
  const hasExam = props.averages.some(d => d.exame)

  const validForAverage = props.averages.filter(d => !d.participation)

  const totalSum = validForAverage.reduce((acc, d) => {
  const baseAverage = parseFloat(d.finalAverage);

  if (d.exame) {
    const evolutions = d.examEvolutions || [];
    const last = evolutions[evolutions.length - 1];

    if (last && !isNaN(parseFloat(last.note))) {
      const examNote = parseFloat(last.note);
      const calculatedScore = ((2 * baseAverage) + examNote) / 3;
      return acc + calculatedScore;
    }

    // Caso tenha exame mas sem nota válida, soma 0
    return acc;
  }

  // Se não tem exame, usa a média final
  return acc + (!isNaN(baseAverage) ? baseAverage : 0);
}, 0);

const finalAverage = (totalSum / validForAverage.length).toFixed(2);

  const failedSubjects = []
  let failedCritical = false

  for (const d of props.averages) {
    if (d.participation) continue;

    const isCritical = d.critical;
    const disciplineName = d.discipline;

    const isExcluded = d.exame && d.status === "Excluido";
    const isDirectFail = !d.exame && d.status === "Reprovado";

    const examEvolutions = d.examEvolutions || [];
    const normalExam = examEvolutions.find(e => e.evolutionType === "Exame normal");
    const recurrenceExam = examEvolutions.find(e => e.evolutionType === "Exame de recorrencia");

    const normalScore = normalExam ? parseFloat(normalExam.note) : null;
    const recurrenceScore = recurrenceExam ? parseFloat(recurrenceExam.note) : null;

    const finalAvg = parseFloat(d.finalAverage);

    const failedByScore = d.exame && (
      (normalScore === null || normalScore < 10) &&
      (recurrenceScore === null || recurrenceScore < 10)
    );

    const failedByCriticalScore = isCritical && (
      (normalScore !== null && normalScore < 10) ||
      (recurrenceScore !== null && recurrenceScore < 10)
    );

    const failedByFinalAverage = !d.exame && isCritical && finalAvg < 10;

    const failedByNoExamDone = d.exame &&
      examEvolutions.length === 0 &&
      !isNaN(finalAvg) &&
      finalAvg < 14;

    const isFailed = isExcluded || isDirectFail || failedByScore || failedByFinalAverage || failedByCriticalScore || failedByNoExamDone;

    if (isFailed) {
      failedSubjects.push(disciplineName);
      if (isCritical) failedCritical = true;
    }
  }

  const situation = failedCritical || parseFloat(finalAverage) < 10
    ? "Reprovado de classe"
    : "Aprovado";

  if (hasExam) {
    return {
      hasExam: true,
      totalFailed: failedSubjects.length,
      failedSubjects,
      finalAverage,
      situation
    }
  } else {
    return {
      hasExam: false,
      finalAverage,
      situation
    }
  }
})


</script>

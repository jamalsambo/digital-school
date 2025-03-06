<script script setup>
import { ref } from "vue";
import { useCurriculumPlanStores } from "src/pages/curriculum-plan/store";

// Props
defineProps({
  disciplines: {
    type: Array,
    required: true,
  },
});

const isModalOpen = ref(false);
const selectedDisciplines = ref([]);
const curriculumId = ref()

// Utilizando stores do curriculum-plan
const curriculumPlanStores = useCurriculumPlanStores();
const teste = ref()

const openModal = (teste,id) => {
  isModalOpen.value = true;
  // Inicializar disciplinas selecionadas com as associadas ao currículo
  selectedDisciplines.value = [...teste];
  curriculumId.value = id;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// Função para validar se todos os campos adicionais foram preenchidos
const isDisciplineValid = (discipline) => {
  return (
    discipline.totalHours > 0 &&
    discipline.totalCredits > 0 &&
    discipline.semester > 0
  );
};

// Função para lidar com o check/uncheck
const toggleDiscipline = async (discipline) => {
  const index = selectedDisciplines.value.findIndex(
    (d) => d.id === discipline.id
  );

  if (index !== -1) {
    // Uncheck: Remove a disciplina selecionada
    selectedDisciplines.value.splice(index, 1);
    console.log(curriculumId.value)
  } else {
    // Check: Adiciona a disciplina selecionada
    selectedDisciplines.value.push(discipline);
    const payload = {
      curriculumPlanId: curriculumId.value,
      disciplineId: discipline.id,
      totalHours: parseInt(discipline.totalHours),
      totalCredits: parseInt(discipline.totalCredits),
      semester: parseInt(discipline.semester)
    }

    try {
      await curriculumPlanStores.addDiscipline(payload)
    } catch (error) {
      console.log(error)
    }
  }
};

defineExpose({
  openModal,
});
</script>

<template>
  <q-dialog v-model="isModalOpen">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Selecione as Disciplinas</div>
        {{ teste }}
      </q-card-section>

      <q-card-section>
        <div
          v-for="discipline in disciplines"
          :key="discipline.id"
          class="row items-center q-py-sm"
        >
          <!-- Checkbox -->
          <q-checkbox
            v-model="selectedDisciplines"
            :val="discipline.id"
            :label="discipline.name"
            @click="toggleDiscipline(discipline)"
            class="col-3"
            :disable="!isDisciplineValid(discipline)"
          />
          <!-- Input para Total de Horas -->
          <q-input
            v-model="discipline.totalHours"
            label="Horas"
            type="number"
            dense
            outlined
            class="col-3"
          />
          <!-- Input para Total de Créditos -->
          <q-input
            v-model="discipline.totalCredits"
            label="Créditos"
            type="number"
            dense
            outlined
            class="col-3"
          />
          <!-- Input para Semestre -->
          <q-input
            v-model="discipline.semester"
            label="Semestre"
            type="number"
            dense
            outlined
            class="col-3"
          />
        </div>
      </q-card-section>

      <q-card-actions>
        <q-btn flat label="Cancelar" @click="closeModal" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

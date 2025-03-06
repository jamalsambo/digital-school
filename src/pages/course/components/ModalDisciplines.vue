<template>
  <q-dialog v-model="medium" persistent>
    <q-card style="width: 900px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Adição das disciplinas ao curriculum</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <q-list>
          <q-item
            v-for="discipline in disciplines"
            :key="discipline.id"
            clickable
          >
            <q-item-section>
              <div class="q-gutter-sm row items-center justify-between">
                <q-checkbox
                  class="col-auto"
                  v-model="discipline.checked"
                  :val="discipline.id"
                  :label="discipline.name"
                  @update:model-value="updateSelection(discipline)"
                  :disable="!isDisciplineValid(discipline)"
                />

                <q-input
                 v-if="!discipline.checked"
                  class="col-auto"
                  v-model="discipline.totalHours"
                  type="number"
                  label="Carga Horária"
                  placeholder="Digite número"
                  outlined
                  dense
                />

                <q-input
                  v-if="!discipline.checked"
                  class="col-auto"
                  v-model="discipline.totalCredits"
                  type="number"
                  label="Creditos"
                  placeholder="Digite número"
                  outlined
                  dense
                />

                <q-select
                v-if="!['Ensino Médio', 'Ensino Infantil', 'Ensino Fundamental', 'Ensino Técnico Profissional'].includes(curriculum?.course?.education?.name) && !discipline.checked"
                  class="col-auto"
                  v-model="discipline.semester"
                  :options="['1 Semester']"
                  label="Standard"
                  option-label="name"
                  map-options
                  outlined
                  dense
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions  align="right" class="bg-white">
        <q-btn flat label="Terminar" @click="medium = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from "vue";
import { useCourseStores } from "../store";
import useNotify from "src/composables/UseNotify";

// use stores
const courseStores = useCourseStores();
const { notifyError, notifySuccess } = useNotify();

// props
const props = defineProps({
  disciplines: { type: Array, required: true },
  curriculum: { type: Object, required: true },
});

// data
const medium = ref(false);

// methods
// Funcao para adicionar disciplina ao curriculum
const updateSelection = async (discipline) => {
  const payload = {
    curriculumPlanId: props.curriculum.id,
    disciplineId: discipline.id,
    totalHours: parseInt(discipline.totalHours),
    totalCredits: parseInt(discipline.totalCredits),
    semester: parseInt(discipline.semester) || 0,
  };

  try {
    if (discipline.checked) {
      await courseStores.addDiscipline(payload);
      notifySuccess("Disciplina adicionada ao curriculum");
    } else {
      console.log("descelecionad");
    }
  } catch (error) {
    notifyError("Erro ao adicionar disciplina");
  }
};
// Função para validar se todos os campos adicionais foram preenchidos
const isDisciplineValid = (discipline) => {
  return discipline.totalHours > 0 && discipline.totalCredits > 0;
};

defineExpose({
  medium,
});
</script>

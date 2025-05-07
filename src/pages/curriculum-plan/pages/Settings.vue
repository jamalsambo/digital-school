<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Configuração do Curriculum</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <div class="border q-pa-md shadow-2">
          <div class="row items-center justify-between">
            <span class="text-weight-bold">Areas de desenvolvimento</span>
            <q-btn
              color="primary"
              icon="add"
              label="Adicionar"
              class="q-mr-sm"
              @click="addDevelopmentArea"
              flat
            />
          </div>
          <q-separator spaced />
          <Tables :rows="developmentAreas" :columns="AreasColumns">
            <template #actions="{ props }">
              <q-btn
                color="secondary"
                icon="add"
                :label="getNameForDisciplineEducation(education?.name)"
                no-caps
                @click="addActivities(props)"
                flat
                dense
              />
              <q-btn
                color="primary"
                icon="edit"
                label="Editar"
                no-caps
                @click="editDevelopmentArea(props)"
                flat
                dense
              />
            </template>
          </Tables>
        </div>
      </q-card-section>
      <div class="row q-mt-md justify-end">
          <q-btn
            label="voltar"
            color="negative"
            flat
            type="reset"
            @click="router.back()"
          />
        </div>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCurriculumPlanStores } from "../store";
import useNotify from "src/composables/UseNotify";
import Tables from "src/components/Tables.vue";
import AreasColumns from "../components/AreasColums";
import scripts from "src/composables/Scripts";
/* setup router */
const router = useRouter();
const route = useRoute();

/* setup store */
const curriculumStores = useCurriculumPlanStores();
const { notifyError } = useNotify();
const { getNameForDisciplineEducation } = scripts()

/* setup data */
const { curriculumId, educationId } = route.params;
const developmentAreas = ref([]);
const education = ref();

/* methods */
const addDevelopmentArea = () => {
  router.push({
    name: "create-development-area",
    params: { educationId: educationId, curriculumId: curriculumId },
  });
};
const editDevelopmentArea = (row) => {
  router.push({
    name: "edit-development-area",
    params: { developmentAreaId: row.key },
  });
}
const addActivities = (row) => {
  router.push({
    name: "activities-development-area",
    params: { educationId: educationId, curriculumId: curriculumId, dAreaId: row.key },
  });
}
/* fetch data */
const fetchCurriculum = async () => {
  try {
    await curriculumStores.findOne(curriculumId);
    developmentAreas.value = curriculumStores.curriculumPlan.developmentAreas;

  } catch (error) {
    console.log(error)
    notifyError("Erro ao carregar curriculums")
  }
};

onMounted(async () => {
  await fetchCurriculum();
});
</script>

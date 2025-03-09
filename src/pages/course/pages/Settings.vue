<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Configuração estágio</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <div class="border q-pa-md shadow-2">
          <div class="row items-center justify-between">
            <span class="text-weight-bold">Turmas</span>
            <q-btn
              color="primary"
              icon="add"
              label="Adicionar"
              class="q-mr-sm"
              @click="addClasse"
              flat
            />
          </div>

          <Tables :rows="classes" :columns="ClasseColumns">
            <template #actions="{ props }">
              <q-btn
                color="secondary"
                icon="calendar_month"
                label="Horario"
                no-caps
                @click="showScheduleClass(props)"
                flat
                dense
              />
              <q-btn
                color="primary"
                icon="edit"
                label="Editar"
                no-caps
                @click="editClasse(props)"
                flat
                dense
              />
            </template>
          </Tables>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCourseStores } from "../store";
import Tables from "src/components/Tables.vue";
import useNotify from "src/composables/UseNotify";
import columns from "../components/DevelopmentAreaColumns";
import ClasseColumns from "../components/ClasseColumns";

/* setup route */
const route = useRoute();
const router = useRouter();

/* setup store */
const courseStores = useCourseStores();
const { notifyError } = useNotify();

/* setup data */
const { educationId,internshipId,program } = route.params;
const internship = ref(null);
const developmentAreas = ref([]);
const classes = ref([]);

/* methods */
// const addDevelopmentArea = () => {
//   router.push({
//     name: "create-development-area",
//     params: { internshipId: internshipId },
//   });
// };

// const editDevelopmentArea = (row) => {
//   router.push({
//     name: "edit-development-area",
//     params: { developmentAreaId: row.key },
//   });
// };

// const addActivities = (row) => {
//   router.push({
//     name: "activities-development-area",
//     params: { internshipId: internshipId, developmentId: row.key },
//   });
// };

// const addClasse = () => {
//   router.push({
//     name: "create-classe",
//     params: { internshipId: internshipId },
//   });
// };

// const editClasse = (row) => {
//   router.push({
//     name: "edit-classe",
//     params: { classId: row.key },
//   });
// };

// const showScheduleClass = (row) => {
//   router.push({ name: "schedule-class", params: { educationId: educationId, classId: row.key } });
// };

/* fetch data */
// const fetchInternship = async () => {
//   try {
//     await internshipStore.findOne(internshipId);
//     internship.value = internshipStore.internship;
//     developmentAreas.value = internshipStore.internship.developmentAreas;
//     classes.value = internshipStore.internship.classes;
//   } catch (error) {
//     notifyError("Erro no carregamento");
//   }
// };

onMounted(async () => {
  // await fetchInternship();
});
</script>

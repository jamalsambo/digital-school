<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Configuração do Curriculum</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <div class="border q-pa-md shadow-2">
          <span class="text-weight-bold">Classes associadas</span>
          <q-list bordered dense class="q-mt-lg">
            <q-item v-for="course in courses" :key="course.id" clickable>
              <q-item-section avatar>
                <q-checkbox
                  v-model="course.checked"
                  :val="course.id"
                  @update:model-value="
                    updateSelection(course.checked, course.id)
                  "
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ course.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
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
                :label="getNameForDisciplineEducation(education.name)"
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
    </q-card>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCourseStores } from "src/pages/course/store";
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
const courseStores = useCourseStores();
const { notifyError } = useNotify();
const { getNameForDisciplineEducation } = scripts()

/* setup data */
const { curriculumId, educationId } = route.params;
const courses = ref();
const developmentAreas = ref([]);
const education = ref();

/* methods */
const updateSelection = async (checked, courseId) => {
  try {
    if (checked) {
      await curriculumStores.addCourseToCurriculum(curriculumId, courseId);
    }
  } catch (error) {
    notifyError("Erro ao adicionar...");
  }
};
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
const fetchCourses = async () => {
  try {
    await courseStores.list({ educationId: educationId });
    courses.value = courseStores.courses.map((course) => {
      return {
        ...course,
        checked: !!curriculumStores.curriculumPlan.curriculumCourses.find(
          (c) => c.courseId === course.id
        ),
      };
    });
  } catch (error) {
    console.error(error);
  }
};

const fetchCurriculum = async () => {
  try {
    await curriculumStores.findOne(curriculumId);
    developmentAreas.value = curriculumStores.curriculumPlan.developmentAreas;
    education.value = curriculumStores.curriculumPlan.educationLevel;
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchCurriculum();
  await fetchCourses();
});
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="text-grey-8 no-shadow" bordered>
          <q-card-section class="q-pa-none">
            <Tables
              :rows="courses"
              :columns="columns"
              :title="getProgram(title)"
            >
              <template #new>
                <q-btn
                  color="primary"
                  icon="add"
                  label="Adicionar"
                  no-caps
                  @click="addProgram"
                  class="q-ml-sm"
                />
              </template>
              <template #actions="{ props }">
                <q-btn
                  color="secondary"
                  icon="settings"
                  label="Configuração"
                  no-caps
                  @click="settingsProgram(props)"
                  flat
                  dense
                />
                <q-btn
                  color="primary"
                  icon="edit"
                  label="Editar"
                  no-caps
                  @click="editCourse(props)"
                  flat
                  dense
                />
                <q-btn
                  color="negative"
                  icon="delete"
                  label="Excluir"
                  no-caps
                  @click="deleteInternship(props)"
                  flat
                  dense
                />
              </template>
            </Tables>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import Tables from "src/components/Tables.vue";
import { useCourseStores } from "src/pages/course/store";
import useNotify from "src/composables/UseNotify";
import columns from "../components/ProgramColumns";

/* setup router */
const router = useRouter();
const route = useRoute();

/* Setup store */
const courseStores = useCourseStores();
const { notifyError, notifySuccess } = useNotify();

/* setup data */
const { program, educationId } = route.params;
const educationIdUpdated = ref(route.params.educationId || educationId);
const courses = ref([]);
const programUpdated = ref(route.params.program || program);
const title = ref(programUpdated);

const fetchCourses = async () => {
  try {
    await courseStores.list({ educationId: educationIdUpdated.value });
    courses.value = courseStores.courses;
  } catch (error) {
    notifyError("Erro ao buscar cursos");
  }
};

const addProgram = () => {
  router.push({
    name: "create-program",
    params: { educationId: educationIdUpdated.value, program: program },
  });
};

const editCourse = (row) => {
  router.push({
    name: "edit-program",
    params: { id: educationIdUpdated.value, courseId: row.key },
  });
};

const deleteCourse = async (course) => {};

const settingsProgram = (item) => {
  router.push({
    name: "settings-program",
    params: {
      educationId: educationIdUpdated.value,
      program: programUpdated.value,
      internshipId: item.key,
    },
  });
};

onBeforeRouteUpdate((to) => {
  educationIdUpdated.value = to.params.educationId || educationId;
  programUpdated.value = to.params.program || program;
  fetchCourses();
  getProgram(programUpdated.value);
});

const getProgram = (name) => {
  switch (name) {
    case "internships":
      return "Estagios";
    case "classes":
      return "classes";
    case "classes":
      return "classes";
    case "courses":
      return "Cursos";
    default:
      return "help_outline";
  }
};

onMounted(() => {
  fetchCourses();
});
</script>

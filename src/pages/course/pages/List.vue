<template>
  <q-page padding>
    <SettingsCourseComponent ref="settingsCourseChild" :course="course">
    </SettingsCourseComponent>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="text-grey-8 no-shadow" bordered>
          <q-card-section class="q-pa-none">
            <q-table
              class="no-shadow"
              :rows="courses"
              title="Cursos"
              :columns="columns"
              row-key="id"
              :filter="filter"
              v-model:pagination="pagination"
            >
              <template v-slot:top-right="">
                <q-input
                  borderless
                  dense
                  debounce="300"
                  v-model="filter"
                  placeholder="Pesquisar"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-btn
                  flat
                  round
                  icon="settings"
                  color="secondary"
                  @click="settingsCourse(props.row)"
                />
                <q-btn
                  flat
                  round
                  icon="edit"
                  color="primary"
                  @click="editCourse(props.row)"
                />
                <q-btn
                  flat
                  round
                  icon="delete"
                  color="negative"
                  @click="deleteCourse(props.row)"
                />
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCourseStores } from "src/pages/course/store";
import useNotify from "src/composables/UseNotify";

// stores
const router = useRouter();
const courseStores = useCourseStores();
const { notifyError, notifySuccess} = useNotify();

// data
const pagination = ref({
  rowsPerPage: 10,
});
const filter = ref("");

const courses = ref([]);
const course = ref();

const columns = [
  { name: "name", align: "left", label: "Nome", field: "name", sortable: true },
  {
    name: "education",
    align: "left",
    label: "Ensino",
    field: (row) => row?.education?.name,
    sortable: true,
  },
  {
    name: "tuitionFee",
    align: "left",
    label: "Mensalisadade",
    field: "tuitionFee",
    sortable: true,
  },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

const fetchCourses = async () => {
  try {
    await courseStores.list();
    courses.value = courseStores.courses;
  } catch (error) {
    notifyError("Erro ao buscar cursos")
  }
};

const editCourse = (course) => {
  $q.notify({
    message: `Editando: ${course.name}`,
    color: "info",
  });
};

const deleteCourse = async (course) => {};

const settingsCourse = (item) => {
  router.push({
    name: "course-settings",
    params: { id: item.id },
  })
};

onMounted(() => {
  fetchCourses();
});
</script>

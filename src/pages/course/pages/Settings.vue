<template>
  <q-page padding>
    <q-card class="q-pa-md shadow-2">
      <q-card-section>
        <div class="text-h6">Configuração estágio</div>
      </q-card-section>
      <q-separator spaced />

      <q-card-section>
        <div class="border q-pa-md shadow-2">
          <div class="row items-center justify-between">
            <span class="text-weight-bold">Planos curriculares</span>
            <q-btn
              color="primary"
              icon="add"
              label="Adicionar"
              class="q-mr-sm"
              @click="addCurriculum"
              flat
            />
          </div>

          <Tables :rows="curriculuns" :columns="ColumnsCurriculum">
            <template #actions="{ props }">
              <q-btn
                color="secondary"
                icon="school"
                no-caps
                @click="settingsCurriculum(props)"
                flat
                dense
                title="Configurar curriculum"
              />
              <q-btn
                color="primary"
                icon="edit"
                no-caps
                @click="editClasse(props)"
                flat
                dense
                title="Editar"
              />
            </template>
          </Tables>
        </div>
      </q-card-section>

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
                no-caps
                @click="showScheduleClass(props)"
                flat
                dense
                title="Horario da turma"
              />
              <q-btn
                color="primary"
                icon="edit"
                no-caps
                @click="editClasse(props)"
                flat
                dense
                title="Editar turma"
              />
              <q-btn
                color="primary"
                icon="person"
                no-caps
                @click="te(props)"
                flat
                dense
                title="Alocação de Pofessores e Horario"
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
import ClasseColumns from "../components/ClasseColumns";
import ColumnsCurriculum from "../components/ColumnsCurriculum";

/* setup route */
const route = useRoute();
const router = useRouter();

/* setup store */
const courseStores = useCourseStores();
const { notifyError } = useNotify();

/* setup data */
const { educationId, internshipId, program } = route.params;
const curriculuns = ref([]);
const classes = ref([]);

/* methods */

const addClasse = () => {
  router.push({
    name: "create-classe",
    params: { educationId: educationId, internshipId: internshipId },
  });
};

const addCurriculum = () => {
  router.push({
    name: 'create-curriculum',
    params: {
      educationId: educationId,
      courseId: internshipId
    }
  })
}

const settingsCurriculum = (props) => {
  router.push({
    name: 'settings-curriculum',
    params: {
      educationId: educationId,
      curriculumId: props.key
    }
  })
}

const editClasse = (row) => {
  router.push({
    name: "edit-classe",
    params: {
      educationId: educationId,
      internshipId: internshipId,
      classeId: row.key,
    },
  });
};

const showScheduleClass = (row) => {
  router.push({ name: "class-schedule", params: { classId: row.key } });
};

const te = (row) => {
  router.push({
    name: "employee-teachings-add",
    params: { id: row.key },
  });
};

/* fetch data */
const fetchCourse = async () => {
  try {
    await courseStores.findOne(internshipId);
      classes.value = courseStores.course.classes
      curriculuns.value =  courseStores.course.curriculums
  } catch (error) {
    notifyError("Erro no carregamento");
  }
};

onMounted(async () => {
  await fetchCourse();

});
</script>

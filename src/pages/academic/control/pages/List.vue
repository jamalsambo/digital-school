<template>
  <q-page padding>
    <div>
      <q-card>
        <q-card-section>
          <div class="row items-center justify-between">
            <div class="text-h6 text-primary">Control academico</div>
            <q-btn
              color="primary"
              label="Emitir"
              class="q-mr-sm"
              @click="handleBulletinIssue"
              flat
            />
          </div>
          <q-separator spaced />
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1">Informações de pesquisa</div>
          <q-card flat bordered class="q-pa-md shadow-2">
            <div class="row q-col-gutter-sm">
              <q-select
                class="col-md-6 col-sm-12 col-xs-12"
                v-model="student"
                use-input
                hide-selected
                input-debounce="0"
                :options="options"
                @filter="filterFn"
                hint="Filtro de Estudantes"
                outlined
                label="Estudantes"
                option-label="name"
                fill-input
                dense
                map-options
                @update:model-value="updateStudentSelect"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-select
                class="col-md-6 col-sm-12 col-xs-12"
                v-model="classe"
                :options="stages"
                label="Estagios"
                option-label="classe.name"
                dense
                outlined
                map-options
                @update:model-value="updateClasseSelect"
              >
                <template v-slot:selected>
                  <span v-if="classe"
                    >{{ classe.classe.name }} -
                    {{ classe.classe.course.name }}</span
                  >
                  <span v-else>Selecione um estágio</span>
                </template>

                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.classe.name }}</q-item-label>
                      <q-item-label caption>{{
                        scope.opt.classe.course.name
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </q-card>
        </q-card-section>
      </q-card>
      <q-card class="my-card" v-if="student">
        <q-card-section>
          <div class="text-h6">Desenvolvimento pedagógico do aluno</div>

          <StudentDevelopmentCycle
            :disciplines="disciplines"
            :get-final-grade-status="getFinalGradeStatus"
            :launch-grades="launchGrades"
            :get-color="getColor"
            :institution-type="institution.educationLevel?.name"
            :regime="regime"
          />
        </q-card-section>

        <q-card-section   v-if="institution.educationLevel?.name === 'Ensino Médio'">

          <StudentDisciplineFinalClassification
            :final-averages="finalAverages"
            :launch-grades-exame="launchGradesExame"
          />
        </q-card-section>
        <q-card-section  v-if="institution.educationLevel?.name === 'Ensino Médio'">
          <StudentFinalClassification :averages="finalAverages" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { useStudentStores } from "src/pages/student/store";
import { useEvolutionStores } from "src/pages/evolution/stores";
import { useInstitutionStores } from "src/pages/institution/store";

import { useRoute, useRouter } from "vue-router";
import ControlAcademicScripts from "../scripts";
import StudentDevelopmentCycle from "../components/StudentDevelopmentCycle.vue";
import StudentDisciplineFinalClassification from "../components/StudentDisciplineFinalClassification.vue";
import StudentFinalClassification from "../components/StudentFinalClassification.vue";

/* setup route */
const route = useRoute();
const router = useRouter();

/* setup stores */
const studentsStores = useStudentStores();
const evolutionStores = useEvolutionStores();
const institutionStores = useInstitutionStores();


const {
  groupedDisciplineByYearAndCicle,
  finalAveragesDisciplines,
  getFinalGradeStatus,
  getColor,
} = ControlAcademicScripts();

/* setup data */
const students = ref([]);
const student = ref(null);
const options = ref(students.value);
const classe = ref();
const stages = ref([]);
const regime = ref();
const disciplines = ref([]);
const evolutions = ref([]);
const evolutionTypeExame = ref([]);
const evolutionTypeNormal = ref();
const finalAverages = ref([]);
const institution = computed(() => institutionStores.institution);

/* setup methods */
const launchGrades = (disciplineId) => {
  router.push({
    name: "evolution-create",
    params: {
      classe: classe.value.classe.id,
      discipline: disciplineId,
      student: "student",
      studentId: student.value.id,
      exame: false,
    },
  });
};

const launchGradesExame = (disciplineId) => {
  router.push({
    name: "evolution-create",
    params: {
      classe: classe.value.classe.id,
      discipline: disciplineId,
      student: "student",
      studentId: student.value.id,
      exame: true,
    },
  });
};

const handleBulletinIssue = () => {
  router.push({
    name: "bulletin-issue",
    params: { studentId: student.value.id, classId: classe.value?.classId },
  });
};
const updateStudentSelect = (student) => {
  stages.value = student.enrollments;
  evolutions.value = student.evolutions;
};

const updateClasseSelect = (value) => {
  regime.value = value.classe.course.institution.regime;

  const curriculum = value?.classe?.course.curriculums.find(
    (f) => f.status === "ACTIVO"
  );

  disciplines.value = groupedDisciplineByYearAndCicle(
    curriculum,
    evolutions.value
  );
  getFinalGradeStatus(evolutions.value);
  finalAverages.value = finalAveragesDisciplines(
    evolutions.value,
    evolutionTypeExame.value,
    regime.value
  );
};

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = students.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

/* Fetch data */
const fetchStudents = async () => {
  try {
    await studentsStores.list();
    students.value = studentsStores.students.map((student) => {
      return {
        id: student.id,
        name: student?.basicInformation?.fullName ?? "Default",
        ...student,
      };
    });

    await evolutionStores.list();
    evolutionTypeExame.value = evolutionStores.evolutionTypes
      .filter((e) => e.type === "Exame")
      .map((e) => e.id);

    evolutionTypeNormal.value = evolutionStores.evolutionTypes.find(
      (e) => e.type === "Normal"
    );
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchStudents();
});
</script>

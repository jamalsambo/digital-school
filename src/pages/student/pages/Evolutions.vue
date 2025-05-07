<template>
  <q-page padding>
    <q-card class="q-pa-md shadow-2">
      <q-card-section>
        <div class="text-h6">Minhas Avaliações Acadêmicas</div>
        <div class="text-subtitle2 text-grey-7">
          Confira suas notas por disciplina e ciclo escolar.
        </div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <StudentDevelopmentCycle
          :disciplines="disciplines"
          :get-final-grade-status="getFinalGradeStatus"
          :get-color="getColor"
          :institution-type="institution.educationLevel?.name"
        />
      </q-card-section>
      <q-card-section>
        <StudentDisciplineFinalClassification  :final-averages="finalAverages" />
      </q-card-section>
      <q-card-section>
        <StudentFinalClassification :averages="finalAverages" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
/* 📦 Importações */
import { ref, computed, onMounted } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useStudentStores } from '../store';
import { useInstitutionStores } from 'src/pages/institution/store';
import { useEvolutionStores } from 'src/pages/evolution/stores';
import ControlAcademicScripts from 'src/pages/academic/control/scripts';
import scripts from 'src/composables/Scripts';
import useNotify from 'src/composables/UseNotify';

/* 🧩 Componentes */
import StudentDevelopmentCycle from 'src/pages/academic/control/components/StudentDevelopmentCycle.vue';
import StudentDisciplineFinalClassification from 'src/pages/academic/control/components/StudentDisciplineFinalClassification.vue';
import StudentFinalClassification from 'src/pages/academic/control/components/StudentFinalClassification.vue';

/* 🧠 Stores */
const route = useRoute();
const studentStores = useStudentStores();
const institutionStores = useInstitutionStores();
const evolutionStores = useEvolutionStores();

/* 🔧 Helpers */
const { filterEnrollmentsByYear } = scripts();
const { notifyError } = useNotify();
const {
  groupedDisciplineByYearAndCicle,
  finalAveragesDisciplines,
  getFinalGradeStatus,
  getColor
} = ControlAcademicScripts();

/* 📌 States */
const studentId = ref(route.params.id);
const student = ref({});
const enrollments = ref([]);
const evolutions = ref([]);
const disciplines = ref([]);
const finalAverages = ref([]);
const evolutionTypeExamIds = ref([]);

/* 🧮 Computed */
const institution = computed(() => institutionStores.institution);

const actualEnrollment = computed(() =>
  filterEnrollmentsByYear(enrollments.value, new Date().getFullYear())
);

const regime = computed(() =>
  actualEnrollment.value?.classe?.course.institution.regime
);

const activeCurriculum = computed(() =>
  actualEnrollment.value?.classe?.course.curriculums.find(c => c.status === 'ACTIVO')
);

/* 🔄 Fetch data */
const fetchStudentData = async () => {
  try {
    await studentStores.findOne(studentId.value);
    student.value = studentStores.student;
    enrollments.value = student.value.enrollments;
    evolutions.value = student.value.evolutions;

    await evolutionStores.list();

    evolutionTypeExamIds.value = evolutionStores.evolutionTypes
      .filter(type => type.type === 'Exame')
      .map(type => type.id);

    disciplines.value = groupedDisciplineByYearAndCicle(
      activeCurriculum.value,
      evolutions.value
    );

    getFinalGradeStatus(evolutions.value);

    finalAverages.value = finalAveragesDisciplines(
      evolutions.value,
      evolutionTypeExamIds.value,
      regime.value
    );
  } catch (error) {
    notifyError('Erro ao carregar o estudante.');
  }
};

/* 🔁 Atualização de rota */
onBeforeRouteUpdate(to => {
  studentId.value = to.params.id;
  fetchStudentData();
});

/* 🚀 Inicialização */
onMounted(fetchStudentData);
</script>

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
        <HistoryStudent :student-history="studentHistory"/>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
/* 📦 Importações */
import { ref, computed, onMounted } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { useStudentStores } from "../store";
import { useInstitutionStores } from "src/pages/institution/store";
import { useHistoryStores } from "src/pages/academic/control/stores";
import scripts from "src/composables/Scripts";
import useNotify from "src/composables/UseNotify";

/* 🧩 Componentes */
import HistoryStudent from "src/pages/academic/control/components/HistoryStudent.vue";

/* 🧠 Stores */
const route = useRoute();
const studentStores = useStudentStores();
const institutionStores = useInstitutionStores();

const historyStores = useHistoryStores();

/* 🔧 Helpers */
const { filterEnrollmentsByYear } = scripts();
const { notifyError } = useNotify();

/* 📌 States */
const studentId = ref(route.params.id);
const student = ref({});
const enrollments = ref([]);
const studentHistory = ref();

const actualEnrollment = computed(() =>
  filterEnrollmentsByYear(enrollments.value, new Date().getFullYear())
);

/* 🔄 Fetch data */
const fetchStudentData = async () => {
  try {
    await studentStores.findOne(studentId.value);
    student.value = studentStores.student;
    enrollments.value = student.value.enrollments;

    await historyStores.findStudentHistory(
      student.value.id,
      actualEnrollment.value.classe.courseId
    );
    studentHistory.value = historyStores.studentHistory;
  } catch (error) {
    console.log(error);
    notifyError("Erro ao carregar o estudante.");
  }
};

/* 🔁 Atualização de rota */
onBeforeRouteUpdate((to) => {
  studentId.value = to.params.id;
  fetchStudentData();
});

/* 🚀 Inicialização */
onMounted(fetchStudentData);
</script>

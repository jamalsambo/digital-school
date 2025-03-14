<template>
  <q-list bordered class="rounded-borders q-pa-md">
    <q-item v-for="enrollment in enrollments" :key="enrollment.id">
      <q-item-section>
        <!-- Cabeçalho da Disciplina -->
        <div
          class="text-bold text-uppercase bg-primary text-white q-pa-sm rounded-borders justify-between"
        >
          <q-item>
            <q-item-section>{{ enrollment.classe.name }}</q-item-section>
            <q-item-section side>
              {{ enrollmentActive ? "Activo" : "Inativo" }}</q-item-section
            >
          </q-item>
        </div>
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            v-for="(renewal, index) in enrollment.renewals"
            :key="index"
            dense
            expand-separator
            icon="perm_identity"
            label="Inscrição"
            :caption="enrollment.classe.name"
          >
            <q-card>
              <q-card-section>
                <span>{{ renewal.renewalDate  }} - {{ renewal.renewalDue  }} </span>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { useStudentStores } from "../store";
import useNotify from "src/composables/UseNotify";
import scripts from "src/composables/Scripts";

/* use store */
const route = useRoute();
const studentStores = useStudentStores();
const { notifyError } = useNotify();
const { filterEnrollmentsByYear } = scripts();

/* data */
const { id } = route.params;
const studentId = ref(route.params.id || id);
const enrollments = ref([]);
const enrollmentActive = ref();
const student = ref()

/* Methods */
const fetchStudent = async () => {
  try {
    await studentStores.findOne(studentId.value);
    student.value = studentStores.student;
    enrollments.value = student.value.enrollments;
    enrollmentActive.value =  !!filterEnrollmentsByYear(enrollments.value, new Date().getFullYear())
  } catch (error) {
    notifyError("Erro ao carregar estudante");
  }
};

const isCurrentDateInInterval = (dateIntervals) => {
  const currentDate = new Date(); // Data atual

  return dateIntervals.some((interval) => {
    const startDate = new Date(interval.classe.startDate);
    const endDate = new Date(interval.classe.endDate);

    return currentDate >= startDate && currentDate <= endDate;
  });
};

onBeforeRouteUpdate( (to) => {
  studentId.value = to.params.id || id;
   fetchStudent();
});

onMounted(fetchStudent);

</script>

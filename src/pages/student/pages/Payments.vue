<template>
  <q-page padding>
    <Tables :rows="payments" :columns="PaymentsColumns"></Tables>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "src/pages/auth/store";
import { useStudentStores } from "../store";
import Tables from "src/components/Tables.vue";
import scripts from "src/composables/Scripts";
import PaymentsColumns from "src/pages/financial/payments/components/columns/Payments";

/* Stores */
const authStore = useAuthStore();
const studentStores = useStudentStores();
const { filterEnrollmentsByYear } = scripts();

/* Reactive variables */
const payments = ref([]);
const student = ref();
const year = ref(new Date().getFullYear());
const months = ref([
  { id: 0, month: "Janeiro" },
  { id: 1, month: "Fevereiro" },
  { id: 2, month: "Março" },
  { id: 3, month: "Abril" },
  { id: 4, month: "Maio" },
  { id: 5, month: "Junho" },
  { id: 6, month: "Julho" },
  { id: 7, month: "Agosto" },
  { id: 8, month: "Setembro" },
  { id: 9, month: "Outubro" },
  { id: 10, month: "Novembro" },
  { id: 11, month: "Dezembro" },
]);

/* Funcao para buscar pagaments do estudante */
const fetchPayments = async () => {
  try {
    await studentStores.findOne(authStore.user.userDetails.id);
    student.value = studentStores.student;
    const enrollments = studentStores.student.enrollments;
    const enrollmentsByYear = filterEnrollmentsByYear(enrollments, year.value);
    const paymentStudent = studentStores.student.payments;

    payments.value = months.value.map((month) => {
      const payment = paymentStudent.find(
        (p) =>
          p.year === year.value.toString() &&
          p.studentId === authStore.user.userDetails.id
      );

      return {
        month: month,
        payment: payment || {
          amount: enrollmentsByYear.monthlyFee,
          status: false,
        },
      };
    });
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchPayments();
});
</script>

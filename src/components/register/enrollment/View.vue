<template>
  <q-dialog v-model="fullWidth" full-width>
    <q-card>
      <OrderComponent
        :enrollment="enrollment"
        :student="student"
      ></OrderComponent>
      <q-card-section class="q-pt-none"> </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Exibição dos Contactos -->
  <div v-if="!isEditingEnroll">
    <q-card flat bordered class="q-pa-md shadow-2">
      <div class="row items-center justify-between">
        <div class="text-h6 text-primary">Matrícula</div>
        <q-btn
          v-if="!enrollmentActive"
          color="primary"
          icon="edit"
          label="Nova Matrícula"
          class="q-mr-sm"
          @click="toggleEdit"
          flat
        />
      </div>
      <q-separator spaced />
      <div class="q-pt-sm">
        <!-- Listagem de Matricula -->
        <div v-if="enrollments.length">
          <q-list bordered>
            <q-item v-for="(item, index) in enrollments" :key="index">
              <q-item-section>
                <div>
                  <span class="text-weight-bold">Classe</span><br />
                  {{ item.classe.course.name }}
                </div>
              </q-item-section>
              <q-item-section>
                <div>
                  <span class="text-weight-bold">Turma</span><br />
                  {{ item.classe.name }}
                </div>
              </q-item-section>
              <q-item-section>
                <div>
                  <span class="text-weight-bold">Matricula </span><br />
                  {{ enrollmentActive ? "Activo" : "Inativo" }}
                </div>
              </q-item-section>
              <q-item-section side>
                <div class="row justify-end q-gutter-sm">
                  <q-btn
                    flat
                    dense
                    round
                    icon="picture_as_pdf"
                    color="black"
                    @click="handleOrderSummary(item.id)"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card>
  </div>

  <!-- Formulário para Criação de nova matricula -->
  <div v-else>
    <q-card flat bordered class="q-pa-md shadow-2">
      <div class="text-h6 text-primary">Nova Matricula</div>
      <q-separator spaced />
      <q-form @submit="saveChanges" class="q-gutter-md q-pt-sm">
        <div class="row q-col-gutter-sm">
          <q-select
            class="col-md-4 col-sm-12 col-xs-12"
            label="Classe/Curso *"
            option-label="name"
            option-value="id"
            v-model="courseSelected"
            :options="courseOptions"
            outlined
            required
            dense
          />
          <q-select
            class="col-md-4 col-sm-12 col-xs-12"
            label="Periodo *"
            option-label="name"
            option-value="id"
            v-model="period"
            :options="periods"
            outlined
            required
            @update:model-value="onPeriodChange(period)"
            dense
          />

          <q-select
            class="col-md-4 col-sm-12 col-xs-12"
            v-model="selectedClass"
            :options="classes"
            option-label="name"
            option-value="id"
            label="Turma"
            outlined
            @update:model-value="onClassChange(selectedClass)"
            dense
          />
        </div>

        <div class="text-h7 text-primary">Taxas extras da matricula</div>
        <q-separator spaced />
        <q-list bordered>
          <q-item clickable v-ripple v-for="fees in extraFees" :key="fees.id">
            <q-item-section>{{ fees.name }} - {{ fees.amount }}</q-item-section>
          </q-item>
        </q-list>

        <div class="text-h7 text-primary">Pagamento de mensalidade</div>
        <q-separator spaced />
        <q-list bordered>
          <q-item clickable v-ripple v-for="month in months" :key="month.id">
            <q-item-section>
              <q-checkbox
                v-model="month.id"
                class="q-ml-md"
                color="primary"
                :label="month.month"
                @update:model-value="checkedMouth(month)"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <div class="text-h7 text-primary">Resumo</div>
        <q-separator spaced />
        <q-list dense bordered class="justify-end">
          <q-item>
            <q-item-section>📋 Matricula referente</q-item-section>
            <q-item-section side>{{ courseSelected?.name }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>📌 Turma</q-item-section>
            <q-item-section side>{{ selectedClass?.name }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>💵 Total a pagar</q-item-section>
            <q-item-section side>{{ totalPaid }}</q-item-section>
          </q-item>
        </q-list>

        <q-card flat bordered class="q-pa-md shadow-2 q-mt-md" v-if="!view">
          <span class="text-weight-bold">Método de pagamento</span>
          <q-separator spaced />
          <div class="row q-col-gutter-md">
            <q-select
              class="col-md-6 col-sm-12 col-xs-12"
              label="Metodo de Pagamento *"
              option-label="name"
              option-value="id"
              v-model="method"
              :options="[
                'Mpesa',
                'eMola',
                'mKesh',
                'Numerário',
                'Depósito Bancário',
                'Cartão Bancário',
                'Cheque Bancário',
                'Transferência',
              ]"
              outlined
              required
              dense
              clearable=""
            />
            <q-input
              class="col-md-4 col-sm-12 col-xs-12"
              label="Número do Documento"
              v-model="code"
              outlined
              dense
            />
          </div>
        </q-card>
        <slot name="actions"></slot>
      </q-form>
    </q-card>
  </div>
</template>
<script setup>
// imports
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useEnrollmentStores } from "./Stores";
import { useCourseStores } from "src/pages/course/store";
import { useStudentStores } from "src/pages/student/store";
import { useInstitutionStores } from "src/pages/institution/store";
import useNotify from "src/composables/UseNotify";
import OrderComponent from "src/components/register/order_summary/View.vue";
import { usePaymentStores } from "src/pages/financial/payments/stores";
import { useAuthStore } from "src/pages/auth/store";

// stores
const route = useRoute();
const { id } = route.params;
const enrollmentStores = useEnrollmentStores();
const courseStores = useCourseStores();
const institutionStores = useInstitutionStores();
const studentStores = useStudentStores();
const paymentStores = usePaymentStores();
const authStore = useAuthStore();
const { notifyError, notifySuccess, notifyInfo } = useNotify();

// components data
const isEditingEnroll = ref(false);
const courseSelected = ref();
const selectedClass = ref();
const enrollments = ref([]);
const period = ref();
const periods = ref([]);
const enrollmentActive = ref();

const classes = ref([]);
const courseOptions = ref([]);
const availableVacancies = ref();
const fullWidth = ref(false);
const student = computed(() => studentStores.student);
const enrollment = ref();
const extraFees = ref([]);
const mouthSelected = ref([]);
const method = ref();
const code = ref();
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

// computed properties
const enrollValue = computed(() =>
  extraFees.value.reduce((acc, value) => acc + parseInt(value.amount), 0)
);

const mouthFees = computed(
  () => mouthSelected.value.length * parseInt(courseSelected.value?.tuitionFee)
);
const totalPaid = computed(() => enrollValue.value + mouthFees.value);

const checkedMouth = async (mouth) => {
  mouthSelected.value.push(mouth);
};

// methods
/* funcao para salvar a matricula */
const saveChanges = async () => {
  const currentDate = new Date();
  const month = currentDate.toLocaleString("pt-BR", { month: "long" });
  const payload = {
    classId: selectedClass.value.id,
    studentId: id,
  };

  try {
    await enrollmentStores.create(payload);

    if (enrollmentStores.enrollment.id) {
      await enrollmentStores.renew({
        enrollmentId: enrollmentStores.enrollment.id,
      });

      const payloadInvoice = {
        institutionId: authStore.user.userDetails.institutionId,
        employeeId: authStore.user.userDetails.id,
        studentId: id,
        issueDate: currentDate,
        totalValue: totalPaid.value.toString(),
        tax: "5",
        netvalue: totalPaid.value.toString(),
        paymentDate: currentDate,
        paymentMethod: method.value,
        status: "Pago",
        paymentReference: code.value || "N/A",
      };

      await paymentStores.createInvoice(payloadInvoice);

      if (paymentStores.invoice.id) {
        const payload = {
          paymentTypeId: "a131c06c-6c3c-4156-80ce-e9f151fe865f",
          amount: totalPaid.value.toString(),
          method: method.value,
          status: "Pago",
          paymentDate: currentDate,
          dueDate: selectedClass.value.endDate,
          paymentNote: `Pagamento referente a matricula`,
          month: month,
          year: currentDate.getFullYear().toString(),
          studentId: id,
          code: code.value || "",
        };

        await paymentStores.create(payload);

        extraFees.value.forEach(async (fee) => {
          const payloadFee = {
            invoiceId: paymentStores.invoice.id,
            description: fee.name,
            quantity: 1,
            unitPrice: fee.amount.toString(),
            tax: "5",
            amount: fee.amount.toString(),
          };
          await paymentStores.createInvoiceItems(payloadFee);
        });

        mouthSelected.value.forEach(async (item) => {
          const payloadMouthItem = {
            invoiceId: paymentStores.invoice.id,
            description: `Mensalidade referente o mes de ${item.month}`,
            quantity: 1,
            unitPrice: courseSelected.value?.tuitionFee.toString(),
            tax: "5",
            amount: courseSelected.value?.tuitionFee.toString(),
          };
          await paymentStores.createInvoiceItems(payloadMouthItem);
        });

        notifySuccess("Matricula salva com sucesso!");
      }

      await enrollmentStores.findById(enrollmentStores.enrollment.id);
      fetchEnrollments();
    } else {
      notifyError("Erro ao gerar inscricao");
    }
  } catch (error) {
    console.error(error);
    notifyError("Erro ao salvar Matricula");
  }
  isEditingEnroll.value = false;
};
/* Funcao de activacao de area de criacao de matricula  */
const toggleEdit = () => {
  isEditingEnroll.value = !isEditingEnroll.value;
};
/* funcao de mudanca do selected periodo */
const onPeriodChange = async (value) => {
  classes.value = courseSelected.value.classes.filter(
    (c) => c.period === value.name
  );
};
/* funcao de mudanca do selected da turma */
const onClassChange = async (row) => {
  await enrollmentStores.findByClass(row.id);
  const enrollmentPerClass = enrollmentStores.enrollments;

  const vacancyLimit = selectedClass.value?.vacancy_limit || 0;
  const enrollmentCount = enrollmentPerClass.length || 0;

  availableVacancies.value = vacancyLimit - enrollmentCount;
  extraFees.value = row.extraFees;

  notifyInfo("Vagas disponivel " + availableVacancies.value);
};
/* funcao para carregar modal de factura-recibo */
const handleOrderSummary = async (enrollId) => {
  fullWidth.value = true;
  enrollment.value = student.value.enrollments.find(
    (enroll) => enroll.id === enrollId
  );
};
/* Funcao para carregar cursos */
const fetchCourse = async () => {
  await courseStores.list();
  courseOptions.value = courseStores.courses;
};
/* Funcao para carregar Matriculas */
const fetchEnrollments = async () => {
  await enrollmentStores.findByStudent(id);
  enrollments.value = enrollmentStores.enrollments;
  enrollmentActive.value = isCurrentDateInInterval(enrollments.value);
};
/* Funcao para verificicar matricula activa */
const isCurrentDateInInterval = (dateIntervals) => {
  const currentDate = new Date(); // Data atual

  return dateIntervals.some((interval) => {
    const startDate = new Date(interval.classe.startDate);
    const endDate = new Date(interval.classe.endDate);

    return currentDate >= startDate && currentDate <= endDate;
  });
};
/* Funçào para buscar o periodos da escola */
const fetchInstitutionPeriods = async () => {
  try {
    await institutionStores.findShifts();
    periods.value = institutionStores.shifts;
  } catch (error) {
    notifyError(error);
  }
};

onMounted(() => {
  fetchCourse();
  fetchEnrollments();
  fetchInstitutionPeriods();
});
defineExpose({
  toggleEdit,
});
</script>

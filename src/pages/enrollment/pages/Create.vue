<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Nova matricula</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <q-form @submit="onSubmit">
          <div class="row q-col-gutter-sm">
            <q-select
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="course"
              :options="courses"
              option-label="name"
              option-value="id"
              label="Classe/Estagio/Curso"
              outlined
              dense
              map-options
              @update:model-value="onCourseChange"
            />
            <q-select
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="classe"
              :options="classes"
              label="Turma"
              option-label="name"
              option-value="id"
              outlined
              dense
              @update:model-value="onClasseChange"
              map-options
            />
          </div>
          <div class="text-h7 text-primary text-bold q-mt-sm">
            Informaçoes da turma
          </div>
          <q-separator spaced />
          <q-list dense bordered class="justify-end">
            <q-item>
              <q-item-section>📋 Valor de matricula </q-item-section>
              <q-item-section side>{{
                classe?.enrollmentFeeValue
              }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>📌 Mensalidade</q-item-section>
              <q-item-section side>{{ classe?.monthlyFee }}</q-item-section>
            </q-item>
            <q-item v-if="classe?.renewal !== 0">
              <q-item-section>📋 Valor de inscricao </q-item-section>
              <q-item-section side>{{ classe?.renewalValue }}</q-item-section>
            </q-item>
            <q-item v-if="classe?.renewal !== 0">
              <q-item-section>📌 Renovaçao de inscricao</q-item-section>
              <q-item-section side>{{ classe?.renewal }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>💵 Periodo</q-item-section>
              <q-item-section side
                >{{ classe?.period.start }} -
                {{ classe?.period.end }}</q-item-section
              >
            </q-item>
            <q-item v-if="classe?.monthlyFeeIncluse">
              <q-item-section
                >Nota: Valor da primeira mensalidade inclusa</q-item-section
              >
            </q-item>
          </q-list>

          <!-- Botões de ação -->
          <div class="row justify-end q-gutter-sm q-mt-sm">
            <q-btn
              label="Cancelar"
              color="negative"
              flat
              icon="cancel"
              @click="cancel"
            />
            <q-btn
              type="submit"
              label="Salvar"
              color="primary"
              icon="save"
              flat
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCourseStores } from "src/pages/course/store";
import { useEnrollmentStores } from "../store";
import { usePaymentStores } from "src/pages/finance/payments/stores";
import { useInvoiceStores } from "src/pages/finance/invoice/stores";
import { useUserStores } from "src/pages/user/store";
import useNotify from "src/composables/UseNotify";

/* setup router */
const router = useRouter();
const route = useRoute();

/* setup router */
const courseStores = useCourseStores();
const enrollmentStores = useEnrollmentStores();
const paymentStores = usePaymentStores();
const invoiceStores = useInvoiceStores();
const userStores = useUserStores();
const { notifyError, notifySuccess } = useNotify();

/* setup data */
const { studentId } = route.params;
const courses = ref([]);
const course = ref();
const classes = ref([]);
const classe = ref();
const month = new Date().toLocaleString("pt-BR", { month: "long" });
const paymentType = ref();

/* setup methods */
const onSubmit = async () => {
  const monthFristPay = new Date(classe.value?.startDate).toLocaleString(
    "pt-BR",
    { month: "long" }
  );
  const payload = {
    classId: classe.value.id,
    studentId: studentId,
  };
  try {
    await enrollmentStores.create(payload);
    if (enrollmentStores.enrollment.id) {
      const payloadInvoice = {
        paymentTypeId: paymentType.value.id,
        classId: classe.value.id,
        studentId: studentId,
        employeeId: userStores.user?.employee?.id,
        issueDate: new Date(),
        dueDate: new Date(),
        month: month,
        amount: parseInt(classe.value.enrollmentFeeValue),
        total: parseInt(classe.value.enrollmentFeeValue),
        status: "Pendente",
        year: new Date().getFullYear(),
        note: `Factura referente a matricula do ano lectivo ${new Date().getFullYear()}`,
      };

      await invoiceStores.create(payloadInvoice);

      if (classe.value.monthlyFeeIncluse) {
        const payloadPayment = {
          invoiceId: invoiceStores.invoice.id,
          description: `Mensalidade referente a turma ${classe.value.name}, mes de ${monthFristPay}`,
          amount: parseInt(classe.value.monthlyFee),
        };

        await invoiceStores.createItems(payloadPayment);
      }

      if (classe.value.extraFeesEnrollments.length > 0) {
        classe.value.extraFeesEnrollments.map(async (value) => {
          const invoiceItems = {
            invoiceId: invoiceStores.invoice.id,
            description: value.name,
            amount: parseInt(value.amount),
          };

          await invoiceStores.createItems(invoiceItems);
        });
      }

      router.back();
      notifySuccess("Matricula registada, aguardando pagamento!");
    } else {
      notifyError("Matricula nao criada.");
    }
  } catch (error) {
    console.log(error);
    notifyError("Erro na criaça de matricula");
  }
};
const onCourseChange = async (value) => {
  classes.value = value.classes;
};
const onClasseChange = async (value) => {
  classe.value = value;
};

/* fetchdata */
const fetchCourses = async (education) => {
  try {
    await courseStores.list({ educationId: education });
    courses.value = courseStores.courses;
  } catch (error) {}
};

const fetchPaymentType = async () => {
  try {
    await paymentStores.findPaymentTypes();
    paymentType.value = paymentStores.paymentTypes.find(
      (type) => type.name === "Matricula"
    );
  } catch (error) {
    notifyError("Erro no carregamento");
  }
};

onMounted(async () => {
  await fetchCourses()
  await fetchPaymentType();
});
</script>

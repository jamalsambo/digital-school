<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Pagemento da matricula</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <div class="text-h7 text-primary text-bold">
          Informaçoes da Pagemento
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
          <!-- <q-item v-if="classe?.renewal !== 0">
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
          </q-item> -->
          <!-- <q-item v-if="classe?.monthlyFeeIncluse">
            <q-item-section
              >Nota: Valor da primeira mensalidade inclusa</q-item-section
            >
          </q-item> -->

        </q-list>
        <div class="row q-col-gutter-sm">
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
        <q-btn
              label="Cancelar"
              @click="router.back()"
              color="negative"
              flat
              type="reset"
            />
            <q-btn
              label="Salvar"
              color="primary"
              flat
              @click="submitPayment"
              type="button"
            />
        </div>
          <div class="row q-mt-md justify-end">

          </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "src/pages/auth/store";
import { useEnrollmentStores } from "src/pages/enrollment/store";
import { usePaymentStores } from "../stores";
import useNotify from "src/composables/UseNotify";
/* setup route */
const route = useRoute();
const router = useRouter();

/* setup store */
const authStore = useAuthStore();
const enrollmentStores = useEnrollmentStores();
const paymentStores = usePaymentStores();
const { notifyError, notifySuccess } = useNotify()

/* setup data */
const { studentId,enrollmentId } = route.params;
const classe = ref();
const paymentType = ref();
const method = ref();
const code = ref();
const currentDate = new Date();
const month = currentDate.toLocaleString('pt-BR', { month: 'long' });

const submitPayment = async () => {
  const payload = {
    institutionId: authStore.user?.userDetails?.institutionId,
    paymentTypeId: paymentType.value.id,
    amount:  classe.value?.enrollmentFeeValue,
    method: method.value,
    status: "Pago",
    paymentDate: currentDate,
    dueDate: classe.value?.endDate,
    paymentNote: `Matricula referente o ano ${currentDate.getFullYear()}`,
    month: month,
    year: currentDate.getFullYear().toString(),
    studentId: studentId,
    code: code.value || "",
  };
  try {
    await paymentStores.create(payload)
    if (paymentStores.payment.id){
      await enrollmentStores.update(enrollmentId, {paymentId: paymentStores.payment.id})
    } 
    notifySuccess("Pagamento efectuado com sucesso!")
    router.back();
  } catch (error) {
    notifyError("Erro ao efectuar pagamento")
  }
};

const fetchEnrollment = async () => {
  try {
    await enrollmentStores.findById(enrollmentId);
    classe.value = enrollmentStores.enrollment.classe;
  } catch (error) {
    console.log(error);
  }
};

const fetchPaymentTypes = async () => {
  try {
    await paymentStores.findPaymentTypes()
    paymentType.value = paymentStores.paymentTypes.find((type) => type.name === "Matricula")
  } catch (error) {
    console.log(error);
  }
}


onMounted(async () => {
  await fetchEnrollment();
  await fetchPaymentTypes();
});
</script>

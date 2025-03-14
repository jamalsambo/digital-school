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
import { useEnrollmentStores } from "src/pages/enrollment/store";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const enrollmentStores = useEnrollmentStores();

const { enrollmentId } = route.params;
const classe = ref();

const submitPayment = async () => {
  const payload = {
    institutionId: authStore.user?.userDetails?.institutionId,
    paymentTypeId: paymentTypeSelected.value.id,
    amount: payment.row.payment.amount,
    method: method.value,
    status: "Pago",
    paymentDate: new Date(),
    dueDate: endDate,
    paymentNote: `${paymentTypeSelected.value.name} de referente o mes de ${payment.row.month.month}`,
    month: payment.row.month.month,
    year: year.value.toString(),
    studentId: studentId.value,
    code: code.value || "",
  };
};

const fetchEnrollment = async () => {
  try {
    await enrollmentStores.findById(enrollmentId);
    classe.value = enrollmentStores.enrollment.classe;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchEnrollment();
});
</script>

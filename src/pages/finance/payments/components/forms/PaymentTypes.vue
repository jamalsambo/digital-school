<template>
  <q-form @submit.prevent="handleSubmit" class="q-gutter-md q-pt-sm">
    <div class="row q-col-gutter-sm">
      <q-input
        class="col-md-6 col-sm-12 col-xs-12"
        label="Nome do Tipo de Pagamento"
        placeholder="Digite o nome"
        v-model="form.name"
        outlined
        required
        dense
      />

      <q-select
        class="col-md-6 col grow col-sm-12 col-xs-12"
        v-model="form.cicle"
        :options="['Anual', 'Semestral', 'Trimestral', 'Mensal', 'Unico']"
        label="Ciclo de pagamento"
        outlined
        dense
      />

      <q-input
        class="col-md-3 col grow col-sm-12 col-xs-12"
        label="Dia de inicio de pagamento"
        type="number"
        placeholder="Digite o dia"
        v-model="form.startDay"
        outlined
        required
        dense
      />

      <q-input
        class="col-md-3 col grow col-sm-12 col-xs-12"
        label="Dias de ponderação"
        type="number"
        placeholder="Digite os dias"
        v-model="form.pondering"
        outlined
        required
        dense
      />

      <q-select
        outlined
        class="col-md-3 col grow col-sm-12 col-xs-12"
        v-model="form.hasPenalty"
        :options="[
          { id: true, name: 'Sim' },
          { id: false, name: 'Não' },
        ]"
        label="Tipo de multa"
        option-value="value"
        option-label="name"
        emit-value="outlined"
        dense
      />

      <q-select
        class="col-md-3 col grow col-sm-12 col-xs-12"
        v-model="form.penaltyCalculation"
        :options="['Fixo', 'Progressiva']"
        label="Forma de calculo da multa"
        outlined
        dense
      />
    </div>
    <slot name="actions"></slot>
  </q-form>
</template>
<script setup>
import { ref } from "vue";
import { usePaymentStores } from "../../stores";
import useNotify from "src/composables/UseNotify";

const props = defineProps({
  institutionId: {
    type: String,
    required: true,
  },
  educationLevelId: {
    type: String,
    required: true,
  },
  fetchPaymentTypes: {
    type: Function,
    required: true,
  },
  toggleEdit: {
    type: Function,
    required: true,
  }
});

/* use stores */
const paymentStores = usePaymentStores();
const { notifyError, notifySuccess } = useNotify();

const form = ref({
  name: "",
  hasPenalty: "",
  cicle: "",
  startDay: "",
  pondering: "",
  penaltyCalculation: "",
});

const handleSubmit = async () => {
  const payload = {
    ...form.value,
    startDay: parseInt(form.value.startDay),
    pondering: parseInt(form.value.pondering),
    institutionId: props.institutionId,
    educationLevelId: props.educationLevelId,
    hasPenalty: form.value.hasPenalty.id
  };

  try {
    await paymentStores.createPaymentType(payload);
    notifySuccess("Tipo de pagamento criado com sucesso!")
    props.fetchPaymentTypes()
    props.toggleEdit()
  } catch (error) {
    notifyError("Erro ao criar tipo de pagamento");
  }
};
</script>

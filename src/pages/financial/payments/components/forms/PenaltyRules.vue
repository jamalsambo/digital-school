<template>
  {{ form }}
  <q-form @submit.prevent="handleSubmit" class="q-gutter-md q-pt-sm">
    <div class="row q-col-gutter-sm">
      <q-input
        class="col-md-4 col-sm-12 col-xs-12"
        label="Intervalo de "
        placeholder="Digite o nome"
        v-model="form.daysMin"
        type="number"
        outlined
        required
        dense
      />

      <q-input
        class="col-md-4 col grow col-sm-12 col-xs-12"
        label="Ate"
        type="number"
        placeholder="Digite o dia"
        v-model="form.daysMax"
        outlined
        required
        dense
      />

      <q-input
        class="col-md-4 col grow col-sm-12 col-xs-12"
        label="Percentagem de multa"
        placeholder="Digite os dias"
        v-model="form.penaltyRate"
        outlined
        required
        dense
      />
    </div>
    <slot name="actions"></slot>
  </q-form>
</template>
<script setup>
import { ref } from "vue";
import { usePaymentStores } from "../../stores";
const paymentStores = usePaymentStores();
import useNotify from "src/composables/UseNotify";
const { notifyError, notifySuccess } = useNotify();

const props = defineProps({
  paymentTypeSelected: {
    type: Object,
    required: true,
  },
  toggleEdit: {
    type: Function,
    required: true,
  },
  fetchPaymentTypes: {
    type: Function,
    required: true,
  },
  form: {
    type: Object,
    required: true,
  },
});

/* funcao para criar regras de multa  */
const handleSubmit = async () => {
  const payload = {
    ...props.form,
    daysMin: parseInt(props.form.daysMin),
    daysMax: parseInt(props.form.daysMax),
    paymentTypeId: props.paymentTypeSelected.id,
  };
  try {
    if (props.form.id) {
      await paymentStores.updatePenaltyRules(props.form.id,payload);
      notifySuccess("Regra de multa atualizada com sucesso!");
    ;
    } else {
      await paymentStores.createPenaltyRules(payload);
      notifySuccess("Regra de multa criada com sucesso!");
    }
    props.fetchPaymentTypes();
    props.toggleEdit()
  } catch (error) {
    notifyError("Error ao criar regra de multa");
  }
};
</script>

<template>
  <q-form ref="formRef" @submit.prevent="handleSubmit">

    <div class="section-label q-mb-md">Configuração da Regra</div>

    <div class="row q-col-gutter-md q-mb-lg">

      <!-- Intervalo De -->
      <div class="col-md-4 col-12">
        <div class="field-label">Intervalo De (dias) <span class="required">*</span></div>
        <q-input
          v-model="props.form.daysMin"
          type="number"
          placeholder="Ex: 1"
          outlined dense
          class="edigital-input"
          :rules="[(val) => !!val || 'Campo obrigatório.']"
        >
          <template #prepend>
            <q-icon name="first_page" color="grey-5" size="1rem" />
          </template>
        </q-input>
      </div>

      <!-- Intervalo Até -->
      <div class="col-md-4 col-12">
        <div class="field-label">Até (dias) <span class="required">*</span></div>
        <q-input
          v-model="props.form.daysMax"
          type="number"
          placeholder="Ex: 30"
          outlined dense
          class="edigital-input"
          :rules="[(val) => !!val || 'Campo obrigatório.']"
        >
          <template #prepend>
            <q-icon name="last_page" color="grey-5" size="1rem" />
          </template>
        </q-input>
      </div>

      <!-- Percentagem -->
      <div class="col-md-4 col-12">
        <div class="field-label">Percentagem de Multa (%) <span class="required">*</span></div>
        <q-input
          v-model="props.form.penaltyRate"
          type="number"
          placeholder="Ex: 5"
          outlined dense
          class="edigital-input"
          :rules="[(val) => !!val || 'Campo obrigatório.']"
        >
          <template #prepend>
            <q-icon name="percent" color="grey-5" size="1rem" />
          </template>
          <template #append>
            <span class="percent-tag">%</span>
          </template>
        </q-input>
      </div>

    </div>

    <slot name="actions" />

  </q-form>
</template>

<script setup>
import { ref } from "vue";
import { usePaymentStores } from "../../stores";
import useNotify from "src/composables/UseNotify";

/* ── Store ── */
const paymentStores = usePaymentStores();
const { notifyError, notifySuccess } = useNotify();

/* ── Props ── */
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

/* ── State ── */
const formRef = ref(null);

/* ── Methods ── */
const handleSubmit = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;

  const payload = {
    ...props.form,
    daysMin: parseInt(props.form.daysMin),
    daysMax: parseInt(props.form.daysMax),
    paymentTypeId: props.paymentTypeSelected.id,
  };

  try {
    if (props.form.id) {
      await paymentStores.updatePenaltyRules(props.form.id, payload);
      notifySuccess("Regra de multa actualizada com sucesso!");
    } else {
      await paymentStores.createPenaltyRules(payload);
      notifySuccess("Regra de multa criada com sucesso!");
    }
    props.fetchPaymentTypes();
    props.toggleEdit();
  } catch (error) {
    notifyError("Erro ao guardar regra de multa");
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap");

/* ── Form Fields ── */
.section-label {
  font-family: "Sora", sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
}
.field-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}
.required { color: #ef4444; }

.edigital-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
}
.edigital-input :deep(.q-field__control:hover) { border-color: #1a3fa6; }

.percent-tag {
  font-size: 0.78rem;
  font-weight: 700;
  color: #1a3fa6;
  font-family: "Sora", sans-serif;
}
</style>

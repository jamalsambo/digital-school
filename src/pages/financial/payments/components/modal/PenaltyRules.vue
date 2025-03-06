<template>
  <q-dialog v-model="modalRules" persistent>
    <q-card style="width: 900px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Regras de multa</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div v-if="!isEditing">
          <div class="row items-center justify-between">
            <span class="text-weight-bold">Tabela de regras</span>
            <q-btn
              color="primary"
              icon="add"
              label="Adicionar"
              class="q-mr-sm"
              @click="toggleEdit"
              flat
            />
          </div>
          <q-separator spaced />
          <Tables :rows="rows" :columns="PenaltyRulesColumns">
            <template #actions="{ props }">
              <q-btn
                icon="edit"
                color="primary"
                class="q-mr-sm"
                flat
                @click="editPenalty(props)"
              />
            </template>
          </Tables>
        </div>
        <div v-else>
          <div class="row items-center justify-between">
            <span class="text-weight-bold">Criar regra de multa</span>
          </div>
          <q-separator spaced />
          <PenaltyRulesForm
            :payment-type-selected="paymentTypeSelected"
            :toggle-edit="toggleEdit"
            :fetch-payment-types="fetchPaymentTypes"
            :form="form"
          >
            <template #actions>
              <div class="row justify-end q-gutter-sm">
                <q-btn
                  label="Cancelar"
                  color="negative"
                  icon="close"
                  outline
                  class="q-mr-sm"
                  flat
                  @click="toggleEdit"
                />
                <q-btn
                  label="Guardar"
                  color="positive"
                  icon="save"
                  type="submit"
                  flat
                />
              </div>
            </template>
          </PenaltyRulesForm>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Terminar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import Tables from "src/components/Tables.vue";
import PenaltyRulesForm from "../forms/PenaltyRules.vue";
import PenaltyRulesColumns from "../columns/PenaltyRules";
import { usePaymentStores } from "../../stores";

/* use stores */
const paymentStores = usePaymentStores();

const props = defineProps({
  paymentTypeSelected: {
    type: Object,
    required: true,
  },
  fetchPaymentTypes: {
    type: Function,
    required: true,
  },
});

/* Data */
const form = ref({
  daysMin: "",
  daysMax: "",
  penaltyRate: ""
});
const rows = computed(() =>
  paymentStores.paymentTypes.flatMap((paymentType) => {
    paymentType.id === props.paymentTypeSelected.id;
    return paymentType.rules;
  })
);
const modalRules = ref(false);
const isEditing = ref(false);

/* Methods */
const editPenalty = (props) => {
  form.value = { ...props.row,  };
  isEditing.value = !isEditing.value;
};

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  form.value ={
    daysMin: "",
    daysMax: "",
    penaltyRate: ""
  }
};

onMounted(() => {
  props.fetchPaymentTypes();
});

defineExpose({
  modalRules,
});
</script>

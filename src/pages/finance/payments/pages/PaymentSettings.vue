<template>
  <PenaltyRulesComponent ref="penaltyRulesChild" :payment-type-selected="paymentTypeSelected" :fetch-payment-types="fetchPaymentTypes">

  </PenaltyRulesComponent>
  <q-card>
    <q-card-section>
      <div class="text-h6">Configuração de pagamentos</div>
    </q-card-section>
    <!-- Seccao de tipo de pagamentos  -->
    <q-card-section class="q-pt-none">
      <div class="border q-pa-md shadow-2">
        <div v-if="!isEditing">
          <div class="row items-center justify-between">
            <span class="text-weight-bold">Tipos de Pagamentos</span>
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
          <Tables :rows="paymentTypes" :columns="columnsPaymentTypes">
            <template #actions="{ props }">
              <q-btn
                icon="gavel"
                color="primary"
                class="q-mr-sm"
                flat
                @click="addPenaltyRules(props)"
              >
              <q-tooltip> Botão para adicionar regras de pagamento </q-tooltip>
              </q-btn>
              <q-btn
                icon="edit"
                color="primary"
                class="q-mr-sm"
                flat
                @click="editPaymentType(row)"
              >
              <q-tooltip> Botão para editar tipo de pagamento </q-tooltip>
            </q-btn>
            </template>
          </Tables>
        </div>
        <div v-else>
          <div class="row items-center justify-between">
            <span class="text-weight-bold">Criar tipo de pagamento</span>
          </div>
          <q-separator spaced />
          <FormPaymentTypesComponent
            :education-level-id="educationLevelId"
            :institution-id="institution"
            :fetch-payment-types="fetchPaymentTypes"
            :toggle-edit="toggleEdit"
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
          </FormPaymentTypesComponent>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Tables from "src/components/Tables.vue";
import FormPaymentTypesComponent from "../components/forms/PaymentTypes.vue";
import columnsPaymentTypes from "../components/columns/PaymentTypes";
import PenaltyRulesComponent from "../components/modal/PenaltyRules.vue";
import { usePaymentStores } from "../stores";
import useNotify from "src/composables/UseNotify";

/* use store */
const route = useRoute();
const { institutionId, educationId } = route.params;
const paymentStores = usePaymentStores();
const { notifyError, notifySuccess } = useNotify();

/* data */
const isEditing = ref(false);
const institution = ref(institutionId);
const educationLevelId = ref(educationId);
const paymentTypes = ref([]);
const penaltyRulesChild = ref()
const paymentTypeSelected = ref()

/* Methonds */
/* funcao para carregar os tipos de pagamentos */
const fetchPaymentTypes = async () => {
  try {
    await paymentStores.findPaymentTypes();
    paymentTypes.value = paymentStores.paymentTypes;
  } catch (error) {
    notifyError("Erro ao carregar tipos de pagamentos");
  }
};
/* funcao para adicionar regras de multa ao tipo de pagamento */
const addPenaltyRules = async (row) => {
  penaltyRulesChild.value.modalRules = true
  paymentTypeSelected.value = row.row
}
/* funcao para editar tipo de pagamento */
const editPaymentType = async (row) => {

}
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

onMounted(() => {
  fetchPaymentTypes();
});
</script>

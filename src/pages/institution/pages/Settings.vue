<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Configuração da instituição</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <div class="border q-pa-md shadow-2">
          <span><strong>Niveis Educacional da instituição</strong> </span>
          <q-select
            v-model="educationLevelActive"
            :options="educationLevels"
            label="Niveis Educacional *"
            option-label="name"
            option-value="id"
            outlined
            class="col-md-4 col-sm-12 col-xs-12"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            dense
            emit-value=""
            map-options
            @update:model-value="updateSelection"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="border q-pa-md shadow-2">
          <span><strong>Plano de pagemento</strong> </span>
          <q-select
            v-model="plan"
            :options="plans"
            label="Planos de pagemento *"
            option-label="name"
            option-value="id"
            outlined
            class="col-md-4 col-sm-12 col-xs-12"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            dense
            emit-value=""
            map-options
            @update:model-value="updateSelectionPlan"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useInstitutionStores } from "../store";
import { useComposablesStores } from "src/composables";
import { usePlanStores } from "src/pages/plan/stores";
import { useRoute, useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

/* setup router */
const router = useRouter();
const route = useRoute();

/* setup store */
const institutionStores = useInstitutionStores();
const complesableStores = useComposablesStores();
const planStores = usePlanStores();
const { notifyError } = useNotify();

/* setup data */
const { institutionId } = route.params;
const institution = ref();
const educationLevels = ref();
const educationLevelActive = ref();
const plans = ref([]);
const plan = ref();

/* methods */
const updateSelection = async (value) => {
  try {
    await institutionStores.update(institutionId,  { educationId: value });
    await fetchPlans();
  } catch (error) {
    notifyError("Erro ao definir nivel da instituicao");
  }
};
const updateSelectionPlan = async (value) => {
  try {
    await institutionStores.update(institutionId, { planId: value });
  } catch (error) {
    notifyError("Erro ao definir o plano de pagemento");
  }
};

/* fetch dada */
const fetchInstitution = async () => {
  try {
    await institutionStores.findOne(institutionId);
    institution.value = institutionStores.institution;
  } catch (error) {
    console.log(error);
  }
};
const fetchEducationLevels = async () => {
  try {
    await complesableStores.findEducationLevels();
    educationLevels.value = complesableStores.educationLevels;
  } catch (error) {
    console.log(error);
  }
};
const fetchPlans = async () => {
  try {
    await planStores.list();
    plans.value = planStores.plans.filter((plan) => plan.educationLevelId===educationLevelActive.value)
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchEducationLevels();

  await fetchInstitution();
});
</script>

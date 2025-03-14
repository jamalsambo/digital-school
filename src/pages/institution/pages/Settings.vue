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
          <q-list bordered dense class="q-mt-lg">
            <q-item
              v-for="education in educationLevels"
              :key="education.id"
              clickable
            >
              <q-item-section avatar>
                <q-checkbox
                  v-model="education.checked"
                  :val="education.id"
                  @update:model-value="
                    updateSelection(education.checked, education.id)
                  "
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ education.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  v-if="education.checked"
                  flat
                  dense
                  round
                  icon="currency_exchange"
                  color="primary"
                  @click="settingsPayment(education)"
                >
                  <q-tooltip> Botão para configuração pagamentos </q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useInstitutionStores } from "../store";
import { useComposablesStores } from "src/composables";
import { useRoute, useRouter } from "vue-router";

/* setup router */
const router = useRouter();
const route = useRoute();

/* setup store */
const institutionStores = useInstitutionStores();
const complesableStores = useComposablesStores();

/* setup data */
const { institutionId } = route.params;
const institution = ref();
const educationLevels = ref();
const educationLevelActive = ref();

/* methods */
const updateSelection = async (checked, educationLevelId) => {
  if (checked) {
    await institutionStores.addEducationLevel(educationLevelId, institutionId);
  }
};

const settingsPayment = (education) => {
  router.push({
    name: 'settings-payment',
    params: {institutionId: institutionId, educationId: education.id}
  })
}
/* fetch dada */
const fetchInstitution = async () => {
  try {
    await institutionStores.findOne(institutionId);
    institution.value = institutionStores.institution;
    educationLevelActive.value = institution.value.institutionLevels;
  } catch (error) {
    console.log(error);
  }
};
const fetchEducationLevels = async () => {
  try {
    await complesableStores.findEducationLevels();
    educationLevels.value = complesableStores.educationLevels.map(
      (education) => {
        const checked = educationLevelActive.value.find(
          (f) => f.educationLevelId === education.id
        );
        return {
          id: education.id,
          name: education.name,
          checked: !!checked,
        };
      }
    );
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchInstitution();
  await fetchEducationLevels();
});
</script>

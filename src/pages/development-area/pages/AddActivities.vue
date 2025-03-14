<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">
          Adicionar {{ getNameForDisciplineEducation(education?.name) }}
        </div>
        <div class="text-subtitle2">
          Selecione as {{ getNameForDisciplineEducation(education?.name) }} para
          associar a area de desenvolvimento.
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-list bordered>
          <q-item v-for="activity in activities" :key="activity.id" clickable>
            <q-item-section>
              <div class="row q-col-gutter-sm">
                <q-checkbox
                  class="col-md-4 col-sm-12 col-xs-12"
                  v-model="activity.checked"
                  :val="activity.id"
                  @update:model-value="
                    updateSelection(activity, activity.checked)
                  "
                  :label="activity.name"
                  :disable="!activity.hours"
                />
                <q-input

                  class="col-md-2 col-sm-12 col-xs-12"
                  v-model="activity.hours"
                  type="number"
                  label="Total de horas"
                  dense
                  outlined
                />
                <q-input
                  v-if="false"
                  class="col-md-1 col-sm-12 col-xs-12"
                  disable
                  v-model="activity.credit"
                  type="number"
                  label="creditos"
                  dense
                  outlined
                />

                <q-select
                  v-if="education.name !== 'Ensino Infantil'"
                  class="col-md-2 col-sm-12 col-xs-12"
                  v-model="activity.exame"
                  :options="[
                    { label: 'Sim', value: true },
                    { label: 'Nao', value: false },
                  ]"
                  label="Exame"
                  outlined=""
                  dense
                  map-options
                />
                <q-select
                  v-if="!invalidViewsCicle.includes(education.name)"
                  class="col-md-2 col-sm-12 col-xs-12"
                  v-model="activity.cicle"

                  :options="[
                    { label: '1 Semestre', value: 1 },
                    { label: '2 Semestre', value: 2 },
                  ]"

                  label="Cicle no ano"
                  outlined
                  dense
                  map-options
                />
                <q-input
                  v-if="education.name !== 'Ensino Infantil'"
                  class="col-md-2 col-sm-12 col-xs-12"
                  v-model="activity.year"
                  type="number"
                  label="Ano"
                  dense
                  outlined
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="row q-mt-md justify-end">
          <q-btn
            label="voltar"
            color="negative"
            flat
            type="reset"
            @click="router.back()"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisciplineStores } from "src/pages/discipline/store";
import { useDevelopmentAreaStores } from "../stores";
import useNotify from "src/composables/UseNotify";
import scripts from "src/composables/Scripts";

/* setup route */
const route = useRoute();
const router = useRouter();

/* setup activity stores */
const disciplineStores = useDisciplineStores();
const developmentAreaStore = useDevelopmentAreaStores();
const { notifyError } = useNotify();
const { getNameForDisciplineEducation } = scripts();

/* setup data */
const { dAreaId, educationId } = route.params;
const activities = ref([]);
const developmentAreaActivities = ref([]);
const education = ref();
const invalidViewsCicle = ref([
  "Ensino Médio",
  "Ensino Infantil",
  "Ensino Fundamental",
]);

/* methods */
const updateSelection = async (activity, checked) => {
  try {
    activity.credit = activity.hours / 15;
    const payload = {
      developmentAreaId: dAreaId,
      activityId: activity.id,
      hours: parseInt(activity.hours),
      credit: parseInt(activity.credit),
      exame: activity.exame.value,
      cicle: parseInt(activity.cicle.value),
      year: parseInt(activity.year),
    };
    if (checked) {
      await developmentAreaStore.addDevelopmentActivity(dAreaId, payload);
    } else {
      await developmentAreaStore.deleteDevelopmentActivity(
        dAreaId,
        activity.id
      );
    }
  } catch (error) {
    console.log(error);
    notifyError("Ocorreu um erro...");
  }
};

/* fetch data */
const fetchActivities = async () => {
  try {
    await disciplineStores.list(educationId);
    activities.value = disciplineStores.disciplines.map((activity) => {
      const developmentActivity = developmentAreaActivities.value.find(
        (developmentAreaActivity) =>
          developmentAreaActivity.activityId === activity.id
      );

      return {
        id: activity.id,
        name: activity.name,
        hours: developmentActivity?.hours,
        credit: developmentActivity?.credit,
        exame: developmentActivity?.exame,
        cicle: developmentActivity?.cicle,
        year: developmentActivity?.year,
        checked: !!developmentActivity,
      };
    });
  } catch (error) {
    notifyError("Erro no carregamento...");
  }
};

const fetchDevelopmentArea = async () => {
  try {
    await developmentAreaStore.findOne(dAreaId);
    developmentAreaActivities.value =
      developmentAreaStore.developmentArea.developmentAreaActivities;
    education.value = developmentAreaStore.developmentArea.educationLevel;
  } catch (error) {
    notifyError("Erro no carregamento...");
  }
};

onMounted(async () => {
  await fetchDevelopmentArea();
  await fetchActivities();
});
</script>

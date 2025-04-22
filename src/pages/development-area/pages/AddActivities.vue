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
                  class="col-md-12 col-sm-12 col-xs-12"
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
                  v-if="education.name !== 'Ensino Infantil' || education.name!=='Ensino Médio'"
                  class="col-md-2 col-sm-12 col-xs-12"
                  v-model="activity.critical"
                  :options="[
                    { label: 'Sim', value: true },
                    { label: 'Nao', value: false },
                  ]"
                  label="Importante na transição"
                  outlined=""
                  dense
                  map-options
                />
                <q-select
                  v-if="education.name !== 'Ensino Infantil'"
                  class="col-md-2 col-sm-12 col-xs-12"
                  v-model="activity.participation"
                  :options="[
                    { label: 'Sim', value: true },
                    { label: 'Nao', value: false },
                  ]"
                  label="Participativa somente"
                  outlined=""
                  dense
                  map-options
                />
                <q-select
                  class="col-md-2 col-sm-12 col-xs-12"
                  v-model="activity.cicle"
                  :options="cicles"
                  label="Ciclo no ano"
                  outlined
                  dense
                  map-options
                  multiple
                  use-chips
                />

                <q-input
                  v-if="!invalidViewsCicle.includes(education.name)"
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
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisciplineStores } from "src/pages/discipline/store";
import { useDevelopmentAreaStores } from "../stores";
import { useInstitutionStores } from "src/pages/institution/store";
import useNotify from "src/composables/UseNotify";
import scripts from "src/composables/Scripts";

/* setup route */
const route = useRoute();
const router = useRouter();

/* setup activity stores */
const disciplineStores = useDisciplineStores();
const developmentAreaStore = useDevelopmentAreaStores();
const institutionStores = useInstitutionStores();
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
const institution = computed(() => institutionStores.institution);
const regime = computed(() =>
  Array.from({ length: institution.value.regime }, (_, i) => i + 1)
);
const cicles = computed(() => {
  const tipo =
    institution.value.regime === 1
      ? "Ano"
      : institution.value.regime === 2
      ? "Semestre"
      : "Trimestre";

  return regime.value.map((r) => ({
    label: `${r}º ${tipo}`,
    value: r,
  }));
});

/* methods */
const updateSelection = async (activity, checked) => {
  try {
    activity.credit = activity.hours / 15;
    const payload = {
      developmentAreaId: dAreaId,
      activityId: activity.id,
      hours: parseInt(activity.hours),
      credit: parseInt(activity.credit),
      exame: activity.exame?.value || false,
      critical: activity.critical?.value || false,
      participation: activity.participation?.value || false,
      year: parseInt(activity.year) || 1,
    };
    if (checked) {
      activity.cicle.forEach(async (cicle) => {
        await developmentAreaStore.addDevelopmentActivity(dAreaId, {
          ...payload,
          cicle: cicle.value,
        });
      });
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

    // Inicializa o mapa com todas as disciplinas
    const grouped = new Map();
    disciplineStores.disciplines.forEach((discipline) => {
      grouped.set(discipline.id, {
        id: discipline.id,
        name: discipline.name,
        hours: 0,
        credit: 0,
        exame: false,
        critical: false,
        participation: false,
        year: null,
        cicle: [],
        checked: false,
      });
    });

    // Preenche com os dados vindos das alocações
    developmentAreaActivities.value.forEach((dev) => {
      const entry = grouped.get(dev.activityId);
      if (entry) {
        entry.hours = dev.hours;
        entry.credit = dev.credit;
        entry.exame = dev.exame;
        entry.critical = dev.critical;
        entry.participation = dev.participation;
        entry.year = dev.year;
        entry.checked = true;

        if (!entry.cicle.includes(dev.cicle)) {
          entry.cicle.push(dev.cicle);
        }
      }
    });

    // Converte para array reativo
    activities.value = Array.from(grouped.values());
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

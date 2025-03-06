<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Adicionar actividades</div>
        <div class="text-subtitle2">
          Selecione as actividade para associar a area de desenvolvimento.
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-list bordered>
          <q-item v-for="activity in activities" :key="activity.id" clickable>
            <q-item-section>
              <div class="row q-col-gutter-sm">
                <q-checkbox
                  class="col-md-6 col-sm-12 col-xs-12"
                  v-model="activity.checked"
                  :val="activity.id"
                  @update:model-value="
                    updateSelection(activity, activity.checked)
                  "
                  :label="activity.name"
                  :disable="!activity.hours"
                />
                <q-input
                  class="col-md-3 col-sm-12 col-xs-12"
                  v-model="activity.hours"
                  type="number"
                  label="Total de horas"
                  dense
                  outlined
                />
                <q-input
                  class="col-md-3 col-sm-12 col-xs-12"
                  disable
                  v-model="activity.credit"
                  type="number"
                  label="Total de creditos"
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
import { useActivityStores } from "../../activity/stores";
import { useDevelopmentAreaStores } from "../stores";
import { useAuthStore } from "src/pages/auth/store";
import useNotify from "src/composables/UseNotify";

/* setup route */
const route = useRoute();
const router = useRouter();

/* setup activity stores */
const authStore = useAuthStore();
const activityStore = useActivityStores();
const developmentAreaStore = useDevelopmentAreaStores();
const {notifyError } = useNotify()

/* setup data */
const { institutionId } = authStore?.user?.userDetails;
const { developmentId } = route.params;
const activities = ref([]);
const developmentAreaActivities = ref([]);

/* methods */
const updateSelection = async (activity, checked) => {
  try {
    activity.credit = activity.hours / 15;
    const payload = {
      developmentAreaId: developmentId,
      activityId: activity.id,
      hours: parseInt(activity.hours),
      credit: parseInt(activity.credit),
    };
    if (checked) {
      await developmentAreaStore.addDevelopmentActivity(payload);
    } else {
      await developmentAreaStore.deleteDevelopmentActivity(developmentId, activity.id);
    }
  } catch (error) {
    notifyError("Ocorreu um erro...")
  }
};

/* fetch data */
const fetchActivities = async () => {
  try {
    await activityStore.list({ institutionId: institutionId });
    activities.value = activityStore.activities.map((activity) => {
      const developmentActivity = developmentAreaActivities.value.find(
          (developmentAreaActivity) =>
            developmentAreaActivity.activityId === activity.id
        )

      return {
        id: activity.id,
        name: activity.name,
        hours: developmentActivity?.hours,
        credit: developmentActivity?.credit,
        checked: !!developmentActivity
      };
    });
  } catch (error) {
   notifyError("Erro no carregamento...")
  }
};

const fetchDevelopmentArea = async () => {
  try {
    await developmentAreaStore.findOne(developmentId);
    developmentAreaActivities.value =
      developmentAreaStore.developmentArea.developmentAreaActivities;
  } catch (error) {
    notifyError("Erro no carregamento...")
  }
};

onMounted(async () => {
  await fetchDevelopmentArea();
  await fetchActivities();
});
</script>

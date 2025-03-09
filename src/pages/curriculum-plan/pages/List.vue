<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="text-grey-8 no-shadow" bordered>
          <q-card-section>
            <Tables
              :rows="curriculumPlans"
              title="Planos Curriculares"
              :columns="columns"
            >
              <template #new>
                <q-btn
                  color="primary"
                  icon="add"
                  label="Adicionar"
                  no-caps
                  @click="addCurriculumPlan"
                  class="q-ml-sm"
                />
              </template>

              <template #actions="{ props }">
                <q-btn
                  flat
                  round
                  icon="settings"
                  color="secondary"
                  @click="settings(props.row)"
                />
                <q-btn
                  flat
                  round
                  icon="edit"
                  color="primary"
                  @click="editCurriculumPlans(props.row)"
                />
              </template>
            </Tables>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { useCurriculumPlanStores } from "src/pages/curriculum-plan/store";
import Tables from "src/components/Tables.vue";
import { columns } from "src/pages/curriculum-plan/components/Columns";
import useNotify from "src/composables/UseNotify";

/* setup router */
const router = useRouter();
const route = useRoute();

/* setup store */
const curriculumPlanStores = useCurriculumPlanStores();
const { notifyInfo, notifyError } = useNotify();

/* setup data */
const { educationId } = route.params;
const educationIdUpdated = ref(route.params.educationId || educationId);
const curriculumPlans = ref([]);

/* setup methods */
const addCurriculumPlan = () => {
  router.push({
    name: "create-curriculum",
    params: { educationId: educationIdUpdated.value },
  });
};

const editCurriculumPlans = (curriculum) => {
  router.push({
    name: "edit-curriculum",
    params: { educationId: educationId, curriculumId: curriculum.id },
  });
};

const settings = (curriculum) => {
  router.push({
    name: "settings-curriculum",
    params: { educationId: educationId, curriculumId: curriculum.id },
  });
};

/* fetch data */
const fetchCurriculums = async () => {
  try {
    await curriculumPlanStores.list({educationId: educationIdUpdated.value});
    curriculumPlans.value = curriculumPlanStores.curriculumPlans;
  } catch (error) {
    notifyError("Falha ao carregar os planos curriculares.");
  }
};

onBeforeRouteUpdate((to) => {
  educationIdUpdated.value = to.params.educationId || educationId;
  fetchCurriculums();
});

onMounted(async () => {
  await fetchCurriculums();
});
</script>

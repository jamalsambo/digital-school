<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="text-grey-8 no-shadow" bordered>
          <q-card-section class="q-pa-none">
            <Tables
              :rows="rows"
              :columns="columns"
              :title="'Planos de pagamento'"
            >
              <template #new>
                <q-btn
                  color="primary"
                  icon="add"
                  label="Adicionar"
                  no-caps
                  @click="createPlan"
                  class="q-ml-sm"
                />
              </template>
              <template #actions="{props}">
                <q-btn
                  color="primary"
                  icon="edit"
                  no-caps
                  class="q-ml-sm"
                  flat=""
                  @click="editPlan(props.row)"
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
import Tables from "src/components/Tables.vue";
import { onMounted, ref } from "vue";
import { usePlanStores } from "../stores";
import { useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";
import columns from "../componnents/PlansColumns";

/* setup router */
const router = useRouter();
const planstores = usePlanStores();
const { notifyError } = useNotify();

/* setup data */
const rows = ref([]);

/* setup methods */
const createPlan = () => {
  router.push({
    name: "create-plan",
  });
};

const editPlan = (row) => {
  router.push({
    name: "edit-plan",
    params: { planId: row.id },
  });
}

/* fetch data */
const fetchPlans = async () => {
  try {
    await planstores.list();
    rows.value = planstores.plans;
  } catch (error) {
    notifyError("Erro ao carregar planos");
  }
};

onMounted(async () => {
  await fetchPlans();
});
</script>

<template>
  <q-page padding>
    <Tables :columns="Columns" :rows="rows" :title="title">
      <template #new>
        <q-btn
          color="primary"
          icon="add"
          label="Adicionar"
          no-caps
          @click="addActivity"
          class="q-ml-sm"
        />
      </template>
      <template #actions>
        <q-btn color="primary" icon="edit" no-caps class="q-ml-sm" flat="" />
      </template>
    </Tables>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useShiftStores } from "../store";
import Tables from "src/components/Tables.vue";
import Columns from "../components/ColumnsActivitiesFixes";
import useNotify from "src/composables/UseNotify";
import { useRoute, useRouter } from "vue-router";

/* setup route */
const router = useRouter()

/* setup store */
const shiftStores = useShiftStores();
const { notifyError } = useNotify();

/* setup data */
const rows = ref([]);
const title = ref("Actividades Fixas");

/* setup methods */
const addActivity = () => {
  router.push({
    name: "activity-fixe-create"
  })
}

/* fetch data */
const fetchActivitiesFixes = async () => {
  try {
    await shiftStores.findActivityFixe();
    rows.value = shiftStores.activitiesFixes;
  } catch (error) {
    notifyError("Erro no carregamento...");
  }
};

onMounted(async () => {
  await fetchActivitiesFixes();
});
</script>

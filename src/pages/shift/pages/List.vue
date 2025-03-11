<template>
  <q-page padding>
    <Tables :columns="Columns" :rows="rows" :title="title">
      <template #new>
        <q-btn
          color="primary"
          icon="add"
          label="Adicionar"
          no-caps
          @click="addShift"
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
import Columns from "../components/Columns";
import useNotify from "src/composables/UseNotify";
import { useRoute, useRouter } from "vue-router";

/* setup route */
const router = useRouter()
const route = useRoute()

/* setup store */
const shiftStores = useShiftStores();
const { notifyError } = useNotify();

/* setup data */
const rows = ref([]);
const title = ref("Horarios");

/* setup methods */
const addShift = () => {
  router.push({
    name: "create-period"
  })
}

/* fetch data */
const fetchShifts = async () => {
  try {
    await shiftStores.list();
    rows.value = shiftStores.shifts;
  } catch (error) {
    notifyError("Erro no carregamento...");
  }
};

onMounted(async () => {
  await fetchShifts();
});
</script>

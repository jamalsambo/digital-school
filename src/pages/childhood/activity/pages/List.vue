<template>
  <q-page padding>
    <Tables :rows="rows" :columns="Columns" :title="title">
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
      <template #actions="{ props }">
        <q-btn
          color="primary"
          icon="edit"
          label="Editar"
          no-caps
          @click="editActivity(props)"
          flat
          dense
        />
        <q-btn
          color="negative"
          icon="delete"
          label="Excluir"
          no-caps
          @click="deleteInternship(props)"
          flat
          dense
        />
      </template>
    </Tables>
  </q-page>
</template>
<script setup>
import Tables from "src/components/Tables.vue";
import { useActivityStores } from "../stores";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Columns from '../components/ActivitiesColumns'
import useNotify from "src/composables/UseNotify";
import { useAuthStore } from "src/pages/auth/store";

/* setup route */
const router = useRouter();
const route = useRoute()

/* setup store */
const  activitiesStore  = useActivityStores();
const authStore = useAuthStore();
const { notifyError} = useNotify();

/* setup data */
const { educationId } = route.params
const { institutionId } = authStore?.user?.userDetails;
const title = ref("Actividades");
const rows = ref([]);

/* setup methods */
const addActivity = () => {
  router.push({
    name: 'create-activities',
    params: { educationId: educationId}
  })
}

const editActivity = (props) => {
  router.push({
    name: 'edit-activities',
    params: {  activityId: props.row.id}
  })
}

/* fetch data */
const fetchActivities = async () => {
  try {
    await activitiesStore.list({institutionId: institutionId})
    rows.value = activitiesStore.activities;
  } catch (error) {
    notifyError("Erro ao carregar...")
  }
}

onMounted( async () => {
  await fetchActivities()
})
</script>

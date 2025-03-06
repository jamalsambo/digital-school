<template>
  <q-page padding>
    <Tables :rows="rows" :columns="columns" :title="title">
      <template #new>
        <q-btn
          color="primary"
          icon="add"
          label="Adicionar"
          no-caps
          @click="addInternships"
          class="q-ml-sm"
        />
      </template>
      <template #actions="{ props }">
        <q-btn
          color="secondary"
          icon="settings"
          label="Configuração"
          no-caps
          @click="settingsInternship(props)"
          flat
          dense
        />
        <q-btn
          color="primary"
          icon="edit"
          label="Editar"
          no-caps
          @click="editInternship(props)"
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
import { onMounted, ref } from "vue";
import { useAuthStore } from "src/pages/auth/store";
import { useRouter, useRoute } from "vue-router";
import { useInternshipStores } from "../stores";
import columns from "../components/InternshipTableColumns";

/* setup store */
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const internshipsStore = useInternshipStores();

/* setup data */
const { institutionId } = authStore?.user?.userDetails;
const educationId = route.params.id;
const title = ref("Estágios");
const rows = ref([]);

/* methods */
const addInternships = () => {
  router.push({
    name: "create-internships",
    params: { id: educationId },
  });
};

const editInternship = (row) => {
  router.push({
    name: "edit-internships",
    params: { id: educationId, internshipId: row.key },
  });
};
const settingsInternship = (row) => {
  router.push({
    name: "settings-internship",
    params: { educationId: educationId, internshipId: row.key },
  });
};
const deleteInternship = (row) => {};

/* fetch data */
const fetchInternships = async () => {
  try {
    await internshipsStore.list({ institutionId: institutionId });
    rows.value = internshipsStore.internships;
  } catch (error) {
    console.error("Error fetching internships:", error);
  }
};

onMounted(async () => {
  await fetchInternships();
});
</script>

<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6" v-if="!activityId">Criar nova Actividade</div>
        <div class="text-h6" v-else>Editar editar</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <q-form @submit.prevent="submitForm" class="q-gutter-md">
          <q-input v-model="form.name" label="Nome" required outlined dense />
          <q-input
            v-model="form.description"
            label="descriçao"
            type="textarea"
            outlined
            dense
          />
          <q-editor
            v-model="form.pedagogicalObjective"
            :toolbar="toolbar"
            placeholder="Objetivos pedagógicos"
          />
          <q-editor
            v-model="form.methodology"
            :toolbar="toolbar"
            placeholder="Metodologias "
          />

          <div class="row q-mt-md justify-end">
            <q-btn
              label="voltar"
              color="negative"
              flat
              type="reset"
              @click="router.back()"
            />
            <q-btn label="Salvar" color="green" flat type="submit" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "src/pages/auth/store";
import { useActivityStores } from "../stores";
import useNotify from "src/composables/UseNotify";

/* setup data */
const router = useRouter();
const route = useRoute();

/* setup store */
const authStore = useAuthStore();
const activityStore = useActivityStores();
const { notifySuccess, notifyError } = useNotify();

/* setup data */
const { institutionId } = authStore?.user?.userDetails;
const { activityId } = route.params;
const activity = ref();
const form = ref({
  institutionId: institutionId,
  name: "",
  description: "",
  pedagogicalObjective: "",
  methodology: "",
});

/* Methods */
const submitForm = async () => {
  try {
    if (!activityId) {
      await activityStore.create(form.value);
      notifySuccess("Actividade criada com sucesso");
    } else {
      await activityStore.update(activityId, form.value);
      notifySuccess("Actividades editado com sucesso");
      router.back();
    }
  } catch (error) {
    console.error(error);
    notifyError("Erro ao salvar o Area de desenvolvimento");
  }
};

/* Fetch data */
const fetchActivity = async () => {
  try {
    await activityStore.findOne(activityId);
    activity.value = activityStore.activity;
  } catch (error) {
    notifyError("Erro ao carregar dados");
  }
};

/* wacth data */
watchEffect(() => {
  if (activity.value) {
    form.value = {...activity.value };
  }
});

onMounted(async () => {
  if (activityId) {
    await fetchActivity();
  }
});
</script>

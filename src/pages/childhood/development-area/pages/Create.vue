<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6" v-if="!developmentAreaId">
          Criar nova Area de desenvolvimento
        </div>
        <div class="text-h6" v-else>Editar Area de desenvolvimento</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <q-form @submit.prevent="submitForm" class="q-gutter-md">
          <q-input v-model="form.name" label="Nome" required outlined dense />
          <q-editor
            v-model="form.description"
            :toolbar="toolbar"
            placeholder="• Contação de histórias • Outra atividade"
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
import { useDevelopmentAreaStores } from "../stores";
import useNotify from "src/composables/UseNotify";

/* setup data */
const router = useRouter();
const route = useRoute();

/* setup store */
const authStore = useAuthStore();
const developmentAreaStore = useDevelopmentAreaStores()
const { notifySuccess, notifyError } = useNotify();

/* setup data */
const { institutionId } = authStore?.user?.userDetails;
const { internshipId, developmentAreaId } = route.params;
const developmentArea = ref()
const form = ref({
  institutionId: institutionId,
  internshipId: internshipId,
  name: "",
  description: "",
});

/* Methods */
const submitForm = async () => {
  try {
    if (!developmentAreaId) {
    await developmentAreaStore.create(form.value);
    notifySuccess("Area de desenvolvimento criado com sucesso");
    } else {
      await developmentAreaStore.update(developmentAreaId, form.value);
      notifySuccess("Area de desenvolvimento editado com sucesso");
    }
    router.back();
  } catch (error) {
    console.error(error);
    notifyError("Erro ao salvar o Area de desenvolvimento");
  }
};

/* Fetch data */
const fetchDevelopmentArea = async () => {
  try {
    await developmentAreaStore.findOne(developmentAreaId);
    developmentArea.value = developmentAreaStore.developmentArea;
  } catch (error) {
    notifyError("Erro ao carregar dados");
  }
};

/* wacth data */
watchEffect(() => {
  if (developmentArea.value) {
    form.value = {...developmentArea.value };
  }
});

onMounted(async () => {
  if (developmentAreaId) {
    await fetchDevelopmentArea();
  }
});
</script>

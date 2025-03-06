<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Criar Nova Disciplina</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="submitForm" @reset="resetForm">
          <!-- Campo para o Nome da Disciplina -->
          <q-input
            v-model="formData.name"
            label="Nome da Disciplina"
            outlined
            dense
            :rules="[(val) => !!val || 'O nome da disciplina é obrigatório.']"
          />

          <!-- Botões de Ação -->
          <div class="row q-mt-md justify-end">
            <q-btn
              label="Cancelar"
              @click="cancel"
              color="warning"
              flat
              type="reset"
            />
            <q-btn label="Salvar" color="primary" flat type="submit" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useDisciplineStores } from "src/pages/discipline/store";
import useNotify from "src/composables/UseNotify";

/* use stores */
const router = useRouter();
const disciplineStores = useDisciplineStores();
const { notifyError, notifySuccess } = useNotify();

/* use reactive data */
const isLoading = ref(false);
const formData = ref({
  name: "",
});

// Função para submeter o formulário
const submitForm = async () => {
  try {
    await disciplineStores.create(formData.value);
    notifySuccess("Disciplina criada com sucesso!");
    router.push("/discipline");
  } catch (error) {
    notifyError("Error ao criar disciplina!");
  } finally {
    isLoading.value = false;
  }
  resetForm();
};

// Função para limpar o formulário
const resetForm = () => {
  formData.value = {
    name: "",
  };
};

const cancel = () => {
  router.push("/discipline");
};
</script>

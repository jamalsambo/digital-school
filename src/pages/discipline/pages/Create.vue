<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Criar nova {{ getNameForDiscipline(module) }}</div>
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
              @click="router.back()"
              color="negative"
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
import { onMounted, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisciplineStores } from "src/pages/discipline/store";
import useNotify from "src/composables/UseNotify";
import scripts from "src/composables/Scripts";

/* setup route */
const router = useRouter();
const route = useRoute();

/* setup store */
const disciplineStores = useDisciplineStores();
const { notifyError, notifySuccess } = useNotify();
const { getNameForDiscipline } = scripts();

/* setup data */
const { module, educationId, moduleId } = route.params;
const discipline = ref();
const isLoading = ref(false);
const formData = ref({
  educationId: educationId,
  name: "",
});

/* methods */
const submitForm = async () => {
  try {
    if (!moduleId) {
      await disciplineStores.create(formData.value);
      notifySuccess(`${getNameForDiscipline(module)} criada com sucesso!`);
    } else {
      await disciplineStores.update(moduleId, formData.value);
      notifySuccess(`${getNameForDiscipline(module)} editado com sucesso!`);
      router.back();
    }
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

const fetchDiscipline = async () => {
  if (moduleId) {
    try {
      await disciplineStores.findOne(moduleId);
      discipline.value = disciplineStores.discipline;
      watchEffect(() => {
        formData.value = {...discipline.value };
      })
    } catch (error) {
      notifyError("Erro no carregamento de dados...");
    }
  }
};

onMounted(async() => {
  await fetchDiscipline()
})
</script>

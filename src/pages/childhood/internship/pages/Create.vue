<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6" v-if="!internshipId">Criar novo estágio</div>
        <div class="text-h6" v-else>Editar estágio</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <q-form @submit.prevent="submitForm" class="q-gutter-md">
          <!-- Nome -->
          <q-input
            v-model="form.name"
            label="Nome *"
            outlined
            maxlength="255"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            dense
          />

          <!-- Descrição -->
          <q-input
            v-model="form.description"
            label="Descrição"
            outlined
            type="textarea"
            dense
          />

          <!-- Idade Mínima/Máxima -->
          <div class="row q-col-gutter-sm">
            <q-input
              v-model="form.minimumAge"
              label="Idade Mínima *"
              outlined
              type="number"
              class="col-md-6 col-sm-12 col-xs-12"
              :rules="[
                (val) => val >= 0 || 'Idade mínima não pode ser negativa',
                (val) => !!val || 'Campo obrigatório',
              ]"
              dense
            />

            <q-input
              v-model="form.maximumAge"
              label="Idade Máxima *"
              outlined
              type="number"
              class="col-md-6 col-sm-12 col-xs-12"
              :rules="[
                (val) => val >= 1 || 'Idade mínima é 1',
                (val) => !!val || 'Campo obrigatório',
                (val) =>
                  val > form.minimumAge || 'Deve ser maior que idade mínima',
              ]"
              dense
            />

            <!-- Taxa de Mensalidade -->
            <q-input
              v-model="form.tuitionFee"
              label="Taxa de Mensalidade *"
              outlined
              type="number"
              step="0.01"
              class="col-md-4 col-sm-12 col-xs-12"
              :rules="[
                (val) => !!val || 'Campo obrigatório',
                (val) => val >= 0 || 'Valor não pode ser negativo',
              ]"
              dense
            />

            <!-- Regime -->
            <q-select
              v-model="form.regime"
              :options="regimeOptions"
              label="Regime *"
              outlined
              class="col-md-4 col-sm-12 col-xs-12"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              dense

              emit-value=""
              map-options
            />

            <!-- Aplicar para Todos -->
            <q-toggle
              class="col-md-4 col-sm-12 col-xs-12"
              v-model="form.applyToAll"
              label="Aplicar para todos os alunos"
            />
          </div>

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
import { useInternshipStores } from "../stores";
import { useAuthStore } from "src/pages/auth/store";
import useNotify from "src/composables/UseNotify";

/* setup store */
const internshipsStore = useInternshipStores();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const { notifySuccess, notifyError } = useNotify();

/* setup data */
const educationId = route.params.id;
const internshipId = route.params.internshipId;
const internship = ref();
const { institutionId } = authStore?.user?.userDetails;
const form = ref({
  institutionId: institutionId,
  educationId: educationId,
  name: "",
  description: "",
  tuitionFee: 0,
  minimumAge: 0,
  maximumAge: 1,
  regime: "",
  applyToAll: false,
});

// Exemplo de opções - substituir com dados reais
const regimeOptions = ref([
  { label: "Semestral", value: 6 },
  { label: "Trimestral", value: 3 },
]);

/* Methods */
const submitForm = async () => {
  const payload = {
    ...form.value,
    minimumAge: parseInt(form.value.minimumAge),
    maximumAge: parseInt(form.value.maximumAge),
    regime: form.value.regime,
  };

  try {
    if (!internshipId) {
    await internshipsStore.create(payload);
    notifySuccess("Estagio criado com sucesso");
    } else {
      await internshipsStore.update(internshipId, payload);
      notifySuccess("Estagio editado com sucesso");
    }
    router.back();
  } catch (error) {
    console.error(error);
    notifyError("Erro ao salvar o estágio");
  }
};

/* Fetch data */
const fetchInternship = async () => {
  try {
    await internshipsStore.findOne(internshipId);
    internship.value = internshipsStore.internship
  } catch (error) {
    notifyError("Erro ao carregar dados");
  }
};

/* wacth data */
watchEffect(() => {
  if (internship.value) {
    form.value = {...internship.value };
  }
})

onMounted(async () => {
  if (internshipId) {
    await fetchInternship();
  }
});
</script>

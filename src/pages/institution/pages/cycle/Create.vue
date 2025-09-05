<template>
  <q-page padding>
    <q-card class="q-pa-md q-mx-auto" style="max-width: 500px">
      <q-card-section>
        <div class="text-h6">Criar Novo Ciclo</div>
      </q-card-section>

      <q-form @submit.prevent="submitForm" ref="formRef">
        <q-card-section class="q-gutter-md">
          <q-select
            v-model="form.name"
            :options="cyclesLabels"
            label="Ciclo"
            outlined
            dense
          />

          <q-input
            outlined
            v-model="form.startDate"
            label="Data de Início"
            readonly
            dense=""
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date
                    v-model="form.startDate"
                    mask="MM-DD"
                    default-view="Months"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            outlined
            v-model="form.endDate"
            label="Data de Fim"
            readonly
            dense=""
            :rules="[(val) => !!val || 'Data de fim obrigatória']"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date
                    v-model="form.endDate"
                    mask="MM-DD"
                    default-view="Months"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancelar" flat color="primary" @click="cancel" />
          <q-btn
            label="Salvar"
            type="submit"
            color="primary"
            :loading="loading"
          />
        </q-card-actions>
      </q-form>
      {{ dailyLabels }}
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, ref } from "vue";
import { useQuasar } from "quasar";
import { useInstitutionStores } from "../../store";
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";

/* stores */
const router = useRouter()
const institutionStores = useInstitutionStores();
const { notifyError, notifySuccess } = useNotify();

/* data */
const loading = ref(false);
const formRef = ref(null);

/* computed */
const institution = computed(() => institutionStores.institution);
const cyclesLabels = computed(() =>
  Array.from({ length: institution.value.regime }, (_, i) => i + 1)
);

const form = ref({
  name: "",
  startDate: "",
  endDate: "",
});

// Submeter o formulário
const submitForm = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    // Substitua por chamada real à API
    await institutionStores.createCycles({
      startDate: `2000-${form.value.startDate}`,
      endDate: `2000-${form.value.endDate}`,
      name: form.value.name.toString(),
      institutionId: institution.value.id,
    });
    notifySuccess("Ciclo criado com sucesso!");
    cancel()
  } catch (err) {
    console.log(err);
    notifyError("Erro ao criar ciclo");
  } finally {
    loading.value = false;
  }
};

// Cancelar ação
const cancel = () => {
  router.back()
  form.value = { name: "", startDate: "", endDate: "" };
};
</script>

<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Criar {{ entity }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleSubmitCourse">
          <div class="row q-col-gutter-sm">
            <q-input
              class="col-md-6 col grow col-sm-12 col-xs-12"
              v-model="form.name"
              label="Nome do Curso"
              placeholder="Digite o nome do Curso"
              outlined
              :rules="[(val) => !!val || 'O nome é obrigatório.']"
              dense
            />
            <q-input
              class="col-md-3 col grow col-sm-12 col-xs-12"
              v-model="form.tuitionFee"
              type="number"
              label="Mensalidade"
              placeholder="Digite o valor da mensalidade"
              outlined
              :rules="[
                (val) => !!val || 'O valor da mensalidade é obrigatório.',
              ]"
              dense
            />

            <q-select
              class="col-md-3 col-sm-12 col-xs-12"
              outlined
              v-model="form.applyToAll"
              label="Aplicação da mensalidade"
              option-value="id"
              option-label="name"
              :options="feesOptions"
              emit-value
              map-options=""
              dense=""
            />
            <q-input
              class="col-md-3 col grow col-sm-12 col-xs-12"
              v-model="form.academicRegime"
              type="number"
              label="Regime"
              placeholder="Digite o regime"
              outlined
              :rules="[
                (val) => !!val || 'O regime e obrigatorio.',
              ]"
              dense
            />
          </div>
          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Cancelar"
              color="negative"
              icon="close"
              outline
              @click="cancel"
              class="q-mr-sm"
              flat
            />
            <q-btn
              label="Guardar"
              color="positive"
              icon="save"
              type="submit"
              flat
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCourseStores } from "src/pages/course/store";
import useNotify from "src/composables/UseNotify";

// use store
const route = useRoute();
const router = useRouter();
const courseStore = useCourseStores();
const { notifyError, notifySuccess } = useNotify();

// data
const { entity, institution, education } = route.params;
const form = ref({
  name: "",
  tuitionFee: "",
  applyToAll: "",
  academicRegime: "",
});
const feesOptions = [
  { id: true, name: "Todos" },
  { id: false, name: "Parcial" },
];
// Methods
const handleSubmitCourse = async () => {
  const payload = {
    ...form.value,
    institutionId: institution,
    educationId: education,
    academicRegime: parseInt(form.value.academicRegime)
  };

  console.log(payload);
  try {
    await courseStore.create(payload);
    notifySuccess(`${entity} criado com sucesso!`);
    router.push("/courses");
  } catch (error) {
    notifyError("Erro ao criar curso");
  }
};

// Cancelar e voltar para a lista
const cancel = () => {
  router.push("/course");
};
</script>

<style scoped>
.text-h6 {
  font-size: 18px;
  font-weight: bold;
}
</style>

<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Adicionar tipo de avaliação</div>
      </q-card-section>
      <q-separator spaced />
      <q-form @submit="onSubmit">
        <div class="row q-col-gutter-md">
          <q-select
            class="col-md-grow col-sm-12 col-xs-12"
            v-model="evolutionType"
            :options="evolutionTypes"
            label=" Tipo de avaliação"
            option-label="name"
            emit-value=""
            map-options
            outlined
            dense
          />
          <q-input
            class="col-md-grow col-sm-12 col-xs-12"
            v-model="weight"
            placeholder="Digite o nome"
            outlined
            dense
            label="Nome da avaliação"
            type="number"
          />
        </div>

        <div class="row justify-end q-gutter-sm">
          <q-btn
            label="Cancelar"
            color="negative"
            icon="close"
            outline
            @click="toggleModal"
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
    </q-card>
  </q-page>
</template>
<script setup>
import { useEvolutionStores } from "src/pages/evolution/stores";
import { useCourseStores } from "../store";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

/* setup router */
const route = useRoute();
const router = useRouter();

/* setup stores */
const { courseId } = route.params;
const evolutionStores = useEvolutionStores();
const courseStores = useCourseStores();
const { notifyError, notifySuccess }= useNotify()

/* setup data */
const evolutionTypes = ref([]);
const evolutionType = ref(null);
const weight = ref(null);

const onSubmit = async () => {
  try {
    const payload = {
      courseId: courseId,
      evolutionTypeId: evolutionType.value.id,
      weight: parseInt(weight.value),
    };
    await courseStores.createEvolutionType(payload);
    notifySuccess("Tipo de avaliação criado com sucesso")
    router.back()
  } catch (error) {
    console.log(error);
  }
};

const fetchData = async () => {
  try {
    await evolutionStores.list();
    evolutionTypes.value = evolutionStores.evolutionTypes;
  } catch (error) {
    console.log(error);
  }
};
onMounted(fetchData);
</script>

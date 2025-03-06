<template>
  <q-dialog v-model="medium" persistent>
    <q-card style="width: 900px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Adicionar tipo de avaliação</div>
      </q-card-section>
      <q-separator spaced />
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <div class="row q-col-gutter-sm">
          <q-input
            class="col-md-6"
            v-model="form.name"
            placeholder="Digite o nome"
            outlined
            dense
            label="Nome da avaliação"
          />
          <q-select
            class="col-md-6"
            v-model="form.type"
            :options="['Normal', 'Exame']"
            label=" Tipo de avaliação"
            option-label="name"
            emit-value=""
            map-options
            outlined
            dense
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
  </q-dialog>
  <q-page padding>
    <Tables :columns="columns" :rows="evolutionTypes">
      <template #new>
        <q-btn
          color="primary"
          icon="add"
          label="Adicionar"
          no-caps
          @click="addEvolutionType"
          class="q-ml-sm"
        />
      </template>

      <template #actions="{ props }">
        <q-btn
          color="primary"
          icon="edit"
          @click="editEvolutionType(props)"
          flat=""
        />
      </template>
    </Tables>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import Tables from "src/components/Tables.vue";
import { useEvolutionStores } from "../stores";
import columns from "../components/columns/Types";
import useNotify from "src/composables/UseNotify";

/* use store */
const evolutionStores = useEvolutionStores();
const { notifyError, notifySuccess } = useNotify();

/* Data */
const evolutionTypes = ref([]);
const evolutionType = ref();
const medium = ref();
const form = ref({
  name: "",
  type: "",
});

/* Methods */
const onSubmit = async () => {
  try {
    if (evolutionType.value) {
      await evolutionStores.updateType(evolutionType.value.id, form.value);
      notifySuccess("Tipo de avaliação editada com sucesso!");
    } else {
      await evolutionStores.createType(form.value);
      notifySuccess("Tipo de avaliação criado com sucesso!");
    }
    toggleModal();
    await fetchEvolutionTypes();
  } catch (error) {
    notifyError("Erro ao criar tipo de avaliação");
  }
};
const addEvolutionType = async () => {
  toggleModal();
};
const editEvolutionType = async (props) => {
  evolutionType.value = props.row;
  form.value.name = props.row.name;
  form.value.type = props.row.type;
  toggleModal();
};
const fetchEvolutionTypes = async () => {
  try {
    await evolutionStores.list();
    evolutionTypes.value = evolutionStores.evolutionTypes;
  } catch (error) {
    notifyError("Erro ao buscar dados");
  }
};
const toggleModal = () => {
  medium.value = !medium.value;
};

onMounted(async () => {
  await fetchEvolutionTypes();
});
</script>

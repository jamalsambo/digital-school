<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Criar Sala</div>
        <q-separator spaced />
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleSubmit">
          <div class="row q-col-gutter-sm">
            <q-input
              class="col-md-4 col grow col-sm-12 col-xs-12"
              v-model="form.name"
              label="Nome do sala"
              placeholder="Digite o nome do sala"
              outlined
              :rules="[(val) => !!val || 'O nome é obrigatório.']"
              dense
            />
            <q-select
              class="col-md-4 col grow col-sm-12 col-xs-12"
              v-model="form.type"
              :options="['Normal', 'Laboratorio', 'Ginasio']"
              label="Tipo de sala"
              outlined
              dense
              :rules="[(val) => !!val || 'Selecione um tipo de sala.']"
            />
            <q-input
              class="col-md-4 col grow col-sm-12 col-xs-12"
              v-model="form.location"
              label="Localizaçao"
              placeholder="Digite o nome do sala"
              outlined
              :rules="[(val) => !!val || ' A Localizaçao é obrigatório.']"
              dense
            />
            <q-select
              class="col-md-4 col grow col-sm-12 col-xs-12"
              v-model="form.availability"
              :options="[
                { id: true, name: 'Sim' },
                { id: false, name: 'Não' },
              ]"
              label="disponibilidade"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              outlined
              dense
              :rules="[(val) => !!val || 'Selecione um tipo de sala.']"
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
import { useRoute, useRouter } from "vue-router";
import { useRoomStores } from "../store";
import useNotify from "src/composables/UseNotify";

/* use store */
const route = useRoute();
const router = useRouter();
const roomStores = useRoomStores();
const { notifyError, notifySuccess } = useNotify();

/* Data */
const {id} = route.params;

/* Method */
const form = ref({ name: "", type: "", location: "", availability: "" });

const handleSubmit = () => {
  console.log(id)
  try {
    if (id) {
      roomStores.update(id.id, {...form.value });
      notifySuccess("Sala atualizada com sucesso!");
    } else {
      roomStores.create({ ...form.value });
      notifySuccess("Sala criada com sucesso!");
    }
  } catch (error) {
    notifyError("Erro ao criar sala");
  }
};

const cancel = () => {
  router.push("/rooms");
};
</script>

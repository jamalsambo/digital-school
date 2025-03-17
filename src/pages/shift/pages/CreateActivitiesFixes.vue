<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Criar Horrio</div>
        <q-separator spaced />
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleSubmit">
          <div class="row q-col-gutter-sm">
            <q-input
              class="col-md-12"
              v-model="name"
              type="text"
              label="Label"
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
              @click="router.back()"
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
import { useShiftStores } from "../store";
import { useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

/* setup route */
const router = useRouter();

/* setup store */
const shiftStores = useShiftStores();
const { notifyError, notifySuccess } = useNotify();

const name = ref();

const handleSubmit = async () => {
  try {
    await shiftStores.createActivitiesFixes({name: name.value});
    notifySuccess("Actividade Fixa criado com sucesso!");
  } catch (error) {
    notifyError("Erro ao criar horario");
  }
};
</script>

<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Criar Horario</div>
        <q-separator spaced />
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleSubmit">
          <div class="row q-col-gutter-sm">
            <q-input
             class="col-md-6 col grow col-sm-12 col-xs-12"
              v-model="form.start"
              mask="##:##"
              label="Entrada"
              outlined
              dense
            >
              <template #append>
                <q-icon name="access_time">
                  <q-popup-proxy>
                    <q-time v-model="form.start" mask="HH:mm" format24h />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              class="col-md-6 col grow col-sm-12 col-xs-12"
              v-model="form.end"
              mask="##:##"
              label="Saida"
              outlined
              dense
            >
              <template #append>
                <q-icon name="access_time">
                  <q-popup-proxy>
                    <q-time v-model="form.end" mask="HH:mm" format24h />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
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
const router = useRouter()

/* setup store */
const shiftStores = useShiftStores()
const {notifyError, notifySuccess} = useNotify()

const form = ref({
  start: "",
  end: "",
});

const handleSubmit =  async() => {
  try {
    await shiftStores.create(form.value)
    notifySuccess("Horario criado com sucesso!");
    router.back();
  } catch (error) {
    notifyError("Erro ao criar horario")
  }
};
</script>

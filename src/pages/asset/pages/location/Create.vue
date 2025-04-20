<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Criaçao de locais</div>
      </q-card-section>
      <q-separator spaced />
      <q-form @submit.prevent="handleSubmit">
        <div class="row q-col-gutter-md">
          <q-input
            class="col-md-6 col-sm-12 col-xs-12"
            outlined
            v-model="form.name"
            label="Nome"
            :rules="[(val) => !!val || 'Campo obrigatório.']"
            dense
          />
          <q-input
            class="col-md-6 col-sm-12 col-xs-12"
            outlined
            v-model="form.block"
            label="Numero de edificio ou bloco"
            :rules="[(val) => !!val || 'Campo obrigatório.']"
            dense
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
    </q-card>
  </q-page>
</template>
<script setup>
import { ref } from "vue";
import { useAssetStores } from "../../stores";
import { useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

/* setup stores */
const router = useRouter();
const { notifyError, notifySuccess } = useNotify();

/* setup stores */
const assetStores = useAssetStores();

/* setup data */
const form = ref({
  name: "",
  block: "",
});

/* setup methods */
const handleSubmit = async () => {
  try {
    await assetStores.createLocation(form.value);
    notifySuccess("Local criada com sucesso");
    router.back();
  } catch (error) {
    console.log(error);
    notifyError("Error ao criar local");
  }
};
</script>

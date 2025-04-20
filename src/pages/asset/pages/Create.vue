<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Criaçao de patrimonio</div>
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
          <q-select
          outlined
          class="col-md-6 col-sm-12 col-xs-12"
          v-model="form.categoryId"
          :options="categories"
          option-label="name"
          option-value="id"
          label="Categorias"
          emit-value
          map-options
          required
          dense
        />
        <q-select
          outlined
          class="col-md-4 col-sm-12 col-xs-12"
          v-model="form.currentLocation"
          :options="locations"
          option-label="name"
          option-value="id"
          label="Local"
          emit-value
          map-options
          required
          dense
        />
        <q-input
          class="col-md-4 col-sm-6 col-xs-12"
          v-model="form.purchaseDate"
          type="date"
          label="Data de compra"
          outlined
          dense
        />
        <q-select
          outlined
          class="col-md-4 col-sm-12 col-xs-12"
          v-model="form.condition"
          :options="conditions"
          option-label="name"
          option-value="id"
          label="Local"
          emit-value
          map-options
          required
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
import { onMounted, ref } from "vue";
import { useAssetStores } from "../stores";
import { useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

/* setup stores */
const router = useRouter();
const { notifyError, notifySuccess } = useNotify();

/* setup stores */
const assetStores = useAssetStores();

/* setup data */
const categories = ref([])
const locations = ref([])
const conditions = ref([
{  id: 'Novo', name: 'Novo'},
{  id: 'Recondicionado', name: 'Recondicionado'}
])
const form = ref({
  name: "",
  categoryId: "",
  purchaseDate: "",
  condition: "",
  currentLocation: "",
});

/* setup methods */
const handleSubmit = async () => {
  try {
    await assetStores.create(form.value);
    notifySuccess("Patrimonio criada com sucesso");
    router.back();
  } catch (error) {
    console.log(error);
    notifyError("Error ao criar patrimonio");
  }
};

const fetchData = async () => {
  try {
      await assetStores.categories()
      categories.value = assetStores.categories
      
      await assetStores.locations()
      locations.value = assetStores.locations
  } catch (error) {
      console.log(error)
  }
}

onMounted( async () => {
   await fetchData()
})
</script>

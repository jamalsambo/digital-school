<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Criaçao de Producto</div>
      </q-card-section>
      <q-separator spaced />
      <q-form @submit.prevent="handleSubmit">
        <div class="row q-col-gutter-md">
          <q-input
            class="col-md-grow col-sm-12 col-xs-12"
            outlined
            v-model="form.name"
            label="Nome"
            :rules="[(val) => !!val || 'Campo obrigatório.']"
            dense
          />
          <q-select
            class="col-md-grow col-sm-12 col-xs-12"
            v-model="form.categoryId"
            :options="categories"
            label="Categorias"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            outlined
            dense
            :rules="[(val) => !!val || 'Campo obrigatório.']"
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
import { useRouter } from "vue-router";
import { useInventoryStores } from "../../stores";
import useNotify from "src/composables/UseNotify";
import { onMounted, ref } from "vue";

/* setup router */
const router = useRouter();

/* setup stores */
const inventoryStores = useInventoryStores();
const { notifyError, notifySuccess } = useNotify();

/* setup data */
const form = ref({
  name: null,
  categoryId: null,
});
const categories = ref([]);

/* metods */
const handleSubmit = async () => {
  try {
    await inventoryStores.createProduct({ ...form.value });
    notifySuccess("Produto criado com sucesso");
    router.back();
    categories.value = inventoryStores.categories;
    clearInputs()
  } catch (error) {
    notifyError("Erro ao criar Produto");
  }
};

const clearInputs = () => {
   form.value.categoryId = null,
   form.value.name = null
}

/* fetcth data */
const fetchCategories = async () => {
  try {
    await inventoryStores.findCategories();
    categories.value = inventoryStores.categories;
  } catch (error) {
    notifyError("Erro ao criar carregar categorias");
  }
};
onMounted(async () => {
  await fetchCategories();
});
</script>

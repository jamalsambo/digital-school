<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">{{way==='in'?'Lançamentos': "Saidas"}}</div>
      </q-card-section>
      <q-separator spaced />
      <q-form @submit.prevent="handleSubmit" class="row q-col-gutter-md">
        <q-select
          outlined
          class="col-md-4 col-sm-12 col-xs-12"
          v-model="form.productId"
          :options="products"
          option-label="name"
          label="Productos"
          emit-value
          option-value="id"
          map-options
           :rules="[(val) => !!val || 'Campo obrigatório.']"
          dense
        />
        <q-input
          class="col-md-4 col-sm-12 col-xs-12"
          outlined
          v-model.number="form.quantity"
          label="Quantidade"
          type="number"
          min="1"
          :rules="[(val) => !!val || 'Campo obrigatório.']"
          dense
        />

        <q-input
          class="col-md-4 col-sm-6 col-xs-12"
          v-model="form.expirationDate"
          type="date"
          label="Data de validade"
          outlined
          dense
        />

        <q-select
          class="col-md-4 col-sm-6 col-xs-12"
          outlined=""
          v-model="form.location"
          :options="typeOptions"
          label="Armazém destino"
          emit-value
          map-options
          :rules="[(val) => !!val || 'Campo obrigatório.']"
          dense
        />

        <q-input
          class="col-md-4 col-sm-6 col-xs-12"
          outlined
          v-model="form.reference"
          label="Referência"
          dense
        />

        <q-select
          outlined
          class="col-md-4 col-sm-12 col-xs-12"
          v-model="form.supplierId"
          :options="suppliers"
          option-label="name"
          option-value="id"
          label="Fornecedores"
          emit-value
          map-options
          required
          dense
        />

        <q-input
          class="col-md-12 col-sm-12 col-xs-12"
          outlined=""
          v-model="form.observation"
          label="Observação"
          type="textarea"
        />

        <div class="q-mt-md">
          <q-btn label="Salvar" type="submit" color="primary" />
          <q-btn label="Cancelar" flat color="negative" @click="resetForm" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useInventoryStores } from "../../stores";
import { useRoute, useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

/* setup route */
const route = useRoute();
const router = useRouter()

/* Setup stores */
const inventoryStores = useInventoryStores();
const {notifyError, notifySuccess} = useNotify();

/* setup data */
const products = ref([]);
const suppliers = ref([]);
const { way } = route.params

/* fetch data */
const fetchProducts = async () => {
  try {
    await inventoryStores.findProducts();
    await inventoryStores.findSuppliers();
    products.value = inventoryStores.products;
    suppliers.value = inventoryStores.suppliers;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const form = ref({
  productId: "",
  quantity: "",
  type: way==='in'?'entrada': 'saida',
  location: "",
  observation: null,
  reference: "",
  supplierId: "",
  expirationDate: null,
});

const typeOptions = [
  { label: "Principal", value: "Principal" },
  { label: "Secundario", value: "Secundario" },
];

const handleSubmit = async () => {
  try {
    await inventoryStores.create({ ...form.value });
    notifySuccess("Lançamento criado com sucesso!");
    resetForm();
    router.back()
  } catch (error) {
    notifyError("Ocorreu um erro ao tentar salvar o lançamento!");
    console.log(error);
  }
};
const resetForm = () => {
  form.value = {
    productId: "",
    quantity: "",
    location: "",
    observation: null,
    reference: "",
    supplierId: "",
    expirationDate: null
  };
};

onMounted(async () => {
  await fetchProducts();
});
</script>

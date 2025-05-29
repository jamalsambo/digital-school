<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h5">
      Produtos</div>
        <q-separator spaced />
      </q-card-section>

    </q-card>

    <q-card class="q-mt-lg">
      <q-card-section>
        <q-card flat bordered class="q-pa-md shadow-2">
          <q-table
            title="Productos"
            :rows="products"
            :columns="columns"
            row-key="id"
            flat
            :filter="filter"
            bordered
            :pagination="{ rowsPerPage: 10 }"
          >
         <template v-slot:top-right="">
              <q-input
                borderless
                dense
                debounce="300"
                v-model="filter"
                placeholder="Pesquisar"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>

              <q-btn
                color="primary"
                icon="add"
                label="Adicionar"
                no-caps
                class="q-ml-sm"
                @click="newProduct"
              />
            </template>
            <template v-slot:body-cell-actions="props">
              <q-btn
                flat
                round
                icon="edit"
                color="primary"
                @click="editCategory(props.row)"
              />
            </template>
        </q-table>
        </q-card>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useInventoryStores } from '../../stores';
import columns from './components/TableProductsColumns';
import { useRouter } from 'vue-router';

/* setup router */
const router = useRouter()

/* setup stores */
const inventoryStores = useInventoryStores()

/* setup data */
const products = ref([])
const filter = ref()

/* methods */
const newProduct = () => {
  router.push({name: "stock-product-create"})
}

/* fetcth data */
const fetcthProducts = async () => {
  try {
    await inventoryStores.findProducts()
    products.value = inventoryStores.products
  } catch (error) {
    console.log(error)
  }
}

onMounted( async() => {
  await fetcthProducts()
})
</script>

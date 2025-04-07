<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h5">
      Produtos</div>
        <q-separator spaced />
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle1">Informações de pesquisa</div>
        <q-card flat bordered class="q-pa-md shadow-2">
          <div class="row q-col-gutter-sm">
          </div>
        </q-card>
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
            bordered
            :pagination="{ rowsPerPage: 10 }"
          ></q-table>
        </q-card>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useInventoryStores } from '../../stores';
import columns from './components/TableProductsColumns';

/* setup stores */
const inventoryStores = useInventoryStores()

/* setup data */
const products = ref([])

/* fetcth data */
const fetcthProducts = async () => {
  try {
    await inventoryStores.findProducts()
    products.value = inventoryStores.products
  } catch (error) {

  }
}

onMounted( async() => {
  await fetcthProducts()
})
</script>

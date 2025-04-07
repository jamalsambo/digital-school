<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h5">
          Resumo de movimentos</div>
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
            title="Lista de movimentos"
            :rows="stockMoves"
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
import columns from './components/TableColumnsMove';

/* Setup router */

/* Setup stores */
const inventoryStores = useInventoryStores()

/* Setup data */
const stockMoves = ref([])

/* fetch data */
const fetchStockMoves = async () => {
  try {
    await inventoryStores.findStockMove()
    stockMoves.value = inventoryStores.moves
  } catch (error) {
    console.log(error)
  }
}

onMounted(async() => {
  await fetchStockMoves()
})
</script>

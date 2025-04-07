<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h5">
    Fornecedores</div>
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
            title="Categorias"
            :rows="suppliers"
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
import columns from './components/TableSupplierColumns';

/* setup stores */
const inventoryStores = useInventoryStores()

/* setup data */
const suppliers = ref([])

/* fetcth data */
const fetchSuppliers = async () => {
  try {
    await inventoryStores.findSuppliers()
    suppliers.value = inventoryStores.suppliers
  } catch (error) {

  }
}

onMounted( async() => {
  await fetchSuppliers()
})
</script>

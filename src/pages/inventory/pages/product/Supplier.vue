<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h5">
    Fornecedores</div>
        <q-separator spaced />
      </q-card-section>
    </q-card>

    <q-card class="q-mt-lg">
      <q-card-section>
        <q-card flat bordered class="q-pa-md shadow-2">
          <q-table
            title="Fornecedores"
            :rows="suppliers"
            :columns="columns"
            row-key="id"
            flat
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
                @click="newSupplier"
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
import columns from './components/TableSupplierColumns';
import { useRouter } from 'vue-router';

/* setup router */
const router = useRouter()

/* setup stores */
const inventoryStores = useInventoryStores()

/* setup data */
const suppliers = ref([])


/* methods */
const newSupplier = () => {
  router.push({name: "stock-supplier-create"})
}

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

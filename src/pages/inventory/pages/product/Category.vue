<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h5">
      Categoria de Produtos</div>
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
            :rows="categories"
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
                @click="newCategory"
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
import columns from './components/TableCategorieeColumns';
import { useRouter } from 'vue-router';

/* setup router */
const router = useRouter()

/* setup stores */
const inventoryStores = useInventoryStores()

/* setup data */
const categories = ref([])

/* methods */
const newCategory = () => {
  router.push({name: "stock-categories-create"})
}

/* fetcth data */
const fetchCategories = async () => {
  try {
    await inventoryStores.findCategories()
    categories.value = inventoryStores.categories
  } catch (error) {

  }
}

onMounted( async() => {
  await fetchCategories()
})
</script>

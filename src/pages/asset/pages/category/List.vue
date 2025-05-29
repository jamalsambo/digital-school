<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h5">Categorias</div>
        <q-separator spaced />
      </q-card-section>
    </q-card>

    <q-card class="q-mt-lg">
      <q-card-section>
        <q-card flat bordered class="q-pa-md shadow-2">
          <q-table
            title="Lista de categorias"
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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAssetStores } from "../../stores";

/* setup router */
const router = useRouter();

/* setup router */
const assetStores = useAssetStores();

/* setup data */
const categories = ref([]);
const columns = ref([
  { name: "name", align: "left", label: "Nome", field: "name", sortable: true },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
]);

/* setup methods */
const newCategory = () => {
  router.push({ name: "assets-category-create" });
};

/* setup methods */
const fetchCategories = async () => {
  try {
    await assetStores.findCategories();
    categories.value = assetStores.categories;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchCategories();
});
</script>

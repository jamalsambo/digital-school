<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h5">Locais</div>
        <q-separator spaced />
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle1">Informações de pesquisa</div>
        <q-card flat bordered class="q-pa-md shadow-2">
          <div class="row q-col-gutter-sm"></div>
        </q-card>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-lg">
      <q-card-section>
        <q-card flat bordered class="q-pa-md shadow-2">
          <q-table
            title="Lista de locais"
            :rows="locations"
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
                @click="newLocation"
              />
            </template>
            <template v-slot:body-cell-actions="props">
              <q-btn
                flat
                round
                icon="edit"
                color="primary"
                @click="editLocation(props.row)"
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
const locations = ref([]);
const columns = ref([
  { name: "name", align: "left", label: "Nome", field: "name", sortable: true },
  { name: "block", align: "left", label: "Edificio/Bloco", field: "block", sortable: true },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
]);

/* setup methods */
const newLocation = () => {
  router.push({ name: "assets-location-create" });
};

/* setup methods */
const fetchCategories = async () => {
  try {
    await assetStores.locations();
    locations.value = assetStores.locations;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchCategories();
});
</script>

<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h5">Patrimonios</div>
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
            title="Lista de patrimonios"
            :rows="assets"
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
                @click="newAsset"
              />
            </template>
            <template v-slot:body-cell-actions="props">
              <q-btn
                flat
                round
                icon="edit"
                color="primary"
                @click="editAsset(props.row)"
              />
              <q-btn
                flat
                round
                icon="compare_arrows"
                color="primary"
                @click="createMove(props.row)"
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
import { useAssetStores } from "../stores";
import columns from "../components/ColumnsAssets";

/* setup router */
const router = useRouter();

/* setup router */
const assetStores = useAssetStores();

/* setup data */
const assets = ref([]);


/* setup methods */
const newAsset = () => {
  router.push({ name: "asset-create" });
};

const createMove = (asset) => {
  router.push({ name: "move create", params: { assetId: asset.id} });
}

/* setup methods */
const fetchAssets = async () => {
  try {
    await assetStores.list();
    assets.value = assetStores.assets;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchAssets();
});
</script>

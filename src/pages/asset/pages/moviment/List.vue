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
            :rows="moves"
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
import { useAssetStores } from '../../stores';
import columns from './components/TableColumnsMove';
import useNotify from 'src/composables/UseNotify';

/* setup stores */
const assetsStores = useAssetStores()
const {notifyError} = useNotify()
/* setup data */
const moves = ref([])

const fetchMoves = async () => {
  try {
    await assetsStores.findMoves()
    moves.value = assetsStores.moves
  } catch (error) {
    console.log(error)
    notifyError("Erro ao carregar dados")
  }
}

onMounted( async () => {
  await fetchMoves()
})


</script>

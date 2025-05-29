<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Criaçao de Fornecedores</div>
      </q-card-section>
      <q-separator spaced />
      <q-form @submit.prevent="handleSubmit">
        <div class="row q-col-gutter-md">
          <q-input
            class="col-md-12 col-sm-12 col-xs-12"
            outlined
            v-model="name"
            label="Nome"
            :rules="[(val) => !!val || 'Campo obrigatório.']"
            dense
          />
        </div>

        <div class="row q-mt-md justify-end">
          <q-btn
            label="voltar"
            color="negative"
            flat
            type="reset"
            @click="router.back()"
          />
          <q-btn label="Salvar" color="green" flat type="submit" />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { useInventoryStores } from '../../stores';
import useNotify from 'src/composables/UseNotify';
import { ref } from 'vue';

/* setup router */
const router = useRouter()

/* setup stores */
const inventoryStores = useInventoryStores()
const {notifyError, notifySuccess} = useNotify()

/* setup data */
const name = ref()

/* metods */
const handleSubmit = async () => {
  try {
    await inventoryStores.createProductSupplier({name: name.value})
    notifySuccess("Fornecedor criada com sucesso")
    router.back()
  } catch (error) {
    console.log(error)
    notifyError("Erro ao criar Fornecedor")
  }
};


</script>

<template>
  <q-page padding>
    <q-card class="q-pa-lg shadow-2 rounded-borders">
      <!-- Cabeçalho -->
      <q-card-section class="row items-center q-pb-none">
        <q-icon name="inventory_2" size="32px" class="q-mr-sm text-primary" />
        <div class="text-h6">Registro de Movimento de Patrimônio</div>
      </q-card-section>

      <q-separator spaced />

      <!-- Formulário -->
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <q-input
            class="col-md-4 col-sm-12 col-xs-12"
            outlined
            dense
            v-model="assetName"
            label="Nome do Patrimônio"
            :rules="[(val) => !!val || 'Campo obrigatório.']"
            placeholder="Digite o nome do patrimônio"
          />

          <q-input
            class="col-md-4 col-sm-12 col-xs-12"
            outlined
            dense
            v-model="currentLocation"
            label="Localização Atual"
            :rules="[(val) => !!val || 'Campo obrigatório.']"
            placeholder="Digite a localização atual"
          />

          <q-select
            class="col-md-4 col-sm-12 col-xs-12"
            outlined
            dense
            v-model="location"
            :options="locations"
            option-label="name"
            option-value="id"
            label="Novo Destino"
            emit-value
            map-options
            placeholder="Selecione o destino"
          />
        </div>

        <!-- Botões -->
        <div class="row justify-end q-mt-md q-gutter-sm">
          <q-btn
            label="Cancelar"
            flat
            color="negative"
            icon="close"
            @click="resetForm"
          />
          <q-btn
            label="Salvar"
            type="submit"
            color="primary"
            icon="save"
            unelevated
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAssetStores } from "../../stores";
import { useUserStores } from "src/pages/user/store";
import { useRoute, useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

/* setup router */
const route = useRoute();
const router = useRouter();

/* setup stores */
const { assetId } = route.params;
const assetsStores = useAssetStores();
const userStores = useUserStores()
const { notifyError, notifySuccess, notifyInfo } = useNotify();

/* setup data */
const assetName = ref();
const currentLocation = ref();
const location = ref(null);

const asset = ref(null);
const locations = ref([]);
const user = computed(() => userStores.user)

/* methods */
const handleSubmit = async () => {
  try {
    const payload = {
      assetId: asset.value?.id,
      from: asset.value?.currentLocation,
      to: location.value,
      movedBy: user.value.employee.id
    };
    if (asset.value?.currentLocation === location.value) {
      notifyInfo("O local de destino nao pode ser igual com o actual");
    } else {
      await assetsStores.createMove(payload);
      await assetsStores.update(asset.value?.id, {currentLocation: location.value})
      notifySuccess("Registro de movimmento feito com sucesso!");

      router.back();
    }
  } catch (error) {
    console.log(error);
    notifyError("Erro ao registar movimento");
  }
};

/* fetch data */
const fetchAsset = async () => {
  try {
    await assetsStores.findOne(assetId);
    asset.value = assetsStores.asset;
    assetName.value = asset.value?.name;
    currentLocation.value = asset.value.location.name;
  } catch (error) {
    console.log(error);
  }
};
const fetchLocations = async () => {
  try {
    await assetsStores.findlocations();
    locations.value = assetsStores.locations;
  } catch (error) {
    console.log(error);
  }
};
onMounted(async () => {
  await fetchAsset();
  await fetchLocations();
});
</script>

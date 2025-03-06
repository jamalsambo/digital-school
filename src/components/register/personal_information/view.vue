<template>
  <!-- Exibição dos Dados Pessoais -->
  <div v-if="!isEditing">
    <q-card flat bordered class="q-pa-md shadow-2">
      <div class="row items-center justify-between">
        <div class="text-h6 text-primary">Informações Pessoais</div>
        <q-btn
          color="primary"
          icon="edit"
          :label="personalInformation ? 'Editar' : 'Adicionar'"
          class="q-mr-sm"
          @click="toggleEdit"
          flat
        />
      </div>
      <q-separator spaced />
      <q-item>
        <q-item-section>
          <div>
            <strong>Nome Completo:</strong>
            {{ personalInformation?.fullName }}
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div><strong>Gênero:</strong> {{ personalInformation?.gender }}</div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div>
            <strong>Data de Nascimento:</strong>
            {{ personalInformation?.dateBirth }}
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div>
            <strong>Estado Civil:</strong>
            {{ personalInformation?.maritalStatus }}
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div>
            <strong>Nacionalidade:</strong>
            {{ personalInformation?.country?.name }}
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div>
            <strong>Naturalidade:</strong>
            {{ personalInformation?.district?.name }} -
            {{ personalInformation?.district?.province?.name }} -
            {{ personalInformation?.district?.province?.country?.name }}
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div>
            <strong>Residencia:</strong>
            {{ personalInformation?.neighborhood }} -
            {{ personalInformation?.houseNumber }}
          </div>
        </q-item-section>
      </q-item>
    </q-card>
  </div>

  <!-- Formulário de Edição -->
  <div v-else>
    <q-card flat bordered class="q-pa-md shadow-2">
      <div class="text-h6 text-primary">Editar Dados Pessoais</div>
      <q-separator spaced />
      <q-form @submit="saveChanges" class="q-gutter-md q-pt-sm">
        <div class="row q-col-gutter-sm">
          <q-input
            class="col-md-12 col-sm-12 col-xs-12"
            label="Nome Completo *"
            v-model="form.fullName"
            outlined
            :rules="[(val) => !!val || 'O nome completo é obrigatória.']"
            dense

          />
          <q-input
            class="col-md-6 col-sm-12 col-xs-12"
            label="Data de Nascimento *"
            v-model="form.dateBirth"
            type="date"
            outlined
            :rules="[(val) => !!val || 'A data de nascimento é obrigatória.']"
            dense
          />
          <q-select
            class="col-md-6 col-sm-12 col-xs-12"
            label="Gênero *"
            v-model="form.gender"
            :options="['Masculino', 'Feminino']"
            outlined
            :rules="[(val) => !!val || 'O Gênero é obrigatória.']"
            dense
          />
          <q-select
            class="col-md-6 col-sm-12 col-xs-12"
            label="Estado Civil *"
            v-model="form.maritalStatus"
            :options="['Solteiro', 'Casado', 'Divorciado']"
            outlined
            :rules="[(val) => !!val || 'O Estado Civil é obrigatória.']"
            dense
          />
          <q-select
            class="col-md-6 col-sm-12 col-xs-12"
            label="Nacionalidade *"
            v-model="form.countryId"
            :options="countries"
            option-label="name"
            option-value="id"
            outlined
            :rules="[(val) => !!val || 'Nacionalidade é obrigatória.']"
            dense
          />
          <div class="text-subtitle2 col-md-12 col-sm-12 col-xs-12 q-mb-md">
            Naturalidade
          </div>
          <q-select
            class="col-md-4 col-sm-12 col-xs-12"
            v-model="form.selectedCountry"
            :options="countries"
            option-label="name"
            option-value="id"
            label="Selecione o pais"
            outlined
            @update:model-value="onCountryChange"
            :rules="[(val) => !!val || 'Campo é obrigatório']"
            dense
          />
          <q-select
            class="col-md-4 col-sm-12 col-xs-12"
            outlined
            v-model="form.selectedProvince"
            :options="provinces"
            option-label="name"
            option-value="id"
            label="Provincia"
            :disable="!provinces.length"
            @update:model-value="onProvinceChange"
            :rules="[(val) => !!val || 'Provincia é obrigatório']"
            dense
          />
          <q-select
            class="col-md-4 col-sm-12 col-xs-12"
            label="distrito *"
            option-label="name"
            option-value="id"
            v-model="form.districtId"
            :options="districts"
            :disable="!districts.length"
            outlined
            :rules="[(val) => !!val || 'Distrito é obrigatório']"
            dense
          />
          <q-input
            class="col-md-6 col-sm-12 col-xs-12"
            label="Bairro *"
            v-model="form.neighborhood"
            outlined
            dense
          />
          <q-input
            class="col-md-6 col-sm-12 col-xs-12"
            label="Número da Casa *"
            v-model="form.houseNumber"
            outlined
            dense
          />
        </div>
        <slot name="actions"></slot>
      </q-form>
    </q-card>
  </div>
</template>
<script setup>
import { ref, watchEffect, onMounted } from "vue";
import useNotify from "src/composables/UseNotify";
import { useServicesStores } from "src/services";
import { useBasicStores } from "./store";

// use store
const serviceStores = useServicesStores();
const basicStores = useBasicStores();
const { notifyError } = useNotify();

// data ref
const props = defineProps({
  personalInformation: {
    type: Object,
    required: true,
  },
});

// Local data
const form = ref({
  fullName: "",
  dateBirth: "",
  gender: "",
  maritalStatus: "",
  countryId: "",
  selectedCountry: "",
  selectedProvince: "",
  districtId: "",
  neighborhood: "",
  houseNumber: "",
});
const countries = ref([]);
const provinces = ref([]);
const districts = ref([]);
const isEditing = ref(false);
watchEffect(() => {
  if (props.personalInformation) {
    form.value.fullName = props.personalInformation.fullName || "";
    form.value.dateBirth = props.personalInformation.dateBirth || "";
    form.value.gender = props.personalInformation.gender || "";
    form.value.maritalStatus = props.personalInformation.maritalStatus || "";
    form.value.countryId = props.personalInformation?.country?.name || "";
    form.value.selectedCountry =
      props.personalInformation.district?.province?.country?.name || "";
    form.value.selectedProvince =
      props.personalInformation?.district?.province.name || "";
    form.value.districtId = props.personalInformation?.district?.name || "";
    form.value.neighborhood = props.personalInformation.neighborhood || "";
    form.value.houseNumber = props.personalInformation.houseNumber || "";
  }
});

// methods
const saveChanges = async () => {
  const payload = {
    fullName: form.value.fullName
      ? form.value.fullName
      : props.personalInformation.fullName,
    dateBirth: form.value.dateBirth
      ? form.value.dateBirth
      : props.personalInformation.dateBirth,
    gender: form.value.gender
      ? form.value.gender
      : props.personalInformation.gender,
    maritalStatus: form.value.maritalStatus
      ? form.value.maritalStatus
      : props.personalInformation.maritalStatus,
    countryId: form.value.countryId.id
      ? form.value.countryId.id
      : props.personalInformation.country.id,
    districtId: form.value.districtId.id
      ? form.value.districtId.id
      : props.personalInformation.district.id,
    neighborhood: form.value.neighborhood
      ? form.value.neighborhood
      : props.personalInformation.neighborhood,
    houseNumber: form.value.houseNumber
      ? form.value.houseNumber
      : props.personalInformation.houseNumber,
  };

  try {
    if (props.personalInformation) {
      await basicStores.update(props.personalInformation.id, payload);
    } else {
      await basicStores.create(payload);
    }
  } catch (error) {
    notifyError("Ocorreu um erro")
  }
};

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};
const onCountryChange = () => {
  provinces.value = form.value.selectedCountry
    ? form.value.selectedCountry.provinces
    : [];
};
const onProvinceChange = () => {
  districts.value = form.value.selectedProvince
    ? form.value.selectedProvince.districts
    : [];
};

// fetchData
const fetchCountries = async () => {
  await serviceStores.countries();
  countries.value = serviceStores.countriess;
};

onMounted(() => {
  fetchCountries();
});
defineExpose({
  toggleEdit,
  saveChanges,
});
</script>

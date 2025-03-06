<template>
  <q-page padding>
    <q-card flat bordered class="q-pa-md shadow-2">
      <div class="text-h6 text-primary">
        {{
          id
            ? "Editar Instituição"
            : parent
            ? `Nova Instituição Sucursal de ${institution.name}`
            : "Nova Instituição"
        }}
      </div>
      <q-separator spaced />
      <q-form @submit="saveInstitution" class="q-gutter-md q-pt-sm">
        <div class="row q-col-gutter-sm" isLoading>
          <q-input
            class="col-md-6 col grow col-xs-12"
            label="Nome da Instituição"
            placeholder="Digite o nome da Instituição"
            v-model="form.name"
            outlined
            required
            dense
          />
          <q-select
            class="col-md-3 col-sm-12 col-xs-12"
            outlined
            v-model="province"
            use-input
            input-debounce="0"
            label="Provincias"
            option-value="id"
            option-label="name"
            :options="options"
            map-options=""
            @filter="handleFilterProvince"
            @update:model-value="changeProvince"
            dense=""
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sem resultado
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            class="col-md-3 col-sm-12 col-xs-12"
            outlined
            v-model="form.districtId"
            use-input
            input-debounce="0"
            label="Cidade/Distrito"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            :options="optionsDistricts"
            @filter="handleFilterDistrict"
            dense
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sem resultado
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            class="col-md-6 col grow col-xs-12"
            label="Nome da Bairro"
            placeholder="Digite o nome do bairro"
            v-model="form.neighborhood"
            outlined
            required
            dense
          />
          <q-input
            class="col-md-6 col grow col-xs-12"
            label="Endereço (Rua/Av Edificio Numero de Edificio)"
            placeholder="Digite o edereço"
            v-model="form.address"
            outlined
            required
            dense
          />
        </div>
        <div class="text-h7 text-primary q-mt-lg">Contactos</div>
        <q-separator spaced />
        <div class="row q-col-gutter-sm">
          <q-input
            class="col-md-3 col grow col-xs-12"
            label="Telefone Principal"
            placeholder="Digite o telefone"
            v-model="form.mainContact"
            outlined
            required
            type="tel"
            dense
          />
          <q-input
            class="col-md-3 col grow col-xs-12"
            label="Telefone alternativo"
            placeholder="Digite o telefone"
            v-model="form.alternativeContact"
            outlined
            type="tel"
            dense
          />
          <q-input
            class="col-md-3 col grow col-xs-12"
            label="Telefone fixo"
            placeholder="Digite o telefone"
            v-model="form.fixed"
            outlined
            type="tel"
            dense
          />
          <q-input
            class="col-md-3 col grow col-xs-12"
            label="Email"
            placeholder="Digite o email"
            v-model="form.email"
            outlined
            type="email"
            dense
          />
        </div>
        <div class="text-h7 text-primary q-mt-lg">Dados Fiscais</div>
        <q-separator spaced />
        <div class="row q-col-gutter-sm">
          <q-input
            class="col-md-6 col grow col-xs-12"
            label="NUIT"
            placeholder="Digite o NUIT"
            v-model="form.nuit"
            outlined
            type="text"
            dense
          />
          <q-input
            class="col-md-6 col grow col-xs-12"
            label="Taxa de imposto"
            placeholder="Digite a taxa (5%)"
            v-model="form.tax"
            outlined
            type="text"
            dense
          />
        </div>
        <div v-if="id">
          <div class="text-h7 text-primary q-mt-lg">Imagem</div>
          <q-separator spaced />
          <q-file
            class="col-md-6 col-sm-12 col-xs-12"
            v-model="file"
            label="Selecione um arquivo"
            outlined=""
            counter
            dense
            @update:model-value="uploadFile"
          />
        </div>
        <div class="row justify-end q-gutter-sm">
          <q-btn
            label="Cancelar"
            color="negative"
            icon="close"
            outline
            @click="cancel"
            class="q-mr-sm"
            flat
          />
          <q-btn
            label="Guardar"
            color="positive"
            icon="save"
            type="submit"
            flat
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { useInstitutionStores } from "src/pages/institution/store";
import { useComposablesStores } from "src/composables";
import useNotify from "src/composables/UseNotify";
import scripts from "src/composables/Scripts";

const router = useRouter();
const route = useRoute();
const institutionStore = useInstitutionStores();
const composablesStores = useComposablesStores();
const { notifyError, notifySuccess } = useNotify();
const { filterFn } = scripts();

// data
const institution = ref({});
const { id, parent } = route.params;
const isLoading = ref(false);
const file = ref();
const form = ref({
  name: "",
  districtId: "",
});

const province = ref("");
const provinces = ref([]);
const districts = ref([]);
const options = ref(provinces.value);
const optionsDistricts = ref(districts.value);
const educationLevel = ref([]);

// Methods
const saveInstitution = async () => {
  isLoading.value = true;
  try {
    if (id) {
      const payload = {
        ...form.value,
        name: form.value.name,
        districtId: form.value.districtId.id,
      };
      await institutionStore.update(id, payload);
      notifySuccess("Instituição editada com sucesso!");
    } else if (parent) {
      await institutionStore.create({ parentId: parent, ...form.value });
      notifySuccess("Instituição criada com sucesso!");
    } else {
      await institutionStore.create(form.value);
      notifySuccess("Instituição criada com sucesso!");
    }
    router.push("/institution");
  } catch (error) {
    notifyError("Instituição nao criada");
  } finally {
    isLoading.value = false;
  }
};

const uploadFile = async () => {
  try {
    const formData = new FormData();
    formData.append("file", file.value);
    const response = await axios.post(
      "http://localhost:4000/upload/single",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    const logo = response.data.file.filename;
    await institutionStore.update(id, { logo: logo });
    notifySuccess("Logo da Instituição editada com sucesso!");
  } catch (error) {
    notifyError("Erro ao carregar logo da instituição");
  }
};

const cancel = () => {
  router.push("/institution");
};

const handleFilterProvince = async (val, update) => {
  const filteredOptions = await filterFn(val, update, provinces.value);
  options.value = filteredOptions; // Atualiza o `options` com os resultados filtrados
};

const handleFilterDistrict = async (val, update) => {
  const filteredOptions = await filterFn(val, update, districts.value);
  optionsDistricts.value = filteredOptions; // Atualiza o `options` com os resultados filtrados
};

const changeProvince = async (val) => {
  districts.value = province.value.districts || [];
};

const fetchProvinces = async () => {
  try {
    await composablesStores.findProvinces();
    provinces.value = composablesStores.provinces;
  } catch (error) {
    console.error(error);
  }
};

const fetchinstitution = async () => {
  try {
    if (id) {
      await institutionStore.findOne(id);
      institution.value = institutionStore.institution;
      if (institution.value) {
        form.value.name = institution.value.name || "";
        form.value.districtId = institution.value.district || "";
        province.value = institution.value.district?.province || "";
        form.value.neighborhood = institution.value.neighborhood || "";
        form.value.address = institution.value.address || "";
        form.value.mainContact = institution.value.mainContact || "";
        form.value.alternativeContact =
          institution.value.alternativeContact || "";
        form.value.fixed = institution.value.fixed || "";
        form.value.email = institution.value.email || "";
        form.value.nuit = institution.value.nuit || "";
        form.value.tax = institution.value.tax || "";
      }
    } else if (parent) {
      await institutionStore.findOne(parent);
      institution.value = institutionStore.institution;
      form.value.name = institution.value.name || "";
    }
  } catch (error) {
    notifyError("Erro ao buscar Instituição");
  }
};

const fetchEducationLevel = async () => {
  try {
    await institutionStore.findEducationLevel();
    educationLevel.value = institutionStore.educationLevel;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchProvinces();
  fetchEducationLevel();
  if (id || parent) {
    fetchinstitution();
  }
});
</script>

<style scoped></style>

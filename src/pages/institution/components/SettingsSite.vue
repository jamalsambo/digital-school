<template>
  <q-page padding>
    <q-card flat bordered class="q-mb-md">
      <q-card flat bordered class="q-pa-md shadow-2">
        <div class="text-h6 text-primary">Configuração da pagina web</div>
        <q-separator spaced />
        <div class="q-mb-md q-mt-lg">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="domain"
              type="text"
              label="Dominio"
              outlined
              dense
              placeholder="Digite o dominio da instituiçao"
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn
                label="Guardar"
                color="positive"
                icon="save"
                type="submit"
                flat
              />
            </div>
          </q-form>
        </div>
        <!-- card de carrosel principal -->
        <q-card-section class="q-pt-none">
          <div class="border q-pa-md shadow-2">
            <div v-if="!isEditing">
              <div class="row items-center justify-between">
                <span class="text-weight-bold">
                  Imagens do carrocel Principal</span
                >
                <q-btn
                  color="primary"
                  icon="add"
                  label="Adicionar"
                  class="q-mr-sm"
                  @click="isEditing = true"
                  flat
                />
              </div>
              <q-separator spaced />
              <q-list bordered>
                <q-item
                  v-for="(item, index) in mainCarroselImagens"
                  :key="index"
                >
                  <q-item-section>
                    <div>
                      <q-card class="my-card" style="width: 200px">
                        <q-img :src="`${apiUrl}/upload/${item?.imagen}`">
                          <div
                            class="absolute-bottom text-subtitle2 text-center"
                          >
                            {{ item.description }}
                          </div>
                        </q-img>
                      </q-card>
                    </div>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn flat dense round icon="delete" color="negative" />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div v-else>
              <div class="row items-center justify-between">
                <span class="text-weight-bold">Criar Periodo</span>
              </div>
              <q-separator spaced />
              <q-form @submit="handleUploaFileMainCarrocel">
                <div class="row q-col-gutter-sm">
                  <q-file
                    class="col-md-5 col-sm-12 col-xs-12"
                    v-model="file"
                    label="Selecione um arquivo"
                    outlined=""
                    counter
                    dense
                    accept="imagen"
                  />
                  <q-input
                    class="col-md-7 col-sm-12 col-xs-12"
                    v-model="description"
                    label="Legenda"
                    outlined
                    dense
                    placeholder="Digite o dominio da instituiçao"
                  />
                </div>
                <div class="row justify-end q-gutter-sm">
                  <q-btn
                    label="Cancelar"
                    color="negative"
                    icon="close"
                    outline
                    @click="isEditing = false"
                    class="q-mr-sm"
                    flat
                  />
                  <q-btn
                    label="Adicionar"
                    color="positive"
                    icon="save"
                    type="submit"
                    flat
                  />
                </div>
              </q-form>
            </div>
          </div>
        </q-card-section>
        <!-- card de historia -->
        <q-card-section class="q-pt-none">
          <div class="border q-pa-md shadow-2">
            <span class="text-weight-bold"> Sobre a instituiçao</span>
            <div class="q-mb-md q-mt-lg">
              <q-form @submit="onSendAboutUs" class="q-gutter-md">
                <q-editor
                  v-model="aboutUs"
                  min-height="150px"
                  :toolbar="toolbar"
                  placeholder="Escreva sua mensagem aqui..."
                />

                <div class="row justify-end q-gutter-sm">
                  <q-btn
                    label="Guardar"
                    color="positive"
                    icon="save"
                    type="submit"
                    flat
                  />
                </div>
              </q-form>
            </div>
          </div>
        </q-card-section>
        <!-- card de carrosel sobre nos -->
        <q-card-section class="q-pt-none">
          <div class="border q-pa-md shadow-2">
            <div v-if="!isAddImgAbountUs">
              <div class="row items-center justify-between">
                <span class="text-weight-bold">
                  Imagens do carrosel sobre nos</span
                >
                <q-btn
                  color="primary"
                  icon="add"
                  label="Adicionar"
                  class="q-mr-sm"
                  @click="isAddImgAbountUs = true"
                  flat
                />
              </div>
              <q-separator spaced />
              <q-list bordered>
                <q-item
                  v-for="(item, index) in aboutUsCarroselImagens"
                  :key="index"
                >
                  <q-item-section>
                    <div>
                      <q-card class="my-card" style="width: 200px">
                        <q-img :src="`${apiUrl}/upload/${item?.imagen}`">
                          <div
                            class="absolute-bottom text-subtitle2 text-center"
                          >
                            {{ item.description }}
                          </div>
                        </q-img>
                      </q-card>
                    </div>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn flat dense round icon="delete" color="negative" />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div v-else>
              <div class="row items-center justify-between">
                <span class="text-weight-bold"
                  >Adicionar imagens de carrosel sobre nos</span
                >
              </div>
              <q-separator spaced />
              <q-form @submit="handleUploaFileAboutUsCarrocel">
                <div class="row q-col-gutter-sm">
                  <q-file
                    class="col-md-5 col-sm-12 col-xs-12"
                    v-model="fileAbout"
                    label="Selecione um arquivo"
                    outlined=""
                    counter
                    dense
                  />
                  <q-input
                    class="col-md-7 col-sm-12 col-xs-12"
                    v-model="description"
                    label="Legenda"
                    outlined
                    dense
                    placeholder="Digite o dominio da instituiçao"
                  />
                </div>
                <div class="row justify-end q-gutter-sm">
                  <q-btn
                    label="Cancelar"
                    color="negative"
                    icon="close"
                    outline
                    @click="isAddImgAbountUs = false"
                    class="q-mr-sm"
                    flat
                  />
                  <q-btn
                    label="Adicionar"
                    color="positive"
                    icon="save"
                    type="submit"
                    flat
                  />
                </div>
              </q-form>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useInstitutionStores } from "../store";
import { useComposablesStores } from "src/composables";
import useNotify from "src/composables/UseNotify";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

/* setup store */
const route = useRoute();
const institutionStores = useInstitutionStores();
const composableStores = useComposablesStores();
const { notifyError, notifySuccess } = useNotify();

/* seteup data */
const { id } = route.params;
const institution = ref();
const mainCarroselImagens = ref([]);
const aboutUsCarroselImagens = ref([]);

const domain = ref("");
const file = ref(null);
const fileAbout = ref(null);
const description = ref();
const aboutUs = ref("");

const isEditing = ref(false);
const isAddImgAbountUs = ref(false);
/* methods */
const onSubmit = async () => {
  try {
    await institutionStores.update(id, { domain: domain.value });
    notifySuccess("Domínio da instituição atualizado com sucesso!");
  } catch (error) {
    notifyError(error.message);
  }
};

const handleUploaFileMainCarrocel = async () => {
  try {
    // await composableStores.login('jhsambo99@gmail.com', 'salvecharles')
   const publicUrl = await composableStores.getURlPublic('7367615a-71ee-4abb-8d98-90285d85b673')
   console.log(publicUrl)
    // const formData = new FormData();
    // formData.append("file", file.value);
    // const response = await axios.post(
    //   "https://educar-api-zymx.onrender.com/upload/single",
    //   formData,
    //   {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   }
    // );
    // if (response.data.file.filename) {
    //   await institutionStores.createMainCarroselImagen({
    //     imagen: response.data.file.filename,
    //     description: description.value,
    //   });
    //   await fetchinstitution();
    //   notifySuccess("Imagem do carrocel principal adicionada com sucesso!");
    // }
  } catch (error) {
    console.error(error)
    notifyError("Erro ao carregar a imagem");
  }
};

const handleUploaFileAboutUsCarrocel = async () => {
  try {
    const formData = new FormData();
    formData.append("file", fileAbout.value);
    const response = await axios.post(
      "../../",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (response.data.file.filename) {
      await institutionStores.createAboutUsCarroselImagen({
        imagen: response.data.file.filename,
        description: description.value,
      });
      await fetchinstitution();
      isAddImgAbountUs.value = false;
      notifySuccess("Imagem do carrosel sobre nos adicionada com sucesso!");
    }
  } catch (error) {
    notifyError("Erro ao carregar a imagem");
  }
};

const onSendAboutUs = async () => {
  try {
    await institutionStores.update(id, { aboutUs: aboutUs.value });
    notifySuccess("Sobre a instituição atualizada com sucesso!");
  } catch (error) {
    notifyError("Error ao adicionar sobre a instituição");
  }
};

const fetchinstitution = async () => {
  try {
    await institutionStores.findOne(id);
    institution.value = institutionStores.institution;
    mainCarroselImagens.value =
      institutionStores.institution.mainCarroselImagens;
      aboutUsCarroselImagens.value =
      institutionStores.institution.aboutUsCarroselImagens;
    domain.value = institution.value.domain;
    aboutUs.value = institution.value.aboutUs;
  } catch (error) {
    notifyError("Oops! Something went wrong");
  }
};
onMounted(fetchinstitution);
</script>

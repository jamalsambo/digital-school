<template>
  <!-- Exibição dos Contactos -->
  <div v-if="!isEditing">
    <q-card flat bordered class="q-pa-md shadow-2">
      <div class="row items-center justify-between">
        <div class="text-h6 text-primary">Documentos</div>
        <q-btn
          color="primary"
          icon="edit"
          label="Editar"
          class="q-mr-sm"
          @click="toggleEdit"
          flat
        />
      </div>
      <q-separator spaced />
      <div class="q-pt-sm">
        <!-- Listagem de Documentos -->
        <div v-if="documents.length" class="q-mb-md">
          <q-list bordered>
            <q-item v-for="(item, index) in documents" :key="index">
              <q-item-section>
                <div>
                  <span class="text-weight-bold"
                    >Tipo de Documento {{ item.type }}</span
                  >: {{ item.number }}
                </div>
              </q-item-section>
              <q-item-section>
                <div>
                  <span class="text-weight-bold">Validade</span>:
                  {{ item.expiration }}
                </div>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  dense
                  round
                  icon="delete"
                  color="negative"
                  @click="removeDocument(item)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card>
  </div>

  <!-- Formulário para Criação de Novos Documentos -->
  <div v-else>
    <q-card flat bordered class="q-pa-md shadow-2">
      <div class="text-h6 text-primary">Adicionar Documentos</div>
      <q-separator spaced />
      <q-form @submit="saveChanges" class="q-gutter-md q-pt-sm">
        <div class="row q-col-gutter-sm">
          <q-file
            class="col-md-6 col-sm-12 col-xs-12"
            v-model="file"
            label="Selecione um arquivo"
            filled
            counter
            :rules="[(val) => !!val || 'Arquivo é obrigatório']"
          />
          <q-select
            class="col-md-6 col-sm-12 col-xs-12"
            label="Tipo de Documento *"
            v-model="form.type"
            :options="['BI','Cedula', 'Certificado', 'Nota Informativa', 'Passaporte', 'Carta de Condução']"
            outlined
            required
          />
          <q-input
            class="col-md-6 col-sm-12"
            label="Número do Documento *"
            v-model="form.number"
            outlined
            required
          />
          <q-input
            class="col grow"
            label="Data de Expiração *"
            v-model="form.expiration"
            type="date"
            outlined
            required
          />
        </div>
        <slot name="actions"></slot>
      </q-form>
    </q-card>
  </div>
</template>
<script setup>
// imports
import { ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { useDocumentStores } from "./store";
import useNotify from "src/composables/UseNotify";

// store
const route = useRoute();
const documentStores = useDocumentStores();
const { notifyError, notifySuccess } = useNotify();

// props
const props = defineProps({
  documents: { type: Array, required: true },
  entity: { type: String, required: true },
});

// component data
const isEditing = ref(false);
const file = ref(null);
const form = ref({
  type: "",
  number: "",
  expiration: "",
  link: "",
});

// component methods
const saveChanges = async () => {
  // Cria um formulário para envio do arquivo
  try {
    const entity =
      props.entity === "employee"
        ? { employeeId: route.params.id }
        : { studentId: route.params.id };

    const formData = new FormData();
    formData.append("file", file.value);
    const response = await axios.post(
      "https://educar-api-zymx.onrender.com/upload/single",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // Ajuste o caminho conforme a resposta do backend
    form.link = response.data.file.path || response.data.file.destination;

    if (form.link) {
      const payload = {
        type: form.value.type,
        name: response.data.file.originalname,
        number: form.value.number,
        expiration: form.value.expiration,
        link: form.link,
      };

      await documentStores.create(payload);
      if (documentStores.document.id) {
        await documentStores.addToOwner({
          documentId: documentStores.document.id,
          ...entity,
        });
        notifySuccess("Documento adicionado com sucesso");
        props.documents.push({ ...form.value });
      } else {
        notifyError("Falha ao salvar documento");
      }
    } else {
      console.error("Erro: Link do arquivo não foi retornado corretamente.");
    }
  } catch (error) {
    console.log(error)
    notifyError("error: " + error);
  }
  isEditing.value = false;
};
const removeDocument = (documentToRemove) => {
  try {
    const index = props.documents.findIndex(
      (document) => document.id === documentToRemove.id
    );

    if (index !== -1) {
      // Remove contato da lista local
      props.documents.splice(index, 1);

      // Remove contato do backend
      // await contactStore.delete(contactToRemove.id);
      notifySuccess("Contato removido com sucesso!");
    } else {
      notifyError("Contato não encontrado!");
    }
  } catch (error) {
    notifyError(`Erro ao remover contato: ${error.message}`);
  }
};
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

defineExpose({
  saveChanges,
  toggleEdit
});
</script>

<template>
  <q-card-section>
    <!-- Exibição dos Dados Pessoais -->
    <div v-if="!isEditing">
      <div class="row items-center justify-between">
        <div class="text-h6 text-primary">Filiação</div>
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
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <q-item class="col-12 col-md-6">
              <q-item-section>
                <q-item-label>Nome do Pai</q-item-label>
                <q-item-label caption>{{
                  paternity?.fatherName || "Não informado"
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="col-12 col-md-6">
              <q-item-section>
                <q-item-label>Ocupação do Pai</q-item-label>
                <q-item-label caption>{{
                  paternity?.fatherOcupation || "Não informado"
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="row q-col-gutter-md q-mt-md">
            <q-item class="col-12 col-md-6">
              <q-item-section>
                <q-item-label>Nome da Mãe</q-item-label>
                <q-item-label caption>{{
                  paternity?.motherName || "Não informado"
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="col-12 col-md-6">
              <q-item-section>
                <q-item-label>Ocupação da Mãe</q-item-label>
                <q-item-label caption>{{
                  paternity?.motherOcupation || "Não informado"
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="row q-col-gutter-md q-mt-md">
            <q-item class="col-12 col-md-6">
              <q-item-section>
                <q-item-label>Nome do Encarregado</q-item-label>
                <q-item-label caption>{{
                  paternity?.educationOfficer || "Não informado"
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="col-12 col-md-6">
              <q-item-section>
                <q-item-label>Ocupação do Encarregado</q-item-label>
                <q-item-label caption>{{
                  paternity?.educationOcupation || "Não informado"
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-card-section>
      </div>
    </div>
    <!-- Formulário de Edição -->
    <div v-else>
      <q-form @submit="saveChanges">
        <q-card-section>
          <div class="text-h6 text-primary q-mb-md">Filiação</div>

          <!-- Informações do Pai -->
          <div class="row q-col-gutter-md q-mb-md">
            <q-input
              class="col-12 col-md-5"
              label="Nome Completo do Pai *"
              v-model="form.fatherName"
              outlined
              dense
              :rules="[
                (val) => !!val || 'O nome completo do Pai é obrigatório.',
              ]"
            />
            <q-input
              class="col-12 col-md-5"
              label="Ocupação do Pai *"
              v-model="form.fatherOcupation"
              outlined
              dense
              :rules="[(val) => !!val || 'A ocupação do Pai é obrigatória.']"
            />
            <q-btn
              color="primary"
              type="button"
              label="Encarregado"
              class="col-12 col-md-2"
              flat=""
              no-caps=""
              @click="togglEducationFather"
            />
          </div>

          <!-- Informações da Mãe -->
          <div class="row q-col-gutter-md ">
            <q-input
              class="col-12 col-md-5"
              label="Nome Completo da Mãe *"
              v-model="form.motherName"
              outlined
              dense
              :rules="[
                (val) => !!val || 'O nome completo da Mãe é obrigatório.',
              ]"
            />
            <q-input
              class="col-12 col-md-5"
              label="Ocupação da Mãe *"
              v-model="form.motherOcupation"
              outlined
              dense
              :rules="[(val) => !!val || 'A ocupação da Mãe é obrigatória.']"
            />
            <q-btn
              color="primary"
              type="button"
              label="Encarregado"
              class="col-12 col-md-2"
              flat
               no-caps
              @click="togglEducationMother"
            />
          </div>

          <!-- Informações do Encarregado de Educação -->
          <div class="row q-col-gutter-md q-mb-md">
            <q-input
              class="col-12 col-md-6"
              label="Encarregado de Educação *"
              v-model="form.educationOfficer"
              outlined
              dense
              :rules="[
                (val) => !!val || 'O encarregado de educação é obrigatório.',
              ]"
            />
            <q-input
              class="col-12 col-md-6"
              label="Ocupação do Encarregado *"
              v-model="form.educationOcupation"
              outlined
              dense
              :rules="[
                (val) => !!val || 'A ocupação do encarregado é obrigatória.',
              ]"
            />
          </div>

          <!-- Botões -->
          <slot name="actions"></slot>
        </q-card-section>
      </q-form>
    </div>
  </q-card-section>
</template>

<script setup>
// imports
import { ref, watchEffect } from "vue";
import { useStudentStores } from "src/pages/student/store";
import useNotify from "src/composables/UseNotify";
import { useRoute } from "vue-router";

// props
const props = defineProps({
  paternity: {
    type: Object,
    required: true,
  },
});

// use store
const route = useRoute();
const studentStores = useStudentStores();
const { notifyError, notifySuccess } = useNotify();

// data
const isEditing = ref(false);
const form = ref({
  fatherName: "",
  fatherOcupation: "",
  motherName: "",
  motherOcupation: "",
  educationOfficer: "",
  educationOcupation: "",
});

// methods
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};
const saveChanges = async () => {
  try {
    if (props.paternity) {
      // edit
      await studentStores.paternityUpdate(props.paternity.id, form.value);
      notifySuccess("Filiacao editada com sucesso");
    } else {
      // create
      await studentStores.paternity({
        studentId: route.params.id,
        ...form.value,
      });
      notifySuccess("Filiacao salva com sucesso");
    }
  } catch (error) {
    notifyError("Erro ao salvar Filiacao" + error);
  }
};

const togglEducationFather = () => {
  form.value.educationOfficer = form.value.fatherName
  form.value.educationOcupation = form.value.fatherOcupation
}

const togglEducationMother = () => {
  form.value.educationOfficer = form.value.motherName
  form.value.educationOcupation = form.value.motherOcupation
}

// fetchData
watchEffect(() => {
  if (props.paternity) {
    form.value.fatherName = props.paternity.fatherName || "";
    form.value.fatherOcupation = props.paternity.fatherOcupation || "";
    form.value.motherName = props.paternity.motherName || "";
    form.value.motherOcupation = props.paternity.motherOcupation || "";
    form.value.educationOfficer = props.paternity.educationOfficer || "";
    form.value.educationOcupation = props.paternity.educationOcupation || "";
  }
});

defineExpose({
  toggleEdit,
  saveChanges,
});
</script>

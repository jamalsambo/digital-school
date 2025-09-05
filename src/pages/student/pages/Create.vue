<template>
  <q-page padding>
    <q-card-section>
      <div class="text-h6 text-center">Registro de Estudante</div>
    </q-card-section>
    <!-- Sessão de Dados Pessoais -->
    <q-card flat bordered class="q-mb-md">
      <q-card flat bordered class="q-pa-md shadow-2">
        <div class="row items-center justify-between">
          <div class="text-h6 text-primary">Matriculas</div>
          <q-btn
           v-if="!actualEnrollment && authStore.hasCreateEnrrolment"
            color="primary"
            icon="edit"
            label="Nova Matricula"
            class="q-mr-sm"
            @click="handleNewEnrollment"
            flat
          />
        </div>
        <q-separator spaced />
        <q-card-section>
          <Tables :rows="enrollments" :columns="ColumnsEnrollments">

          </Tables>
        </q-card-section>
      </q-card>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <PersonalInformationComponent
        ref="personalChild"
        :personalInformation="personalInformation"
      >
        <template #actions>
          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Cancelar"
              color="negative"
              icon="close"
              outline
              @click="toggleEditPersonalInfo"
              class="q-mr-sm"
              flat
            />
            <q-btn
              label="Guardar"
              color="positive"
              icon="save"
              type="button"
              flat
              @click="handleSavePersonal"
            />
          </div>
        </template>
      </PersonalInformationComponent>
    </q-card>
    <!-- Sessão de Paternidade -->
    <q-card flat bordered class="q-mb-md">
      <PaternityComponent ref="paternityChild" :paternity="paternity">
        <template #actions>
          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Cancelar"
              color="negative"
              icon="close"
              outline
              @click="toggleEditPaternity"
              class="q-mr-sm"
              flat
            />
            <q-btn
              label="Guardar"
              color="positive"
              icon="save"
              type="button"
              flat
              @click="handleSavePaternity"
            />
          </div>
        </template>
      </PaternityComponent>
    </q-card>
    <!-- Sessão de Contactos -->
    <q-card flat bordered class="q-mb-md">
      <ContactComponent ref="contactChild" :contacts="contacts">
        <template #actions>
          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Cancelar"
              color="negative"
              icon="close"
              outline
              @click="toggleEditContact"
              class="q-mr-sm"
              flat
            />
            <q-btn
              label="Guardar"
              color="positive"
              icon="save"
              type="submit"
              flat
              @click="handleSaveContact"
            />
          </div>
        </template>
      </ContactComponent>
    </q-card>
    <!-- Sessão de Documentos -->
    <q-card flat bordered class="q-mb-md">
      <DocumentsComponent
        ref="documentChild"
        :documents="documents"
        :entity="entity"
      >
        <template #actions>
          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Cancelar"
              color="negative"
              icon="close"
              outline
              @click="toggleEditDocument"
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
        </template>
      </DocumentsComponent>
    </q-card>
    <!-- Sessão de Tipo de de Pagamento -->
    <q-card flat bordered class="q-mb-md">
      <q-card flat bordered class="q-pa-md shadow-2">
        <div class="row items-center justify-between">
          <div class="text-h6 text-primary" v-if="!isEditing">
            Tipos de Pagamentos
          </div>
          <div class="text-h6 text-primary" v-else>
            Adicionar Novo Tipo de Pagamento
          </div>
          <q-btn
            v-if="!isEditing"
            color="primary"
            icon="edit"
            label="Nova Tipo de Pagamento"
            class="q-mr-sm"
            @click="handleNewPaymentType"
            flat
          />
        </div>

        <div v-if="!isEditing">
          <Tables
            :rows="studentPaymentTypes"
            :columns="ColumnsStudentPaymentType"
          >
            <template #actions="{ props }">
              <q-btn
                icon="print"
                color="primary"
                class="q-mr-sm"
                flat
                @click="printDocument(props)"
              />
            </template>
          </Tables>
        </div>
        <div v-else>
          <q-card flat bordered class="q-pa-md shadow-2">
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
              <div class="row q-col-gutter-sm">
                <q-select
                  class="col-md-6 col-sm-12 col-xs-12"
                  label="Tipo de Pagamento"
                  option-label="name"
                  option-value="id"
                  v-model="payType.paymentTypeId"
                  :options="paymentTypes"
                  map-options
                  outlined
                  @update:model-value="updateValue"
                  dense
                  clearable=""
                />
                <q-input
                  class="col-md-6 col-sm-12 col-xs-12"
                  label="Valor de pagamento"
                  placeholder="Digite valor de pagamento"
                  type="number"
                  v-model="payType.amount"
                  outlined
                  dense
                />
              </div>

              <div class="row justify-end q-gutter-sm">
                <q-btn
                  label="Cancelar"
                  color="negative"
                  icon="close"
                  outline
                  @click="handleNewPaymentType"
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
        </div>
      </q-card>
    </q-card>
  </q-page>
</template>

<script setup>
// imports
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStudentStores } from "../store";
import { usePaymentStores } from "src/pages/finance/payments/stores";
import { useBasicStores } from "src/components/register/personal_information/store";
import { useAuthStore } from "src/pages/auth/store";
import useNotify from "src/composables/UseNotify";
import PersonalInformationComponent from "src/components/register/personal_information/view.vue";
import PaternityComponent from "src/components/register/personal_information/paternity.vue";
import ContactComponent from "src/components/register/contact/View.vue";
import DocumentsComponent from "src/components/register/documents/View.vue";
import Tables from "src/components/Tables.vue";
import ColumnsStudentPaymentType from "../components/ColumnsStudentsPaymentTypes.js";
import ColumnsEnrollments from "../components/ColumnsEnrolments";
import scripts from "src/composables/Scripts";

// use store
const route = useRoute();
const router = useRouter();
const studentStores = useStudentStores();
const paymentStores = usePaymentStores();
const basicStores = useBasicStores();
const authStore = useAuthStore();
const { notifySuccess, notifyError } = useNotify();
const { getActiveClass } = scripts();

/* setup computed */
// data
const isLoading = ref(true);
const personalInformation = ref(null);
const entity = ref("student");
const student = ref();
const paternity = ref(null);
const contacts = ref([]);
const documents = ref([]);
const enrollments = ref([]);
const paymentTypes = ref([]);
const studentPaymentTypes = ref([]);
const invoices = ref([]);
const medium = ref(false);
const isEditing = ref(false);

const personalChild = ref(null);
const paternityChild = ref(null);
const contactChild = ref(null);
const documentChild = ref(null);
const payType = ref({
  paymentTypeId: "",
  amount: "",
});

// computed
const actualEnrollment = computed(() => getActiveClass(enrollments.value));

// methods
const handleSavePersonal = async () => {
  if (!studentStores.student?.basic_information) {
    // create a new
    try {
      await personalChild.value.saveChanges();
      const basicInformation = basicStores.basicInformation;
      await studentStores.update(route.params.id, {
        basicInformationId: basicInformation.id,
      });
      notifySuccess("Informações Pessoais salvas com sucesso!");
    } catch (error) {
      notifyError("Ocorreu um erro ao salvar Informacoes Pessoais.");
    }
  } else {
    try {
      await personalChild.value.saveChanges();
      notifySuccess("Informações Pessoais editadas com sucesso!");
    } catch (error) {
      notifyError("Ocorreu um erro ao Editar Informacoes Pessoais.");
    }
  }

  await studentStores.findOne(route.params.id);
  personalInformation.value = studentStores.student?.basicInformation;
  toggleEditPersonalInfo();
};
const handleSavePaternity = async () => {
  paternityChild.value.saveChanges();
  fetchStudent();
  toggleEditPaternity();
};
const handleSaveContact = async () => {
  const entity = { owner: "student", id: route.params.id };
  contactChild.value.addContact(entity);
  fetchStudent();
  toggleEditContact();
};

const handleNewEnrollment = () => {
  router.push({
    name: "create-enrollment",
    params: { studentId: route.params.id },
  });
};
const onSubmit = async () => {
  const payload = {
    studentId: route.params.id,
    paymentTypeId: payType.value.paymentTypeId.id,
    amount: parseInt(payType.value.amount),
    classId: actualEnrollment.value.classId,
  };
  try {
    await studentStores.createPaymentType(payload);
    handleNewPaymentType();
    notifySuccess("Tipo de pagamento criado com sucesso!");
  } catch (error) {
    console.log(error);
    notifyError("Erro ao criar tipo de pagamento");
  }
};
// edit functions

const toggleEditPersonalInfo = () => {
  personalChild.value.toggleEdit();
};
const toggleEditPaternity = () => {
  paternityChild.value.toggleEdit();
};
const toggleEditContact = () => {
  contactChild.value.toggleEdit();
};
const toggleEditDocument = () => {
  documentChild.value.toggleEdit();
};

const handleNewPaymentType = () => {
  isEditing.value = !isEditing.value;
};

// fetch data
const fetchStudent = async () => {
  try {
    await studentStores.findOne(route.params.id);
    personalInformation.value = studentStores.student?.basicInformation;
    paternity.value = studentStores.student?.paternity;
    contacts.value = studentStores.student?.contacts;
    documents.value = studentStores.student?.documents;
    student.value = studentStores.student;
    invoices.value = studentStores.student?.invoices;
    enrollments.value = studentStores.student?.enrollments;
    studentPaymentTypes.value = studentStores.student?.studentPaymentTypes;
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  } finally {
    isLoading.value = false; // Desativar o carregamento
  }
};

const fetchPaymentTypes = async () => {
  try {
    await paymentStores.findPaymentTypes();
    paymentTypes.value = paymentStores.paymentTypes.filter(
      (payment) =>
        payment.name !== "Mensalidade" && payment.name !== "Matricula"
    );
  } catch (error) {
    notifyError("Ocorreu um erro ao carregar os tipos de pagamento");
  }
};

const handleModal = () => {
  medium.value = !medium.value;
};

onMounted(() => {
  fetchStudent();
  fetchPaymentTypes();
});
</script>

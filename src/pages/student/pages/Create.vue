<template>
  <q-page class="edigital-page">

    <!-- ── Top Bar ── -->
    <div class="page-topbar row items-center q-px-xl q-py-md">
      <q-btn flat round dense icon="arrow_back_ios_new" class="back-btn q-mr-md" @click="$router.back()">
        <q-tooltip>Voltar à lista</q-tooltip>
      </q-btn>

      <div class="col">
        <q-breadcrumbs class="breadcrumb-nav" active-color="primary" separator="›">
          <q-breadcrumbs-el label="Dashboard" icon="home" to="/" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Estudantes" icon="group" to="/students" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Perfil do Estudante" class="breadcrumb-active" />
        </q-breadcrumbs>
        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="person" size="1.3rem" color="white" />
          </div>
          <span>{{ personalInformation?.fullName || 'Novo Estudante' }}</span>
          <q-chip size="sm" color="blue-1" text-color="blue-9" class="q-ml-sm" dense>
            ID: {{ route.params.id }}
          </q-chip>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <q-btn flat round dense icon="refresh" color="grey-6" class="action-icon-btn" @click="fetchStudent">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
        <q-chip
          :color="actualEnrollment ? 'positive' : 'orange'"
          text-color="white"
          :icon="actualEnrollment ? 'check_circle' : 'warning_amber'"
          size="sm" dense
        >
          {{ actualEnrollment ? 'Matriculado' : 'Sem Matrícula Activa' }}
        </q-chip>
      </div>
    </div>

    <!-- ── Loading Skeleton ── -->
    <div v-if="isLoading" class="q-px-xl q-pt-lg">
      <div class="row q-col-gutter-md">
        <div class="col-12"><q-skeleton height="120px" class="rounded-xl" /></div>
        <div class="col-md-8"><q-skeleton height="300px" class="rounded-xl" /></div>
        <div class="col-md-4"><q-skeleton height="300px" class="rounded-xl" /></div>
      </div>
    </div>

    <div v-else class="q-px-xl q-pb-xl">

      <!-- ── Enrollment History ── -->
      <div class="section-block q-mb-lg">
        <div class="section-header-bar row items-center justify-between q-px-lg q-py-md">
          <div class="row items-center">
            <div class="section-icon-wrap q-mr-sm">
              <q-icon name="assignment" size="1rem" color="white" />
            </div>
            <div>
              <div class="section-title">Histórico de Matrículas</div>
              <div class="section-sub">{{ enrollments.length }} matrícula(s) registada(s)</div>
            </div>
          </div>
          <q-btn
            v-if="!actualEnrollment && authStore.hasCreateEnrrolment"
            unelevated no-caps
            icon="add"
            label="Nova Matrícula"
            class="new-btn"
            @click="handleNewEnrollment"
          />
        </div>
        <q-separator />
        <Tables :rows="enrollments" :columns="ColumnsEnrollments" class="no-shadow edigital-table" />
      </div>

      <!-- ── Main Content Grid ── -->
      <div class="row q-col-gutter-lg q-mb-lg">

        <!-- Left: Personal + Paternity -->
        <div class="col-12 col-md-8 q-gutter-y-lg">

          <!-- Personal Information -->
          <div class="section-block">
            <div class="section-header-bar row items-center q-px-lg q-py-md">
              <div class="section-icon-wrap q-mr-sm">
                <q-icon name="badge" size="1rem" color="white" />
              </div>
              <div>
                <div class="section-title">Informações Pessoais</div>
                <div class="section-sub">Dados de identificação do estudante</div>
              </div>
            </div>
            <q-separator />
            <PersonalInformationComponent
              ref="personalChild"
              :personalInformation="personalInformation"
            >
              <template #actions>
                <div class="section-actions row justify-end q-gutter-sm q-pa-md">
                  <q-btn label="Cancelar" color="grey-6" flat no-caps dense @click="toggleEditPersonalInfo" />
                  <q-btn label="Guardar Dados" color="positive" unelevated no-caps dense icon="save" @click="handleSavePersonal" />
                </div>
              </template>
            </PersonalInformationComponent>
          </div>

          <!-- Paternity -->
          <div class="section-block">
            <div class="section-header-bar row items-center q-px-lg q-py-md">
              <div class="section-icon-wrap q-mr-sm" style="background:linear-gradient(135deg,#7b1fa2,#4a148c)">
                <q-icon name="family_restroom" size="1rem" color="white" />
              </div>
              <div>
                <div class="section-title">Dados de Paternidade</div>
                <div class="section-sub">Informação dos encarregados de educação</div>
              </div>
            </div>
            <q-separator />
            <PaternityComponent ref="paternityChild" :paternity="paternity">
              <template #actions>
                <div class="section-actions row justify-end q-gutter-sm q-pa-md">
                  <q-btn label="Cancelar" color="grey-6" flat no-caps dense @click="toggleEditPaternity" />
                  <q-btn label="Guardar Paternidade" color="positive" unelevated no-caps dense icon="save" @click="handleSavePaternity" />
                </div>
              </template>
            </PaternityComponent>
          </div>

        </div>

        <!-- Right: Contacts + Documents -->
        <div class="col-12 col-md-4 q-gutter-y-lg">

          <!-- Contacts -->
          <div class="section-block">
            <div class="section-header-bar row items-center q-px-lg q-py-md">
              <div class="section-icon-wrap q-mr-sm" style="background:linear-gradient(135deg,#0288d1,#01579b)">
                <q-icon name="contacts" size="1rem" color="white" />
              </div>
              <div>
                <div class="section-title">Contactos</div>
                <div class="section-sub">Telefone e e-mail</div>
              </div>
            </div>
            <q-separator />
            <ContactComponent ref="contactChild" :contacts="contacts">
              <template #actions>
                <div class="section-actions row justify-end q-gutter-sm q-pa-md">
                  <q-btn label="Cancelar" color="grey-6" flat no-caps dense @click="toggleEditContact" />
                  <q-btn label="Guardar" color="positive" unelevated no-caps dense icon="save" @click="handleSaveContact" />
                </div>
              </template>
            </ContactComponent>
          </div>

          <!-- Documents -->
          <div class="section-block">
            <div class="section-header-bar row items-center q-px-lg q-py-md">
              <div class="section-icon-wrap q-mr-sm" style="background:linear-gradient(135deg,#f57c00,#e65100)">
                <q-icon name="folder_open" size="1rem" color="white" />
              </div>
              <div>
                <div class="section-title">Documentos</div>
                <div class="section-sub">BI, certidões e outros</div>
              </div>
            </div>
            <q-separator />
            <DocumentsComponent ref="documentChild" :documents="documents" :entity="entity">
              <template #actions>
                <div class="section-actions row justify-end q-gutter-sm q-pa-md">
                  <q-btn label="Cancelar" color="grey-6" flat no-caps dense @click="toggleEditDocument" />
                  <q-btn label="Guardar Documentos" color="positive" unelevated no-caps dense icon="save" @click="handleSaveDocument" />
                </div>
              </template>
            </DocumentsComponent>
          </div>

        </div>
      </div>

      <!-- ── Payment Types ── -->
      <div class="section-block">
        <div class="section-header-bar row items-center justify-between q-px-lg q-py-md">
          <div class="row items-center">
            <div class="section-icon-wrap q-mr-sm" style="background:linear-gradient(135deg,#21b573,#0d7040)">
              <q-icon name="payments" size="1rem" color="white" />
            </div>
            <div>
              <div class="section-title">
                {{ isEditing ? 'Adicionar Novo Tipo de Pagamento' : 'Configurações de Pagamentos Adicionais' }}
              </div>
              <div class="section-sub">{{ studentPaymentTypes.length }} tipo(s) de pagamento configurado(s)</div>
            </div>
          </div>
          <q-btn
            v-if="!isEditing"
            unelevated no-caps
            icon="add_card"
            label="Novo Tipo de Pagamento"
            class="new-btn new-btn-green"
            @click="handleNewPaymentType"
          />
          <q-btn
            v-else
            flat no-caps dense
            icon="close"
            label="Cancelar"
            color="grey-6"
            @click="handleNewPaymentType"
          />
        </div>

        <q-separator />

        <!-- Table -->
        <div v-if="!isEditing">
          <Tables :rows="studentPaymentTypes" :columns="ColumnsStudentPaymentType" class="no-shadow edigital-table">
            <template #actions="{ props }">
              <q-btn icon="print" class="tbl-btn tbl-btn-primary" flat round dense @click="printDocument(props)">
                <q-tooltip>Imprimir Recibo / Documento</q-tooltip>
              </q-btn>
            </template>
          </Tables>
        </div>

        <!-- Add Form -->
        <div v-else class="q-pa-lg">
          <q-form @submit="onSubmit" class="row q-col-gutter-md items-end">
            <q-select
              class="col-md-5 col-xs-12"
              label="Tipo de Serviço / Pagamento"
              v-model="payType.paymentTypeId"
              :options="paymentTypes"
              option-label="name"
              outlined dense
            >
              <template #prepend><q-icon name="category" color="primary" /></template>
            </q-select>

            <q-input
              class="col-md-4 col-xs-12"
              label="Valor a Pagar (MT)"
              type="number"
              v-model="payType.amount"
              outlined dense
              prefix="MT"
            >
              <template #prepend><q-icon name="attach_money" color="primary" /></template>
            </q-input>

            <div class="col-auto row q-gutter-sm">
              <q-btn label="Cancelar" color="grey-6" flat no-caps @click="handleNewPaymentType" />
              <q-btn
                label="Confirmar Registo"
                icon="check_circle"
                color="positive"
                unelevated no-caps
                type="submit"
                class="confirm-btn"
              />
            </div>
          </q-form>
        </div>

      </div>

    </div>
  </q-page>
</template>

<script setup>
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

/* ── Router & Stores ── */
const route = useRoute();
const router = useRouter();
const studentStores = useStudentStores();
const paymentStores = usePaymentStores();
const basicStores = useBasicStores();
const authStore = useAuthStore();
const { notifySuccess, notifyError } = useNotify();
const { getActiveClass } = scripts();

/* ── Data ── */
const isLoading = ref(true);
const personalInformation = ref(null);
const entity = ref("student");
const student = ref(null);
const paternity = ref(null);
const contacts = ref([]);
const documents = ref([]);
const enrollments = ref([]);
const paymentTypes = ref([]);
const studentPaymentTypes = ref([]);
const invoices = ref([]);
const isEditing = ref(false);
const payType = ref({ paymentTypeId: "", amount: "" });

/* ── Child Refs ── */
const personalChild = ref(null);
const paternityChild = ref(null);
const contactChild = ref(null);
const documentChild = ref(null);

/* ── Computed ── */
const actualEnrollment = computed(() => getActiveClass(enrollments.value));

/* ── Methods ── */
const handleSavePersonal = async () => {
  if (!studentStores.student?.basic_information) {
    try {
      await personalChild.value.saveChanges();
      const basicInformation = basicStores.basicInformation;
      await studentStores.update(route.params.id, { basicInformationId: basicInformation.id });
      notifySuccess("Informações Pessoais guardadas com sucesso!");
    } catch (error) {
      notifyError("Ocorreu um erro ao guardar Informações Pessoais.");
    }
  } else {
    try {
      await personalChild.value.saveChanges();
      notifySuccess("Informações Pessoais editadas com sucesso!");
    } catch (error) {
      notifyError("Ocorreu um erro ao editar Informações Pessoais.");
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
  const entityData = { owner: "student", id: route.params.id };
  contactChild.value.addContact(entityData);
  fetchStudent();
  toggleEditContact();
};

const handleSaveDocument = async () => {
  documentChild.value.toggleEdit();
};

const handleNewEnrollment = () => {
  router.push({ name: "create-enrollment", params: { studentId: route.params.id } });
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
    payType.value = { paymentTypeId: "", amount: "" };
  } catch (error) {
    notifyError("Erro ao criar tipo de pagamento.");
  }
};

const toggleEditPersonalInfo  = () => personalChild.value.toggleEdit();
const toggleEditPaternity     = () => paternityChild.value.toggleEdit();
const toggleEditContact       = () => contactChild.value.toggleEdit();
const toggleEditDocument      = () => documentChild.value.toggleEdit();
const handleNewPaymentType    = () => { isEditing.value = !isEditing.value; };

/* ── Fetch ── */
const fetchStudent = async () => {
  isLoading.value = true;
  try {
    await studentStores.findOne(route.params.id);
    const s = studentStores.student;
    personalInformation.value  = s?.basicInformation;
    paternity.value            = s?.paternity;
    contacts.value             = s?.contacts;
    documents.value            = s?.documents;
    student.value              = s;
    invoices.value             = s?.invoices;
    enrollments.value          = s?.enrollments;
    studentPaymentTypes.value  = s?.studentPaymentTypes;
  } catch (error) {
    notifyError("Erro ao carregar os dados do estudante.");
  } finally {
    isLoading.value = false;
  }
};

const fetchPaymentTypes = async () => {
  try {
    await paymentStores.findPaymentTypes();
    paymentTypes.value = paymentStores.paymentTypes.filter(
      p => p.name !== "Mensalidade" && p.name !== "Matricula"
    );
  } catch (error) {
    notifyError("Erro ao carregar os tipos de pagamento.");
  }
};

onMounted(() => {
  fetchStudent();
  fetchPaymentTypes();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

.edigital-page {
  min-height: 100vh;
  background: #f0f4f8;
  font-family: 'DM Sans', sans-serif;
}

/* ── Top Bar ── */
.page-topbar {
  background: #ffffff;
  border-bottom: 1px solid #e8edf3;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 12px rgba(15,40,98,0.06);
}
.back-btn {
  background: #f0f4f8;
  color: #1a3fa6 !important;
  border-radius: 10px;
  width: 36px; height: 36px;
  transition: background 0.2s;
}
.back-btn:hover { background: #e0e8f7; }

.breadcrumb-nav { font-size: 0.78rem; }
.breadcrumb-link { color: #9ca3af !important; }
.breadcrumb-active { color: #1a3fa6 !important; font-weight: 600; }

.page-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f2862;
}
.title-icon-wrap {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.action-icon-btn {
  background: #f0f4f8;
  border-radius: 10px;
  width: 36px; height: 36px;
  transition: background 0.2s;
}
.action-icon-btn:hover { background: #e0e8f7; }

/* ── Section Blocks ── */
.section-block {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(15,40,98,0.07);
  border: 1px solid #edf0f5;
  margin-top: 1.2rem;
}
.section-block:first-child { margin-top: 1.2rem; }

.section-header-bar {
  background: #fafbfd;
  border-bottom: 1px solid #f0f0f0;
}
.section-icon-wrap {
  width: 30px; height: 30px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.section-title {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 0.92rem;
  color: #0f2862;
}
.section-sub { font-size: 0.74rem; color: #9ca3af; }

.section-actions {
  border-top: 1px solid #f0f4f8;
  background: #fafbfd;
}

/* ── Buttons ── */
.new-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white;
  border-radius: 10px;
  padding: 0 16px;
  height: 36px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  transition: box-shadow 0.2s, transform 0.15s;
}
.new-btn:hover {
  box-shadow: 0 6px 18px rgba(26,63,166,0.3);
  transform: translateY(-1px);
}
.new-btn-green {
  background: linear-gradient(135deg, #21b573 0%, #0d7040 100%) !important;
}
.new-btn-green:hover {
  box-shadow: 0 6px 18px rgba(33,181,115,0.3) !important;
}

.confirm-btn {
  border-radius: 10px;
  padding: 0 16px;
  height: 38px;
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
}

/* ── Table overrides ── */
.edigital-table :deep(thead tr th) {
  font-family: 'Sora', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  background: #fafbfd;
  border-bottom: 2px solid #edf0f5;
  padding: 12px 16px;
}
.edigital-table :deep(tbody tr:hover) { background: #f5f8ff !important; }
.edigital-table :deep(tbody tr td) {
  font-size: 0.875rem;
  color: #374151;
  padding: 11px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.tbl-btn { border-radius: 8px !important; width: 30px; height: 30px; }
.tbl-btn-primary { color: #1a3fa6 !important; }
.tbl-btn-primary:hover { background: #e8f0fe !important; }

/* ── Skeleton ── */
.rounded-xl { border-radius: 16px !important; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
  .section-block { margin-top: 1rem; }
}
</style>

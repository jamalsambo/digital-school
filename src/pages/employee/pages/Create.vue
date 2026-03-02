<template>
  <q-page class="edigital-page">

    <!-- ── Top Bar ── -->
    <div class="page-topbar row items-center q-px-xl q-py-md">
      <q-btn flat round dense icon="arrow_back_ios_new"
             class="back-btn q-mr-md"
             @click="$router.back()" />

      <div class="col">
        <q-breadcrumbs class="breadcrumb-nav" separator="›">
          <q-breadcrumbs-el label="Dashboard" icon="home" to="/" />
          <q-breadcrumbs-el label="Funcionários" to="/employees" />
          <q-breadcrumbs-el label="Registro do Funcionário" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="badge" size="1.2rem" color="white" />
          </div>
          <span>
            {{ personalInformation?.fullName || 'Novo Funcionário' }}
          </span>
        </div>
      </div>
    </div>

    <!-- ── Conteúdo ── -->
    <div class="q-px-xl q-pb-xl">

      <!-- Dados Pessoais -->
      <div class="section-block">
        <div class="section-header-bar row items-center q-px-lg q-py-md">
          <div class="section-icon-wrap q-mr-sm">
            <q-icon name="person" size="1rem" color="white" />
          </div>
          <div>
            <div class="section-title">Informações Pessoais</div>
            <div class="section-sub">Dados de identificação do funcionário</div>
          </div>
        </div>
        <q-separator />

        <PersonalInformationComponent
          ref="personalChild"
          :personalInformation="personalInformation"
        >
          <template #actions>
            <div class="section-actions row justify-end q-gutter-sm q-pa-md">
              <q-btn label="Cancelar"
                     flat dense no-caps
                     color="grey-6"
                     @click="toggleEditPersonalInfo" />

              <q-btn label="Guardar"
                     icon="save"
                     class="new-btn"
                     unelevated
                     no-caps
                     @click="handleSavePersonal" />
            </div>
          </template>
        </PersonalInformationComponent>
      </div>

      <!-- Contactos -->
      <div class="section-block">
        <div class="section-header-bar row items-center q-px-lg q-py-md">
          <div class="section-icon-wrap q-mr-sm"
               style="background:linear-gradient(135deg,#0288d1,#01579b)">
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
              <q-btn label="Cancelar"
                     flat dense no-caps
                     color="grey-6"
                     @click="toggleEditContact" />

              <q-btn label="Guardar"
                     icon="save"
                     class="new-btn"
                     unelevated
                     no-caps
                     @click="handleSaveContact" />
            </div>
          </template>
        </ContactComponent>
      </div>

      <!-- Informação Adicional -->
      <div class="section-block">
        <div class="section-header-bar row items-center q-px-lg q-py-md">
          <div class="section-icon-wrap q-mr-sm"
               style="background:linear-gradient(135deg,#7b1fa2,#4a148c)">
            <q-icon name="info" size="1rem" color="white" />
          </div>
          <div>
            <div class="section-title">Informação Adicional</div>
            <div class="section-sub">Configuração de perfil profissional</div>
          </div>
        </div>
        <q-separator />

        <div class="q-pa-lg">
          <div class="row items-center">
            <span class="text-weight-medium">É professor?</span>
            <q-toggle
              v-model="isProfessor"
              class="q-ml-md"
              color="primary"
              :label="yesOrNo"
              @update:model-value="onToggleChange"
            />
          </div>
        </div>
      </div>

      <!-- Turmas Responsável -->
      <div class="section-block">
        <div class="section-header-bar row items-center q-px-lg q-py-md">
          <div class="section-icon-wrap q-mr-sm"
               style="background:linear-gradient(135deg,#21b573,#0d7040)">
            <q-icon name="school" size="1rem" color="white" />
          </div>
          <div>
            <div class="section-title">Turmas Responsável</div>
            <div class="section-sub">
              {{ classLeader.length }} turma(s) atribuída(s)
            </div>
          </div>
        </div>
        <q-separator />

        <div class="q-pa-lg">
          <q-list bordered separator>
            <q-item v-for="(item, index) in classLeader" :key="index">
              <q-item-section>
                <div class="text-weight-medium">
                  {{ item?.type }}
                </div>
                <div class="text-caption text-grey-6">
                  {{ item?.number }}
                </div>
              </q-item-section>

              <q-item-section side>
                <q-btn flat dense round icon="delete"
                       color="negative"
                       @click="removeContact(item)" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import useNotify from "src/composables/UseNotify";
import { useEmployeeStores } from "../stores";
import { useBasicStores } from "src/components/register/personal_information/store";
import PersonalInformationComponent from "src/components/register/personal_information/view.vue";
import ContactComponent from "src/components/register/contact/View.vue";

/* 🔹 Setup stores */
const route = useRoute();
const employeeStores = useEmployeeStores();
const basicStores = useBasicStores();

const { notifyError, notifySuccess } = useNotify();

/* 🔹 Estados Reativos */
const isLoading = ref(true);
const viewEmployeeClass = ref(false);
const personalInformation = ref(null);
const contacts = ref([]);
const classLeader = ref([]);
const employee = ref();
const entity = ref("employee");


/* 🔹 Computed */
const isProfessor = computed(() => employeeStores.employee?.teacher === "Sim");
const yesOrNo = computed(() => employeeStores.employee?.teacher);

/* 🔹 Refs para Componentes Filhos */
const personalChild = ref(null);
const contactChild = ref(null);

/* 🔹 Função para buscar os dados do funcionário */
const fetchEmployee = async () => {
  try {
    await employeeStores.findOne(route.params.id);
    employee.value = employeeStores.employee;
    personalInformation.value = employeeStores.employee?.basicInformation;
    contacts.value = employeeStores.employee?.contacts;
    classLeader.value = employeeStores.employee?.classLeader || [];
  } catch (error) {
    console.log(error)
    notifyError("Ocorreu um erro ao carregar os dados do funcionário.");
  } finally {
    isLoading.value = false;
  }
};
/* 🔹 Métodos para Salvar */
const handleSavePersonal = async () => {
  try {
    await personalChild.value.saveChanges();
    if (!employeeStores.employee?.basicInformation) {
      const basicInformation = basicStores.basicInformation;
      await employeeStores.update(route.params.id, {
        basicInformationId: basicInformation.id,
      });
    }
    notifySuccess("Informações Pessoais salvas com sucesso!");
  } catch (error) {
    notifyError("Ocorreu um erro ao salvar Informações Pessoais.");
  }
  fetchEmployee();
  toggleEditPersonalInfo();
};

const handleSaveContact = async () => {
  contactChild.value.addContact({ owner: "employee", id: route.params.id });
  fetchEmployee();
  toggleEditContact();
};

/* 🔹 Métodos para Alternar Estado */
const toggleEditPersonalInfo = () => personalChild.value.toggleEdit();
const toggleEditContact = () => contactChild.value.toggleEdit();
const toggleEdit = () => (viewEmployeeClass.value = !viewEmployeeClass.value);

const onToggleChange = async (newValue) => {
  try {
    await employeeStores.update(route.params.id, {
      teacher: newValue ? "Sim" : "Nao",
    });
  } catch (error) {
    notifyError(error);
  }
};


/* 🔹 Lifecycle Hook */
onMounted(async () => {
  await fetchEmployee();
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

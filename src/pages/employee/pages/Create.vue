<template>
  <q-page padding>
    <q-card-section>
      <div class="text-h6 text-center">Registro do Funcionario</div>
    </q-card-section>
    <!-- Sessão de Dados Pessoais -->
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

    <!-- Sessão de Informações Adicionais -->
    <q-card flat bordered class="q-mb-md">
      <q-card flat bordered class="q-pa-md shadow-2">
        <div class="row items-center justify-between">
          <div class="text-h6 text-primary">Informacao adicional</div>
        </div>
        <div>
          <label>É professor?</label>
          <q-toggle
            v-model="isProfessor"
            class="q-ml-md"
            color="primary"
            :label="yesOrNo"
            @update:model-value="onToggleChange"
          />
        </div>
      </q-card>
    </q-card>

    <!-- Sessão de Informações Adicionais -->
    <q-card flat bordered class="q-mb-md">
      <q-card flat bordered class="q-pa-md shadow-2">
        <div class="row items-center justify-between">
          <div class="text-h6 text-primary">Turmas responsavel</div>
        </div>
        <q-separator spaced />
        <div class="q-pt-sm">
          <div v-if="!viewEmployeeClass" class="q-mb-md">
            <q-list bordered>
              <q-item v-for="(item, index) in classLeader" :key="index">
                <q-item-section>
                  <div>
                    <span class="text-weight-bold"
                      >Contato {{ item?.type }}</span
                    >: {{ item?.number }}
                  </div>
                </q-item-section>
                <q-item-section>
                  <div>
                    <span class="text-weight-bold">Proprietário</span>:
                    {{ item.owner }}
                  </div>
                </q-item-section>
                <q-item-section
                  side
                  v-if="
                    item?.type === 'Principal' && item?.owner === 'Encarregado'
                  "
                >
                  <q-btn
                    flat
                    dense
                    round
                    icon="person"
                    color="negative"
                    @click="createUser(item)"
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    dense
                    round
                    icon="delete"
                    color="negative"
                    @click="removeContact(item)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card>
    </q-card>
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


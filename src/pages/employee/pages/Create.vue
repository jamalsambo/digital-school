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
                  <span class="text-weight-bold">Contato {{ item?.type }}</span
                  >: {{ item?.number }}
                </div>
              </q-item-section>
              <q-item-section>
                <div>
                  <span class="text-weight-bold">Proprietário</span>:
                  {{ item.owner }}
                </div>
              </q-item-section>
              <q-item-section side v-if="item?.type === 'Principal' && item?.owner === 'Encarregado'">
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
    <!-- Sessão de configuracoes de acesso -->
    <q-card flat bordered class="q-mb-md">
      <q-card flat bordered class="q-pa-md shadow-2">
        <div class="row items-center justify-between">
          <div class="text-h6 text-primary">Configurações de acesso</div>
        </div>
        <q-separator spaced />
        <div class="q-gutter-y-md">
          <q-card>
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="mails" label="Usuario" />
              <q-tab name="alarms" label="Funções" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="mails">
                <UserComponent ref="userChild"
                :data="employee"
                :entity="entity"
                :userTypeId="'4d90c961-05f6-4963-a94c-dad53cc360a7'">
                  <template #actions>
                    <div class="row justify-end q-gutter-sm">
                      <q-btn
                        label="Guardar"
                        color="positive"
                        icon="save"
                        type="submit"
                        flat
                      />
                    </div>
                  </template>
                </UserComponent>
              </q-tab-panel>

              <q-tab-panel name="alarms">
                <div class="text-h6">Alarms</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
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
import UserComponent from "src/components/register/user/View.vue";

// Acessos aos stores e router
const route = useRoute();
const employeeStores = useEmployeeStores();
const basicStores = useBasicStores();
const { notifyError, notifySuccess } = useNotify();
const { id } = route.params;

// Referências e variáveis reativas
const isLoading = ref(true);
const viewEmployeeClass = ref(false);
const personalInformation = ref(
  employeeStores.employee?.basicInformation || null
);
const contacts = ref(employeeStores.employee?.contacts || []);
const classLeader = ref([])
const isProfessor = computed(() =>
  employeeStores.employee.teacher === "Sim" ? true : false
);
const employee = ref()
const entity = ref("employee");
const yesOrNo = computed(() => employeeStores.employee.teacher);
const tab = ref("mails");

const personalChild = ref(null);
const contactChild = ref(null);

// Methods
const handleSavePersonal = async () => {
  if (!employeeStores.employee?.basicInformation) {
    // create a new
    try {
      await personalChild.value.saveChanges();
      const basicInformation = basicStores.basicInformation;
      await employeeStores.update(route.params.id, {
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

  fetchEmployee();
  toggleEditPersonalInfo();
};
const onToggleChange = async (newValue) => {
  try {
    if (newValue) {
      await employeeStores.update(id, { teacher: "Sim" });
      yesOrNo.value = "Sim";
    } else {
      await employeeStores.update(id, { teacher: "Nao" });
      yesOrNo.value = "Não";
    }
  } catch (error) {
    notifyError(error);
  }
};
const fetchEmployee = async () => {
  try {
    await employeeStores.findOne(id);
    employee.value = employeeStores.employee;
    personalInformation.value = employeeStores.employee?.basicInformation;
    contacts.value = employeeStores.employee?.contacts;
    classLeader.value = employeeStores.employee?.classLeader || [];
  } catch (error) {
    notifyError("Ocorreu um erro ao carregar os dados do funcionário.");
  } finally {
    isLoading.value = false; // Desativar o carregamento
  }
};
const handleSaveContact = async () => {
  const entity = { owner: "employee", id: id };
  contactChild.value.addContact(entity);
  fetchEmployee();
  toggleEditContact();
};
const toggleEditPersonalInfo = () => {
  personalChild.value.toggleEdit();
};
const toggleEditContact = () => {
  contactChild.value.toggleEdit();
};
const toggleEdit = () => {
  viewEmployeeClass.value =!viewEmployeeClass.value;
}

onMounted(() => {
  fetchEmployee();
});
</script>

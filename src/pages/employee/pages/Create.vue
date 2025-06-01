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
                <UserComponent
                  ref="userChild"
                  :data="employee"
                  :entity="entity"
                  :userTypeId="employeeTypeID"
                >
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
                <q-select
                  outlined
                  v-model="selected"
                  multiple
                  :options="options"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  use-chips
                  stack-label
                  label="Permissões"
                >
                  <template v-slot:selected-item="scope">
                    <q-chip @remove="removeSelection(scope.opt.value)">
                      {{ scope.opt.label }}
                    </q-chip>
                  </template>

                  <template v-slot:option="scope">
                    <q-item
                      clickable
                      v-ripple
                      @click="toggleSelection(scope.opt)"
                    >
                      <q-item-section>
                        <q-item-label>
                          <strong v-if="scope.opt.isGroup">{{
                            scope.opt.label
                          }}</strong>
                          <span v-else>{{ scope.opt.label }}</span>
                        </q-item-label>
                      </q-item-section>

                      <q-item-section side>
                        <q-icon v-if="isSelected(scope.opt)" name="check" />
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
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
import { useAuthStore } from "src/pages/auth/store";
import { useUserStores } from "src/pages/user/store";
import ContactComponent from "src/components/register/contact/View.vue";
import UserComponent from "src/components/register/user/View.vue";
const employeeTypeID = import.meta.env.VITE_EMPLOYEE_ID;
/* 🔹 Setup stores */
const route = useRoute();
const employeeStores = useEmployeeStores();
const basicStores = useBasicStores();
const authStore = useAuthStore();
const userStores = useUserStores();
const { notifyError, notifySuccess } = useNotify();

/* 🔹 Estados Reativos */
const isLoading = ref(true);
const viewEmployeeClass = ref(false);
const personalInformation = ref(null);
const contacts = ref([]);
const classLeader = ref([]);
const employee = ref();
const entity = ref("employee");
const tab = ref("mails");
const selected = ref([]);
const userPermissions = ref([]);
const permissions = ref([]);

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
    userPermissions.value = employeeStores.employee.user?.permissionsItems;
    permissions.value = employeeStores.employee.institution?.plan?.permissions;
  } catch (error) {
    console.log(error)
    notifyError("Ocorreu um erro ao carregar os dados do funcionário.");
  } finally {
    isLoading.value = false;
  }
};

/* 🔹 Manipulação de Seleção de Permissões */
const toggleSelection = async (option) => {
  if (option.isGroup) {
    const groupItems = options.value
      .filter((item) => item.group === option.value)
      .map((item) => item.value);

    const allSelected = groupItems.every((item) =>
      selected.value.includes(item)
    );

    selected.value = allSelected
      ? selected.value.filter((item) => !groupItems.includes(item))
      : [...new Set([...selected.value, ...groupItems])];
  } else {
    if (selected.value.includes(option.value)) {
      await userStores.removePermissions(route.params.id, option.id);
      selected.value = selected.value.filter((item) => item !== option.value);
    } else {
      await userStores.addPermissions(route.params.id, {
        permissionItemId: option.id,
      });
      selected.value.push(option.value);
    }
  }
};

const isSelected = (option) => {
  if (option.isGroup) {
    const groupItems = options.value
      .filter((item) => item.group === option.value)
      .map((item) => item.value);

    return groupItems.every((item) => selected.value.includes(item));
  }
  return selected.value.includes(option.value);
};

const removeSelection = (value) => {
  selected.value = selected.value.filter((item) => item !== value);
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

/* 🔹 Computed para Transformar Dados */
const options = computed(() =>
  permissions.value.flatMap((module) => [
    { label: module.name, value: module.key, isGroup: true },
    ...module.items.map((item) => ({
      label: item.name,
      value: item.key,
      group: module.key,
      id: item.id,
    })),
  ])
);

/* 🔹 Lifecycle Hook */
onMounted(async () => {
  await fetchEmployee();
  selected.value = userPermissions?.value?.map((up) => up.key);
});
</script>


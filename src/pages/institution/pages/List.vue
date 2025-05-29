<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="text-grey-8 no-shadow" bordered>
          <q-card-section class="q-pa-none">
            {{userStores.isSuper}}
            <Tables :columns="columns" :rows="institutions">
              <template #new>
                <q-btn
                  color="primary"
                  icon="add"
                  label="Adicionar"
                  no-caps
                  @click="createInstitution"
                  class="q-ml-sm"
                  v-if="userStores.user.userType?.name === 'Super'"
                />
              </template>

              <template #actions="{ props }">
                <q-btn
                 v-if="userStores.user.userType?.name === 'Super'"
                  flat
                  round
                  icon="settings"
                  color="secondary"
                  @click="settingsInstitution(props.row)"
                >
                  <q-tooltip> Configurar instituição</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="props.row.status === 'Activo' && userStores.hasEditInstitution"
                  flat
                  round
                  icon="edit"
                  color="primary"
                  @click="editInstitution(props.row)"
                >
                  <q-tooltip> Editar de instituição </q-tooltip>
                </q-btn>

                <q-btn
                   v-if="userStores.user.userType?.name === 'Super'"
                  flat
                  round
                  icon="delete"
                  color="negative"
                  @click="deleteInstitution(props.row)"
                >
                  <q-tooltip> Deletar instituição </q-tooltip>
                </q-btn>

                <q-btn
                  v-if="!props.row.parentId && userStores.user.userType?.name === 'Super'"
                  flat
                  round
                  icon="escalator_warning"
                  color="primary"
                  @click="createSucursal(props.row)"
                >
                  <q-tooltip> Criar sucursal </q-tooltip>
                </q-btn>

                <q-btn
                v-if="userStores.hasSettingsSiteInstitution || userStores.user.userType?.name === 'Super'"
                  flat
                  round
                  icon="language"
                  color="primary"
                  @click="handleSettingsSite(props.row)"
                >
                  <q-tooltip> Configurar o site </q-tooltip>
                </q-btn>
                <q-btn
                 v-if="userStores.hasCreateEmployees  || userStores.user.userType?.name === 'Super'"
                  flat
                  round
                  icon="person"
                  color="primary"
                  @click="createEmployee(props.row)"
                >
                  <q-tooltip> Criar usuario </q-tooltip>
                </q-btn>
              </template>
            </Tables>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useInstitutionStores } from "../store";
import { useAuthStore } from "src/pages/auth/store";
import { useUserStores } from "src/pages/user/store";
import useNotify from "src/composables/UseNotify";
import Tables from "src/components/Tables.vue";
import columns from "../components/InstitutionColumns";
import { useEmployeeStores } from "src/pages/employee/stores";

/* setup router */
const router = useRouter();

/* setup store */
const institutuinStores = useInstitutionStores();
const authStore = useAuthStore();
const employeeStores = useEmployeeStores();
const userStores = useUserStores();
const { notifyError, notifySuccess } = useNotify();

/* setup data */
const { institutionId } = authStore.user
const institutions = ref([]);

/* methods */
const createInstitution = () => {
  router.push({ name: "create-institution" });
};

const editInstitution = (institution) => {
  router.push({
    name: "edit-institution",
    params: { institutionId: institution.id },
  });
};

const createSucursal = async (institution) => {
  router.push({
    name: "create-branch",
    params: { parent: institution.id },
    state: { name: institution.name },
  });
};

const deleteInstitution = async (institution) => {
  try {
    await institutuinStores.update(institution.id, { status: "Desactivo" });
    notifySuccess(`Instituição "${institution.name}" excluída com sucesso!`);
    fetchInstitutions();
  } catch (error) {
    notifyError("Erro ao excluir instituição.");
  }
};

const createEmployee = async (institution) => {
  try {
    await employeeStores.create({institutionId: institution.id, teacher: 'Sim'});
    router.push({
      name: "create-employee",
      params: { id: employeeStores.employee.id, created: "create" },
    });
  } catch (error) {
    notifyError("Erro ao criar funcionario");
  }
};

const settingsInstitution = (institution) => {
  router.push({
    name: "settings-institution",
    params: { institutionId: institution.id },
  });
};

const handleSettingsSite = (row) => {
  router.push({
    name: "settings-site",
    params: { id: row.id },
  });
};

/* fetch data */
const fetchInstitutions = async () => {
  try {
    if (userStores.isSuper) {
    await institutuinStores.list();
    institutions.value = institutuinStores.institutions;
    }else {
      await institutuinStores.list({institutionId:institutionId});
      institutions.value = institutuinStores.institutions;
    }
  } catch (error) {
    notifyError("Erro ao carregar Instituições");
  }
};

onMounted(async () => {
  await fetchInstitutions();
});
</script>

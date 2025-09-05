<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="text-grey-8 no-shadow" bordered>
          <q-card-section class="q-pa-none">
            <q-table
              class="no-shadow"
              :rows="employees"
              title="Funcionarios"
              :columns="columns"
              row-key="id"
              :filter="filter"
              v-model:pagination="pagination"
            >
              <template v-slot:top-right="">
                <q-input
                  borderless
                  dense
                  debounce="300"
                  v-model="filter"
                  placeholder="Pesquisar"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>

                <q-btn
                  color="primary"
                  icon="add"
                  label="Adicionar"
                  no-caps
                  class="q-ml-sm"
                  @click="addEmployee"
                />
              </template>

              <template v-slot:body-cell-actions="props">
                <q-btn
                  flat
                  round
                  icon="edit"
                  @click="editEmployee(props.row)"
                  color="primary"
                  title="Editar Funcionario"
                  dense
                />
                <q-btn
                  flat
                  round
                  icon="manage_accounts"
                  @click="addUser(props.row)"
                  color="primary"
                  title="Configurar Acesso"
                />
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEmployeeStores } from "../stores";
import { useAuthStore } from "src/pages/auth/store";
import { useUserStores } from "src/pages/user/store";
import columns from "src/pages/employee/components/ColumnsEmployeesList";
import useNotify from "src/composables/UseNotify";
const employeeTypeID = import.meta.env.VITE_EMPLOYEE_ID;

/* use stores */
const route = useRoute();

// Referências e variáveis reativas
const filter = ref("");
const pagination = ref({
  rowsPerPage: 10,
});
const employees = ref([]);
const userStores = useUserStores();

// Acessos aos stores e router
const router = useRouter();
const employeeStores = useEmployeeStores();
const authStores = useAuthStore();
const { institutionId } = authStores.user;
const { notifyError } = useNotify();

// Funções
const addEmployee = async () => {
  await employeeStores.create({ institutionId: institutionId });
  router.push({
    name: "create-employee",
    params: { id: employeeStores.employee.id, created: "create" },
  });
};

const editEmployee = async (employee) => {
  router.push({
    name: "create-employee",
    params: { id: employee.id, created: "edit" },
  });
};

const addUser = async (employee) => {
  if (employee.userId) {
     router.push({
      name: "manage-account",
      params: { userId: employee.userId },
    });
  } else {
   await userStores.create({
        displayName: employee.basicInformation?.fullName,
        username: employee.number,
        password: '1234',
        userTypeId: employeeTypeID,
        institutionId: employee?.institutionId
   })
   await employeeStores.update(employee.id, {userId: userStores.user.id})
    router.push({
      name: "manage-account",
      params: { userId: userStores.user.id },
    });
  }
};
// Função para buscar os planos curriculares
const fetchEmployees = async () => {
  try {
    if (route.params.institutionId) {
      await employeeStores.list(route.params.institutionId);
    } else {
      await employeeStores.list(institutionId);
    }
    employees.value = employeeStores.employees;
  } catch (error) {
    notifyError("Falha ao carregar os funcionarios.");
  }
};

onMounted(() => {
  fetchEmployees();
});
</script>

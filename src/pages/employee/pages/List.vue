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
                />
                <q-btn
                  flat
                  round
                  icon="cast_for_education"
                  @click="addTeachings(props.row)"
                  color="primary"
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
import { useRouter } from "vue-router";
import { useEmployeeStores } from "../stores";
import { useAuthStore } from "src/pages/auth/store";
import columns from "src/pages/employee/components/ColumnsEmployeesList";
import useNotify from "src/composables/UseNotify";

// Referências e variáveis reativas
const filter = ref("");
const pagination = ref({
  rowsPerPage: 10,
});
const employees = ref([]);

// Acessos aos stores e router
const router = useRouter();
const employeeStores = useEmployeeStores();
const authStores = useAuthStore();
const { notifyError } = useNotify();

// Funções
const addEmployee = async () => {
  const {institutionId} = authStores.user
  await employeeStores.create({institutionId: institutionId});
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

const addTeachings = async (employee) => {
  router.push({
    name: "employee-teachings",
    params: { id: employee.id },
  });
};
// Função para buscar os planos curriculares
const fetchEmployees = async () => {
  try {

    await employeeStores.list();
    employees.value = employeeStores.employees;
  } catch (error) {
    notifyError("Falha ao carregar os funcionarios.");
  }
};

onMounted(() => {
  fetchEmployees();
});
</script>

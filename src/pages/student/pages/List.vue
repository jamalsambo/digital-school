<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="text-grey-8 no-shadow" bordered>
          <q-card-section class="q-pa-none">
            <q-table
              class="no-shadow"
              :rows="students"
              title="Estudantes"
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
                  @click="addStudents"
                v-if="authStore.hasCreateStudents"
                />
              </template>

              <template v-slot:body-cell-actions="props">
                <q-btn
                  flat
                  round
                  icon="info"
                  @click="editStudent(props.row)"
                  color="primary"
                  dense
                />
                <q-btn
                  flat
                  round
                  icon="manage_accounts"
                  @click="addUser(props.row)"
                  color="primary"
                  title="Configurar Acesso"
                  dense
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
import { useStudentStores } from "src/pages/student/store";
import { useAuthStore } from "src/pages/auth/store";
import { useUserStores } from "src/pages/user/store";
import columns from "src/pages/student/components/ColumnsStudentsList";
import useNotify from "src/composables/UseNotify";
import { computed } from "vue";

// Referências e variáveis reativas
const filter = ref("");
const pagination = ref({
  rowsPerPage: 10,
});
const students = ref([]);

// Acessos aos stores e router
const router = useRouter();
const authStore = useAuthStore()
const studentStores = useStudentStores();
const userStores = useUserStores()
const { notifyInfo, notifyError } = useNotify();
const studentTypeID = import.meta.env.VITE_STUDENT_ID;

// Funções
const addStudents = async () => {
  await studentStores.create();
  router.push({
    name: "student-space",
    params: { id: studentStores.student.id, created: "create" },
  });
};

const editStudent = async (student) => {
  router.push({
    name: "student-space",
    params: { id: student.id, created: "edit" },
  });
};

const addUser = async (student) => {
  if (student.userId) {
     router.push({
      name: "manage-account",
      params: { userId: student.userId },
    });
  } else {
   await userStores.create({
        displayName: student.basicInformation?.fullName,
        username: student.number,
        password: '1234',
        userTypeId: studentTypeID,
        institutionId: student?.institutionId
   })
   await studentStores.update(student.id, {userId: userStores.user.id})
    router.push({
      name: "manage-account",
      params: { userId: userStores.user.id },
    });
  }
};
// Função para buscar os planos curriculares
const fetchStudents = async () => {
  try {
    await studentStores.list();
    students.value = studentStores.students;
  } catch (error) {
    notifyError("Falha ao carregar os estudantes.");
  }
};

onMounted(() => {
  fetchStudents();
});
</script>


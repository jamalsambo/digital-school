<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStudentStores } from "src/pages/student/store";
import columns from "src/pages/student/components/ColumnsStudentsList";
import useNotify from "src/composables/UseNotify";

// Referências e variáveis reativas
const filter = ref("");
const pagination = ref({
  rowsPerPage: 10,
});
const students = ref([]);

// Acessos aos stores e router
const router = useRouter();
const studentStores = useStudentStores();
const { notifyInfo, notifyError } = useNotify();

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
                />
              </template>

              <template v-slot:body-cell-actions="props">
                <q-btn
                  flat
                  round
                  icon="info"
                  @click="editStudent(props.row)"
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

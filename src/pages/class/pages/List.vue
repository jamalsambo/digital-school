<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="text-grey-8 no-shadow" bordered>
          <q-card-section class="q-pa-none">
            <q-table
              class="no-shadow"
              :rows="classes"
              title="Turmas"
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
                  @click="addClass"
                  class="q-ml-sm"
                />
              </template>

              <template v-slot:body-cell-actions="props">
                <q-btn
                  flat
                  round
                  icon="edit"
                  color="primary"
                  @click="editClass(props.row)"
                />
                <q-btn
                  flat
                  round
                  icon="delete"
                  color="negative"
                  @click="deleteClass(props.row)"
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
import { useClassStores } from "src/pages/class/store";
import useNotify from "src/composables/UseNotify";

const filter = ref("");
const router = useRouter();
const pagination = ref({
  rowsPerPage: 10,
});

const classStores = useClassStores();
const {notifyError, notifySuccess} = useNotify()
const classes = ref([]);

const columns = [
  { name: "name", align: "left", label: "Nome", field: "name", sortable: true },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

const fetchClasses = async () => {
  try {
    await classStores.list();
    classes.value = classStores.classes;
  } catch (error) {
    console.error("Erro ao buscar Turmas:", error);
  }
};

const addClass = () => {
  router.push({name: "class-create"});
};

const editClass = (classe) => {
  console.log(classe)
};

const deleteClass = async (classs) => {
  try {
    await classStores.delete(classs.id);
    notifySuccess( `Turma "${classs.name}" excluída com sucesso!`)
    fetchCourses();
  } catch (error) {
    notifyError("Erro ao excluir Turma.",)
  }
};

onMounted(() => {
  fetchClasses();
});
</script>

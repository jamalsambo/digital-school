<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="text-grey-8 no-shadow" bordered>
          <q-card-section class="q-pa-none">
            <q-table
              class="no-shadow"
              :rows="disciplines"
              title="Disciplinas"
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
                  @click="addDiscipline"
                  class="q-ml-sm"
                />
              </template>

              <template v-slot:body-cell-actions="props">
                <q-btn
                  flat
                  round
                  icon="edit"
                  color="primary"
                  @click="editDiscipline(props.row)"
                />
                <q-btn
                  flat
                  round
                  icon="delete"
                  color="negative"
                  @click="deleteDiscipline(props.row)"
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
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useDisciplineStores } from "src/pages/discipline/store";

const $q = useQuasar();
const filter = ref("");
const router = useRouter();
const pagination = ref({
  rowsPerPage: 10,
});

const disciplineStores = useDisciplineStores();
const disciplines = ref([]);

const columns = [
  { name: "name", align: "left", label: "Nome", field: "name", sortable: true },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

const fetchDiscipline = async () => {

  try {
    await disciplineStores.list();
    disciplines.value = disciplineStores.disciplines;
  } catch (error) {
    console.error("Erro ao buscar disciplinas:", error);
  }
};

const addDiscipline = () => {
  router.push({ name: "discipline-create" });
};

const editDiscipline = (discipline) => {
  $q.notify({
    message: `Editando: ${discipline.name}`,
    color: "info",
  });
};

const deleteDiscipline = async (discipline) => {
  try {
    await disciplineStores.delete(discipline.id);
    $q.notify({
      message: `Disciplina "${discipline.name}" excluída com sucesso!`,
      color: "positive",
    });
    fetchCourses();
  } catch (error) {
    console.error("Erro ao excluir Discipline:", error);
    $q.notify({
      message: "Erro ao excluir Discipline.",
      color: "negative",
    });
  }
};

onMounted(() => {
  fetchDiscipline();
});
</script>

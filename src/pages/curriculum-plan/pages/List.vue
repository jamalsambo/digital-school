<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCurriculumPlanStores } from "src/pages/curriculum-plan/store";
import { useDisciplineStores } from "src/pages/discipline/store";
import { columns } from "src/pages/curriculum-plan/components/Columns";
import ModalDisciplines from "src/pages/curriculum-plan/components/ModalDisciplines.vue";
import useNotify from "src/composables/UseNotify";

// Referências e variáveis reativas
const filter = ref("");
const allDisciplines = ref([]);
const curriculumSelectDisciplines = ref([]);
const modalDisciplinesRef = ref(null);
const pagination = ref({
  rowsPerPage: 10,
});
const curriculumPlans = ref([]);

// Acessos aos stores e router
const router = useRouter();
const curriculumPlanStores = useCurriculumPlanStores();
const disciplineStores = useDisciplineStores();
const { notifyInfo, notifyError } = useNotify();

// Funções
const addCurriculumPlan = () => {
  router.push({ name: "curriculum-create" });
};

const editCurriculumPlans = (curriculum) => {
  router.push({ name: "curriculum-edit", params: { id: curriculum.id } });
  notifyInfo(`Editando: ${curriculum.name}`);
};

const deleteCurriculumPlans = async (discipline) => {};

// Função para abrir o modal de disciplinas
const openModal = (row) => {
  curriculumSelectDisciplines.value = row.disciplines.map(
    (discipline) => discipline.id
  );

  const difference = row.endYear - row.startYear;

// Gerando números para os semestres
const semesters = Array.from({ length: difference * row.periodicity }, (_, index) => {
  const semester = index + 1;
  return {
    label: {semester}, // Rótulo para exibição no select
    value: semester               // Valor associado
  };
});

console.log(semesters);

  modalDisciplinesRef.value?.openModal(
    curriculumSelectDisciplines.value,
    row.id
  );
};

// Função para buscar os planos curriculares
const fetchCurriculum = async () => {
  try {
    await curriculumPlanStores.list();
    curriculumPlans.value = curriculumPlanStores.curriculumPlans;
  } catch (error) {
    notifyError("Falha ao carregar os planos curriculares.");
  }
};

// Função para buscar as disciplinas
const fetchDisciplines = async () => {
  try {
    await disciplineStores.list();
    const disciplineList = disciplineStores.disciplines; // Método para listar cursos
    allDisciplines.value = disciplineList.map((discipline) => ({
      id: discipline.id,
      name: discipline.name,
    }));
  } catch (error) {
    notifyError("Falha ao carregar os disciplinas.");
  }
};

onMounted(() => {
  fetchCurriculum();
  fetchDisciplines();
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
              :rows="curriculumPlans"
              title="Planos Curriculares"
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
                  @click="addCurriculumPlan"
                  class="q-ml-sm"
                />
              </template>

              <template v-slot:body-cell-actions="props">
                <q-btn
                  flat
                  round
                  icon="edit"
                  color="primary"
                  @click="editCurriculumPlans(props.row)"
                />
                <q-btn
                  flat
                  round
                  icon="delete"
                  color="negative"
                  @click="deleteCurriculumPlans(props.row)"
                />
                <q-btn
                  flat
                  round
                  icon="fa fa-book-medical"
                  color="primary"
                  @click="openModal(props.row)"
                />
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Modal Disciplines -->
    <ModalDisciplines
      ref="modalDisciplinesRef"
      :disciplines="allDisciplines"
      :curriculumDisciplines="curriculumSelectDisciplines"
      @save="handleSaveDisciplines"
    />
  </q-page>
</template>

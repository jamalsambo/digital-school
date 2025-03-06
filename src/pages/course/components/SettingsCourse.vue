<template>
  <!-- Modal para alocacao de disciplina -->
  <ModalDisciplinesComponent
    ref="modalDisciplineChild"
    :disciplines="disciplines"
    :curriculum="curriculum"
  />
  <!-- Modal para alocacao de turma -->

  <ModalClasseComponent
    ref="modalClasseChild"
    :curriculum="curriculum"
    :classe="classe"
    :fetch-course="fetchCourse"
    :period-options="periodOptions"
  />
  <q-card>
    <q-card-section>
      <div class="text-h6">Configuração - {{ course?.name }}</div>
    </q-card-section>

    <q-card-section>
      <!--  Div de listagem de planos curriculares -->
      <div class="border q-pa-md shadow-2">
        <div v-if="!isEditing">
          <div class="row items-center justify-between">
            <span class="text-weight-bold">Planos Curriculares</span>
            <q-btn
              color="primary"
              icon="add"
              label="Adicionar"
              class="q-mr-sm"
              @click="toggleEdit"
              flat
            />
          </div>
          <q-separator spaced />
          <TableCurriculum
            :rows="curriculuns"
            :columns="ColumnsCurriculum"
            row-key="id"
          >
            <template #actions="{ row }">
              <q-btn
                icon="auto_stories"
                color="primary"
                class="q-mr-sm"
                flat
                @click="addDiscipline(row)"
              >
                <q-tooltip> Adicionar disciplina ao curriculum </q-tooltip>
              </q-btn>
              <q-btn
                icon="school"
                color="primary"
                class="q-mr-sm"
                flat
                @click="addClasse(row)"
              >
                <q-tooltip> Adicionar turma ao curriculum </q-tooltip>
              </q-btn>
              <q-btn icon="edit" color="primary" class="q-mr-sm" flat>
                <q-tooltip> Editar curriculum </q-tooltip>
              </q-btn>
            </template>
          </TableCurriculum>
        </div>

        <div v-else>
          <div class="row items-center justify-between">
            <span class="text-weight-bold">Criar Plano Curricular</span>
          </div>
          <q-separator spaced />
          <q-form
            @submit.prevent="handleSubmitCurriculum"
            class="q-gutter-md q-pt-sm"
          >
            <div class="row q-col-gutter-sm" isLoading>
              <q-input
                class="col-md-6 col grow col-sm-12 col-xs-12"
                label="Nome do curriculum"
                placeholder="Digite o nome do curriculum"
                v-model="newCurriculum.name"
                outlined
                required
                dense
              />
              <q-select
                class="col-md-6 col-sm-12 col-xs-12"
                outlined
                v-model="newCurriculum.mode"
                label="Modalidade de Ensino"
                option-value="id"
                option-label="name"
                :options="modeOptions"
                emit-value
                map-options
                dense
              />
              <q-input
                class="col-md-6 col grow col-sm-12 col-xs-12"
                label="Ano de Inicio"
                placeholder="Digite o ano de Inicio"
                v-model="newCurriculum.startYear"
                type="number"
                outlined
                required
                dense
                :rules="[validateYear]"
              />

              <!-- <q-select
                  class="col-md-3 col-sm-12 col-xs-12"
                  outlined
                  v-model="newCurriculum.status"
                  label="Estado do curriculum"
                  option-value="id"
                  option-label="name"
                  :options="statusOptions"
                  emit-value
                  map-options
                  dense
                /> -->
            </div>
            <div class="row justify-end q-gutter-sm">
              <q-btn
                label="Cancelar"
                color="negative"
                icon="close"
                outline
                @click="toggleEdit"
                class="q-mr-sm"
                flat
              />
              <q-btn
                label="Guardar"
                color="positive"
                icon="save"
                type="submit"
                flat
              />
            </div>
          </q-form>
        </div>
      </div>
      <div class="q-mt-md"></div>
      <!--  Div de listagem de turmas -->
      <div class="border q-pa-md shadow-2">
        <div class="row items-center justify-between">
          <span class="text-weight-bold">Turmas</span>
        </div>
        <TableCurriculum :rows="classes" :columns="ColumnsClass">
          <template #actions="{ row }">
            <q-btn
              icon="edit"
              color="primary"
              @click="editClasse(row)"
              class="q-mr-sm"
              flat
            />
            <q-btn
              icon="calendar_month"
              color="primary"
              @click="showScheduleClass(row)"
              class="q-mr-sm"
              flat
            />
            <q-btn
              icon="person"
              color="primary"
              @click="addTeachings(row)"
              class="q-mr-sm"
              flat
            />
          </template>
        </TableCurriculum>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCourseStores } from "../store";
import { useDisciplineStores } from "src/pages/discipline/store";
import ModalDisciplinesComponent from "./ModalDisciplines.vue";
import ModalClasseComponent from "./ModalClasse.vue";
import TableCurriculum from "./Tables.vue";
import useNotify from "src/composables/UseNotify";
import ColumnsCurriculum from "./ColumnsCurriculum";
import ColumnsClass from "./ColumnsClass";

// stores
const route = useRoute();
const router = useRouter();
const courseStores = useCourseStores();
const disciplineStores = useDisciplineStores();
const { notifyError, notifySuccess } = useNotify();

// data
const { id } = route.params;
const course = ref();
const curriculuns = ref([]);
const curriculum = ref();
const disciplines = ref([]);
const classes = ref([]);
const classe = ref();
const isEditing = ref(false);
const modalDisciplineChild = ref();
const modalClasseChild = ref();
const modeOptions = ref(["Presencial", "EAD", "Hibrido", "Modular"]);
const periodOptions = ref([]);
// const statusOptions = ref(["ACTIVO", "INACTIVO", "REVISAO"]);
const newCurriculum = ref({
  name: "",
  startYear: parseInt(""),
  mode: "",
  status: "ACTIVO",
});

// methods
// Funcao para submeter formulário de criacao de curriculum
const handleSubmitCurriculum = async () => {
  const payload = {
    ...newCurriculum.value,
    courseId: id,
    startYear: parseInt(newCurriculum.value.startYear),
  };
  try {
    await courseStores.createCurriculum(payload);
    notifySuccess("Curriculum criado com sucesso!");

    toggleEdit();
  } catch (error) {
    notifyError("Erros ao gravar curriculum");
  }
};
// funcao para abrir modal e  adicionar disciplina ao curriculum
const addDiscipline = (item) => {
  modalDisciplineChild.value.medium = true;
  curriculum.value = item;
  const curriculumDisciplines = item.disciplines;

  // Verificacao das disciplinas do curriculum
  const all = disciplines.value.map((d) => {
    const isActive = curriculumDisciplines.find((a) => a.id === d.id);
    return {
      id: d.id,
      name: d.name,
      checked: !!isActive,
    };
  });

  disciplines.value = all;
};
// funcao para navegador na pagina para alocar disciplina ao funcionaio
const addTeachings = (row) => {
  router.push({
    name: "class-teachings-add",
    params: {
      id: row.id,
    },
  });
};
// funcao para adicionar turma ao curriculum
const addClasse = (item) => {
  modalClasseChild.value.medium = true;
  curriculum.value = item;
  classe.value = {};
  router.push({
    name: "course-settings",
    params: {
      id: id,
      settingsEntity: "curriculum",
      settingsEntityId: item.id,
      purpose: "create",
      entity: "classe",
    },
  });
};
// funcao para editar classe
const editClasse = (props) => {
  modalClasseChild.value.medium = true;
  curriculum.value = {};
  classe.value = props;
  router.push({
    name: "course-settings",
    params: {
      id: id,
      purpose: "edit",
      purposeId: props.id,
      entity: "classe",
    },
  });
};
const showScheduleClass = (row) => {
  router.push({ name: "schedule-class", params: { id: row.id } });
};
// funcao para ativivar o fomulario de criacao de curriculum
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};
// funcao para validar o campo de ano de inicio do curriculum
const validateYear = (val) => {
  const year = parseInt(val, 10);
  return (year >= 1900 && year <= 2100) || "Ano deve estar entre 1900 e 2100.";
};
// funcao para buscar curso por id
const fetchCourse = async () => {
  try {
    await courseStores.findOne(id);
    course.value = courseStores.course;
    curriculuns.value = courseStores?.course?.curriculuns;
    classes.value = courseStores?.course?.classes;
    periodOptions.value = courseStores?.course?.institution?.shifts;
  } catch (error) {
    notifyError("Erros no carregamento");
  }
};
// funcao para buscar disciplinas
const fetchDisciplines = async () => {
  try {
    await disciplineStores.list();
    disciplines.value = disciplineStores.disciplines;
  } catch (error) {
    notifyError("Erros ao carregar disciplinas");
  }
};

onMounted(() => {
  fetchCourse();
  fetchDisciplines();
  router.push({
    name: "course-settings",
    params: {
      id: id,
    },
  });
});
</script>

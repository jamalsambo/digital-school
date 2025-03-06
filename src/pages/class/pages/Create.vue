<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Criar Nova Turma</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="submitForm" @reset="resetForm">
          <div class="row q-col-gutter-md">
            <q-input
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="formData.name"
              label="Nome da Turma"
              outlined
              :rules="[(val) => !!val || 'O nome da turma é obrigatório.']"
            />

            <q-select
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="formData.courseId"
              :options="courses"
              label="Curso"
              option-label="name"
              option-value="id"
              outlined
              emit-value
              map-options
              :rules="[(val) => !!val || 'Selecione um curso.']"
            />

            <q-input
              class="col-md-6 col-sm-6 col-xs-12"
              v-model="formData.startDate"
              type="date"
              label="Data de Início"
              outlined
              :rules="[(val) => !!val || 'A data de início é obrigatória.']"
            />

            <q-input
              class="col-md-6 col-sm-6 col-xs-12"
              v-model="formData.endDate"
              type="date"
              label="Data de Término"
              outlined
              :rules="[
                (val) => !!val || 'A data de término é obrigatória.',
                (val) =>
                  !formData.startDate ||
                  new Date(val) >= new Date(formData.startDate) ||
                  'A data de término deve ser posterior à data de início.',
              ]"
            />

            <q-input
              class="col-md-3 col-sm-12 col-xs-12"
              v-model.number="formData.vacancy_limit"
              type="number"
              label="Limite de Vagas"
              outlined
              :rules="[
                (val) => !!val || 'O limite de vagas é obrigatório.',
                (val) =>
                  val > 0 || 'O limite de vagas deve ser maior que zero.',
              ]"
            />

            <q-select
              class="col-md-3 col-sm-12 col-xs-12"
              v-model="formData.period"
              :options="periodOptions"
              label="Periodo"
              outlined
              emit-value
              :rules="[(val) => !!val || 'Selecione um periodo.']"
            />

            <q-select
              class="col-md-3 col-sm-12 col-xs-12"
              v-model="formData.curriculumId"
              :options="curriculuns"
              label="Plano Curricular"
              outlined
              option-label="name"
              option-value="id"
              emit-value
              map-options
            />

            <q-input
              class="col-md-3 col-sm-12 col-xs-12"
              v-model.number="formData.renew"
              type="number"
              label="Renovacao da Inscricao"
              outlined
              :rules="[
                (val) => !!val || 'O Renovacao é obrigatório.',
                (val) => val > 0 || 'O Renovacao deve ser maior que zero.',
              ]"
            />
          </div>
          <q-card-section v-if="classStore.classe.id">
            <div class="text-subtitle1 q-mb-md">
              Taxas Extras para Matricula
            </div>
            <div
              v-for="extra in extraFees"
              :key="extra.id"
              class="row items-center q-py-sm"
            >
              <q-checkbox
                v-model="selectEdextraFees"
                @click="toggleExtraFees(extra)"
                :val="extra.id"
                :label="extra.name"
                class="col-3"
              />
            </div>
          </q-card-section>
          <div class="row q-mt-md justify-end">
            <q-btn
              label="Canceclar"
              color="warning"
              @click="cancel"
              flat
              type="reset"
            />
            <q-btn
              v-if="!classStore.classe.id"
              label="Salvar"
              color="primary"
              flat
              type="submit"
            />
            <q-btn
              v-else
              label="Finalizar"
              @click="cancel"
              color="primary"
              flat
              type="button"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useCourseStores } from "src/pages/course/store";
import { useClassStores } from "src/pages/class/store";
import { useCurriculumPlanStores } from "src/pages/curriculum-plan/store";
import { useServicesStores } from "src/services";
import { useEnrollmentStores } from "src/components/register/enrollment/Stores";
import useNotify from "src/composables/UseNotify";

const router = useRouter();
const courseStore = useCourseStores();
const classStore = useClassStores();
const curriculumStores = useCurriculumPlanStores();
const servicesStores = useServicesStores();
const enrollmentStores = useEnrollmentStores();
const { notifyError, notifySuccess } = useNotify();

const formData = ref({
  name: "",
  vacancy_limit: 0,
  courseId: null,
  startDate: "",
  endDate: "",
  period: "",
  curriculumId: "",
  renew: "",
});
const selectEdextraFees = ref([]);

const isLoading = ref(false);
const courses = ref([]);
const curriculuns = ref([]);
const extraFees = ref([]);

const periodOptions = [
  { label: "Manha", value: "Manha" },
  { label: "Tarde", value: "Tarde" },
  { label: "Noite", value: "Noite" },
];

// Methods
const submitForm = async () => {
  isLoading.value = true;
  if (!formData.value.name || !formData.value.vacancy_limit) {
    notifyError("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  try {
    await classStore.create(formData.value);
    notifySuccess("Turma criada com sucesso!");
  } catch (error) {
    notifyError("Erro ao criar Turma");
  } finally {
    isLoading.value = false;
  }
};

const fetchCourses = async () => {
  try {
    await courseStore.list();
    const courseList = courseStore.courses; // Atualize para o método correto de listagem
    courses.value = courseList.map((course) => ({
      id: course.id,
      name: course.name,
    }));
  } catch (error) {
    notifyError("Erro ao carregar cursos.");
  }
};

const fetchCurriculum = async () => {
  try {
    await curriculumStores.list();
    const curriculumList = curriculumStores.curriculumPlans; // Atualize para o método correto de listagem
    curriculuns.value = curriculumList.map((curriculum) => ({
      id: curriculum.id,
      name: curriculum.name,
    }));
  } catch (error) {
    notifyError("Erro ao carregar Planos Curriculares.");
  }
};

const fetchExtraFees = async () => {
  try {
    await servicesStores.listExtraFees();
    extraFees.value = servicesStores.extraFees;
  } catch (error) {
    notifyError("Erro ao carregar Taxas Extras.");
  }
};

const toggleExtraFees = async (extra) => {
  const index = selectEdextraFees.value.findIndex((e) => e.id === extra.id);

  if (index !== -1) {
    // Uncheck: Remove a disciplina selecionada
    selectEdextraFees.value.splice(index, 1);
    const payload = {
      classId: classStore.classe.id,
      extraFeesId: extra.id,
    };
    console.log(payload);
  } else {
    // Check: Adiciona a disciplina selecionada
    selectEdextraFees.value.push(extra);
    const payload = {
      classId: classStore.classe.id,
      extraFeesId: extra.id,
    };
    try {
      await enrollmentStores.createExtraFees(payload);
      notifySuccess("Taxa Extra adicionado com sucesso");
    } catch (error) {
      notifyError("Erro ao adicionar Taxa Extra");
    }
  }
};

const resetForm = () => {
  formData.value = {
    name: "",
    vacancy_limit: 0,
    courseId: null,
    startDate: "",
    endDate: "",
    status: "",
  };
};

const cancel = () => {
  router.push("/class");
  resetForm();
};

onMounted(() => {
  fetchCourses();
  fetchCurriculum();
  fetchExtraFees();
});
</script>

<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">
          {{ isEditing ? "Editar Plano Curricular" : "Nova Plano Curricular" }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleSubmit">
          <!-- Nome -->
          <div class="row q-col-gutter-md">
            <q-input
              class="col-md-12 col-sm-12 col-xs-12"
              v-model="form.name"
              label="Nome do Plano Curricular"
              outlined
              :rules="[(val) => !!val || 'O nome é obrigatório.']"
            />

            <!-- Ano de início -->
            <q-input
              class="col-md-6 col-sm-12 col-xs-12"
              v-model.number="form.startYear"
              label="Ano de Início"
              outlined
              type="number"
              :rules="[(val) => !!val || 'O ano de início é obrigatório.']"
            />

            <!-- Ano de término -->
            <q-input
              class="col-md-6 col-sm-12 col-xs-12"
              v-model.number="form.endYear"
              label="Ano de Término"
              outlined
              type="number"
            />

            <!-- Curso -->
            <q-select
              class="col-md-4 col-sm-12 col-xs-12"
              v-model="form.courseId"
              :options="courses"
              label="Curso"
              option-label="name"
              option-value="id"
              outlined
              emit-value
              map-options
              :rules="[(val) => !!val || 'O curso é obrigatório.']"
            />

            <!-- Modalidade -->
            <q-select
              class="col-md-4 col-sm-12 col-xs-12"
              v-model="form.mode"
              :options="modes"
              label="Modalidade"
              outlined
              emit-value
              map-options
            />

            <!-- Descrição -->
            <q-input
              class="col-md-4 col-sm-12 col-xs-12"
              v-model.number="form.periodicity"
              label="Periodicidade"
              outlined
              type="number"
            />

            <!-- Status -->
            <q-select
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="form.status"
              :options="statuses"
              label="Status"
              outlined
              emit-value
              map-options
              :rules="[(val) => !!val || 'O status é obrigatório.']"
            />

            <!-- Descrição -->
            <q-input
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="form.description"
              label="Descrição"
              outlined
              type="text"
            />
          </div>

          <!-- Botões de ação -->
          <div class="row justify-end q-gutter-sm">
            <q-btn
              type="submit"
              label="Salvar"
              color="primary"
              icon="save"
              :loading="isLoading"
            />
            <q-btn
              label="Cancelar"
              color="negative"
              flat
              icon="cancel"
              @click="cancel"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCourseStores } from "src/pages/course/store";
import { useCurriculumPlanStores } from "src/pages/curriculum-plan/store";
import useNotify from "src/composables/UseNotify";

const router = useRouter();
const route = useRoute();
const coourseStores = useCourseStores();
const curriculumPlanStore = useCurriculumPlanStores();
const { notifyError, notifySuccess } = useNotify();

const isLoading = ref(false);
const isEditing = ref(false);
const courses = ref([]);
// Formulário inicial
const form = ref({
  name: "",
  startYear: null,
  courseId: "",
  mode: "",
  description: "",
  endYear: null,
  status: "",
  periodicity: null,
});

// Dados auxiliares
// Função para buscar os cursos
const fetchCourses = async () => {
  try {
    await coourseStores.list();
    const courseList = coourseStores.courses; // Método para listar cursos
    courses.value = courseList.map((course) => ({
      id: course.id,
      name: course.name,
    })); // Método para listar cursos
  } catch (error) {
    notifyError("Erro ao carregar cursos.");
  }
};

const modes = [
  { label: "Presencial", value: "Presencial" },
  { label: "EAD", value: "EAD" },
  { label: "Híbrido", value: "Hibrido" },
];
const statuses = [
  { label: "Ativo", value: "ACTIVO" },
  { label: "Inativo", value: "INACTIVO" },
  { label: "Revisao", value: "REVISAO" },
];

// Verificar se é edição
onMounted(async () => {
  if (route.params.id) {
    isEditing.value = true;
    await loadCurriculumPlan(route.params.id);
  }
  fetchCourses();
});

// Carregar dados para edição
const loadCurriculumPlan = async (id) => {
  isLoading.value = true;

  try {
    await curriculumPlanStore.findOne(id);
    form.value = curriculumPlanStore.curriculumPlan;
  } catch (error) {
    notifyError("Erro ao carregar os dados da instituição.");
  } finally {
    isLoading.value = false;
  }
};

// Salvar dados (criar ou atualizar)
const handleSubmit = async () => {
  isLoading.value = true;

  const payload = {
    name: form.value.name,
    startYear: form.value.startYear,
    courseId: form.value.courseId,
    mode: form.value.mode,
    description: form.value.description,
    endYear: form.value.endYear,
    totalHours: form.value.totalHours,
    totalCredits: form.value.totalCredits,
    status: form.value.status,
    periodicity: form.value.periodicity,
  };

  try {
    if (isEditing.value) {
      await curriculumPlanStore.update(route.params.id, payload);
      notifySuccess("Curriculum atualizada com sucesso!");
    } else {
      await curriculumPlanStore.create(payload);
      notifySuccess("Curriculum criada com sucesso!");
    }

    router.push("/curriculum-plan");
  } catch (error) {
    notifyError("Erro ao salvar a Curriculum.");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// Cancelar
const cancel = () => {
  router.push("/curriculum-plan");
};
</script>

<style scoped>
.text-h6 {
  font-size: 18px;
  font-weight: bold;
}
</style>

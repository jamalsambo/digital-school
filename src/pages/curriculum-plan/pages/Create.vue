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
              dense
            />
            <!-- Status -->
            <q-select
              class="col-md-12 col-sm-12 col-xs-12"
              v-model="form.status"
              :options="statuses"
              label="Status"
              outlined
              emit-value
              map-options
              :rules="[(val) => !!val || 'O status é obrigatório.']"
              dense
            />
          </div>

          <!-- Botões de ação -->
          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Cancelar"
              color="negative"
              flat
              icon="cancel"
              @click="cancel"
            />
            <q-btn
              type="submit"
              label="Salvar"
              color="primary"
              icon="save"
              flat
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
import { useCurriculumPlanStores } from "src/pages/curriculum-plan/store";
import useNotify from "src/composables/UseNotify";

/* setup router */
const router = useRouter();
const route = useRoute();

/* setup store */
const curriculumPlanStore = useCurriculumPlanStores();
const { notifyError, notifySuccess } = useNotify();

/* setup data */
const { educationId, curriculumId } = route.params;
const isLoading = ref(false);
const isEditing = ref(false);
const form = ref({
  educationId: educationId,
  name: "",
  status: "ACTIVO",
});

const statuses = [
  { label: "Ativo", value: "ACTIVO" },
  { label: "Inativo", value: "INACTIVO" },
  { label: "Revisao", value: "REVISAO" },
];
// Salvar dados (criar ou atualizar)
const handleSubmit = async () => {
  try {
    if (curriculumId) {
      await curriculumPlanStore.update(curriculumId, form.value);
      notifySuccess("Curriculum atualizada com sucesso!");
    } else {
      await curriculumPlanStore.create(form.value);
      notifySuccess("Curriculum criada com sucesso!");
    }

    router.back();
  } catch (error) {
    notifyError("Erro ao salvar a Curriculum.");
  } finally {
    isLoading.value = false;
  }
};

// Carregar dados para edição
const fetchCurriculum = async () => {
    if (curriculumId) {
      try {
        await curriculumPlanStore.findOne(curriculumId);
        form.value = {...curriculumPlanStore.curriculumPlan};
      } catch (error) {
        notifyError("Erro ao carregar os dados da instituição.");
      } finally {
        isLoading.value = false;
      }
    }
  };

  // Verificar se é edição
  onMounted(async () => {
    await fetchCurriculum();
  });
</script>

<style scoped>
.text-h6 {
  font-size: 18px;
  font-weight: bold;
}
</style>

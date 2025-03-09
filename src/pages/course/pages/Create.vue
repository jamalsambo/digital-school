<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6" v-if="!internshipId">Criar novo {{getProgramName(program)}}</div>
        <div class="text-h6" v-else>Editar {{getProgramName(program)}}</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <q-form @submit.prevent="submitForm" class="q-gutter-md">
          <!-- Nome -->
          <q-input
            v-model="form.name"
            label="Nome *"
            outlined
            maxlength="255"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            dense
          />

          <!-- Idade Mínima/Máxima -->
          <div class="row q-col-gutter-sm" v-if="applyAge">
            <q-input
              v-model="form.minimumAge"
              label="Idade Mínima *"
              outlined
              type="number"
              class="col-md-6 col-sm-12 col-xs-12"
              :rules="[
                (val) => val >= 0 || 'Idade mínima não pode ser negativa',
                (val) => !!val || 'Campo obrigatório',
              ]"
              dense
            />

            <q-input
              v-model="form.maximumAge"
              label="Idade Máxima *"
              outlined
              type="number"
              class="col-md-6 col-sm-12 col-xs-12"
              :rules="[
                (val) => val >= 1 || 'Idade mínima é 1',
                (val) => !!val || 'Campo obrigatório',
                (val) =>
                  val > form.minimumAge || 'Deve ser maior que idade mínima',
              ]"
              dense
            />
            </div>

            <div class="row q-col-gutter-sm">
            <!-- Taxa de Mensalidade -->
            <q-input
              v-model="form.tuitionFee"
              label="Taxa de Mensalidade *"
              outlined
              type="number"
              step="0.01"
              class="col-md-4 col-sm-12 col-xs-12"
              :rules="[
                (val) => !!val || 'Campo obrigatório',
                (val) => val >= 0 || 'Valor não pode ser negativo',
              ]"
              dense
            />
            <!-- Aplicar para Todos -->
            <q-toggle
              class="col-md-4 col-sm-12 col-xs-12"
              v-model="form.applyToAll"
              label="Aplicar para todos os alunos"
            />
          </div>

          <div class="row q-mt-md justify-end">
            <q-btn
              label="voltar"
              color="negative"
              flat
              type="reset"
              @click="router.back()"
            />
            <q-btn label="Salvar" color="green" flat type="submit" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCourseStores } from "../store";
import useNotify from "src/composables/UseNotify";
import scripts from "src/composables/Scripts";

/* setup store */
const courseStores = useCourseStores();
const router = useRouter();
const route = useRoute();
const { notifySuccess, notifyError } = useNotify();
const { getProgramName} = scripts()

/* setup data */
const { educationId, courseId, program } = route.params;
const course = ref();
const applyAge = ref(false)
const form = ref({
  educationId: educationId,
  name: "",
  tuitionFee: 0,
  minimumAge: 0,
  maximumAge: 1,
  academicRegime: "",
  applyToAll: false,
});

// Exemplo de opções - substituir com dados reais
const regimeOptions = ref([
  { label: "Semestral", value: 6 },
  { label: "Trimestral", value: 3 },
]);

/* Methods */
const submitForm = async () => {
  const payload = {
    ...form.value,
    minimumAge: parseInt(form.value.minimumAge),
    maximumAge: parseInt(form.value.maximumAge),
    academicRegime: form.value.academicRegime,
  };

  try {
    if (!courseId) {
      await courseStores.create(payload);
      notifySuccess("Estagio criado com sucesso");
    } else {
      await courseStores.update(courseId, payload);
      notifySuccess("Estagio editado com sucesso");
    }
    router.back();
  } catch (error) {
    console.error(error);
    notifyError("Erro ao salvar o estágio");
  }
};

/* Fetch data */
const fetchProgram = async () => {
  try {
    await courseStores.findOne(courseId);
    course.value = courseStores.course;
  } catch (error) {
    notifyError("Erro ao carregar dados");
  }
};

/* wacth data */
watchEffect(() => {
  if (course.value) {
    form.value = { ...course.value };
  }
});

onMounted(async () => {
  if (program === 'internships') {
    applyAge.value = true;
  }
  if (courseId) {
    await fetchProgram();
  }
});
</script>

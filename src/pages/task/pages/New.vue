<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Criar tarefa</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-sm">
            <q-input
              class="col-md-12 col grow col-sm-12 col-xs-12"
              v-model="form.title"
              label="A tarefa"
              placeholder="Digite o nome do Curso"
              outlined
              :rules="[(val) => !!val || 'O nome é obrigatório.']"
              dense
            />
            <q-editor
              class="col-md-12 col grow col-sm-12 col-xs-12"
              v-model="form.description"
              :dense="true"
              :toolbar="[
                ['bold', 'italic', 'underline'],
                ['unordered', 'ordered'],
                ['link', 'quote'],
                ['undo', 'redo'],
              ]"
              placeholder="Digite aqui..."
              min-height="150px"
            />

            <q-input
              class="col-md-12 col-sm-6 col-xs-12"
              v-model="form.dueDate"
              type="date"
              label="Data de entrega"
              outlined
              :rules="[(val) => !!val || 'A data de entreg é obrigatória.']"
              dense
            />

            <q-select
              class="col-md-12 col-sm-12 col-xs-12"
              outlined
              v-model="form.status"
              label="Aplicação da mensalidade"
              option-value="id"
              option-label="name"
              :options="['Cancelado']"
              emit-value
              map-options=""
              dense=""
            />
          </div>

          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Cancelar"
              color="negative"
              icon="close"
              outline
              @click="cancel"
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
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTaskStores } from "../store";
import { useAuthStore } from "src/pages/auth/store";
import useNotify from "src/composables/UseNotify";

/* use store */
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const taskStores = useTaskStores();
const { notifyError, notifySuccess } = useNotify();

/* data*/
const user = computed(() => authStore.user);
const task = ref(null);
const { classe, discipline, id } = route.params;
const form = ref({
  name: "",
  description: "",
  dueDate: "",
  status: null,
});

watchEffect(() => {
  if (id) {
    form.value = {
      title: task.value?.title || "",
      description: task.value?.description || "",
      dueDate: task.value?.dueDate || "",
      status: task.value?.status || null,
    };
  }
});

/* methods */
const onSubmit = async () => {
  try {
    await taskStores.create({
      ...form.value,
      classId: classe,
      disciplineId: discipline,
      teacherId: user.value.userDetails.id,
    });
    notifySuccess("Tarefa guardada com sucesso");
  } catch (error) {
    notifyError("Error ao guardar tarefa");
  }
};

const cancel = () => {
  router.back();
};

/* fetch data */
const fetchTask = async () => {
  try {
    await taskStores.findOne(id);
    task.value = taskStores.task;
  } catch (error) {
    notifyError("Erro ao carregar tarefa");
  }
};

onMounted(async () => {
  if (id) {
    await fetchTask();
  }
});
</script>

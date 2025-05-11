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
              placeholder="Digite o nome da tarefa"
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
            <div class="row  q-col-gutter-sm col-md-12 col-sm-12 col-xs-12">
              <q-input
                class="col-md-grow col-sm-6 col-xs-12"
                v-model="form.dueDate"
                type="date"
                label="Data de entrega"
                outlined
                :rules="[(val) => !!val || 'A data de entreg é obrigatória.']"
                dense
              />

              <q-select
                v-if="id"
                class="col-md-grow col-sm-12 col-xs-12"
                outlined
                v-model="form.status"
                label="Estado"
                option-value="id"
                option-label="name"
                :options="['Activo', 'Cancelado']"
                emit-value
                map-options=""
                dense=""
              />
            </div>

            <q-file
              class="col-grow"
              v-model="file"
              label="Anexar documento (opcional)"
              filled
              dense
              accept=".pdf"
              counter
            >
              <template v-slot:append>
                <q-icon name="attach_file" />
              </template>
            </q-file>
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
import { useUserStores } from "src/pages/user/store";
import { useComposablesStores } from "src/composables";
import useNotify from "src/composables/UseNotify";

/* use store */
const route = useRoute();
const router = useRouter();
const userStores = useUserStores();
const taskStores = useTaskStores();
const composableStores = useComposablesStores();
const { notifyError, notifySuccess } = useNotify();

/* data*/
const user = computed(() => userStores.user);
const task = ref(null);
const { classeId, disciplineId, id } = route.params;
const file = ref(null);
const form = ref({
  title: "",
  description: "",
  dueDate: "",
  status: "Activo",
  fileName: "",
  attachments: "",
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
    if (file.value) {
      form.value.fileName = file.value.name;
      const publicUrl = await composableStores.uploadFromSupabase(
        file.value,
        "student"
      );
      form.value.attachments = publicUrl;
    }
    const payload = {
      ...form.value,
      classId: classeId,
      activityId: disciplineId,
      teacherId: user.value.employee.id,
    };
    console.log(payload);
    await taskStores.create(payload);
    notifySuccess("Tarefa guardada com sucesso");
    router.back()
  } catch (error) {
    console.log(error)
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

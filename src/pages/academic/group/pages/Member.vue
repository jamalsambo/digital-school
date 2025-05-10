<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Criar grupo</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-sm">
            <q-input
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="form.name"
              label="Nome do grupo"
              :rules="[(val) => !!val || 'Digite o nome do Grupo']"
              outlined
              dense
            />
            <q-input
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="form.description"
              label="Descrição do grupo"
              outlined
              dense
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
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStores } from "src/pages/user/store";
import { useGroupStores } from "../store";
import useNotify from "src/composables/UseNotify";

/* use store*/
const router = useRouter();
const route = useRoute();
const userStores = useUserStores();
const groupStores = useGroupStores();
const { notifyError, notifySuccess } = useNotify();

/* Data */
const { classe, disciplineId } = route.params;
const form = ref({ name: "", description: "" });

/* Methods */
const onSubmit = async () => {
  const payload = {
    name: form.value.name,
    description: form.value.description,
    classId: classe,
    activityId: disciplineId,
    teacherId: userStores.user.employee?.id
  }
    try {
      await groupStores.create(payload);
      notifySuccess("Grupo criado com sucesso!");
      router.push({name: 'groups'});
    } catch (error) {
      notifyError("Ocorreu um erro ao tentar criar o grupo!");
    }
};

const cancel = () => {
  router.back()
};
</script>

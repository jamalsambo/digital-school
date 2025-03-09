<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="text-grey-8 no-shadow" bordered>
          <q-card-section>
            <Tables
              :rows="disciplines"
              :title="getNameForDiscipline(title) + `s`"
              :columns="columns"
            >
              <template #new>
                <q-btn
                  color="primary"
                  icon="add"
                  label="Adicionar"
                  no-caps
                  @click="createDiscipline"
                  class="q-ml-sm"
                />
              </template>

              <template #actions="{ props }">
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
            </Tables>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { onBeforeRouteUpdate, useRouter } from "vue-router";
import { useDisciplineStores } from "src/pages/discipline/store";
import { useRoute } from "vue-router";
import scripts from "src/composables/Scripts";
import Tables from "src/components/Tables.vue";
import columns from "../components/DisciplinesColumns";

/* setup route */
const router = useRouter();
const route = useRoute();

/* setup store */
const disciplineStores = useDisciplineStores();
const { getNameForDiscipline } = scripts();

/* setup data */
const { educationId, module } = route.params;
const educationIdUpdated = ref(route.params.educationId || educationId);
const disciplines = ref([]);
const moduleUpdated = ref(route.params.module || module);
const title = ref(moduleUpdated);

/* setup methods */
const createDiscipline = () => {
  router.push({
    name: "create-module",
    params: {
      educationId: educationIdUpdated.value,
      module: moduleUpdated.value,
    },
  });
};

const editDiscipline = (discipline) => {
  router.push({
    name: "edit-module",
    params: {
      educationId: educationIdUpdated.value,
      module: moduleUpdated.value,
      moduleId: discipline.id,
    }
  })
};

const deleteDiscipline = async (discipline) => {
  try {
    await disciplineStores.delete(discipline.id);
    await fetchDisciplines()
  } catch (error) {
    console.error("Erro ao excluir Discipline:", error);
  }
};

/* fetch data */
const fetchDisciplines = async () => {
  try {
    await disciplineStores.list(educationIdUpdated.value);
    disciplines.value = disciplineStores.disciplines;
  } catch (error) {
    console.error("Erro ao buscar disciplinas:", error);
  }
};

onBeforeRouteUpdate(async (to) => {
  moduleUpdated.value = to.params.module || module;
  educationIdUpdated.value = to.params.educationId || educationId;
  await fetchDisciplines();
});

onMounted(async () => {
  await fetchDisciplines();
});
</script>

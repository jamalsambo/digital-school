<template>
  <q-page padding class="bg-grey-2">
    <q-card flat bordered class="q-pa-md">
      <q-card-section class="row items-center justify-between q-pb-none">
        <div class="text-h6 text-primary">Ensino por Turma</div>
        <q-input
          dense
          outlined
          debounce="300"
          v-model="filter"
          placeholder="Pesquisar turma ou disciplina"
          class="q-ml-sm"
          style="max-width: 300px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-table
          :rows="teachings"
          :columns="columns"
          row-key="classEntity"
          dense
          :filter="filter"
          flat
          bordered
          class="q-mt-md"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td class="text-bold text-primary">
                {{ props.row.classEntity.name }}
              </q-td>

              <q-td>
                <div
                  v-for="group in props.row.disciplines"
                  :key="group.cicle"
                  class="q-mb-sm"
                >
                  <div class="text-subtitle2 text-grey-8 q-mb-xs">
                    🌀 Ciclo {{ group.cicle }}
                  </div>
                  <q-list bordered separator dense>
                    <q-item
                      v-for="discipline in group.list"
                      :key="discipline.id"
                      clickable
                      v-ripple
                    >
                      <q-item-section>
                        {{ discipline.name }}
                      </q-item-section>

                      <q-item-section side>
                        <q-btn
                          dense
                          flat
                          round
                          icon="crisis_alert"
                          color="green"
                          @click="
                            attendances(props.row.classEntity, discipline)
                          "
                          :title="'Ver presenças'"
                        />
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          dense
                          flat
                          round
                          icon="groups"
                          color="negative"
                          @click="evolution(props.row.classEntity, discipline)"
                          :title="'Ver evolução'"
                        />
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          dense
                          round
                          flat
                          icon="group_add"
                          color="green"
                          size="sm"
                          class="q-ml-sm"
                          @click="handleShowGroups(props.row.classEntity, discipline)"
                          :title="'Gerir grupos'"
                        />
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          dense
                          flat
                          round
                          icon="add_task"
                          color="primary"
                          @click="handleShowTasks(props.row.classEntity, discipline)"
                          :title="'Nova tarefa'"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEmployeeStores } from "../stores";
import useNotify from "src/composables/UseNotify";
import columns from "src/pages/employee/components/ColumnsEmployeesTeachings";

// Acessos aos stores e router
const route = useRoute();
const router = useRouter();
const employeeStores = useEmployeeStores();
const { notifyError } = useNotify();

// Variáveis do componente
const { id } = route.params;
const teachings = ref([]);

// Metodo do componente
const fetchEmployeeTeachings = async () => {
  try {
    await employeeStores.findTeachings(id);
    teachings.value = groupDataByClass(employeeStores.teachings);
  } catch (error) {
    console.log(error);
    notifyError("Falha ao carregar os disciplinas.");
  }
};

const attendances = (classe, discipline) => {
  router.push({
    name: "class-attendances",
    params: {
      classe: classe.id,
      discipline: discipline.id,
    },
  });
};

const evolution = (classe, discipline) => {
  router.push({
    name: "evolution-create",
    params: {
      classe: classe.id,
      discipline: discipline.id,
    },
  });
};

const handleShowTasks = (classe, discipline) => {
  router.push({
    name: "tasks",
    params: {
      classeId: classe.id,
      disciplineId: discipline.id,
    },
  });
};

const handleShowGroups = (classe, discipline) => {
  router.push({
    name: "groups",
    params: {
      classe: classe.id,
      disciplineId: discipline.id,
    },
  });
};

const groupDataByClass = (data) => {
  const grouped = {};

  data.forEach((item) => {
    const className = item.classEntity.name;
    const activity = item.developmentAreaActivy;

    if (!grouped[className]) {
      grouped[className] = {
        classEntity: item.classEntity,
        disciplines: {},
      };
    }

    // Agrupar por ciclo
    const cicle = activity.cicle;
    if (!grouped[className].disciplines[cicle]) {
      grouped[className].disciplines[cicle] = [];
    }

    grouped[className].disciplines[cicle].push({
      name: activity.activity.name,
      id: activity.id,
      cicle: activity.cicle,
    });
  });

  // Converter os ciclos para array, se preferir
  return Object.values(grouped).map((group) => ({
    ...group,
    disciplines: Object.entries(group.disciplines).map(([cicle, list]) => ({
      cicle,
      list,
    })),
  }));
};

onMounted(() => {
  fetchEmployeeTeachings();
});
</script>

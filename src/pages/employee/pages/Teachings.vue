<template>
  <q-page padding>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card class="text-grey-8 no-shadow" bordered>
          <q-card-section class="q-pa-none">
            <q-page>
              <q-table
                :rows="teachings"
                :columns="columns"
                row-key="classEntity"
                dense=""
              >
                <template v-slot:top-right="">
                  <q-input
                    borderless
                    dense
                    debounce="300"
                    v-model="filter"
                    placeholder="Pesquisar"
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>

                </template>
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td>
                     <q-item-section>
                      {{ props.row.classEntity.name }}
                     </q-item-section>
                      <q-item-section side>
                            <q-btn
                              dense
                              flat
                              icon="group_add"
                              color="green"
                              @click="
                                group(props.row.classEntity)
                              "
                            />
                          </q-item-section>
                    </q-td>
                    <q-td>
                      <q-list bordered>
                        <q-item
                          v-for="discipline in props.row.disciplines"
                          :key="discipline.id"
                        >
                          <q-item-section>
                            {{ discipline.name }}
                          </q-item-section>

                          <q-item-section side>
                            <q-btn
                              dense
                              flat
                              icon="crisis_alert"
                              color="green"
                              @click="
                                attendances(props.row.classEntity, discipline)
                              "
                            />
                          </q-item-section>

                          <q-item-section side>
                            <q-btn
                              dense
                              flat
                              icon="groups"
                              color="negative"
                              @click="
                                evolution(props.row.classEntity, discipline)
                              "
                            />
                          </q-item-section>
                          <q-item-section side>
                            <q-btn
                              dense
                              flat
                              icon="add_task"
                              color="secundary"
                              @click="
                                createTask(props.row.classEntity, discipline)
                              "
                            />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-page>
          </q-card-section>
        </q-card>
      </div>
    </div>
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
    notifyError("Falha ao carregar os disciplinas.");
  }
};

const attendances =  (classe, discipline) => {
   router.push({
    name: 'class-attendances',
    params: {
      classe: classe.id,
      discipline: discipline.id,
    },
   })
};

const evolution = (classe, discipline) => {
   router.push({
    name: 'evolution-create',
    params: {
      classe: classe.id,
      discipline: discipline.id,
    },
   })
};

const createTask = (classe, discipline) => {
   router.push({
    name: 'task-create',
    params: {
      classe: classe.id,
      discipline: discipline.id,
    },
   })
};

const group = (classe) => {
   router.push({
    name: 'groups',
    params: {
      classe: classe.id,
    },
   })
}
const groupDataByClass = (data) => {
  const grouped = {};
  data.forEach((item) => {
    if (!grouped[item.classEntity.name]) {
      grouped[item.classEntity.name] = {
        classEntity: item.classEntity,
        disciplines: [],
      };
    }
    grouped[item.classEntity.name].disciplines.push({
      name: item.discipline.name,
      id: item.discipline.id,
    });
  });
  return Object.values(grouped);
};

onMounted(() => {
  fetchEmployeeTeachings();
});
</script>

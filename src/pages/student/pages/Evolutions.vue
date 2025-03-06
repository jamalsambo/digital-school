<template>
  <q-page padding>
    <div>
      <q-card>
        <q-card-section>
          <q-select
            v-model="evolutionType"
            :options="[
              { value: 'Normal', name: 'Normal' },
              { value: 'Exame', name: 'Exame' },
            ]"
            label="Tipo de Avaliação"
            outlined
            dense
            clearable
            option-label="name"
            option-disable="value"
            emit-value
            @update:model-value="onchangeEvolutionType"
          />
          <div class="row q-col-gutter-x-sm"></div>
        </q-card-section>
      </q-card>
    </div>
    <q-list bordered class="rounded-borders q-pa-md">
      <q-item v-for="(year, index) in yearsList" :key="index">
        <q-item-section>
          <!-- Cabeçalho da Disciplina -->
          <div
            class="text-bold text-uppercase bg-primary text-white q-pa-sm rounded-borders"
          >
            {{ year }}
          </div>

          <q-list padding bordered class="rounded-borders">
            <q-expansion-item
              v-for="(regi, index) in regime"
              :key="index"
              dense
              expand-separator
              icon="note"
              :label="index + 1 + ' Trimestre'"
            >
              <!-- Conteúdo da disciplina -->
              <q-list bordered class="rounded-borders q-pa-md">
                <q-item v-for="discipline in disciplines" :key="discipline.id">
                  <q-item-section>
                    <!-- Cabeçalho da Disciplina -->
                    <div
                      class="text-bold text-uppercase bg-primary text-white q-pa-sm rounded-borders"
                    >
                      {{ discipline.name }}
                    </div>
                    <!-- Conteúdo das notas -->
                    <!-- Tabela de Avaliações -->
                    <q-card
                      flat
                      bordered
                      class="q-mt-sm q-pa-sm bg-grey-2 rounded-borders"
                    >
                      <q-list dense>
                        <q-item
                          v-for="(e, index) in getNotasPorRegime(
                            evolutions.value ?? [],
                            regi,
                            discipline.id
                          )"
                          :key="index"
                        >
                          <q-item-section v-if="e.note">
                            <div class="text-weight-medium">
                              {{ e.evolutionType.name }}
                            </div>
                          </q-item-section>
                          <q-item-section side v-if="e.note">
                            <q-chip
                              dense
                              :color="getColor(e.note)"
                              text-color="white"
                            >
                              {{ e.note }}
                            </q-chip>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-list>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { useStudentStores } from "../store";
import scripts from "src/composables/Scripts";
import useNotify from "src/composables/UseNotify";

/* use store */
const route = useRoute();
const studentStores = useStudentStores();
const { filterEnrollmentsByYear, getNotasPorRegime } = scripts();
const { notifyError } = useNotify();

/* data */
const { id } = route.params;
const studentId = ref(route.params.id || id);
const evolutionType = ref();
const student = ref({});
const enrollments = ref([]);
const evolutions = ref([]);

/* computed */
/* Funcao que busca a matricala actual do estudante */
const actualEnrollment = computed(() =>
  filterEnrollmentsByYear(enrollments.value, new Date().getFullYear())
);
/* Funcao que lista o regime (Semestral -2 / trimestral- 3) */
const regime = computed(
  () => actualEnrollment.value?.classe?.course?.academicRegime
);
/* Funcao que lista as disciplinas */
const disciplines = computed(
  () => actualEnrollment.value?.classe?.curriculum?.disciplines
);
/* Funcao  que lista o total de anos tem a matricula */
const yearsList = computed(() => {
  const startYear = new Date(
    actualEnrollment.value?.classe?.startDate
  ).getFullYear();
  const endYear = new Date(
    actualEnrollment.value?.classe?.endDate
  ).getFullYear();

  let years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return years;
});

/* methods */
const onchangeEvolutionType = async (value) => {
  await fetchStudent();
  evolutions.value = computed(() =>
  student.value.evolutions.filter(
      (e) => e.evolutionType.type === value
    )
  );
};
const fetchStudent = async () => {
  try {
    await studentStores.findOne(studentId.value);
    student.value = studentStores.student;
    enrollments.value = student.value.enrollments
  } catch (error) {
    notifyError("Erro ao carregar a estudnte");
  }
};

onBeforeRouteUpdate((to) => {
  studentId.value = to.params.id || id;
  fetchStudent();
});

const getColor = (score) => {
  if (score >= 9) return "green";
  if (score >= 7) return "orange";
  return "red";
};

onMounted(fetchStudent);
</script>

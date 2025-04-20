<template>
  <q-page padding>
    <div>
      <q-card>
        <q-card-section>
          <div class="row items-center justify-between">
            <div class="text-h6 text-primary">Emissao de boletins</div>
            <q-btn
              color="primary"
              label="Emitir"
              class="q-mr-sm"
              @click="handleBulletinIssue"
              flat
            />
          </div>
          <q-separator spaced />
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1">Informações de pesquisa</div>
          <q-card flat bordered class="q-pa-md shadow-2">
            <div class="row q-col-gutter-sm">
              <q-select
                class="col-md-6 col-sm-12 col-xs-12"
                v-model="student"
                use-input
                hide-selected
                input-debounce="0"
                :options="options"
                @filter="filterFn"
                hint="Filtro de Estudantes"
                outlined
                label="Estudantes"
                option-label="name"
                fill-input
                dense
                map-options
                @update:model-value="updateStudentSelect"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-select
                class="col-md-6 col-sm-12 col-xs-12"
                v-model="classe"
                :options="stages"
                label="Estagios"
                option-label="classe.name"
                dense
                outlined
                map-options
                @update:model-value="updateClasseSelect"
              >
                <template v-slot:selected>
                  <span v-if="classe"
                    >{{ classe.classe.name }} -
                    {{ classe.classe.course.name }}</span
                  >
                  <span v-else>Selecione um estágio</span>
                </template>

                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.classe.name }}</q-item-label>
                      <q-item-label caption>{{
                        scope.opt.classe.course.name
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <div class="row q-mt-md justify-end">
                <q-btn
                  label="Pesquisar"
                  color="primary"
                  flat
                  dense
                  type="submit"
                  @click="fetchInvoices"
                />
              </div>
            </div>
          </q-card>
        </q-card-section>
      </q-card>
      <q-card class="my-card">
        <q-card-section>
          <q-card class="q-pa-md">
            <q-card-section>
              <div class="text-h6">Desevolvimento pedagogico do Aluno</div>
            </q-card-section>

            <q-card-section class="q-gutter-md">
              <q-expansion-item
                v-for="(yearGroup, indexYear) in disciplines"
                :key="indexYear"
                :label="`Ano ${yearGroup.year}`"
                expand-separator
                icon="event"
                header-class="bg-primary text-white text-weight-bold"
              >
                <div class="q-pa-sm">
                  <q-expansion-item
                    v-for="(cicleGroup, indexCicle) in yearGroup.cicles"
                    :key="indexCicle"
                    :label="`Semestre ${cicleGroup.cicle}`"
                    expand-separator
                    icon="school"
                    header-class="bg-grey-2 text-dark text-weight-medium"
                    class="q-mb-md"
                  >
                    <q-card
                      flat
                      bordered
                      class="q-pa-md rounded-borders shadow-1"
                    >
                      <q-table
                        flat
                        :rows="cicleGroup.activities"
                        :columns="columns"
                        row-key="disciplina"
                        :rows-per-page-options="[0]"
                        hide-pagination
                        class="q-mt-md"
                      >
                        <!-- NOTAS -->
                        <template v-slot:body-cell-notas="props">
                          <q-td :props="props">
                            <div
                              v-for="(e, index) in props.row.evolutions"
                              :key="index"
                              class="q-mb-sm"
                            >
                              <div class="text-subtitle2 text-weight-medium">
                                {{ e.evolutionType.name }}
                              </div>
                              <q-chip
                                dense
                                class="q-mt-xs"
                                :color="getColor(e.note)"
                                text-color="white"
                                v-if="e.note"
                              >
                                {{ e.note }}
                              </q-chip>
                            </div>
                          </q-td>
                        </template>

                        <!-- SITUAÇÃO -->
                        <template v-slot:body-cell-situacao="props">
                          <q-td :props="props">
                            <q-badge
                              v-if="
                                props.row.exame &&
                                !getFinalGradeStatus(props.row.evolutions)
                                  .approved
                              "
                              color="red"
                              :label="
                                getFinalGradeStatus(props.row.evolutions)
                                  .mediaFinal
                              "
                              class="q-px-sm"
                            />
                            <q-badge
                              v-else
                              :color="
                                getFinalGradeStatus(props.row.evolutions)
                                  .approved
                                  ? 'green'
                                  : 'red'
                              "
                              :label="
                                getFinalGradeStatus(props.row.evolutions).label
                              "
                              class="q-px-sm"
                            />
                          </q-td>
                        </template>

                        <!-- EXAME -->
                        <template v-slot:body-cell-exame="props">
                          <q-td :props="props">
                            <q-badge
                              :label="
                                props.row.exame ? 'Com exame' : 'Sem exame'
                              "
                              color="grey-3"
                              text-color="black"
                              class="text-caption"
                              outline
                            />
                          </q-td>
                        </template>

                        <!-- ACTIONS -->
                        <template v-slot:body-cell-actions="props">
                          <q-btn
                            color="primary"
                            size="sm"
                            unelevated
                            dense
                            label="Lançar nota"
                            @click="launchGrades(props.row.id)"
                            icon="edit"
                            class="q-mt-sm"
                          />
                        </template>
                      </q-table>
                    </q-card>
                  </q-expansion-item>
                </div>
              </q-expansion-item>
            </q-card-section>
          </q-card>
        </q-card-section>

        <q-card-section>
          <q-list bordered class="rounded-borders shadow-1 q-pa-sm">
            <div class="text-h7">Disciplinas com exame</div>
            <q-item
              v-for="(item, index) in historyExame"
              :key="index"
              class="q-mb-md q-pa-sm bg-grey-1 rounded-borders"
            >
              <!-- Cabeçalho da disciplina -->
              <q-item-section>
                <q-item-label
                  class="text-subtitle1 text-primary text-weight-bold"
                >
                  {{ item.discipline }}
                </q-item-label>
                <q-item-label>
                  <q-chip
                    :color="
                      item.status === 'Admitido'
                        ? 'green'
                        : item.status === 'Dispensado'
                        ? 'orange'
                        : 'red'
                    "
                    text-color="white"
                    outline
                    class="text-weight-medium"
                  >
                    {{ item.status }}
                  </q-chip>
                </q-item-label>
                <q-item-label caption class="q-mt-xs">
                  Média final:
                  <span class="text-weight-medium">{{
                    item.finalAverage
                  }}</span>
                </q-item-label>
              </q-item-section>

              <!-- Lista de avaliações do exame -->
              <q-item-section class="q-mt-md full-width">
                <div
                  v-for="(exam, examIndex) in item.examEvolutions"
                  :key="examIndex"
                  class="q-pa-sm q-mb-sm bg-white rounded-borders shadow-1"
                >
                  <div class="row justify-between items-center">
                    <div>
                      <div class="text-weight-medium">
                        {{ exam.evolutionType.name }}
                      </div>
                      <div class="text-caption text-grey-8">
                        Nota: {{ exam.note }}
                      </div>
                    </div>
                    <q-chip
                      :color="exam.note >= 10 ? 'green' : 'red'"
                      text-color="white"
                      dense
                      class="text-weight-medium"
                    >
                      {{ exam.note >= 10 ? "Aprovado" : "Reprovado" }}
                    </q-chip>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup>
import {  onMounted, ref } from "vue";
import { useStudentStores } from "src/pages/student/store";
import { useEvolutionStores } from "src/pages/evolution/stores";
import { useRoute, useRouter } from "vue-router";

/* setup route */
const route = useRoute();
const router = useRouter();

/* setup stores */
const studentsStores = useStudentStores();
const evolutionStores = useEvolutionStores();

/* setup data */
const students = ref([]);
const student = ref(null);
const options = ref(students.value);
const classe = ref();
const stages = ref([]);
const regime = ref();
const disciplines = ref([]);
const evolutions = ref([]);
const evolutionTypeExame = ref([]);
const evolutionTypeNormal = ref();
const historyExame = ref([]);

/* setup methods */
const launchGrades = (disciplineId) => {
  router.push({
    name: "evolution-create",
    params: { classe: classe.value.classe.id, discipline: disciplineId },
  });
};

const handleBulletinIssue = () => {
  router.push({
    name: "bulletin-issue",
    params: { studentId: student.value.id, classId: classe.value?.classId },
  });
};
const updateStudentSelect = (student) => {
  stages.value = student.enrollments;
  evolutions.value = student.evolutions;
};

const updateClasseSelect = (value) => {
  regime.value = value.classe.course.institution.regime;

  const curriculum = value?.classe?.course.curriculums.find(
    (f) => f.status === "ACTIVO"
  );

  const groupedByYearAndCicle = {};

  curriculum.developmentAreas.forEach((area) => {
    area.developmentAreaActivities.forEach((dev) => {
      const { cicle, year } = dev;

      // Garante que o ano exista no objeto
      if (!groupedByYearAndCicle[year]) {
        groupedByYearAndCicle[year] = {};
      }

      // Garante que o ciclo exista dentro do ano
      if (!groupedByYearAndCicle[year][cicle]) {
        groupedByYearAndCicle[year][cicle] = [];
      }

      // Filtra as evoluções relacionadas
      const relatedEvolutions = evolutions?.value.filter(
        (e) =>
          e.developmentAreaActivityId === dev.id &&
          parseInt(e.cicle) === parseInt(dev.cicle)
      );

      // Adiciona a atividade agrupada
      groupedByYearAndCicle[year][cicle].push({
        id: dev.id,
        name: dev.activity.name,
        cicle: dev.cicle,
        year: dev.year,
        exame: dev.exame,
        evolutions: relatedEvolutions,
      });
    });
  });

  // Transforma em array organizado
  disciplines.value = Object.entries(groupedByYearAndCicle).map(
    ([year, cicles]) => ({
      year: Number(year),
      cicles: Object.entries(cicles).map(([cicle, activities]) => ({
        cicle: Number(cicle),
        activities,
      })),
    })
  );

  historyExame.value = getGroupedExamDisciplinesSummary(evolutions.value);
};

const getFinalGradeStatus = (evolutions) => {
  if (!evolutions || evolutions.length === 0) {
    return { approved: false, label: "Sem dados" };
  }

  let somaNotasPonderadas = 0;
  let somaPercentagens = 0;

  evolutions.forEach((e) => {
    const nota = parseFloat(e.note);
    const perc = parseFloat(e.perception);

    if (!isNaN(nota) && !isNaN(perc)) {
      somaNotasPonderadas += nota * perc * 10;
      somaPercentagens += perc;
    }
  });

  if (somaPercentagens === 0) {
    return { approved: false, label: "Sem percentagem" };
  }

  const mediaFinal = somaNotasPonderadas / 100;
  const isApproved = mediaFinal >= 10;

  return {
    approved: isApproved,
    mediaFinal: mediaFinal.toFixed(1),
    label: `${isApproved ? "Aprovado" : "Reprovado"} (${mediaFinal.toFixed(
      1
    )})`,
  };
};

function getGroupedExamDisciplinesSummary(data) {
  const grouped = {};

  data.forEach((e) => {
    const name = e.developmentAreaActivity?.activity?.name;
    const exame = e.developmentAreaActivity.exame;

    if (!grouped[name]) {
      grouped[name] = {
        name: name,
        evolutions: [],
        exame: exame,
        examEvolutions: [],
      };
    }


    grouped[name].evolutions.push({ note: e.note, perception: e.perception });

    if (
      evolutionTypeExame.value.includes(e.testTypeId) &&
      e.perception === 100
    ) {
      grouped[name].examEvolutions.push({
        note: e.note,
        evolutionType: e.evolutionType.name,
      });
    }
  });

  // Calcular média apenas das disciplinas com exame
  const result = [];

  Object.values(grouped).forEach((group) => {


    let totalWeighted = 0;
    let totalPercentage = 0;

    group.evolutions.forEach((evo) => {
      const note = parseFloat(evo.note);
      const perc = parseFloat(evo.perception);
      if (perc !== 100)
        if (!isNaN(note) && !isNaN(perc)) {
          totalWeighted += note * perc * 10;
          totalPercentage += perc;
        }
    });

    const finalAverage = totalWeighted / 100 / regime.value;

    let status = "";

if (finalAverage >= 14) {
  status = "Dispensado";
} else if (finalAverage >= 10) {
  status = "Admitido";
} else {
  status = "Excluido";
}


    result.push({
      discipline: group.name,
      finalAverage: finalAverage.toFixed(1),
      status: status,
      examEvolutions: group.examEvolutions,
    });
  });

  return result;
}

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = students.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};
const columns = [
  { name: "name", label: "Disciplina", field: "name", align: "left" },
  { name: "notas", label: "Notas", field: "notas", align: "left" },
  { name: "situacao", label: "Situação", field: "situacao", align: "center" },
  { name: "exame", label: "Exame", field: "exame", align: "center" },
  { name: "actions", label: "Acçoes", field: "actions", align: "center" },
];
const getColor = (score) => {
  if (score >= 9) return "green";
  if (score >= 7) return "orange";
  return "red";
};

/* Fetch data */
const fetchStudents = async () => {
  try {
    await studentsStores.list();
    students.value = studentsStores.students.map((student) => {
      return {
        id: student.id,
        name: student?.basicInformation?.fullName ?? "Default",
        ...student,
      };
    });

    await evolutionStores.list();
    evolutionTypeExame.value = evolutionStores.evolutionTypes
      .filter((e) => e.type === "Exame")
      .map((e) => e.id);

    evolutionTypeNormal.value = evolutionStores.evolutionTypes.find(
      (e) => e.type === "Normal"
    );
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchStudents();
});
</script>

<template>
  <q-page padding>
    <q-card class="q-pa-lg shadow-2 rounded-borders">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <q-input
            class="col-md-4 col-sm-6"
            v-model="dateCompletion"
            type="date"
            label="Data de Realização"
            outlined
            dense
            clearable
            :rules="[(val) => !!val || 'Obrigatório']"
          />
        </div>
      </q-card-section>
      <q-card-section class="row items-center q-gutter-sm">
        <q-icon name="grading" size="md" color="primary" />
        <div class="text-h6 text-primary">Lançamento de Notas</div>
      </q-card-section>
      <q-card-section>
        <q-table
          title="Registro de Notas"
          :rows="students"
          :columns="columns"
          row-key="id"
          :loading="loading"
        >
          <template v-slot:body-cell="props">
            <q-td :props="props" class="q-pa-sm">
              <!-- Para o campo de nome -->
              <span v-if="props.col.field === 'name'">
                {{ props.row.name }}
              </span>

              <!-- Para os campos de nota -->
              <div v-else class="column">
                <div v-if="!discipline.participation">
                  <div class="row items-center no-wrap">
                    <q-input
                      v-model.number="
                        (
                          props.row.grades[props.col.field] ?? {
                            note: 0,
                            items: {},
                          }
                        ).note
                      "
                      type="number"
                      outlined
                      dense
                      :min="0"
                      :max="20"
                      class="col"
                      @focus="
                        if (!props.row.grades[props.col.field]) {
                          props.row.grades[props.col.field] = {
                            note: 0,
                            items: {},
                          };
                        }
                      "
                      @blur="
                        updateGrade(
                          props.row.id,
                          props.col,
                         {note:  props.row.grades[props.col.field].note}
                        )
                      "
                    />

                    <q-btn
                      flat
                      dense
                      round
                      icon="expand_more"
                      class="q-ml-sm"
                      @click="toggleExpanded(props.row.id, props.col.field)"
                    />
                  </div>

                  <!-- Conteúdo expandido -->
                  <div
                    v-if="isExpanded(props.row.id, props.col.field)"
                    class="q-mt-sm bg-grey-2 q-pa-sm rounded-borders"
                  >
                    <div class="q-mt-sm">
                      <div
                        v-for="(item, index) in props.col.items"
                        :key="index"
                      >
                        <div class="row items-center no-wrap">
                          <q-input
                            v-model.number="
                              (
                                props.row.grades[props.col.field].items[
                                  item.id
                                ] ?? { note: 0 }
                              ).note
                            "
                            type="number"
                            outlined
                            :label="`${item.name} - ${item.weight}%`"
                            dense
                            :min="0"
                            :max="20"
                            class="col-md-grow"
                            @blur="
                              updateGradeItem(
                                props.row.grades[props.col.field].id,
                                item.id,
                                props.row.grades[props.col.field].items[item.id]
                                  .note,
                                props.row.grades[props.col.field].items[item.id]
                                  .id
                              )
                            "
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <q-select
                    v-if="props.col.label.includes('Participativa')"
                    v-model="
                      (
                        props.row.grades[props.col.field] ?? {
                          participation: 'NA',
                        }
                      ).participation
                    "
                    :options="['Sim', 'Não']"
                    label="Standard"
                    outlined
                    dense
                    @focus="
                      if (!props.row.grades[props.col.field]) {
                        props.row.grades[props.col.field] = {
                          participation: 'NA',
                        };
                      }
                    "
                    @update:model-value="
                        updateGrade(
                          props.row.id,
                          props.col,
                          props.row.grades[props.col.field]
                        )
                      "
                  />

                  <!-- Mostrar campo de observação apenas se for a coluna 'Observação' -->
                  <q-input
                    v-else-if="props.col.name === 'observation'"
                    v-model="(
                        props.row.grades[props.col.field] ?? {
                          observations: 'NA',
                        }
                      ).observations"
                    dense
                    outlined
                    placeholder="Observação"
                     @focus="
                        if (!props.row.grades[props.col.field]) {
                          props.row.grades[props.col.field] = {
                          observations: 'NA',
                          };
                        }
                      "
                      @blur="
                        updateGrade(
                          props.row.id,
                          props.col,
                         props.row.grades[props.col.field]
                        )
                      "
                  />
                </div>
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useClassStores } from "src/pages/class/store";
import { useStudentStores } from "src/pages/student/store";
import { useEvolutionStores } from "../stores";
import { useDevelopmentAreaStores } from "src/pages/development-area/stores";
import { useRoute, useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

/* setup stores */
const route = useRoute();
const router = useRouter();

/* setup stores */
const classStores = useClassStores();
const studentStores = useStudentStores();
const evolutionStores = useEvolutionStores();
const developmentAreaStores = useDevelopmentAreaStores();
const discipline = ref();
const { notifyInfo } = useNotify();

/* setup data */
const { classe: classId, studentId, discipline: disciplineId } = route.params;
const assessmentTypesData = ref();
const students = ref([]);
const columns = ref();
const expandedRows = ref({});
const evolution = ref();
const dateCompletion = ref();

const fetchData = async () => {
  try {
    await classStores.findOne(classId);

    const evolutionTypes = classStores.classe?.course?.evolutionTypes ?? [];
    assessmentTypesData.value = evolutionTypes.map((e) => ({
      name: e.evolutionType.name,
      key: e.id,
      weight: e.weight,
      items: e.items,
    }));

    // Define as colunas dinamicamente
    columns.value = [
      {
        name: "name",
        required: true,
        label: "Aluno",
        align: "left",
        field: "name",
      },
      ...(discipline.value.participation
        ? assessmentTypesData.value.filter(
            (type) => type.name === "Participativa"
          )
        : assessmentTypesData.value
      ).map((type) => ({
        name: type.key,
        required: true,
        label: `${type.name} - ${type.weight}%`,
        align: "center",
        field: type.key,
      })),
      ...(discipline.value.participation
        ? [
            {
              name: "observation",
              label: "Observação",
              align: "left",
           
            },
          ]
        : []),
    ];
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
};

const fetchDiscipline = async () => {
  try {
    await developmentAreaStores.findOneDevepmentActivity(disciplineId);
    discipline.value = developmentAreaStores.developmentAreaActivity;
  } catch (error) {
    console.log();
  }
};

const fetchStudents = async () => {
  try {
    await studentStores.list({ classId: classId });
    students.value = studentStores.students
      .filter((student) => {
        return !studentId || student.id === studentId;
      })
      .map((student) => {
        const evolutions = student.evolutions.filter(
          (d) => d.developmentAreaActivityId === disciplineId
        );

        return {
          id: student.id,
          name: student.basicInformation?.fullName,
          grades: evolutions.reduce((acc, evo) => {
            acc[evo.courseEvolutionTypeId] = {
              id: evo.id ?? null,
              note: Number(evo.note ?? 0),
              participation: evo.participation ?? "NA",
              observations: evo.observations ?? "NA",
              items: {},
            };

            for (const item of evo.items ?? []) {
              acc[evo.courseEvolutionTypeId].items[
                item.courseEvolutionTypeItemId
              ] = {
                id: item.id,
                note: Number(item.note ?? 0),
              };
            }

            return acc;
          }, {}),
        };
      });
  } catch (error) {
    console.log(error);
  }
};

function toggleExpanded(rowId, field) {
  console.log(field);
  const key = `${rowId}_${field}`;
  expandedRows.value[key] = !expandedRows.value[key];
}

function isExpanded(rowId, field) {
  const key = `${rowId}_${field}`;
  return !!expandedRows.value[key];
}

const loading = ref(false);

// Função para atualizar a nota (simulação de chamada à API)
const updateGrade = async (studentId, assessmentType, grade) => {
  // Aqui você faria a chamada à sua API para salvar a nota

  try {
    if (!dateCompletion.value) {
      notifyInfo("Por favor, selecione a data de realização da avaliação.");
      return;
    }
    const payload = {
      studentId: studentId,
      disciplineId: disciplineId,
      courseEvolutionTypeId: assessmentType.field,
    };
    // await api.put(`/grades/${studentId}/${assessmentType}`, { grade })
    await evolutionStores.findOne(payload);
    evolution.value = evolutionStores.evolution;
    if (evolution.value) {
      await evolutionStores.update(evolution.value.id, {
        ...grade,
      });
    } else {
      const payloadGrade = {
        studentId: studentId,
        developmentAreaActivityId: disciplineId,
        classId: classId,
        courseEvolutionTypeId: assessmentType.field,
        ...grade,
        dateCompletion: dateCompletion.value,
      };

      await evolutionStores.create(payloadGrade);
    }
  } catch (error) {
    // Lógica de erro
    console.error("Erro ao atualizar a nota:", error);
    // Exibir mensagem de erro ao usuário
  }
};

const updateGradeItem = async (
  evolutionId,
  courseEvolutionTypeItemId,
  grade,
  evolutionItemId
) => {
  try {
    if (!dateCompletion.value) {
      notifyInfo("Por favor, selecione a data de realização da avaliação.");
      return;
    }
    if (evolutionItemId) {
      await evolutionStores.updateItem(evolutionItemId, { note: grade });
    } else {
      const payload = {
        evolutionId: evolutionId,
        courseEvolutionTypeItemId: courseEvolutionTypeItemId,
        note: grade,
        dateCompletion: dateCompletion.value,
      };
      await evolutionStores.createItem(payload);
    }
  } catch (error) {
    console.log(error);
  }
};
onMounted(async () => {
  await fetchDiscipline();
  await fetchStudents();
  await fetchData();
});
</script>

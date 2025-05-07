<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-lg shadow-2 rounded-borders">
      <!-- Cabeçalho -->
      <q-card-section class="row items-center q-gutter-sm">
        <q-icon name="grading" size="md" color="primary" />
        <div class="text-h6 text-primary">Lançamento de Notas</div>
      </q-card-section>

      <!-- Seleção de Avaliação -->
      <q-card-section>
        <div class="row q-col-gutter-md">
          <q-select
            class="col-md-4 col-sm-12"
            v-model="evolutionType"
            :options="evolutionTypes"
            label="Tipo de Avaliação"
            option-value="id"
            option-label="name"
            outlined
            dense
            clearable
          />

          <q-input
            v-if="!activity?.participation"
            class="col-md-4 col-sm-6"
            v-model="dateCompletion"
            type="date"
            label="Data de Realização"
            outlined
            dense
            clearable
            :rules="[(val) => !!val || 'Obrigatório']"
          />

          <q-input
            v-if="!activity?.participation && !isInfantil"
            class="col-md-4 col-sm-6"
            v-model="perception"
            type="number"
            label="Percentagem"
            outlined
            dense
            clearable
            placeholder="0 - 100"
            :rules="[{ required: true, min: 0, max: 100 }]"
          />
        </div>
      </q-card-section>

      <!-- Tabela de Estudantes -->
      <q-card-section>
        <q-table
          :rows="students"
          :columns="columns"
          row-key="id"
          dense
          flat
          bordered
          hide-bottom
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <!-- Nome -->
              <q-td>
                <strong class="text-body1">{{ props.row.name }}</strong>
              </q-td>

              <!-- Evoluções -->
              <q-td>
                <q-list separator dense>
                  <q-item
                    v-for="ev in props.row.evolutions"
                    :key="ev.id"
                    class="bg-grey-1 q-pa-sm q-mb-sm rounded-borders"
                  >
                    <q-item-section class="text-left">
                      <div class="text-subtitle2 text-primary">
                        {{ ev.evolutionType.name }} - {{ ev.perception }}%
                      </div>
                      <div
                        class="text-caption text-secondary"
                        v-if="!isInfantil"
                      >
                        Nota:
                        <span class="text-bold" v-if="!activity.participation">
                          {{ ev.note }}
                        </span>
                        <span class="text-bold" v-else>
                          {{ ev.observations }}
                        </span>
                      </div>
                      <div v-else>
                        <span class="text-bold">
                          {{ ev.observations }}
                        </span>
                      </div>
                    </q-item-section>

                    <q-item-section side>
                      <q-btn
                        icon="delete"
                        flat
                        round
                        dense
                        size="sm"
                        color="negative"
                        @click="removeEvolution(ev)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-td>

              <!-- Campo de Nota / Participação -->
              <q-td>
                <div>
                  <q-input
                    v-if="
                      !isInfantil &&
                      ((evolutionType && perception) ||
                        !activity?.participation)
                    "
                    v-model="props.row.newNote"
                    type="number"
                    dense
                    outlined
                    clearable
                    label="Nova Nota"
                    class="q-mb-sm"
                    :rules="[{ required: true, min: 0, max: 20 }]"
                    @blur="saveGrades(props.row, props.row.newNote)"
                  />

                  <q-select
                    v-if="!isInfantil && activity?.participation"
                    v-model="participationModel"
                    :options="['Bom', 'Razoável']"
                    label="Desempenho"
                    outlined
                    dense
                    clearable
                    @update:model-value="saveGradesParticipation(props.row)"
                  />

                  <q-input
                    v-if="isInfantil"
                    v-model="participationModel"
                    dense
                    outlined
                    clearable
                    label="Nova observação"
                    class="q-mb-sm"
                    @blur="saveGradesParticipation(props.row)"
                  />
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
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useStudentStores } from "src/pages/student/store";
import { useEvolutionStores } from "../stores";
import { useDevelopmentAreaStores } from "src/pages/development-area/stores";
import { useInstitutionStores } from "src/pages/institution/store";
import useNotify from "src/composables/UseNotify";

// use store
const route = useRoute();
const studentStores = useStudentStores();
const evolutionStores = useEvolutionStores();
const developmentArea = useDevelopmentAreaStores();
const institutionStore = useInstitutionStores();

const { notifyError, notifySuccess, notifyInfo } = useNotify();
const { classe, discipline, studentId } = route.params;

/* setup data */
const students = ref([]);
const evolutionTypes = ref([]);
const evolutionType = ref(null);
const dateCompletion = ref(null);
const activity = ref(null);
const perception = ref(null);
const participationModel = ref();
const istechnical = computed(() => institutionStore.istechnical);
const isInfantil = computed(() => institutionStore.isInfantil);
const isHigh = computed(() => institutionStore.isHigh);

const columns = ref([
  { name: "number", label: "Estudante", align: "left", field: "number" },
  {
    name: "test",
    label: "Avaliação",
    align: "center",
    field: "id",
    style: "width: 50px",
  },
]);

// Função para salvar as notas
const saveGrades = async (value, note) => {
  const payload = {
    studentId: value.id,
    developmentAreaActivityId: discipline,
    classId: classe,
    testTypeId: evolutionType.value.id,
    note: note,
    perception: parseInt(perception.value) || 100,
    dateCompletion: dateCompletion.value,
    cicle: activity.value?.exame === true ? activity.value?.cicle : null,
    year: activity.value?.year,
  };
  const findStudent = students.value.find((student) => student.id === value.id);
  const evolutionExists = findStudent.evolutions.find(
    (evolution) =>
      evolution.testTypeId === evolutionType.value.id &&
      evolution.studentId === value.id &&
      evolution.developmentAreaActivityId === discipline &&
      evolution.cicle === activity.value?.cicle
  );

  if (!evolutionExists) {
    try {
      await evolutionStores.create(payload);
      fetchStudents();
      notifySuccess("Nota adicionada com sucesso");
    } catch (error) {
      notifyError("Erro ao adicionar nota");
    }
  } else {
    notifyInfo("O estudante ja foi alocada nota");
  }
};

const saveGradesParticipation = async (value) => {
  try {
    const payload = {
      studentId: value.id,
      developmentAreaActivityId: discipline,
      classId: classe,
      testTypeId: evolutionType.value.id,
      cicle: parseInt(activity.value?.cicle),
      year: activity.value?.year,
      observations: participationModel.value,
      perception: 100,
    };

    await evolutionStores.create(payload);
    await fetchStudents();
    notifySuccess("Nota adicionada com sucesso");
  } catch (error) {
    console.log(error);
  }
};

const removeEvolution = async (ev) => {
  try {
    evolutionStores.delete(ev.id);
     fetchStudents();
  } catch (error) {
    console.log(error)
  }
};

const fetchStudents = async () => {
  try {
    await studentStores.list({ classId: classe });
    students.value = studentStores.students
      .filter((student) => {
        // Se studentId estiver definido, filtra apenas esse estudante
        return !studentId || student.id === studentId;
      })
      .map((student) => {
        const evolutions = student.evolutions.filter(
          (d) => d.developmentAreaActivityId === discipline
        );

        return {
          id: student.id,
          name: student.basicInformation?.fullName,
          evolutions,
        };
      });
  } catch (error) {
    notifyError("Erroa ao carregar avaliaçoes ");
  }
};

const fetchEvolutionType = async () => {
  try {
    await evolutionStores.list();

    if (istechnical) {
      evolutionTypes.value = evolutionStores.evolutionTypes;
    } else {
      if (activity.value?.exame === true) {
        evolutionTypes.value = evolutionStores.evolutionTypes.filter(
          (e) => e.type === "Exame"
        );
      } else {
        evolutionTypes.value =
          activity.value?.participation === true
            ? evolutionStores.evolutionTypes.filter(
                (e) => e.name === "Participou" && e.type === "Normal"
              )
            : evolutionStores.evolutionTypes.filter(
                (e) => e.name !== "Participou" && e.type === "Normal"
              );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchActivity = async () => {
  try {
    await developmentArea.findOneDevepmentActivity(discipline);
    activity.value = developmentArea.developmentAreaActivity;
  } catch (error) {
    notifyError("Erro ao carregar actividade");
  }
};
onMounted(async () => {
  await fetchActivity();
  await fetchStudents();
  await fetchEvolutionType();
});
</script>

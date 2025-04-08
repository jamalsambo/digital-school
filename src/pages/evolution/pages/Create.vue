<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Lançamento de Notas</div>
      </q-card-section>
      <!-- Seleção de Turma e Disciplina -->
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <q-select
            class="col-md-3 col-sm-12 col-xs-12"
            v-model="evolutionType"
            :options="evolutionTypes"
            label="Selecione o Tipo de Avaliacao"
            option-value="id"
            option-label="name"
            outlined
            dense=""
            @update:model-value="changeEvolutionType"
          />

          <q-input
            class="col-md-3 col-sm-6 col-xs-12"
            v-model="dateCompletion"
            type="date"
            label="Data de realização"
            outlined
            :rules="[(val) => !!val || 'A data de realização é obrigatória.']"
            dense
          />

          <q-input
            class="col-md-2 col-sm-12 col-xs-12"
            v-model="perception"
            type="number"
            dense
            outlined
            label="Percentagem do Avaliacao"
            placeholder="Digite a Percentagem"
          />

          <q-select
            class="col-md-2 col-sm-12 col-xs-12"
            v-model="actualRegime"
            :options="dailyLabels"
            :label="`Selecione um ${getRegimeName(institution?.regime)}`"
            option-value="id"
            option-label="name"
            outlined
            dense=""
            @update:model-value="changeEvolutionType"
          />
          <q-select
            class="col-md-2 col-sm-12 col-xs-12"
            v-model="actualYearProgram"
            :options="yearsProgram"
            :label="`Selecione o ano`"
            option-value="id"
            option-label="name"
            outlined
            dense=""
            @update:model-value="changeEvolutionType"
            :disable="['Ensino Médio', 'Ensino Fundamental'].includes(institution.educationLevel.name)"
          />
        </div>
      </q-card-section>

      <!-- Tabela de Estudantes e Notas -->
      <q-card-section>
        <q-table
          :rows="students"
          :columns="columns"
          row-key="id"
          dense
          flat
          bordered
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <!-- Número do Estudante -->
              <q-td>
                <strong>{{ props.row?.basicInformation?.fullName }}</strong>
              </q-td>

              <!-- Evoluções -->
              <q-td>
                <q-list bordered dense>
                  <q-item
                    v-for="evolution in filteredEvolutions(props.row.id)"
                    :key="evolution.id"
                    class="q-my-xs"
                  >
                    <q-item-section
                      v-for="ev in evolution.evolutions"
                      :key="ev.id"
                      style="
                        background-color: #f9f9f9;
                        border-radius: 5px;
                        margin-bottom: 10px;
                        padding: 10px;
                      "
                    >
                      <div class="row items-start">
                        <div class="column text-left" style="flex: 1">
                          <strong class="text-primary q-mb-xs">{{
                            ev.evolutionType.name
                          }}</strong>
                          <span class="text-weight-bold text-secondary q-mb-sm">
                            Nota: {{ ev.note }}
                          </span>
                        </div>
                        <q-btn
                          flat
                          icon="delete"
                          size="sm"
                          color="negative"
                          @click="removeEvolution(props.row, evolution)"
                        />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-td>

              <!-- Campo de Notas -->
              <q-td>
                <q-input
                  v-if="evolutionType && perception"
                  v-model="props.row.newNote"
                  type="number"
                  dense
                  outlined
                  label="Nova Nota"
                  placeholder="Digite a nota"
                  class="col-md-12 col-sm-12 col-xs-12"
                  :rules="[{ required: true, min: 0, max: 20 }]"
                  @blur="saveGrades(props.row, props.row.newNote)"
                />
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
import { useInstitutionStores } from "src/pages/institution/store";
import { useClassStores } from "src/pages/class/store";
import useNotify from "src/composables/UseNotify";
import scripts from "src/composables/Scripts";

// use store
const route = useRoute();
const studentStores = useStudentStores();
const evolutionStores = useEvolutionStores();
const institutionStores = useInstitutionStores()
const classStores = useClassStores()
const { notifyError, notifySuccess, notifyInfo } = useNotify();
const { classe, discipline } = route.params;
const { getRegimeName, getActualRegime, enumerateProgramYears, getCurrentYearOfProgram } = scripts()

/* setup data */
const students = ref([]);
const classeActual = ref()
const evolutionTypes = ref([]);
const evolutionType = ref(null);
const perception = ref(null);
const dateCompletion = ref(null);
const institution = computed(() => institutionStores.institution)
const dailyLabels = computed(() => Array.from({ length: institution.value?.regime }, (_, i) => i + 1))
const actualRegime = ref( getActualRegime(institution.value?.regime ))
const yearsProgram = ref([])
const actualYearProgram = ref()

const filteredEvolutions = (id) => {
  return students.value
    .flatMap((student) => ({
      evolutions: student.evolutions.filter(
        (evolution) => evolution.disciplineId === discipline && evolution.studentId === id
      ),
    }))
    .filter((student) => student.evolutions.length > 0)
}

const columns = ref([
  { name: "number", label: "Estudante", align: "left", field: "number" },
  {
    name: "test",
    label: "Avaliacao",
    align: "center",
    field: "id",
    style: "width: 50px",
  },
]);

// Função para salvar as notas
const saveGrades = async (value, note) => {
  const payload = {
    studentId: value.id,
    disciplineId: discipline,
    classId: classe,
    testTypeId: evolutionType.value.id,
    note: note,
    perception: parseInt(perception.value),
    dateCompletion: dateCompletion.value,
    cicle: actualRegime.value,
    year: actualYearProgram.value
  };
  const findStudent = students.value.find((student) => student.id === value.id);
  const evolutionExists = findStudent.evolutions.find(
    (evolution) =>
      evolution.testTypeId === evolutionType.value.id &&
      evolution.studentId === value.id &&
      evolution.disciplineId === discipline
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

const changeEvolutionType = (value) => {
  const findEvolutions = students.value;
  const perceptionResult = findEvolutions[0].evolutions.find(
    (evolution) => evolution.testTypeId === value.id
  )?.perception;
  perception.value = perceptionResult;
};

const fetchStudents = async () => {
  try {
    await studentStores.list({ classId: classe, disciplineId: discipline });
    students.value = studentStores.students;

    await classStores.findOne(classe)
    classeActual.value = classStores.classe
    yearsProgram.value = enumerateProgramYears(classeActual.value?.startDate,classeActual.value?.endDate)
    actualYearProgram.value = getCurrentYearOfProgram(classeActual.value?.startDate,classeActual.value?.endDate)
  } catch (error) {
    console.error(error);
  }
};

const fetchEvolutionType = async () => {
  try {
    await evolutionStores.list();
    evolutionTypes.value = evolutionStores.evolutionTypes;
  } catch (error) {
    console.error(error);
  }
};
onMounted(() => {
  fetchStudents();
  fetchEvolutionType();
});
</script>

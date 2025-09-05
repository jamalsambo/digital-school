<template>
  <q-page padding>
    <div class="q-gutter-md">
      <!-- Header Card -->
      <q-card>
        <q-card-section>
          <div class="row items-center justify-between">
            <div class="text-h6 text-primary">Controle Acadêmico</div>
            <q-btn
              color="primary"
              :label="!issueDocument ? 'Emitir' : 'Cancelar emissão'"
              flat
              @click="issueDocument = !issueDocument"
            />
          </div>
        </q-card-section>
        <q-separator />

        <!-- Pesquisa -->
        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">Informações de Pesquisa</div>
          <q-card flat bordered class="q-pa-md shadow-1">
            <div class="row q-col-gutter-md">
              <!-- Seletor de Estudante -->
              <q-select
                v-model="student"
                use-input
                hide-selected
                input-debounce="0"
                :options="options"
                @filter="filterFn"
                label="Estudantes"
                hint="Filtro de Estudantes"
                outlined
                dense
                map-options
                fill-input
                option-label="name"
                class="col-md-grow col-sm-12 col-xs-12"
                @update:model-value="updateStudentSelect"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey"
                      >Nenhum resultado</q-item-section
                    >
                  </q-item>
                </template>
              </q-select>

              <!-- Seletor de Classe -->
              <q-select
                v-model="classe"
                :options="stages"
                option-label="classe.name"
                label="Estágios"
                outlined
                dense
                map-options
                class="col-md-grow col-sm-12 col-xs-12"
                @update:model-value="updateClasseSelect"
              >
                <template #selected>
                  <span v-if="classe"
                    >{{ classe.classe.name }} -
                    {{ classe.classe.course.name }}</span
                  >
                  <span v-else>Selecione um estágio</span>
                </template>

                <template #option="scope">
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
              <q-select
                v-if="issueDocument"
                class="col-md-grow col-sm-12 col-xs-12"
                v-model="emission"
                :options="docs"
                label="Standard"
                option-label="name"
                outlined
                dense
                map-options
                @update:model-value="handleImission(emission)"
              />
            </div>
          </q-card>
        </q-card-section>
      </q-card>

      <!-- Histórico Acadêmico -->
      <HistoryStudent
        v-if="student"
        :student-history="studentHistory"
        :launch-grades="launchGrades"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStudentStores } from "src/pages/student/store";
import { useHistoryStores } from "../stores";
import { useRoute, useRouter } from "vue-router";
import getColumns from "../components/ColumnsControl";
import HistoryStudent from "../components/HistoryStudent.vue";

/* setup route */
const route = useRoute();
const router = useRouter();

/* setup stores */
const studentsStores = useStudentStores();
const historyStores = useHistoryStores();
const columns = computed(() => getColumns());

/* setup data */
const students = ref([]);
const student = ref(null);
const options = ref(students.value);
const classe = ref();
const stages = ref([]);
const studentHistory = ref();
const emission = ref();
const issueDocument = ref(false);
const docs = ref([
  { value: "certificate", name: "Certificado" },
  { value: "note", name: "Nota Informativa" },
]);

/* setup methods */
const updateStudentSelect = (student) => {
  stages.value = student.enrollments;
};

const updateClasseSelect = async (value) => {
  const { courseId } = value.classe;
  await historyStores.findStudentHistory(student.value.id, courseId);
  studentHistory.value = historyStores.studentHistory;
  try {
  } catch (error) {
    console.log(error);
  }
};

const launchGrades = (disciplineId) => {
  router.push({
    name: "evolution-create",
    params: {
      classe: classe.value.classe.id,
      discipline: disciplineId,
      studentId: student.value.id,
    },
  });
};

const handleImission = (value) => {
  if (value.value === "certificate") {
    router.push({
      name: "emission-certificate",
      params: {
        courseId: classe.value.id,
        studentId: student.value.id,
      },
    });
  } else {
     router.push({
      name: "emission-informative-note",
      params: {
        cicle: 1,
        studentId: student.value.id,
      },
    });
  }
};

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = students.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
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
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchStudents();
});
</script>

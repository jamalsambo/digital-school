<template>
  <q-page padding>
    <div>
      <q-card>
        <q-card-section>
          <div class="text-h5">Boletins</div>
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
                option-value="classe.id"
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

              <q-card-section>
                <q-expansion-item
                  v-for="(semestre, index) in boletim"
                  :key="index"
                  :label="`Semestre ${index + 1}`"
                  expand-separator
                  icon="school"
                >
                  <q-table
                    flat
                    bordered
                    :rows="semestre"
                    :columns="columns"
                    row-key="disciplina"
                     :rows-per-page-options="[0]"
                     hide-pagination=""
                  >
                    <template v-slot:body-cell-situacao="props">
                      <q-td :props="props">
                        <q-badge
                          color="green"
                          label="Aprovado"
                          align="center"
                        />
                      </q-td>
                    </template>
                  </q-table>
                </q-expansion-item>
              </q-card-section>
            </q-card>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { useStudentStores } from "src/pages/student/store";

/* setup data */
const studentsStores = useStudentStores();
/* setup data */
const students = ref([]);
const student = ref(null);
const options = ref(students.value);
const stages = ref([]);
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

const updateStudentSelect = (student) => {
  stages.value = student.enrollments;
  // invoices.value = student.invoices;
};

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    options.value = students.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};
const columns = [
  { name: 'disciplina', label: 'Disciplina', field: 'disciplina', align: 'left' },
  { name: 'aval1', label: 'Aval. 1', field: 'aval1', align: 'center' },
  { name: 'aval2', label: 'Aval. 2', field: 'aval2', align: 'center' },
  { name: 'aval3', label: 'Aval. 3', field: 'aval3', align: 'center' },
  { name: 'media', label: 'Média', field: 'media', align: 'center' },
  { name: 'situacao', label: 'Situação', field: 'situacao', align: 'center' }
]

const boletim = [
  [ // Semestre 1
    { disciplina: 'Língua Portuguesa', aval1: 8.5, aval2: 7, aval3: 9.2, media: 8.2, situacao: 'Aprovado' },
    { disciplina: 'Matemática', aval1: 9, aval2: 8.5, aval3: 7.8, media: 8.4, situacao: 'Aprovado' },
    { disciplina: 'História', aval1: 7.5, aval2: 8, aval3: 8.5, media: 8, situacao: 'Aprovado' },
    { disciplina: 'Ciências', aval1: 8, aval2: 8, aval3: 8, media: 8, situacao: 'Aprovado' }
  ],
  [ // Semestre 2 (exemplo futuro)
    { disciplina: 'Língua Portuguesa', aval1: 7.5, aval2: 8, aval3: 8.5, media: 8, situacao: 'Aprovado' },
    { disciplina: 'Matemática', aval1: 8, aval2: 8.5, aval3: 8.2, media: 8.2, situacao: 'Aprovado' },
    { disciplina: 'História', aval1: 7, aval2: 7.5, aval3: 8, media: 7.5, situacao: 'Aprovado' },
    { disciplina: 'Ciências', aval1: 8.5, aval2: 8.5, aval3: 9, media: 8.7, situacao: 'Aprovado' }
  ]
]
onMounted(async () => {
  await fetchStudents();
});
</script>

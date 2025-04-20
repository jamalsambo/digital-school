<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Adicionar Disciplinas</div>
          <div class="text-subtitle2">
            Selecione as disciplinas para associar ao funcionário.
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <q-select
                v-model="employee"
                class="col-md-8 col-sm-12 col-xs-12"
                :options="employees"
                label="Professores"
                option-label="name"
                option-value="id"
                outlined
                map-options
                clearable
                :rules="[(val) => !!val || 'Selecione um professor.']"
                dense
                @update:model-value="onchangeSelectedEmployee(employee.id)"
              />

              <q-select
                v-if="visibleSemeters"
                class="col-md-4 col-sm-12 col-xs-12"
                :options="['courses']"
                label="Semestre"
                option-label="name"
                option-value="id"
                outlined
                emit-value
                map-options
                :rules="[(val) => !!val || 'Selecione um curso.']"
                dense
              />
            </div>
          </q-card-section>

          <q-list bordered>
            <q-item
              v-for="discipline in disciplines"
              :key="discipline.id"
              clickable
            >
              <q-item-section avatar>
                <q-checkbox
                  v-model="discipline.checked"
                  :val="discipline.id"
                  @update:model-value="updateSelection(discipline)"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ discipline.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-separator />
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useEmployeeStores } from "../stores";
import { useClassStores } from "src/pages/class/store";
import scripts from "src/composables/Scripts";
import useNotify from "src/composables/UseNotify";

// Stores
const route = useRoute();
const employeeStores = useEmployeeStores();
const classStores = useClassStores();
const { notifyError, notifySuccess } = useNotify();
const { determineRegime } = scripts();

// data
const { id } = route.params;
const employees = ref([]);
const employee = ref(null);
const disciplines = ref([]);
// const employeeTeachings = ref([])

// Disciplinas selecionadas
const selectedDisciplines = ref([]);
const visibleSemeters = ref(false);

// methods
const updateSelection = async (discipline) => {


  const payload = {
    employeeId: employee.value.id,
    developmentAreaActivityId: discipline.id,
    classId: id,
  };

  try {
    if (!discipline.checked) {
      // Uncheck: Remove a disciplina selecionada
      await employeeStores.removeTeachings(employee.value.id,discipline.id)
      notifySuccess("Disciplina adicionada");

    } else {
      // check: Remove a disciplina selecionada
      await employeeStores.addTeachings(payload);
      notifySuccess("Disciplina adicionada com sucesso");
    }
  } catch (error) {
    notifyError("Ocorreu um error");
  }
};

const fetchEmployees = async () => {
  try {
    await employeeStores.list();
    employees.value = employeeStores.employees
      .filter((e) => e.teacher === 'Sim') // Primeiro filtra os professores
      .map((e) => ({
        id: e.id,
        name: e?.basicInformation?.fullName ?? "Default",
        teacher: e.teacher,
      }));
  } catch (error) {}
};

const fetchClass = async () => {
  try {
    await classStores.findOne(id);
    if (classStores.classe.curriculumId) {
      console.log("tem curriculum");
    } else {
      const curriculum =  classStores.classe.course.curriculums.find((f) => f.status==='ACTIVO')
      disciplines.value = curriculum.developmentAreas.flatMap(
          (area) => {
            return area.developmentAreaActivities.map((dev) => {
              console.log(dev)
              return {
                id: dev.id,
                name: dev.activity.name, // ou qualquer outro dado relevante
              }; // ou qualquer outro dado relevante
            });
          }
        );
    }
  } catch (error) {
    notifyError("Erro no carregamentos");
  }
};

const onchangeSelectedEmployee = async (val) => {
  try {
    await employeeStores.findTeachings(val);
  } catch (error) {
    notifyError("Falha ao carregar as disciplinas.");
    return;
  }

  disciplines.value = disciplines.value.map((d) => {
    const employeeDisciplines = employeeStores.teachings;

    const isAssociated = employeeDisciplines.some(
      (emp) => emp.developmentAreaActivityId === d.id && emp.classId === id
    );

    return {
      id: d.id,
      name: d.name,
      checked: isAssociated, // Define como `true` apenas se a disciplina estiver associada
    };
  });
};

onMounted(async () => {
  await fetchEmployees();
  await fetchClass();
});
</script>

<style scoped>
.text-h6 {
  font-weight: bold;
}
</style>

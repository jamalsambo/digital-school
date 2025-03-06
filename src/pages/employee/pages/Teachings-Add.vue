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
              v-for="discipline in disciplineFiltered"
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
const disciplineFiltered = ref([]);
// Disciplinas selecionadas
const selectedDisciplines = ref([]);
const visibleSemeters = ref(false);

// methods
const updateSelection = async (discipline) => {
  const index = selectedDisciplines.value.findIndex(
    (d) => d.id === discipline.id
  );

  const payload = {
    employeeId: employee.value.id,
    disciplineId: discipline.id,
    classId: id,
  };

  try {
    if (index !== -1) {
      // Uncheck: Remove a disciplina selecionada
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
    employees.value = employees.value = employeeStores.employees.map((e) => {
      return {
        id: e.id,
        name: e?.basicInformation?.fullName ?? "Default",
      };
    });
  } catch (error) {}
};

const fetchClass = async () => {
  try {
    await classStores.findOne(id);
    disciplines.value = classStores.classe.curriculum.disciplines;
  } catch (error) {
    notifyError("Erro no carregamento")
  }
};
const onchangeSelectedEmployee = async (val) => {
  try {
    await employeeStores.findTeachings(val);
    // employeeTeachings.value = employeeStores.teachings;
  } catch (error) {
    notifyError("Falha ao carregar os disciplinas.");
  }

  const disc = disciplines.value.map((d) => {
      const employeeDisciplines = employeeStores.teachings;

      const isAssociated = employeeDisciplines.some(
        (emp) => emp.discipline.id === d.id && emp.classId === id
      );
      return {
        id: d.id,
        name: d.name,
        checked: !!isAssociated,
      };
    });

    disciplineFiltered.value = disc;
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

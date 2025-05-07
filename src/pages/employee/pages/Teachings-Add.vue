<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card flat bordered class="shadow-2">
        <q-card-section>
          <div class="text-h6">Associar Disciplinas ao Professor</div>
          <div class="text-body2 text-grey-7">
            Escolha um professor e associe as disciplinas desejadas por ciclo.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- Professor -->
            <q-select
              v-model="employee"
              class="col-md-6 col-sm-12"
              :options="employees"
              label="Professor"
              option-label="name"
              option-value="id"
              outlined
              map-options
              clearable
              dense
              :rules="[(val) => !!val || 'Selecione um professor.']"
              @update:model-value="handleEmployeeChange(employee?.id)"
            />

            <!-- Disciplinas -->
            <q-select
              class="col-md-6 col-sm-12"
              outlined
              v-model="selected"
              multiple
              :options="options"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              use-chips
              stack-label
              label="Disciplinas por Ciclo"
              dense
            >
              <template v-slot:selected-item="scope">
                <q-chip @remove="removeSelection(scope.opt.value)">
                  {{ scope.opt.label }}
                </q-chip>
              </template>

              <template v-slot:option="scope">
                <q-item clickable v-ripple @click="toggleSelection(scope.opt)">
                  <q-item-section>
                    <q-item-label>
                      <strong v-if="scope.opt.isGroup">
                        {{ scope.opt.label }}
                      </strong>
                      <span v-else>{{ scope.opt.label }}</span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-icon v-if="isSelected(scope.opt)" name="check" />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </q-card-section>

        <q-separator />
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEmployeeStores } from '../stores';
import { useClassStores } from 'src/pages/class/store';
import useNotify from 'src/composables/UseNotify';

// Stores e utilitários
const route = useRoute();
const { notifyError, notifySuccess } = useNotify();
const employeeStores = useEmployeeStores();
const classStores = useClassStores();

// Estado
const { id: classId } = route.params;
const employees = ref([]);
const employee = ref(null);
const disciplines = ref([]);
const selected = ref([]);

// Funções auxiliares
const isSelected = (opt) => selected.value.includes(opt.value);

const fetchEmployees = async () => {
  try {
    await employeeStores.list();
    employees.value = employeeStores.employees
      .filter((e) => e.teacher === 'Sim')
      .map((e) => ({
        id: e.id,
        name: e?.basicInformation?.fullName ?? 'Default',
        teacher: e.teacher,
      }));
  } catch (err) {
    notifyError('Erro ao carregar professores.');
  }
};

const fetchClassDisciplines = async () => {
  try {
    await classStores.findOne(classId);

    if (!classStores.classe.curriculumId) {
      const curriculum = classStores.classe.course.curriculums.find(
        (c) => c.status === 'ACTIVO'
      );

      disciplines.value = curriculum?.developmentAreas?.flatMap((area) =>
        area.developmentAreaActivities.map((dev) => ({
          id: dev.id,
          name: dev.activity.name,
          cicle: dev.cicle,
        }))
      ) ?? [];
    }
  } catch {
    notifyError('Erro ao carregar a turma.');
  }
};

const handleEmployeeChange = async (employeeId) => {
  try {
    await employeeStores.findTeachings(employeeId);
    selected.value = employeeStores.teachings.map(
      (t) => t.developmentAreaActivityId
    );
  } catch {
    notifyError('Falha ao carregar as disciplinas.');
  }
};

const rawData = computed(() => {
  const grouped = {};
  disciplines.value.forEach((d) => {
    if (!grouped[d.name]) grouped[d.name] = { cicles: [] };
    grouped[d.name].cicles.push({ id: d.id, cicle: d.cicle });
  });
  return grouped;
});

const options = computed(() => {
  const list = [];
  for (const discipline in rawData.value) {
    list.push({ label: discipline, isGroup: true });
    rawData.value[discipline].cicles.forEach((c) => {
      list.push({
        label: `Ciclo ${c.cicle}`,
        value: c.id,
        parent: discipline,
      });
    });
  }
  return list;
});

const toggleSelection = async (opt) => {
  if (opt.isGroup) return;

  const payload = {
    employeeId: employee.value.id,
    developmentAreaActivityId: opt.value,
    classId,
  };

  const index = selected.value.indexOf(opt.value);
  const isAdding = index === -1;

  try {
    if (isAdding) {
      selected.value.push(opt.value);
      await employeeStores.addTeachings(payload);
      notifySuccess('Disciplina adicionada com sucesso');
    } else {
      selected.value.splice(index, 1);
      await employeeStores.removeTeachings(employee.value.id, opt.id);
    }
  } catch {
    notifyError('Ocorreu um erro ao atualizar a disciplina.');
  }
};

const removeSelection = (val) => {
  const index = selected.value.indexOf(val);
  if (index !== -1) selected.value.splice(index, 1);
};

// Lifecycle
onMounted(async () => {
  await fetchEmployees();
  await fetchClassDisciplines();
});
</script>


<style scoped>
.text-h6 {
  font-weight: bold;
}
</style>

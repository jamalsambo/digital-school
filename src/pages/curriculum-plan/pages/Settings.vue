<template>
  <q-page padding>
    <PrecedenceDialogModal
      :precedence-dialog="precedenceDialog"
      :current-discipline="currentDiscipline"
      :allocated-disciplines="allocatedDisciplines"
      :-handled-add-precedence="HandledAddPrecedence"
    >
      <template #actions>
        <q-btn flat label="Fechar" @click="precedenceDialog = false" />
      </template>
    </PrecedenceDialogModal>
    <q-card class="q-pa-md q-mx-auto">
      <q-card-section>
        <h4>Alocação de Disciplinas por Área</h4>
        <q-list bordered separator>
          <q-item
            v-for="area in developmentAreas"
            :key="area.id"
            class="q-mb-md"
          >
            <q-item-section>
              <q-item-label class="text-h6">{{ area.name }}</q-item-label>

              <!-- QSelect para disciplinas -->
              <q-select
                v-model="selectedDisciplines[area.id]"
                :options="getAvailableDisciplines()"
                label="Selecione uma Disciplina"
                option-label="name"
                emit-value
                map-options
                dense
                outlined
                @update:model-value="onDisciplineSelected(area.id)"
                class="q-mt-sm q-mb-sm"
              />

              <!-- Lista de disciplinas alocadas -->
              <q-expansion-item
                dense
                expand-separator
                icon="folder"
                label="Disciplinas Alocadas"
                header-class="bg-grey-2 text-black"
                class="q-mb-md"
              >
                <template v-if="(allocatedDisciplines[area.id] || []).length">
                  <q-list>
                    <q-item
                      v-for="(d, index) in allocatedDisciplines[area.id]"
                      :key="index"
                    >
                      <q-item-section>
                        <q-item-label>{{ d.name }}</q-item-label>
                        <q-item-label caption>
                          Horas: {{ d.hours }}, Créditos: {{ d.credit }}, Exame:
                          {{ d.exame }}, Crítica: {{ d.critical }},
                          Participação: {{ d.participation }}, Ano:
                          {{ d.year }}, Ciclo: {{ d.cicle }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side v-if="d.year !== 1">
                        <q-btn
                          dense
                          flat
                          round
                          icon="swap_vert"
                          color="primary"
                          @click="openPrecedenceDialog(area.id, d)"
                          :title="'Gerir Precedência'"
                        />
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          dense
                          flat
                          icon="delete"
                          color="red"
                          @click="
                            removeDiscipline(area.id, index, d.activityId)
                          "
                          :title="'Remover Disciplina'"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </template>
                <template v-else>
                  <div class="q-pa-sm text-grey">
                    Nenhuma disciplina alocada.
                  </div>
                </template>
              </q-expansion-item>

              <!-- Detalhes se disciplina foi selecionada -->
              <div v-if="formState[area.id]">
                <q-input
                  v-model="formState[area.id].hours"
                  label="Horas"
                  type="number"
                  dense
                  outlined
                  class="q-mb-sm"
                />
                <q-input
                  v-model="formState[area.id].credit"
                  label="Créditos"
                  type="number"
                  dense
                  outlined
                  class="q-mb-sm"
                />
                <q-select
                  v-model="formState[area.id].exame"
                  :options="[
                    { label: 'Sim', value: true },
                    { label: 'Nao', value: false },
                  ]"
                  label="Exame"
                  outlined=""
                  dense
                  map-options
                  class="q-mb-sm"
                />
                <q-select
                  class="q-mb-sm"
                  v-model.number="formState[area.id].critical"
                  :options="[
                    { label: 'Sim', value: true },
                    { label: 'Nao', value: false },
                  ]"
                  label="Importante na transição"
                  outlined=""
                  dense
                  map-options
                />
                <q-select
                  class="q-mb-sm"
                  v-model.number="formState[area.id].participation"
                  :options="[
                    { label: 'Sim', value: true },
                    { label: 'Nao', value: false },
                  ]"
                  label="Participativa somente"
                  outlined=""
                  dense
                  map-options
                />
                <q-input
                  v-model="formState[area.id].year"
                  label="Ano"
                  dense
                  outlined
                  class="q-mb-sm"
                />
                <q-select
                  class="q-mb-sm"
                  v-model="formState[area.id].cicle"
                  :options="cicles"
                  label="Ciclo no ano"
                  outlined
                  dense
                  map-options
                  multiple
                  use-chips
                />
                <q-btn
                  label="Alocar"
                  color="primary"
                  @click="allocateDiscipline(area.id)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useInstitutionStores } from "src/pages/institution/store";
import { useDevelopmentAreaStores } from "src/pages/development-area/stores";
import { useDisciplineStores } from "src/pages/discipline/store";
import PrecedenceDialogModal from "../components/PrecedenceDialogModal.vue";
import { useRoute } from "vue-router";

/* setup router */
const route = useRoute();

/* setup stores */
const institutionStores = useInstitutionStores();
const developmentAreaStores = useDevelopmentAreaStores();
const disciplineStores = useDisciplineStores();

/* setup data */
const { curriculumId } = route.params;
const institution = computed(() => institutionStores.institution);
const developmentAreas = ref([]);
const disciplineOptions = ref([]);
const precedenceDialog = ref(false);
const currentDiscipline = ref(null);
const selectedDisciplines = reactive({});
const allocatedDisciplines = reactive({});
const formState = reactive({});

const regime = computed(() =>
  Array.from({ length: institution.value.regime }, (_, i) => i + 1)
);
const cicles = computed(() => {
  const tipo =
    institution.value.regime === 1
      ? "Ano"
      : institution.value.regime === 2
      ? "Semestre"
      : "Trimestre";

  return regime.value.map((r) => ({
    label: `${r}º ${tipo}`,
    value: r,
  }));
});

// Obter disciplinas alocadas globalmente
const globallyAllocated = computed(() => {
  const set = new Set();
  Object.values(allocatedDisciplines).forEach((list) => {
    list?.forEach((d) => set.add(d.activityId));
  });
  return set;
});

function getAvailableDisciplines() {
  return disciplineOptions.value.filter(
    (opt) => !globallyAllocated.value.has(opt.id)
  );
}

function onDisciplineSelected(areaValue) {
  const selected = selectedDisciplines[areaValue];
  if (!selected) return;

  formState[areaValue] = {
    hours: 0,
    credit: 0,
    exame: false,
    critical: false,
    participation: false,
    year: "",
    cicle: [],
  };
}

function allocateDiscipline(areaValue) {
  const disciplineValue = selectedDisciplines[areaValue];
  const discipline = disciplineOptions.value.find((d) => d === disciplineValue);

  if (!discipline || !formState[areaValue]) return;

  if (!allocatedDisciplines[areaValue]) {
    allocatedDisciplines[areaValue] = [];
  }

  allocatedDisciplines[areaValue].push({
    ...formState[areaValue],
    ...discipline,
  });

  formState[areaValue].cicle.forEach(async (cicle) => {
    await developmentAreaStores.addDevelopmentActivity(areaValue, {
      exame: formState[areaValue].exame.value,
      critical: formState[areaValue].critical.value,
      participation: formState[areaValue].participation.value,
      year: parseInt(formState[areaValue].year),
      cicle: cicle.value,
      hours: parseInt(formState[areaValue].hours),
      credit: parseInt(formState[areaValue].credit),
      activityId: discipline.id,
      developmentAreaId: areaValue,
    });
  });

  selectedDisciplines[areaValue] = null;
  formState[areaValue] = null;
}

const removeDiscipline = async (areaValue, index, disciplineId) => {
  try {
    await developmentAreaStores.deleteDevelopmentActivity(
      areaValue,
      disciplineId
    );
    allocatedDisciplines[areaValue].splice(index, 1);
  } catch (error) {
    console.log(error);
  }
};

const openPrecedenceDialog = (area, discipline) => {
  currentDiscipline.value = discipline;
  precedenceDialog.value = true;
};

const HandledAddPrecedence = async (value) => {
  try {
    const disciplineId = currentDiscipline.value.id;
    const precedenceId = value.id;

    await developmentAreaStores.addActivityPrecedence(
      disciplineId,
      precedenceId
    );
  } catch (error) {
    console.log(error);
  }
};
/* fetch data */
const fetchDevelopmentAreas = async () => {
  try {
    await developmentAreaStores.list({ curriculumId: curriculumId });
    developmentAreas.value = developmentAreaStores.developmentAreas;
    developmentAreas.value.forEach((area) => {
      allocatedDisciplines[area.id] = (
        area.developmentAreaActivities || []
      ).map((d) => ({
        name: d.activity.name,
        ...d,
      }));
    });
  } catch (error) {
    console.log(error);
  }
};

const fetchDisciplines = async (educationId) => {
  try {
    await disciplineStores.list(educationId);
    disciplineOptions.value = disciplineStores.disciplines;
  } catch (error) {
    console.log(error);
  }
};

watch(institution, (newValue) => {
  if (newValue?.educationId) {
    fetchDisciplines(newValue.educationId);
  }
});

onMounted(() => {
  fetchDevelopmentAreas();
});
</script>

<style scoped>
.q-card-section h4 {
  margin-bottom: 10px;
}
</style>

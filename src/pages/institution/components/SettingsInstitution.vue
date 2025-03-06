<template>
  <q-dialog v-model="medium" persistent>
    <q-card style="width: 900px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Configuração da instituição</div>
      </q-card-section>
      <!-- Seccao de nivel de educacao da instituicao -->
      <q-card-section>
        <div class="border q-pa-md shadow-2">
          <span><strong>Niveis Educacional da instituição</strong> </span>
          <q-separator />
          <q-list>
            <q-item
              v-for="education in educationLevel"
              :key="education.id"
              clickable
            >
              <q-item-section avatar>
                <q-checkbox
                  v-model="education.checked"
                  :val="education.id"
                  @update:model-value="updateSelection(education)"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ education.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  v-if="education.checked"
                  flat
                  dense
                  round
                  icon="school"
                  color="primary"
                  @click="createCourse(education)"
                >
                <q-tooltip> Botao criar classe </q-tooltip>
                </q-btn>

              </q-item-section>
              <q-item-section side>
                <q-btn
                  v-if="education.checked"
                  flat
                  dense
                  round
                  icon="currency_exchange"
                  color="primary"
                  @click="settingsPayment(education)"
                >
                <q-tooltip> Botão para configuração pagamentos </q-tooltip>
                </q-btn>

              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
      <!-- Seccao de nivel de Horarios e periodos da instituicao -->
      <q-card-section class="q-pt-none">
        <div class="border q-pa-md shadow-2">
          <div v-if="!isEditing">
            <div class="row items-center justify-between">
              <span class="text-weight-bold">Periodos e Horarios</span>
              <q-btn
                color="primary"
                icon="add"
                label="Adicionar"
                class="q-mr-sm"
                @click="toggleEdit"
                flat
              />
            </div>
            <q-separator spaced />
            <q-list bordered>
              <q-item v-for="(item, index) in shifts" :key="index">
                <q-item-section>
                  <div>
                    <span class="text-weight-bold">Periodo: </span>
                    {{ item.name }}
                  </div>
                </q-item-section>
                <q-item-section>
                  <div>
                    <span class="text-weight-bold">Entrada</span>:
                    {{ item.start }}
                  </div>
                </q-item-section>
                <q-item-section>
                  <div>
                    <span class="text-weight-bold">Divisão</span>:
                    {{ item.times }}
                  </div>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat dense round icon="delete" color="negative" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div v-else>
            <div class="row items-center justify-between">
              <span class="text-weight-bold">Criar Periodo</span>
            </div>
            <q-separator spaced />
            <q-form
              @submit.prevent="handleSubmitShift"
              class="q-gutter-md q-pt-sm"
            >
              <div class="row q-col-gutter-sm" isLoading>
                <q-input
                  class="col-md-6 col grow col-sm-12 col-xs-12"
                  label="Nome da Periodo"
                  placeholder="Digite o nome do Periodo"
                  v-model="newShift.name"
                  outlined
                  required
                  dense
                />

                <q-input
                  class="col-md-6 col grow col-sm-12 col-xs-12"
                  label="Hora de Inicio"
                  type="time"
                  placeholder="Digite a hora de inicio"
                  v-model="newShift.start"
                  outlined
                  required
                  dense
                />

                <q-input
                  class="col-md-4 col grow col-sm-12 col-xs-12"
                  label="Divisão de tempo"
                  type="number"
                  placeholder="Digite o tempo"
                  v-model="newShift.times"
                  outlined
                  required
                  dense
                />

                <q-input
                  class="col-md-4 col grow col-sm-12 col-xs-12"
                  label="Duração das aulas"
                  type="number"
                  placeholder="Digite a duração"
                  v-model="newShift.duration"
                  outlined
                  required
                  dense
                />

                <q-input
                  class="col-md-4 col grow col-sm-12 col-xs-12"
                  label="Intervalo normal"
                  type="number"
                  placeholder="Digite o minutos de intervalo normal"
                  v-model="newShift.normalRange"
                  outlined
                  required
                  dense
                />

                <q-input
                  class="col-md-6 col grow col-sm-12 col-xs-12"
                  label="Intervalo de Lanche"
                  type="number"
                  placeholder="Digite o tempo de intervalo de lanche"
                  v-model="newShift.largeRange"
                  outlined
                  required
                  dense
                />

                <q-input
                  class="col-md-6 col grow col-sm-12 col-xs-12"
                  label="Intervalo de Lanche"
                  type="number"
                  placeholder="Digite os minutos de intervalo de lanche"
                  v-model="newShift.largeRangeTime"
                  outlined
                  required
                  dense
                />
              </div>
              <div class="row justify-end q-gutter-sm">
                <q-btn
                  label="Cancelar"
                  color="negative"
                  icon="close"
                  outline
                  @click="cancel"
                  class="q-mr-sm"
                  flat
                />
                <q-btn
                  label="Guardar"
                  color="positive"
                  icon="save"
                  type="submit"
                  flat
                />
              </div>
            </q-form>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useInstitutionStores } from "../store";
import useNotify from "src/composables/UseNotify";

// stores
const router = useRouter();
const institutionStores = useInstitutionStores();
const { notifySuccess, notifyError } = useNotify();

const props = defineProps({
  educationLevel: {
    type: Array,
    required: true,
  },
  shifts: {
    type: Array,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});
// data
const medium = ref(false);
const isEditing = ref(false);
const entity = ref();
const newShift = ref({
  name: "",
  start: "",
  times: "",
  duration: "",
  normalRange: "",
  largeRange: "",
  largeRangeTime: "",
});

// Methods
const handleSubmitShift = async () => {
  const payload = {
    institutionId: props.id,
    name: newShift.value.name,
    start: newShift.value.start,
    times: parseInt(newShift.value.times),
    duration: parseInt(newShift.value.duration),
    normalRange: parseInt(newShift.value.normalRange),
    largeRange: parseInt(newShift.value.largeRange),
    largeRangeTime: parseInt(newShift.value.largeRangeTime),
  };

  try {
    await institutionStores.createInstitutionShift(payload);
    notifySuccess("Período e horário adicionado com sucesso");
    props.shifts.push(newShift.value);
    toggleEdit();
  } catch (error) {
    notifyError("Ocorreu um erro ao adicionar o período e horário");
  }
};

const createCourse = (item) => {
  if (item.name === "Ensino Médio") {
    entity.value = "classe";
  } else {
    entity.value = "curso";
  }
  router.push(
    `/institution/${props.id}/${entity.value}/create/education/${item.id}`
  );
};

const settingsPayment = (item) => {
  if (item.name === "Ensino Médio") {
    entity.value = "classe";
  }
  router.push({
    name: "settings-payment",
    params: { institution: props.id, entity: entity.value, education: item.id },
  });
};

const updateSelection = async (education) => {
  const payload = {
    institutionId: props.id,
    educationLevelId: education.id,
  };

  try {
    if (education.checked) {
      await institutionStores.createInstitutionEducation(payload);
      notifySuccess("Nivel Escolar adicionada com sucesso");
    } else {
      await institutionStores.deleteInstitutionEducation(payload);
      notifySuccess("Nivel Escolar removido com sucesso");
    }
  } catch (error) {
    notifyError("Ocorreu um erro ao adicionar/remover o nível escolar");
  }
};

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};
defineExpose({
  medium,
});
</script>

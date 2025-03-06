<template>
  <q-dialog v-model="medium" persistent>
    <q-card style="width: 900px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">
          Criar Turma para o curriculum {{ curriculum?.name }}
        </div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <!-- <span class="text-weight-bold"> Informações da Turma</span><br> -->
        <q-form @submit="onSubmit" @reset="onReset">
          <div class="row q-col-gutter-sm">
            <q-input
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="form.name"
              label="Nome da Turma"
              :rules="[
                (val) => !!val || 'Digite o nome da Turma e obrigatorio',
              ]"
              outlined
              dense
            />
            <q-input
              class="col-md-3 col-sm-12 col-xs-12"
              v-model="form.vacancy_limit"
              type="number"
              label="Limite de Vagas"
              outlined
              dense
            />
            <q-select
              class="col-md-3 col-sm-12 col-xs-12"
              v-model="form.period"
              :options="periodOptions"
              label="Periodo"
              option-label="name"
              option-value="id"
              map-options
              outlined
              emit-value
              :rules="[(val) => !!val || 'Selecione um periodo.']"
              dense=""
              clearable=""
            />
            <q-input
              class="col-md-6 col-sm-6 col-xs-12"
              v-model="form.startDate"
              type="date"
              label="Data de Início"
              outlined
              :rules="[(val) => !!val || 'A data de início é obrigatória.']"
              dense
            />

            <q-input
              class="col-md-6 col-sm-6 col-xs-12"
              v-model="form.endDate"
              type="date"
              label="Data de Término"
              outlined
              :rules="[
                (val) => !!val || 'A data de término é obrigatória.',
                (val) =>
                  !form.startDate ||
                  new Date(val) >= new Date(form.startDate) ||
                  'A data de término deve ser posterior à data de início.',
              ]"
              dense
            />
            <q-select
              class="col-md-4 col-sm-12 col-xs-12"
              v-model="form.roomId"
              :options="rooms"
              label="Sala"
              option-label="name"
              option-value="id"
              map-options
              outlined
              emit-value
              :rules="[(val) => !!val || 'Selecione uma sala.']"
              dense=""
              clearable=""
            />
            <q-input
              class="col-md-4 col-sm-12 col-xs-12"
              v-model="form.renew"
              type="number"
              label="Periodo de renovacao de inscrição"
              placeholder="Digite o numero de meses"
              outlined
              dense
            />
            <q-select
              class="col-md-4 col-sm-12 col-xs-12"
              v-model="form.exam"
              :options="[
                { id: true, name: 'Sim' },
                { id: false, name: 'Não' },
              ]"
              label="A turma tem exames"
              option-label="name"
              option-value="id"
              map-options
              outlined
              emit-value
              dense=""
              clearable=""
            />
          </div>
          <q-separator spaced />
          <div v-if="classId">
            <div class="row q-col-gutter-x-sm">
              <div class="col-md-6">
                <span>Taxas extras de matricula</span>
                <q-list>
                  <q-item v-for="fees in extraFees" :key="fees.id" clickable>
                    <q-checkbox
                      class="col-auto"
                      v-model="fees.isActive"
                      :val="fees.id"
                      :label="fees.name"
                      @update:model-value="onChange(fees.isActive, fees.id)"
                    />
                  </q-item>
                </q-list>
              </div>
              <div class="col-md-6">
                <span>Professor Responsavel</span>
                <q-select
                  class="col-md-4 col-sm-12 col-xs-12"
                  v-model="employee"
                  :options="employees"
                  label="Professor"
                  option-label="name"
                  option-value="id"
                  map-options
                  outlined
                  emit-value
                  dense
                  @update:model-value="onChangeTeacherLeader"
                />
              </div>
            </div>
          </div>

          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Cancelar"
              color="negative"
              icon="close"
              outline
              @click="toggleEdit"
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
      </q-card-section>
      <q-card-actions align="right" class="bg-white">
        <q-btn flat label="Terminar" @click="handleModal" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useCourseStores } from "../store";
import { useInstitutionStores } from "src/pages/institution/store";
import { useExtraFeeStores } from "src/pages/financial/extra-fees/stores";
import { useEmployeeStores } from "src/pages/employee/stores";
import useNotify from "src/composables/UseNotify";

// use store
const router = useRouter();
const courseStores = useCourseStores();
const institutionStores = useInstitutionStores();
const employeeStores = useEmployeeStores();
const extraFeeStores = useExtraFeeStores();
const { notifyError, notifySuccess } = useNotify();

// props
const props = defineProps({
  curriculum: {
    type: Object,
    required: true,
  },
  fetchCourse: {
    type: Function,
    required: true,
  },
  periodOptions: {
    type: Array,
    required: true,
  },
  classe: {
    type: Object,
    required: false,
  },
});
/* computed */
// data
const medium = ref(false);
const rooms = ref([]);
const classId = ref();
const courseId = ref();
const curriculumId = ref();
const extraFees = ref([]);
const employees = ref([]);
const employee = ref();
const form = ref({
  name: "",
  vacancy_limit: "",
  startDate: "",
  endDate: "",
  period: "",
  roomId: "",
  renew: 0,
  exam: "",
});

watchEffect(() => {
  if (props.classe) {
    classId.value = props.classe.id;
    courseId.value = props.classe.courseId;
    curriculumId.value = props.classe.curriculumId;
    form.value.name = props.classe.name || "";
    form.value.vacancy_limit = props.classe.vacancy_limit || "";
    (form.value.startDate = props.classe.startDate || ""),
      (form.value.endDate = props.classe.endDate || "");
    form.value.period = props.classe.period || "";
    form.value.roomId = props.classe.roomId || "";
    form.value.renew = props.classe.renew || "";
    form.value.exam = props.classe.exam || false;
    employee.value = props.classe.leader

  }
  if(classId.value) {
    fetchExtraFees();
  }
  if (props.curriculum) {
    courseId.value = props.curriculum.courseId;
    curriculumId.value = props.curriculum.id;
  }
});

// methods
// funcao para criar turma
const onSubmit = async () => {
  const payload = {
    ...form.value,
    courseId: courseId.value,
    curriculumId: curriculumId.value,
    period: form.value.period.name || props.classe.period,
    vacancy_limit: parseInt(form.value.vacancy_limit),
    renew: parseInt(form.value.renew),
  };
  try {
    if (classId.value) {
      await courseStores.editClasse(classId.value, payload);
      notifySuccess("Turma editada com sucesso!");
    } else {
      await courseStores.createClasse(payload);
      notifySuccess("Turma criada com sucesso!");
    }
    props.fetchCourse();
    handleModal();
    onReset();
  } catch (error) {
    console.error(error);
    notifyError("Erro ao criar turma!");
  }
};

const onChange = async (value, feesId) => {
  try {
    if (value) {
      await extraFeeStores.createFeesToEnrollment({
        classId: classId.value,
        extraFeesId: feesId,
      });
      notifySuccess("Pagamentos extras adicionados à turma");
    } else {
      console.log("edit");
    }
  } catch (error) {
    console.error(error);
    notifyError("Ocorreu ");
  }
};

const onChangeTeacherLeader = async (value) => {
  const payload = {
    leader: value,
  };
  try {
    await courseStores.editClasse(classId.value, payload);
    notifySuccess("Professor responsável adicionado com sucesso!");
  } catch (error) {
    console.error(error);
    notifyError("Erro ao adicionar professor responsável!");
  }
};
// funcao para buscar a salas
const fetchRooms = async () => {
  try {
    await institutionStores.listRooms();
    rooms.value = institutionStores.rooms;
  } catch (error) {
    notifyError("Erro ao buscar salas");
  }
};

// funccao para buscar professores
const fetchEmployees = async () => {
  try {
    await employeeStores.list();
    employees.value = employeeStores.employees.map((e) => {
      return {
        id: e.id,
        name: e?.basicInformation?.fullName ?? "Default",
      };
    });
  } catch (error) {
    notifyError("Erro ao buscar professores");
  }
};

// funcao para buscar a taxas
const fetchExtraFees = async () => {
  try {
    await extraFeeStores.list();
    extraFees.value = extraFeeStores.extraFees.map((fees) => {
      const isActive = props.classe?.extraFees.find((f) => f.id === fees.id);
      return {
        id: fees.id,
        name: fees.name,
        isActive: isActive ? true : false,
      };
    });
  } catch (error) {
    notifyError("Erro ao buscar taxas extras");
  }
};

// funcao para resetar os campos do formulario
const onReset = () => {
  form.value = {
    name: "",
    vacancy_limit: "",
    startDate: "",
    endDate: "",
    status: "",
    period: "",
  };
};

// funcao para fechar o modal
const handleModal = () => {
  medium.value = false;
  router.push({
    name: "course-settings",
    params: {
      id: courseId.value,
    },
  });
};
defineExpose({
  medium,
});
onMounted(() => {
  fetchRooms();
  fetchEmployees();
});
</script>

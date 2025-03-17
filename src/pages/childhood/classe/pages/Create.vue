<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6" v-if="!classId">Criar nova turma</div>
        <div class="text-h6" v-else>Editar turma</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <q-form @submit.prevent="submitForm">
          <div class="row q-col-gutter-sm">
            <q-input
              class="col-md-8 col-sm-6 col-xs-12"
              v-model="form.name"
              label="Nome"
              required
              outlined
              dense
              placeholder="Digite o nome"
            />
            <q-input
              class="col-md-4 col-sm-6 col-xs-12"
              v-model="form.capacity"
              label="Capacidade"
              required
              outlined
              type="number"
              dense
              placeholder="Digite a capacidade"
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
              v-model="duration"
              label="Duração"
              required
              outlined
              type="number"
              dense
              placeholder="Digite os meses"
              @blur="saveGrades(duration)"
            />
            <q-select
              class="col-md-4 col-sm-6 col-xs-12"
              v-model="form.roomId"
              :options="rooms"
              label="Salas"
              option-label="name"
              option-value="id"
              dense
              outlined
              map-options
              emit-value
            />
            <q-select
              class="col-md-4 col-sm-6 col-xs-12"
              v-model="form.period"
              :options="shifts"
              label="Turnos"
              option-label="name"
              option-value="name"
              dense
              outlined=""
              map-options
              emit-value
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.start }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              class="col-md-4 col-sm-6 col-xs-12"
              v-model="form.employeeId"
              :options="employees"
              label="Professor responsavel"
              option-label="name"
              option-value="id"
              dense
              outlined
              map-options=""
              emit-value=""
            />
          </div>
          <q-separator spaced />
          <div v-if="classId">
            <div class="row q-col-gutter-x-sm">
              <div class="col-md-6">
                <span>Taxas extras de matricula</span>
                <q-list bordered>
                  <q-item v-for="fees in extraFees" :key="fees.id" clickable>
                    <q-checkbox
                      class="col-auto"
                      v-model="fees.isActive"
                      :val="fees.id"
                      :label="fees.name"
                      @update:model-value="
                        onUpdatedFees(fees.isActive, fees.id)
                      "
                    />
                  </q-item>
                </q-list>
              </div>
            </div>
          </div>

          <div class="row q-mt-md justify-end">
            <q-btn
              label="voltar"
              color="negative"
              flat
              type="reset"
              @click="router.back()"
            />
            <q-btn label="Salvar" color="green" flat type="submit" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInstitutionStores } from "src/pages/institution/store";
import { useEmployeeStores } from "src/pages/employee/stores";
import { useChildhoodClasseStores } from "../stores";
import { useExtraFeeStores } from "src/pages/finance/extra-fees/stores";
import useNotify from "src/composables/UseNotify";
import moment from "moment";

/* setup route */
const route = useRoute();
const router = useRouter();

/* setup store */
const institutionStore = useInstitutionStores();
const employeeStore = useEmployeeStores();
const classStore = useChildhoodClasseStores();
const extraFeeStores = useExtraFeeStores();
const { notifyError, notifySuccess } = useNotify();
/* setup data */
const { internshipId, classId } = route.params;
const duration = ref();
const rooms = ref([]);
const shifts = ref([]);
const employees = ref([]);
const extraFees = ref([]);
const classe = ref();

const form = ref({
  internshipId: internshipId,
  roomId: "",
  period: "",
  name: "",
  capacity: "",
  startDate: "",
  endDate: "",
  employeeId: "",
});

/* methods */
const submitForm = async () => {
  const payload = {
    ...form.value,
    capacity: parseInt(form.value.capacity),
  };
  try {
    if (!classId) {
      await classStore.create(payload);
      notifySuccess("Turma criada com sucesso!");
    } else {
      await classStore.update(classId, payload);
      notifySuccess("Turma editada com sucesso!");
    }
  } catch (error) {
    notifyError("Erro ao salvar turma");
  }
};

const saveGrades = (duration) => {
  const endDate = new Date(form.value.startDate);
  endDate.setMonth(endDate.getMonth() + parseInt(duration));
  form.value.endDate = endDate;
};

const onUpdatedFees = async (checked, feesId) => {
  try {
    if (checked) {
      await extraFeeStores.childhoodCreateFeesToEnrollment({
        classId: classId,
        extraFeesId: feesId,
      });
    } else {
      await extraFeeStores.childhoodDeleteFeesToEnrollment(classId, feesId);
    }
  } catch (error) {
    notifyError("Erro ao tratar as despensas extras");
  }
};

const fetchRoom = async () => {
  try {
    await institutionStore.listRooms();
    rooms.value = institutionStore.rooms;
  } catch (error) {
    notifyError("Erro no carregemento...");
  }
};

const fetchShifts = async () => {
  try {
    await institutionStore.findShifts();
    shifts.value = institutionStore.shifts;
  } catch (error) {
    notifyError("Erro no carregemento...");
  }
};

const fetchEmployees = async () => {
  try {
    await employeeStore.list();
    employees.value = employeeStore.employees.map((e) => {
      return {
        id: e.id,
        name: e?.basicInformation?.fullName ?? "Default",
      };
    });
  } catch (error) {
    notifyError("Erro no carregemento...");
  }
};

const fetchExtraFees = async () => {
  try {
    await extraFeeStores.list();
    extraFees.value = extraFeeStores.extraFees.map((fees) => {
      const isActive = classe.value?.enrrolmentExtraFees.find(
        (f) => f.extraFeesId === fees.id
      );
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

const fetchClasse = async () => {
  if (classId) {
    try {
      await classStore.findOne(classId);
      classe.value = classStore.classe;
    } catch (error) {
      notifyError("Erro ao buscar turma");
    }
  }
};

/* wacth */
watchEffect(() => {
  if (classe.value) {
    form.value = { ...classe.value };
    duration.value = moment(classe.value.endDate).diff(
      moment(classe.value.startDate),
      "months"
    );
  }
});

onMounted(async () => {
  await fetchRoom();
  await fetchShifts();
  await fetchEmployees();
  await fetchClasse();
  await fetchExtraFees();
});
</script>

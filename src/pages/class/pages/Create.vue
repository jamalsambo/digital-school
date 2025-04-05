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
              v-model="form.vacancyLimit"
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
              v-model="form.periodId"
              :options="shifts"
              label="Turnos"
              option-label="start"
              option-value="id"
              dense
              outlined
              map-options
              emit-value
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.start }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.end }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              class="col-md-4 col-sm-6 col-xs-12"
              v-model="form.leader"
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
          <div class="text-h6">Pagamentos</div>
          <q-separator spaced="" />
          <div class="border q-pa-md shadow-2">
            <div class="row q-col-gutter-sm">
              <div class="col-md-6">
                <span class="text-h7 text-bold">Valor de Matricula</span>
                <q-input
                  class="col-md-6 col-sm-6 col-xs-12"
                  v-model="form.enrollmentFeeValue"
                  label="Matricula"
                  outlined
                  type="number"
                  dense
                  placeholder="Digite o valor"
                />
                <q-toggle
                  class="col-md-4 col-sm-12 col-xs-12"
                  v-model="form.monthlyFeeIncluse"
                  label="Valor da primeira mensalidade inclusa"
                />
              </div>
              <div class="col-md-6" v-if="classeIdOnCreate">
                <span class="text-h7">Taxas extras de matricula</span>
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
          <q-separator spaced />
          <div class="border q-pa-md shadow-2">
            <div class="row q-col-gutter-x-sm">
              <div class="col-md-6">
                <span class="text-h7">Mensalidade</span>
                <q-input
                  class="col-md-6 col-sm-6 col-xs-12"
                  v-model="form.monthlyFee"
                  label="Mensalidade"
                  outlined
                  type="number"
                  dense
                  placeholder="Digite o valor"
                />
              </div>
            </div>
          </div>
          <q-separator spaced="" />
          <q-toggle
            class="col-md-4 col-sm-12 col-xs-12"
            v-model="toogleRenew"
            label="Renovação inscrição"
            @update:model-value="updateToggleRenew"
          />
          <div class="border q-pa-md shadow-2" v-if="toogleRenew">
            <div class="row q-col-gutter-sm">
              <div class="col-md-6">
                <span class="text-h7 text-bold">Inscriçao</span>
                <q-input
                  class="col-md-6 col-sm-6 col-xs-12"
                  v-model="form.renewalValue"
                  label="Valor de inscrição"
                  outlined
                  type="number"
                  dense
                  placeholder="Digite o valor"
                />
                <q-input
                  class="col-md-6 col-sm-6 col-xs-12 q-mt-md"
                  v-model="form.renewal"
                  label="Tempo de renovação"
                  outlined
                  type="number"
                  dense
                  placeholder="Digite os meses"
                />
              </div>
              <div class="col-md-6" v-if="classeIdOnCreate">
                <span class="text-h7">Taxas extras de escriçao</span>
                <q-list bordered>
                  <q-item
                    v-for="fees in renewalExtraFees"
                    :key="fees.id"
                    clickable
                  >
                    <q-checkbox
                      class="col-auto"
                      v-model="fees.isActive"
                      :val="fees.id"
                      :label="fees.name"
                      @update:model-value="
                        onUpdatedRenewalFees(fees.isActive, fees.id)
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
import { computed, onMounted, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "src/pages/auth/store";
import { useRoomStores } from "src/pages/room/store";
import { useEmployeeStores } from "src/pages/employee/stores";
import { useClassStores } from "../store";
import { useExtraFeeStores } from "src/pages/finance/extra-fees/stores";
import { useShiftStores } from "src/pages/shift/store";
import useNotify from "src/composables/UseNotify";
import moment from "moment";

/* setup route */
const route = useRoute();
const router = useRouter();

/* setup store */
const authStore = useAuthStore();
const roomStores = useRoomStores();
const employeeStore = useEmployeeStores();
const classStore = useClassStores();
const extraFeeStores = useExtraFeeStores();
const shiftStores = useShiftStores();
const { notifyError, notifySuccess } = useNotify();


/* setup data */
const { internshipId, classeId } = route.params;
const classeIdOnCreate = ref(classeId)
const duration = ref();
const rooms = ref([]);
const shifts = ref([]);
const employees = ref([]);
const extraFees = ref([]);
const renewalExtraFees = ref([]);
const classe = ref();
const toogleRenew = ref(false);

/* setup computed */
const instituttion = computed(() => authStore.user?.institutionId);

const form = ref({
  courseId: internshipId,
  roomId: "",
  periodId: "",
  name: "",
  vacancyLimit: 0,
  startDate: "",
  endDate: "",
  leader: "",
  enrollmentFeeValue: 0,
  monthlyFeeIncluse: false,
  renewal: 0,
  renewalValue: 0,
  monthlyFee: 0,
});

/* methods */
const submitForm = async () => {
  const payload = {
    vacancyLimit: parseInt(form.value.vacancyLimit),
    courseId: internshipId,
    roomId: form.value.roomId,
    periodId: form.value.periodId,
    name: form.value.name,
    startDate: form.value.startDate,
    endDate: form.value.endDate,
    leader: form.value.leader,
    enrollmentFeeValue: form.value.enrollmentFeeValue,
    monthlyFeeIncluse: form.value.monthlyFeeIncluse,
    renewal: parseInt(form.value.renewal),
    renewalValue: form.value.renewalValue,
    monthlyFee: form.value.monthlyFee,
  };
  try {
    if (!classeId) {
      await classStore.create(payload);
      notifySuccess("Turma criada com sucesso!");
      classeIdOnCreate.value = classStore.classe.id;
    } else {
      await classStore.update(classeId, payload);
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
      await extraFeeStores.createFeesToEnrollment(classeIdOnCreate.value, feesId);
    } else {
      await extraFeeStores.deleteFeesToEnrollment(classeIdOnCreate.value, feesId);
    }
  } catch (error) {
    notifyError("Erro ao tratar as despensas extras");
  }
};

const onUpdatedRenewalFees = async (checked, feesId) => {
  try {
    if (checked) {
      await extraFeeStores.createFeesToRenew(classeIdOnCreate.value, feesId);
    } else {
      await extraFeeStores.deleteFeesToRenew(classeIdOnCreate.value, feesId);
    }
  } catch (error) {
    notifyError("Erro ao tratar as despensas extras");
  }
};

const updateToggleRenew = async (value) => {
  if (value) {
    form.value.renewal = instituttion.value.regime;
  }
};

const fetchRooms = async () => {
  try {
    await roomStores.list();
    rooms.value = roomStores.rooms;
  } catch (error) {
    notifyError("Erro no carregemento...");
  }
};

const fetchShifts = async () => {
  try {
    await shiftStores.list();
    shifts.value = shiftStores.shifts;
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
    console.log(error);
    notifyError("Erro no carregemento...");
  }
};

const fetchExtraFees = async () => {
  try {
    await extraFeeStores.list();
    extraFees.value = extraFeeStores.extraFees.map((fees) => {
      const isActive = classe.value?.extraFeesEnrollments.find(
        (f) => f.id === fees.id
      );
      return {
        id: fees.id,
        name: fees.name,
        isActive: isActive ? true : false,
      };
    });

    renewalExtraFees.value = extraFeeStores.extraFees.map((fees) => {
      const isActive = classe.value?.extraFeesRenewals.find(
        (f) => f.id === fees.id
      );
      return {
        id: fees.id,
        name: fees.name,
        isActive: isActive ? true : false,
      };
    });
  } catch (error) {
    console.log(error);
    notifyError("Erro ao buscar taxas extras");
  }
};

const fetchClasse = async () => {
  if (classeId) {
    try {
      await classStore.findOne(classeId);
      classe.value = classStore.classe;

      if (parseInt(classe.value.renew) === 0) {
      toogleRenew.value = false;
    } else {
      toogleRenew.value = true;
    }
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
  await fetchRooms();
  await fetchShifts();
  await fetchEmployees();
  await fetchClasse();
  await fetchExtraFees();
});
</script>

<template>
  <q-page class="edigital-page">
    <!-- ── Top Bar ── -->
    <div class="page-topbar row items-center q-px-xl q-py-md">
      <q-btn
        flat
        round
        dense
        icon="arrow_back_ios_new"
        class="back-btn q-mr-md"
        @click="router.back()"
      >
        <q-tooltip>Voltar</q-tooltip>
      </q-btn>

      <div class="col">
        <q-breadcrumbs
          class="breadcrumb-nav"
          active-color="primary"
          separator="›"
        >
          <q-breadcrumbs-el
            label="Dashboard"
            icon="home"
            to="/"
            class="breadcrumb-link"
          />
          <q-breadcrumbs-el label="Turmas" class="breadcrumb-link" />
          <q-breadcrumbs-el
            :label="classId ? 'Editar Turma' : 'Nova Turma'"
            class="breadcrumb-active"
          />
        </q-breadcrumbs>
        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon
              :name="classId ? 'edit_note' : 'add_circle'"
              size="1.3rem"
              color="white"
            />
          </div>
          <span>{{ classId ? "Editar Turma" : "Criar Nova Turma" }}</span>
          <q-chip
            v-if="form.name"
            size="sm"
            color="blue-1"
            text-color="blue-9"
            class="q-ml-sm"
            dense
          >
            {{ form.name }}
          </q-chip>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <q-btn
          flat
          no-caps
          dense
          icon="close"
          label="Cancelar"
          color="grey-6"
          class="cancel-btn"
          @click="router.back()"
        />
        <q-btn
          unelevated
          no-caps
          icon="save"
          :label="classId ? 'Guardar Alterações' : 'Criar Turma'"
          class="save-btn"
          :loading="saving"
          @click="submitForm"
        >
          <template #loading><q-spinner-dots color="white" /></template>
        </q-btn>
      </div>
    </div>

    <!-- ── Form ── -->
    <div class="q-px-xl q-pb-xl">
      <q-form @submit.prevent="submitForm">
        <!-- ════ Section 1: Basic Info ════ -->
        <div class="section-block q-mt-lg q-mb-lg">
          <div class="section-header-bar row items-center q-px-lg q-py-md">
            <div class="section-icon-wrap q-mr-sm">
              <q-icon name="class" size="1rem" color="white" />
            </div>
            <div>
              <div class="section-title">Informações Básicas</div>
              <div class="section-sub">
                Dados gerais de identificação da turma
              </div>
            </div>
          </div>
          <q-separator />
          <div class="q-pa-lg row q-col-gutter-md">
            <div class="col-md-8 col-sm-6 col-xs-12">
              <label class="field-label">Nome da Turma *</label>
              <q-input
                v-model="form.name"
                outlined
                dense
                placeholder="Ex: Turma A — 2025"
                :rules="[(val) => !!val || 'Campo obrigatório']"
                class="custom-input"
              >
                <template #prepend
                  ><q-icon name="label" color="primary"
                /></template>
              </q-input>
            </div>

            <div class="col-md-4 col-sm-6 col-xs-12">
              <label class="field-label">Capacidade (vagas) *</label>
              <q-input
                v-model="form.vacancyLimit"
                outlined
                dense
                type="number"
                placeholder="Ex: 30"
                :rules="[(val) => !!val || 'Campo obrigatório']"
                class="custom-input"
              >
                <template #prepend
                  ><q-icon name="people" color="primary"
                /></template>
              </q-input>
            </div>

            <div class="col-md-4 col-sm-6 col-xs-12">
              <label class="field-label">Professor Responsável</label>
              <q-select
                v-model="form.leader"
                :options="employees"
                option-label="name"
                option-value="id"
                outlined
                dense
                map-options
                emit-value
                clearable
                class="custom-input"
              >
                <template #prepend
                  ><q-icon name="person_pin" color="primary"
                /></template>
              </q-select>
            </div>

            <div class="col-md-4 col-sm-6 col-xs-12">
              <label class="field-label">Sala</label>
              <q-select
                v-model="form.roomId"
                :options="rooms"
                option-label="name"
                option-value="id"
                outlined
                dense
                map-options
                emit-value
                clearable
                class="custom-input"
              >
                <template #prepend
                  ><q-icon name="meeting_room" color="primary"
                /></template>
              </q-select>
            </div>

            <div class="col-md-4 col-sm-6 col-xs-12">
              <label class="field-label">Turno</label>
              <q-select
                v-model="form.periodId"
                :options="shifts"
                option-label="start"
                option-value="id"
                outlined
                dense
                map-options
                emit-value
                clearable
                class="custom-input"
              >
                <template #prepend
                  ><q-icon name="schedule" color="primary"
                /></template>
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.start }}</q-item-label>
                      <q-item-label caption>{{ scope.opt.end }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
        </div>

        <!-- ════ Section 2: Duration ════ -->
        <div class="section-block q-mb-lg">
          <div class="section-header-bar row items-center q-px-lg q-py-md">
            <div
              class="section-icon-wrap q-mr-sm"
              style="background: linear-gradient(135deg, #7b1fa2, #4a148c)"
            >
              <q-icon name="date_range" size="1rem" color="white" />
            </div>
            <div>
              <div class="section-title">Período e Duração</div>
              <div class="section-sub">Data de início e duração em meses</div>
            </div>
          </div>
          <q-separator />
          <div class="q-pa-lg row q-col-gutter-md">
            <div class="col-md-4 col-sm-6 col-xs-12">
              <label class="field-label">Data de Início *</label>
              <q-input
                v-model="form.startDate"
                type="date"
                outlined
                dense
                :rules="[(val) => !!val || 'A data de início é obrigatória.']"
                class="custom-input"
              >
                <template #prepend
                  ><q-icon name="event_available" color="primary"
                /></template>
              </q-input>
            </div>

            <div class="col-md-4 col-sm-6 col-xs-12">
              <label class="field-label">Duração (meses) *</label>
              <q-input
                v-model="duration"
                outlined
                dense
                type="number"
                placeholder="Ex: 12"
                @blur="saveGrades(duration)"
                class="custom-input"
              >
                <template #prepend
                  ><q-icon name="hourglass_empty" color="primary"
                /></template>
              </q-input>
            </div>

            <div class="col-md-4 col-sm-6 col-xs-12">
              <label class="field-label">Data de Fim (calculada)</label>
              <q-input
                :model-value="
                  form.endDate
                    ? new Date(form.endDate).toLocaleDateString('pt-PT')
                    : '—'
                "
                outlined
                dense
                readonly
                class="custom-input"
              >
                <template #prepend
                  ><q-icon name="event_busy" color="grey-5"
                /></template>
              </q-input>
            </div>
          </div>
        </div>

        <!-- ════ Section 3: Enrollment Fee ════ -->
        <div class="section-block q-mb-lg">
          <div class="section-header-bar row items-center q-px-lg q-py-md">
            <div
              class="section-icon-wrap q-mr-sm"
              style="background: linear-gradient(135deg, #21b573, #0d7040)"
            >
              <q-icon name="assignment_turned_in" size="1rem" color="white" />
            </div>
            <div>
              <div class="section-title">Matrícula</div>
              <div class="section-sub">Valor e configurações da matrícula</div>
            </div>
          </div>
          <q-separator />
          <div class="q-pa-lg row q-col-gutter-md">
            <div class="col-md-4 col-sm-6 col-xs-12">
              <label class="field-label">Valor de Matrícula (MT)</label>
              <q-input
                v-model="form.enrollmentFeeValue"
                outlined
                dense
                type="number"
                placeholder="0.00"
                prefix="MT"
                class="custom-input"
              >
                <template #prepend
                  ><q-icon name="payments" color="primary"
                /></template>
              </q-input>
            </div>

            <div class="col-md-8 col-sm-6 col-xs-12 flex items-end q-pb-sm">
              <q-toggle
                v-model="form.monthlyFeeIncluse"
                color="primary"
                label="Primeira mensalidade incluída no valor de matrícula"
                class="toggle-styled"
              />
            </div>

            <!-- Extra Enrollment Fees -->
            <div class="col-12" v-if="classeIdOnCreate && extraFees.length">
              <div class="extra-fees-box">
                <div class="extra-fees-title row items-center q-mb-sm">
                  <q-icon
                    name="add_circle_outline"
                    color="primary"
                    class="q-mr-xs"
                  />
                  Taxas Extras de Matrícula
                </div>
                <div class="row q-gutter-sm">
                  <div
                    v-for="fees in extraFees"
                    :key="fees.id"
                    class="fee-chip"
                    :class="{ 'fee-chip-active': fees.isActive }"
                    @click="
                      fees.isActive = !fees.isActive;
                      onUpdatedFees(fees.isActive, fees.id);
                    "
                  >
                    <q-icon
                      :name="
                        fees.isActive
                          ? 'check_circle'
                          : 'radio_button_unchecked'
                      "
                      size="0.9rem"
                    />
                    {{ fees.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ════ Section 4: Monthly Fee ════ -->
        <div class="section-block q-mb-lg">
          <div class="section-header-bar row items-center q-px-lg q-py-md">
            <div
              class="section-icon-wrap q-mr-sm"
              style="background: linear-gradient(135deg, #1565c0, #0288d1)"
            >
              <q-icon name="calendar_month" size="1rem" color="white" />
            </div>
            <div>
              <div class="section-title">Mensalidade</div>
              <div class="section-sub">
                Valor mensal a pagar pelos estudantes
              </div>
            </div>
          </div>
          <q-separator />
          <div class="q-pa-lg row q-col-gutter-md">
            <div class="col-md-4 col-sm-6 col-xs-12">
              <label class="field-label">Valor da Mensalidade (MT)</label>
              <q-input
                v-model="form.monthlyFee"
                outlined
                dense
                type="number"
                placeholder="0.00"
                prefix="MT"
                class="custom-input"
              >
                <template #prepend
                  ><q-icon name="attach_money" color="primary"
                /></template>
              </q-input>
            </div>
          </div>
        </div>

        <!-- ════ Section 5: Renewal ════ -->
        <div class="section-block q-mb-lg">
          <div
            class="section-header-bar row items-center justify-between q-px-lg q-py-md"
          >
            <div class="row items-center">
              <div
                class="section-icon-wrap q-mr-sm"
                style="background: linear-gradient(135deg, #f57c00, #e65100)"
              >
                <q-icon name="autorenew" size="1rem" color="white" />
              </div>
              <div>
                <div class="section-title">Renovação de Inscrição</div>
                <div class="section-sub">
                  Configurar taxa e período de renovação
                </div>
              </div>
            </div>
            <q-toggle
              v-model="toogleRenew"
              color="orange-8"
              @update:model-value="updateToggleRenew"
            />
          </div>

          <q-slide-transition>
            <div v-if="toogleRenew">
              <q-separator />
              <div class="q-pa-lg row q-col-gutter-md">
                <div class="col-md-4 col-sm-6 col-xs-12">
                  <label class="field-label">Valor de Inscrição (MT)</label>
                  <q-input
                    v-model="form.renewalValue"
                    outlined
                    dense
                    type="number"
                    placeholder="0.00"
                    prefix="MT"
                    class="custom-input"
                  >
                    <template #prepend
                      ><q-icon name="payments" color="orange-8"
                    /></template>
                  </q-input>
                </div>

                <div class="col-md-4 col-sm-6 col-xs-12">
                  <label class="field-label">Tempo de Renovação (meses)</label>
                  <q-input
                    v-model="form.renewal"
                    outlined
                    dense
                    type="number"
                    placeholder="Ex: 6"
                    class="custom-input"
                  >
                    <template #prepend
                      ><q-icon name="update" color="orange-8"
                    /></template>
                  </q-input>
                </div>

                <!-- Extra Renewal Fees -->
                <div
                  class="col-12"
                  v-if="classeIdOnCreate && renewalExtraFees.length"
                >
                  <div class="extra-fees-box">
                    <div class="extra-fees-title row items-center q-mb-sm">
                      <q-icon
                        name="add_circle_outline"
                        color="orange-8"
                        class="q-mr-xs"
                      />
                      Taxas Extras de Inscrição
                    </div>
                    <div class="row q-gutter-sm">
                      <div
                        v-for="fees in renewalExtraFees"
                        :key="fees.id"
                        class="fee-chip fee-chip-orange"
                        :class="{ 'fee-chip-orange-active': fees.isActive }"
                        @click="
                          fees.isActive = !fees.isActive;
                          onUpdatedRenewalFees(fees.isActive, fees.id);
                        "
                      >
                        <q-icon
                          :name="
                            fees.isActive
                              ? 'check_circle'
                              : 'radio_button_unchecked'
                          "
                          size="0.9rem"
                        />
                        {{ fees.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-slide-transition>
        </div>

        <!-- ════ Actions ════ -->
        <div class="form-actions row justify-end q-gutter-sm">
          <q-btn
            flat
            no-caps
            label="Cancelar"
            icon="close"
            color="grey-6"
            class="cancel-btn"
            @click="router.back()"
          />
          <q-btn
            unelevated
            no-caps
            type="submit"
            icon="save"
            :label="classId ? 'Guardar Alterações' : 'Criar Turma'"
            class="save-btn"
            :loading="saving"
          >
            <template #loading><q-spinner-dots color="white" /></template>
          </q-btn>
        </div>
      </q-form>
    </div>
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
import dayjs from 'dayjs'

/* ── Router & Stores ── */
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const roomStores = useRoomStores();
const employeeStore = useEmployeeStores();
const classStore = useClassStores();
const extraFeeStores = useExtraFeeStores();
const shiftStores = useShiftStores();
const { notifyError, notifySuccess } = useNotify();

/* ── Params ── */
const { internshipId, classeId } = route.params;
const classId = classeId; // alias for template readability

/* ── Data ── */
const classeIdOnCreate = ref(classeId);
const duration = ref(null);
const rooms = ref([]);
const shifts = ref([]);
const employees = ref([]);
const extraFees = ref([]);
const renewalExtraFees = ref([]);
const classe = ref(null);
const toogleRenew = ref(false);
const saving = ref(false);

/* ── Computed ── */
const instituttion = computed(() => authStore.user?.institutionId);

/* ── Form ── */
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

/* ── Methods ── */
const submitForm = async () => {
  saving.value = true;
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
    notifyError("Erro ao guardar turma.");
  } finally {
    saving.value = false;
  }
};

const saveGrades = (dur) => {
  if (!form.value.startDate || !dur) return;
  const endDate = new Date(form.value.startDate);
  endDate.setMonth(endDate.getMonth() + parseInt(dur));
  form.value.endDate = endDate;
};

const onUpdatedFees = async (checked, feesId) => {
  try {
    if (checked) {
      await extraFeeStores.createFeesToEnrollment(
        classeIdOnCreate.value,
        feesId,
      );
    } else {
      await extraFeeStores.deleteFeesToEnrollment(
        classeIdOnCreate.value,
        feesId,
      );
    }
  } catch (error) {
    notifyError("Erro ao tratar as taxas extras.");
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
    notifyError("Erro ao tratar as taxas extras.");
  }
};

const updateToggleRenew = (value) => {
  if (value) form.value.renewal = instituttion.value?.regime ?? 0;
};

/* ── Fetch ── */
const fetchRooms = async () => {
  try {
    await roomStores.list();
    rooms.value = roomStores.rooms;
  } catch {
    notifyError("Erro ao carregar salas.");
  }
};

const fetchShifts = async () => {
  try {
    await shiftStores.list();
    shifts.value = shiftStores.shifts;
  } catch {
    notifyError("Erro ao carregar turnos.");
  }
};

const fetchEmployees = async () => {
  try {
    await employeeStore.list();
    employees.value = employeeStore.employees.map((e) => ({
      id: e.id,
      name: e?.basicInformation?.fullName ?? "—",
    }));
  } catch {
    notifyError("Erro ao carregar funcionários.");
  }
};

const fetchExtraFees = async () => {
  try {
    await extraFeeStores.list();
    extraFees.value = extraFeeStores.extraFees.map((fees) => ({
      id: fees.id,
      name: fees.name,
      isActive: !!classe.value?.extraFeesEnrollments?.find(
        (f) => f.id === fees.id,
      ),
    }));
    renewalExtraFees.value = extraFeeStores.extraFees.map((fees) => ({
      id: fees.id,
      name: fees.name,
      isActive: !!classe.value?.extraFeesRenewals?.find(
        (f) => f.id === fees.id,
      ),
    }));
  } catch {
    notifyError("Erro ao buscar taxas extras.");
  }
};

const fetchClasse = async () => {
  if (!classeId) return;
  try {
    await classStore.findOne(classeId);
    classe.value = classStore.classe;
    toogleRenew.value = parseInt(classe.value.renew) !== 0;
  } catch {
    notifyError("Erro ao buscar turma.");
  }
};

/* ── Watch ── */
watchEffect(() => {
  if (classe.value) {
    form.value = { ...classe.value };
    duration.value = dayjs(classe.value.endDate).diff(
      dayjs(classe.value.startDate),
      "month",
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

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap");

.edigital-page {
  min-height: 100vh;
  background: #f0f4f8;
  font-family: "DM Sans", sans-serif;
}

/* ── Top Bar ── */
.page-topbar {
  background: #ffffff;
  border-bottom: 1px solid #e8edf3;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.06);
}
.back-btn {
  background: #f0f4f8;
  color: #1a3fa6 !important;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  transition: background 0.2s;
}
.back-btn:hover {
  background: #e0e8f7;
}
.breadcrumb-nav {
  font-size: 0.78rem;
}
.breadcrumb-link {
  color: #9ca3af !important;
}
.breadcrumb-active {
  color: #1a3fa6 !important;
  font-weight: 600;
}
.page-title {
  font-family: "Sora", sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f2862;
}
.title-icon-wrap {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Buttons ── */
.save-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white;
  border-radius: 10px;
  padding: 0 20px;
  height: 38px;
  font-family: "Sora", sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  transition:
    box-shadow 0.2s,
    transform 0.15s;
}
.save-btn:hover {
  box-shadow: 0 6px 18px rgba(26, 63, 166, 0.35);
  transform: translateY(-1px);
}
.cancel-btn {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  height: 38px;
  padding: 0 16px;
  font-size: 0.85rem;
  transition: background 0.2s;
}
.cancel-btn:hover {
  background: #f3f4f6;
}

/* ── Section Blocks ── */
.section-block {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(15, 40, 98, 0.07);
  border: 1px solid #edf0f5;
}
.section-header-bar {
  background: #fafbfd;
}
.section-icon-wrap {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.section-title {
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 0.92rem;
  color: #0f2862;
}
.section-sub {
  font-size: 0.74rem;
  color: #9ca3af;
}

/* ── Fields ── */
.field-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
  letter-spacing: 0.02em;
}
.custom-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
}
.custom-input :deep(.q-field--focused .q-field__control:before) {
  border-color: #1a3fa6;
}

/* ── Toggle ── */
.toggle-styled :deep(.q-toggle__label) {
  font-size: 0.85rem;
  color: #374151;
  font-weight: 500;
}

/* ── Extra Fees ── */
.extra-fees-box {
  background: #f8fafc;
  border: 1px solid #edf0f5;
  border-radius: 12px;
  padding: 1rem;
}
.extra-fees-title {
  font-family: "Sora", sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: #374151;
}
.fee-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  border: 1.5px solid #e5e7eb;
  background: white;
  color: #6b7280;
  transition: all 0.15s;
  user-select: none;
}
.fee-chip:hover {
  border-color: #1a3fa6;
  color: #1a3fa6;
  background: #eff6ff;
}
.fee-chip-active {
  background: #dbeafe;
  border-color: #1a3fa6;
  color: #1d4ed8;
  font-weight: 600;
}
.fee-chip-orange:hover {
  border-color: #f57c00;
  color: #f57c00;
  background: #fff7ed;
}
.fee-chip-orange-active {
  background: #ffedd5;
  border-color: #f57c00;
  color: #c2410c;
  font-weight: 600;
}

/* ── Form Actions ── */
.form-actions {
  padding-top: 0.5rem;
  padding-bottom: 1rem;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .edigital-page .q-px-xl {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
</style>

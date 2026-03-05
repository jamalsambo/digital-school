<template>
  <q-page class="edigital-page">

    <!-- Top Bar -->
    <div class="page-topbar row items-center q-px-xl q-py-md">
      <q-btn
        flat round dense
        icon="arrow_back_ios_new"
        class="back-btn q-mr-md"
        @click="$router.back()"
      />

      <div class="col">
        <q-breadcrumbs class="breadcrumb-nav" active-color="primary" separator="›">
          <q-breadcrumbs-el label="Dashboard" icon="home" to="/" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Estudantes" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Nova Matrícula" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="how_to_reg" size="1.3rem" color="white" />
          </div>
          <span>Nova Matrícula</span>
        </div>
      </div>
    </div>

    <div class="q-px-xl q-pt-lg q-pb-xl q-gutter-lg">

      <!-- Card: Seleção de Turma -->
      <q-card class="form-card" flat>

        <div class="form-card-header row items-center q-px-lg q-py-md">
          <div class="form-header-icon q-mr-md">
            <q-icon name="how_to_reg" size="1.2rem" color="white" />
          </div>
          <div class="col">
            <div class="form-header-title">Dados da Matrícula</div>
            <div class="form-header-sub">Selecione o curso e a turma para efectuar a matrícula</div>
          </div>
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <q-form ref="formRef" @submit.prevent="onSubmit">

            <div class="section-label q-mb-md">Selecionar Turma</div>

            <div class="row q-col-gutter-md q-mb-lg">

              <!-- Curso -->
              <div class="col-md-6 col-12">
                <div class="field-label">Curso / Estágio <span class="required">*</span></div>
                <q-select
                  v-model="course"
                  :options="courses"
                  option-label="name"
                  option-value="id"
                  placeholder="Selecione o curso..."
                  outlined dense
                  class="edigital-input"
                  map-options
                  :rules="[(val) => !!val || 'Selecione um curso.']"
                  @update:model-value="onCourseChange"
                >
                  <template #prepend>
                    <q-icon name="school" color="grey-5" size="1rem" />
                  </template>
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-grey">Nenhum curso disponível</q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- Turma -->
              <div class="col-md-6 col-12">
                <div class="field-label">Turma <span class="required">*</span></div>
                <q-select
                  v-model="classe"
                  :options="classes"
                  option-label="name"
                  option-value="id"
                  placeholder="Selecione a turma..."
                  outlined dense
                  class="edigital-input"
                  map-options
                  :disable="!course"
                  :rules="[(val) => !!val || 'Selecione uma turma.']"
                  @update:model-value="onClasseChange"
                >
                  <template #prepend>
                    <q-icon name="class" color="grey-5" size="1rem" />
                  </template>
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        {{ course ? 'Nenhuma turma disponível' : 'Selecione um curso primeiro' }}
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

            </div>

            <q-separator class="q-mb-lg" />

            <div class="row justify-end q-gutter-sm">
              <q-btn
                label="Cancelar"
                icon="close"
                class="cancel-btn"
                no-caps flat
                @click="$router.back()"
              />
              <q-btn
                label="Matricular"
                icon="how_to_reg"
                class="save-btn"
                no-caps
                type="submit"
                :loading="loading"
                :disable="!classe"
              />
            </div>

          </q-form>
        </q-card-section>
      </q-card>

      <!-- Card: Informações da Turma -->
      <q-card class="form-card" flat v-if="classe">

        <div class="form-card-header row items-center q-px-lg q-py-md">
          <div class="form-header-icon q-mr-md">
            <q-icon name="info" size="1.2rem" color="white" />
          </div>
          <div class="col">
            <div class="form-header-title">Informações da Turma</div>
            <div class="form-header-sub">Detalhes financeiros e período da turma seleccionada</div>
          </div>
          <!-- Pill turma -->
          <div class="permissions-count-pill">
            <q-icon name="class" size="0.9rem" color="white" class="q-mr-xs" />
            {{ classe.name }}
          </div>
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <div class="section-label q-mb-md">Resumo Financeiro</div>

          <!-- Info rows -->
          <div class="info-grid q-gutter-md">

            <div class="info-row row items-center justify-between">
              <div class="info-row-left row items-center q-gutter-sm">
                <div class="info-icon-wrap" style="background:#1a3fa618">
                  <q-icon name="receipt_long" size="1rem" style="color:#1a3fa6" />
                </div>
                <span class="info-label">Valor de Matrícula</span>
              </div>
              <span class="info-value">{{ classe.enrollmentFeeValue }} MZN</span>
            </div>

            <div class="info-row row items-center justify-between">
              <div class="info-row-left row items-center q-gutter-sm">
                <div class="info-icon-wrap" style="background:#21b57318">
                  <q-icon name="payments" size="1rem" style="color:#21b573" />
                </div>
                <span class="info-label">Mensalidade</span>
              </div>
              <span class="info-value">{{ classe.monthlyFee }} MZN</span>
            </div>

            <template v-if="classe.renewal !== 0">
              <div class="info-row row items-center justify-between">
                <div class="info-row-left row items-center q-gutter-sm">
                  <div class="info-icon-wrap" style="background:#f59e0b18">
                    <q-icon name="autorenew" size="1rem" style="color:#f59e0b" />
                  </div>
                  <span class="info-label">Valor de Inscrição</span>
                </div>
                <span class="info-value">{{ classe.renewalValue }} MZN</span>
              </div>

              <div class="info-row row items-center justify-between">
                <div class="info-row-left row items-center q-gutter-sm">
                  <div class="info-icon-wrap" style="background:#f59e0b18">
                    <q-icon name="refresh" size="1rem" style="color:#f59e0b" />
                  </div>
                  <span class="info-label">Renovação de Inscrição</span>
                </div>
                <span class="info-value">{{ classe.renewal }}</span>
              </div>
            </template>

            <div class="info-row row items-center justify-between">
              <div class="info-row-left row items-center q-gutter-sm">
                <div class="info-icon-wrap" style="background:#6366f118">
                  <q-icon name="schedule" size="1rem" style="color:#6366f1" />
                </div>
                <span class="info-label">Período</span>
              </div>
              <span class="info-value">{{ classe.period?.start }} — {{ classe.period?.end }}</span>
            </div>

          </div>

          <!-- Nota mensalidade inclusa -->
          <div class="info-note row items-center q-gutter-sm q-mt-md" v-if="classe.monthlyFeeIncluse">
            <q-icon name="info" color="primary" size="1rem" />
            <span>Nota: Valor da primeira mensalidade inclusa na matrícula</span>
          </div>

        </q-card-section>
      </q-card>

      <!-- Empty state (sem turma) -->
      <q-card v-else class="form-card empty-card" flat>
        <q-card-section class="column items-center q-py-xl">
          <div class="empty-icon-wrap q-mb-md">
            <q-icon name="how_to_reg" size="3rem" color="white" />
          </div>
          <div class="empty-title">Nenhuma turma seleccionada</div>
          <div class="empty-sub">Selecione um curso e uma turma acima para visualizar os detalhes da matrícula</div>
        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCourseStores } from "src/pages/course/store";
import { useEnrollmentStores } from "../store";
import { usePaymentStores } from "src/pages/finance/payments/stores";
import { useInvoiceStores } from "src/pages/finance/invoice/stores";
import { useUserStores } from "src/pages/user/store";
import useNotify from "src/composables/UseNotify";

/* ── Router / Store ── */
const router = useRouter();
const route = useRoute();
const courseStores = useCourseStores();
const enrollmentStores = useEnrollmentStores();
const paymentStores = usePaymentStores();
const invoiceStores = useInvoiceStores();
const userStores = useUserStores();
const { notifyError, notifySuccess } = useNotify();

/* ── Params ── */
const { studentId } = route.params;

/* ── State ── */
const formRef = ref(null);
const loading = ref(false);
const courses = ref([]);
const course = ref(null);
const classes = ref([]);
const classe = ref(null);
const paymentType = ref(null);
const month = new Date().toLocaleString("pt-PT", { month: "long" });

/* ── Methods ── */
const onCourseChange = (value) => {
  classes.value = value.classes ?? [];
  classe.value = null;
};

const onClasseChange = (value) => {
  classe.value = value;
};

const onSubmit = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await enrollmentStores.create({
      classId: classe.value.id,
      studentId,
    });

    if (!enrollmentStores.enrollment?.id) {
      notifyError("Matrícula não criada.");
      return;
    }

    const monthFirstPay = new Date(classe.value?.startDate)
      .toLocaleString("pt-PT", { month: "long" });

    await invoiceStores.create({
      paymentTypeId: paymentType.value.id,
      classId: classe.value.id,
      studentId,
      employeeId: userStores.user?.employee?.id,
      issueDate: new Date(),
      dueDate: new Date(),
      month,
      amount: parseInt(classe.value.enrollmentFeeValue),
      status: "Pendente",
      year: new Date().getFullYear(),
      note: `Factura referente à matrícula do ano lectivo ${new Date().getFullYear()}`,
    });

    if (classe.value.monthlyFeeIncluse) {
      await invoiceStores.createItems({
        invoiceId: invoiceStores.invoice.id,
        description: `Mensalidade referente ao mês de ${monthFirstPay}`,
        amount: parseInt(classe.value.monthlyFee),
      });
    }

    if (classe.value.extraFeesEnrollments?.length > 0) {
      await Promise.all(
        classe.value.extraFeesEnrollments.map((value) =>
          invoiceStores.createItems({
            invoiceId: invoiceStores.invoice.id,
            description: value.name,
            amount: parseInt(value.amount),
          })
        )
      );
    }

    notifySuccess("Matrícula registada, aguardando pagamento!");
    router.back();
  } catch (error) {
    notifyError("Erro na criação da matrícula.");
  } finally {
    loading.value = false;
  }
};

/* ── Fetch ── */
const fetchCourses = async () => {
  try {
    await courseStores.list();
    courses.value = courseStores.courses;
  } catch (error) {
    notifyError("Erro ao carregar cursos.");
  }
};

const fetchPaymentType = async () => {
  try {
    await paymentStores.findPaymentTypes();
    paymentType.value = paymentStores.paymentTypes.find(
      (type) => type.name === "Matricula"
    );
  } catch (error) {
    notifyError("Erro ao carregar tipos de pagamento.");
  }
};

/* ── Lifecycle ── */
onMounted(async () => {
  await fetchCourses();
  await fetchPaymentType();
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
  position: sticky; top: 0; z-index: 10;
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.06);
}
.back-btn {
  background: #f0f4f8; color: #1a3fa6 !important;
  border-radius: 10px; width: 36px; height: 36px; transition: background 0.2s;
}
.back-btn:hover { background: #e0e8f7; }
.breadcrumb-nav { font-size: 0.78rem; }
.breadcrumb-link { color: #9ca3af !important; }
.breadcrumb-active { color: #1a3fa6 !important; font-weight: 600; }
.page-title {
  font-family: "Sora", sans-serif;
  font-size: 1.3rem; font-weight: 700; color: #0f2862;
}
.title-icon-wrap {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}

/* ── Form Card ── */
.form-card {
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 2px 20px rgba(15, 40, 98, 0.07);
  border: 1px solid #edf0f5;
}
.form-card-header { background: #fafbfd; border-bottom: 1px solid #f0f0f0; }
.form-header-icon {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.form-header-title { font-family: "Sora", sans-serif; font-size: 1rem; font-weight: 700; color: #0f2862; }
.form-header-sub { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; }

/* ── Form Fields ── */
.section-label {
  font-family: "Sora", sans-serif; font-size: 0.8rem;
  font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: #6b7280;
}
.field-label { font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 6px; }
.required { color: #ef4444; }
.edigital-input :deep(.q-field__control) { border-radius: 10px; background: #f8fafc; }
.edigital-input :deep(.q-field__control:hover) { border-color: #1a3fa6; }

/* ── Permissions Pill ── */
.permissions-count-pill {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  color: white; border-radius: 20px; padding: 4px 12px;
  font-family: "Sora", sans-serif; font-weight: 700; font-size: 0.8rem;
  display: flex; align-items: center;
}

/* ── Info Grid ── */
.info-row {
  background: #f8fafc;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  border: 1px solid #edf0f5;
  transition: background 0.15s;
}
.info-row:hover { background: #f0f6ff; }
.info-row-left { flex: 1; }
.info-icon-wrap {
  width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.info-label { font-size: 0.88rem; font-weight: 500; color: #374151; }
.info-value {
  font-family: "Sora", sans-serif;
  font-weight: 700; font-size: 0.92rem; color: #0f2862;
}

/* ── Info Note ── */
.info-note {
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 10px;
  padding: 0.6rem 1rem;
  font-size: 0.82rem;
  color: #1a3fa6;
  font-weight: 500;
}

/* ── Buttons ── */
.cancel-btn {
  border: 1px solid #e5e7eb; border-radius: 10px;
  color: #6b7280 !important; padding: 0 20px; height: 40px;
  font-weight: 600; transition: background 0.2s;
}
.cancel-btn:hover { background: #f3f4f6 !important; }
.save-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white !important; border-radius: 10px;
  padding: 0 24px; height: 40px;
  font-family: "Sora", sans-serif; font-weight: 600; font-size: 0.88rem;
  transition: box-shadow 0.2s, transform 0.15s;
}
.save-btn:hover { box-shadow: 0 6px 18px rgba(26, 63, 166, 0.35); transform: translateY(-1px); }

/* ── Empty State ── */
.empty-card { background: white; }
.empty-icon-wrap {
  width: 72px; height: 72px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
}
.empty-title { font-family: "Sora", sans-serif; font-size: 1.1rem; font-weight: 700; color: #0f2862; margin-bottom: 6px; }
.empty-sub { font-size: 0.85rem; color: #9ca3af; text-align: center; max-width: 320px; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
}
</style>

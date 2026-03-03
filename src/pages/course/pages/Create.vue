<template>
  <q-page class="edigital-page">

    <!-- ── Top Bar ── -->
    <div class="page-topbar row items-center q-px-xl q-py-md">
      <q-btn flat round dense icon="arrow_back_ios_new" class="back-btn q-mr-md" @click="router.back()">
        <q-tooltip>Voltar</q-tooltip>
      </q-btn>

      <div class="col">
        <q-breadcrumbs class="breadcrumb-nav" active-color="primary" separator="›">
          <q-breadcrumbs-el label="Dashboard" icon="home" to="/" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Controlo Académico" class="breadcrumb-link" />
          <q-breadcrumbs-el
            :label="internshipId ? `Editar ${getProgramName(program)}` : `Novo ${getProgramName(program)}`"
            class="breadcrumb-active"
          />
        </q-breadcrumbs>
        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon :name="internshipId ? 'edit_note' : 'add_circle'" size="1.3rem" color="white" />
          </div>
          <span>{{ internshipId ? 'Editar' : 'Criar' }} {{ getProgramName(program) }}</span>
          <q-chip v-if="form.name" size="sm" color="blue-1" text-color="blue-9" class="q-ml-sm" dense>
            {{ form.name }}
          </q-chip>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <q-btn flat no-caps dense icon="close" label="Cancelar" color="grey-6" class="cancel-btn" @click="router.back()" />
        <q-btn
          unelevated no-caps
          icon="save"
          :label="internshipId ? 'Guardar Alterações' : `Criar ${getProgramName(program)}`"
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

        <!-- ════ Informações Gerais ════ -->
        <div class="section-block q-mt-lg q-mb-lg">
          <div class="section-header-bar row items-center q-px-lg q-py-md">
            <div class="section-icon-wrap q-mr-sm">
              <q-icon name="info" size="1rem" color="white" />
            </div>
            <div>
              <div class="section-title">Informações Gerais</div>
              <div class="section-sub">Dados de identificação do {{ getProgramName(program) }}</div>
            </div>
          </div>
          <q-separator />

          <div class="q-pa-lg">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <label class="field-label">Nome do {{ getProgramName(program) }} *</label>
                <q-input
                  v-model="form.name"
                  outlined dense
                  maxlength="255"
                  :placeholder="`Ex: ${getProgramName(program)} Avançado 2025`"
                  :rules="[val => !!val || 'Campo obrigatório']"
                  class="custom-input"
                >
                  <template #prepend><q-icon name="label" color="primary" /></template>
                </q-input>
              </div>
            </div>
          </div>
        </div>

        <!-- ════ Faixa Etária (apenas Estágios) ════ -->
        <div class="section-block q-mb-lg" v-if="applyAge">
          <div class="section-header-bar row items-center q-px-lg q-py-md">
            <div class="section-icon-wrap q-mr-sm" style="background:linear-gradient(135deg,#7b1fa2,#4a148c)">
              <q-icon name="child_care" size="1rem" color="white" />
            </div>
            <div>
              <div class="section-title">Faixa Etária</div>
              <div class="section-sub">Definir idades mínima e máxima para admissão</div>
            </div>
          </div>
          <q-separator />

          <div class="q-pa-lg">
            <div class="row q-col-gutter-md">

              <div class="col-md-6 col-sm-12 col-xs-12">
                <label class="field-label">Idade Mínima *</label>
                <q-input
                  v-model="form.minimumAge"
                  outlined dense
                  type="number"
                  placeholder="Ex: 3"
                  :rules="[
                    val => val >= 0 || 'Não pode ser negativa',
                    val => !!val || 'Campo obrigatório'
                  ]"
                  class="custom-input"
                >
                  <template #prepend><q-icon name="arrow_downward" color="primary" /></template>
                  <template #append><span class="unit-label">anos</span></template>
                </q-input>
              </div>

              <div class="col-md-6 col-sm-12 col-xs-12">
                <label class="field-label">Idade Máxima *</label>
                <q-input
                  v-model="form.maximumAge"
                  outlined dense
                  type="number"
                  placeholder="Ex: 6"
                  :rules="[
                    val => val >= 1 || 'Mínimo é 1',
                    val => !!val || 'Campo obrigatório',
                    val => val > form.minimumAge || 'Deve ser maior que a idade mínima'
                  ]"
                  class="custom-input"
                >
                  <template #prepend><q-icon name="arrow_upward" color="primary" /></template>
                  <template #append><span class="unit-label">anos</span></template>
                </q-input>
              </div>

            </div>

            <!-- Age range visual preview -->
            <div class="age-preview q-mt-md" v-if="form.minimumAge >= 0 && form.maximumAge > 0">
              <q-icon name="people" size="1rem" style="color:#7b1fa2" />
              <span>Faixa aceite: <strong>{{ form.minimumAge }} – {{ form.maximumAge }} anos</strong></span>
              <span class="age-range-pill">{{ form.maximumAge - form.minimumAge }} anos de intervalo</span>
            </div>
          </div>
        </div>

        <!-- ════ Footer Actions ════ -->
        <div class="row justify-end q-gutter-sm">
          <q-btn flat no-caps label="Cancelar" icon="close" color="grey-6" class="cancel-btn" @click="router.back()" />
          <q-btn
            unelevated no-caps type="submit"
            icon="save"
            :label="internshipId ? 'Guardar Alterações' : `Criar ${getProgramName(program)}`"
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
import { onMounted, ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCourseStores } from "../store";
import useNotify from "src/composables/UseNotify";
import scripts from "src/composables/Scripts";

/* ── Stores ── */
const courseStores = useCourseStores();
const router = useRouter();
const route  = useRoute();
const { notifySuccess, notifyError } = useNotify();
const { getProgramName } = scripts();

/* ── Params ── */
const { educationId, courseId, program } = route.params;
const internshipId = courseId; // alias para legibilidade no template

/* ── Data ── */
const course   = ref(null);
const applyAge = ref(false);
const saving   = ref(false);

const form = ref({
  educationId,
  name: "",
  minimumAge: 0,
  maximumAge: 1,
});

const regimeOptions = ref([
  { label: "Semestral", value: 6 },
  { label: "Trimestral", value: 3 },
]);

/* ── Methods ── */
const submitForm = async () => {
  saving.value = true;
  const payload = {
    ...form.value,
    minimumAge:     parseInt(form.value.minimumAge),
    maximumAge:     parseInt(form.value.maximumAge),
    academicRegime: form.value.academicRegime,
  };

  try {
    if (!courseId) {
      await courseStores.create(payload);
      notifySuccess(`${getProgramName(program)} criado com sucesso!`);
    } else {
      await courseStores.update(courseId, payload);
      notifySuccess(`${getProgramName(program)} editado com sucesso!`);
    }
    router.back();
  } catch (error) {
    console.error(error);
    notifyError(`Erro ao guardar o ${getProgramName(program)}.`);
  } finally {
    saving.value = false;
  }
};

/* ── Fetch ── */
const fetchProgram = async () => {
  try {
    await courseStores.findOne(courseId);
    course.value = courseStores.course;
  } catch (error) {
    notifyError("Erro ao carregar dados.");
  }
};

/* ── Watch ── */
watchEffect(() => {
  if (course.value) {
    form.value = { ...course.value };
  }
});

onMounted(async () => {
  if (program === "internships") {
    applyAge.value = true;
  }
  if (courseId) {
    await fetchProgram();
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

.edigital-page {
  min-height: 100vh;
  background: #f0f4f8;
  font-family: 'DM Sans', sans-serif;
}

/* ── Top Bar ── */
.page-topbar {
  background: #ffffff;
  border-bottom: 1px solid #e8edf3;
  position: sticky; top: 0; z-index: 10;
  box-shadow: 0 2px 12px rgba(15,40,98,0.06);
}
.back-btn {
  background: #f0f4f8; color: #1a3fa6 !important;
  border-radius: 10px; width: 36px; height: 36px;
  transition: background 0.2s;
}
.back-btn:hover { background: #e0e8f7; }
.breadcrumb-nav { font-size: 0.78rem; }
.breadcrumb-link { color: #9ca3af !important; }
.breadcrumb-active { color: #1a3fa6 !important; font-weight: 600; }
.page-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.3rem; font-weight: 700; color: #0f2862;
}
.title-icon-wrap {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}

/* ── Buttons ── */
.save-btn {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  color: white; border-radius: 10px;
  padding: 0 20px; height: 38px;
  font-family: 'Sora', sans-serif; font-weight: 600; font-size: 0.88rem;
  transition: box-shadow 0.2s, transform 0.15s;
}
.save-btn:hover { box-shadow: 0 6px 18px rgba(26,63,166,0.35); transform: translateY(-1px); }
.cancel-btn {
  border: 1px solid #e5e7eb; border-radius: 10px;
  height: 38px; padding: 0 16px; font-size: 0.85rem;
  transition: background 0.2s;
}
.cancel-btn:hover { background: #f3f4f6; }

/* ── Section Blocks ── */
.section-block {
  background: white; border-radius: 16px; overflow: hidden;
  box-shadow: 0 2px 20px rgba(15,40,98,0.07); border: 1px solid #edf0f5;
}
.section-header-bar { background: #fafbfd; }
.section-icon-wrap {
  width: 30px; height: 30px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.section-title { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 0.92rem; color: #0f2862; }
.section-sub { font-size: 0.74rem; color: #9ca3af; }

/* ── Fields ── */
.field-label {
  display: block; font-size: 0.8rem; font-weight: 600;
  color: #374151; margin-bottom: 0.4rem;
}
.custom-input :deep(.q-field__control) { border-radius: 10px; background: #f8fafc; }
.custom-input :deep(.q-field--focused .q-field__control:before) { border-color: #1a3fa6; }
.unit-label {
  font-size: 0.78rem; font-weight: 600;
  color: #9ca3af; margin-right: 4px;
}

/* ── Age Preview ── */
.age-preview {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #faf5ff;
  border: 1px solid #e9d5ff;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 0.82rem;
  color: #6b21a8;
}
.age-range-pill {
  background: #e9d5ff;
  border-radius: 20px;
  padding: 2px 10px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #7b1fa2;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
}
</style>

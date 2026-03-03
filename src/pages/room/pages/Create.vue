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
          <q-breadcrumbs-el label="Gestão Académica" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Salas" to="/rooms" class="breadcrumb-link" />
          <q-breadcrumbs-el :label="pageTitle" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="meeting_room" size="1.3rem" color="white" />
          </div>
          <span>{{ pageTitle }}</span>
        </div>
      </div>
    </div>

    <!-- Form Card -->
    <div class="q-px-xl q-pt-lg q-pb-xl">
      <q-card class="form-card" flat>

        <!-- Card Header -->
        <div class="form-card-header row items-center q-px-lg q-py-md">
          <div class="form-header-icon q-mr-md">
            <q-icon name="meeting_room" size="1.2rem" color="white" />
          </div>
          <div>
            <div class="form-header-title">{{ pageTitle }}</div>
            <div class="form-header-sub">Preencha os campos abaixo para {{ id ? 'actualizar' : 'registar' }} a sala</div>
          </div>
        </div>

        <q-separator />

        <!-- Form Body -->
        <q-card-section class="q-pa-lg">
          <q-form ref="formRef" @submit.prevent="handleSubmit">

            <div class="section-label q-mb-md">Informações da Sala</div>

            <div class="row q-col-gutter-md q-mb-lg">
              <!-- Nome -->
              <div class="col-md-4 col-12">
                <div class="field-label">Nome da Sala <span class="required">*</span></div>
                <q-input
                  v-model="form.name"
                  placeholder="Ex: Sala A1"
                  outlined
                  dense
                  class="edigital-input"
                  :rules="[(val) => !!val || 'O nome é obrigatório.']"
                />
              </div>

              <!-- Tipo -->
              <div class="col-md-3 col-12">
                <div class="field-label">Tipo de Sala <span class="required">*</span></div>
                <q-select
                  v-model="form.type"
                  :options="roomTypes"
                  placeholder="Selecione o tipo"
                  outlined
                  dense
                  class="edigital-input"
                  :rules="[(val) => !!val || 'Selecione um tipo de sala.']"
                />
              </div>

              <!-- Localização -->
              <div class="col-md-3 col-12">
                <div class="field-label">Localização <span class="required">*</span></div>
                <q-input
                  v-model="form.location"
                  placeholder="Ex: Bloco B, 2º Andar"
                  outlined
                  dense
                  class="edigital-input"
                  :rules="[(val) => !!val || 'A localização é obrigatória.']"
                />
              </div>

              <!-- Disponibilidade -->
              <div class="col-md-2 col-12">
                <div class="field-label">Disponibilidade <span class="required">*</span></div>
                <q-select
                  v-model="form.availability"
                  :options="availabilityOptions"
                  option-value="id"
                  option-label="name"
                  emit-value
                  map-options
                  outlined
                  dense
                  class="edigital-input"
                  :rules="[(val) => val !== '' && val !== null && val !== undefined || 'Selecione a disponibilidade.']"
                />
              </div>
            </div>

            <q-separator class="q-mb-lg" />

            <!-- Actions -->
            <div class="row justify-end q-gutter-sm">
              <q-btn
                label="Cancelar"
                icon="close"
                class="cancel-btn"
                no-caps
                flat
                @click="cancel"
              />
              <q-btn
                :label="id ? 'Actualizar' : 'Guardar'"
                icon="save"
                class="save-btn"
                no-caps
                type="submit"
                :loading="loading"
              />
            </div>

          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRoomStores } from "../store";
import useNotify from "src/composables/UseNotify";

/* ── Router / Store ── */
const route = useRoute();
const router = useRouter();
const roomStores = useRoomStores();
const { notifyError, notifySuccess } = useNotify();

/* ── State ── */
const { id } = route.params;
const loading = ref(false);
const formRef = ref(null);

const form = ref({
  name: "",
  type: "",
  location: "",
  availability: "",
});

/* ── Options ── */
const roomTypes = ["Normal", "Laboratorio", "Ginásio"];

const availabilityOptions = [
  { id: true, name: "Sim" },
  { id: false, name: "Não" },
];

/* ── Computed ── */
const pageTitle = computed(() => (id ? "Editar Sala" : "Criar Sala"));

/* ── Methods ── */
const handleSubmit = async () => {
  try {
    loading.value = true;
    if (id) {
      await roomStores.update(id, { ...form.value });
      notifySuccess("Sala actualizada com sucesso!");
    } else {
      await roomStores.create({ ...form.value });
      notifySuccess("Sala criada com sucesso!");
    }
    router.back();
  } catch (error) {
    notifyError("Erro ao guardar sala");
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  router.back();
};
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
.back-btn:hover { background: #e0e8f7; }

.breadcrumb-nav { font-size: 0.78rem; }
.breadcrumb-link { color: #9ca3af !important; }
.breadcrumb-active { color: #1a3fa6 !important; font-weight: 600; }

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

/* ── Form Card ── */
.form-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(15, 40, 98, 0.07);
  border: 1px solid #edf0f5;
}

.form-card-header {
  background: #fafbfd;
  border-bottom: 1px solid #f0f0f0;
}
.form-header-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.form-header-title {
  font-family: "Sora", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #0f2862;
}
.form-header-sub {
  font-size: 0.78rem;
  color: #9ca3af;
  margin-top: 2px;
}

/* ── Form Fields ── */
.section-label {
  font-family: "Sora", sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
}
.field-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}
.required { color: #ef4444; }

.edigital-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
}
.edigital-input :deep(.q-field__control:hover) {
  border-color: #1a3fa6;
}

/* ── Buttons ── */
.cancel-btn {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #6b7280 !important;
  padding: 0 20px;
  height: 40px;
  font-weight: 600;
  transition: background 0.2s;
}
.cancel-btn:hover { background: #f3f4f6 !important; }

.save-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white !important;
  border-radius: 10px;
  padding: 0 24px;
  height: 40px;
  font-family: "Sora", sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  transition: box-shadow 0.2s, transform 0.15s;
}
.save-btn:hover {
  box-shadow: 0 6px 18px rgba(26, 63, 166, 0.35);
  transform: translateY(-1px);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; }
  .edigital-page .q-px-xl {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
</style>

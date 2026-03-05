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
          <q-breadcrumbs-el label="Financeiro" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Pagamentos Extras" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="payments" size="1.3rem" color="white" />
          </div>
          <span>Pagamentos Extras</span>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <q-input
          v-model="filter"
          dense outlined
          placeholder="Pesquisar pagamentos..."
          class="search-input"
          debounce="300"
          clearable
        >
          <template #prepend>
            <q-icon name="search" color="grey-5" size="1.1rem" />
          </template>
        </q-input>

        <q-btn flat round dense icon="refresh" class="action-icon-btn" @click="fetchExtraFees">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>

        <q-btn
          unelevated no-caps
          icon="add" label="Adicionar"
          class="new-btn"
          @click="addExtraFees"
        />
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row q-px-xl q-mb-lg row q-gutter-md">
      <div class="stat-card col" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="`background:${stat.color}18`">
          <q-icon :name="stat.icon" size="1.3rem" :style="`color:${stat.color}`" />
        </div>
        <div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="q-px-xl q-pb-xl">
      <q-card class="table-card" flat>
        <q-card-section class="q-pa-none">

          <div class="table-toolbar row items-center justify-between q-px-lg q-py-md">
            <div class="row items-center q-gutter-xs">
              <span class="table-count">{{ filteredExtraFees.length }}</span>
              <span class="table-count-label">pagamento(s) encontrado(s)</span>
            </div>
            <div class="row items-center q-gutter-xs">
              <q-btn flat round dense icon="view_list" :color="viewMode === 'list' ? 'primary' : 'grey-5'" size="sm" @click="viewMode = 'list'" />
              <q-btn flat round dense icon="grid_view" :color="viewMode === 'grid' ? 'primary' : 'grey-5'" size="sm" @click="viewMode = 'grid'" />
            </div>
          </div>

          <q-separator />

          <!-- LIST VIEW -->
          <q-table
            v-if="viewMode === 'list'"
            class="edigital-table no-shadow"
            :rows="filteredExtraFees"
            :columns="columns"
            row-key="id"
            flat
            v-model:pagination="pagination"
          >
            <template #body-cell-actions="props">
              <q-td :props="props">
                <div class="row no-wrap items-center q-gutter-xs">
                  <q-btn
                    flat round dense icon="edit"
                    class="tbl-btn tbl-btn-primary"
                    @click="editExtrasFees(props)"
                  >
                    <q-tooltip>Editar</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat round dense icon="login"
                    class="tbl-btn tbl-btn-green"
                    @click="addToClass(props)"
                  >
                    <q-tooltip>Associar a Turma</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </template>
          </q-table>

          <!-- GRID VIEW -->
          <div v-else class="grid-view q-pa-lg row q-gutter-md">
            <div
              v-for="fee in filteredExtraFees"
              :key="fee.id"
              class="grid-card col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div class="grid-card-header row items-center justify-between">
                <q-avatar size="48px" class="fee-avatar">
                  <q-icon name="payments" color="white" />
                </q-avatar>
                <div class="grid-amount">{{ fee.amount }} MZN</div>
              </div>
              <div class="grid-card-body q-mt-sm">
                <div class="grid-name">{{ fee.name }}</div>
              </div>
              <div class="grid-card-actions row q-gutter-xs">
                <q-btn flat dense no-caps icon="edit" label="Editar" class="grid-action-btn grid-action-primary" @click="editExtrasFees(fee)" />
                <q-btn flat dense no-caps icon="login" label="Associar" class="grid-action-btn grid-action-green" @click="addToClass(fee)" />
              </div>
            </div>
          </div>

        </q-card-section>
      </q-card>
    </div>

    <!-- ── Dialog: Criar / Editar Pagamento ── -->
    <q-dialog v-model="medium" persistent>
      <q-card class="dialog-card">

        <div class="dialog-header row items-center q-px-lg q-py-md">
          <div class="dialog-header-icon q-mr-md">
            <q-icon name="payments" size="1.1rem" color="white" />
          </div>
          <div class="col">
            <div class="dialog-title">{{ extraFee ? 'Editar Pagamento' : 'Adicionar Pagamento Extra' }}</div>
            <div class="dialog-sub">Preencha os campos abaixo</div>
          </div>
          <q-btn flat round dense icon="close" class="dialog-close-btn" @click="toggleModal" />
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <q-form ref="formRef" @submit.prevent="onSubmit">

            <div class="section-label q-mb-md">Informações do Pagamento</div>

            <div class="row q-col-gutter-md q-mb-lg">

              <div class="col-md-6 col-12">
                <div class="field-label">Nome do Pagamento <span class="required">*</span></div>
                <q-input
                  v-model="form.name"
                  placeholder="Ex: Taxa de Exame"
                  outlined dense
                  class="edigital-input"
                  :rules="[(val) => !!val || 'O nome é obrigatório.']"
                >
                  <template #prepend>
                    <q-icon name="label" color="grey-5" size="1rem" />
                  </template>
                </q-input>
              </div>

              <div class="col-md-6 col-12">
                <div class="field-label">Valor <span class="required">*</span></div>
                <q-input
                  v-model="form.amount"
                  type="number"
                  placeholder="Ex: 500"
                  outlined dense
                  class="edigital-input"
                  :rules="[(val) => !!val || 'O valor é obrigatório.']"
                >
                  <template #prepend>
                    <q-icon name="attach_money" color="grey-5" size="1rem" />
                  </template>
                  <template #append>
                    <span class="amount-tag">MZN</span>
                  </template>
                </q-input>
              </div>

            </div>

            <q-separator class="q-mb-lg" />

            <div class="row justify-end q-gutter-sm">
              <q-btn label="Cancelar" icon="close" class="cancel-btn" no-caps flat @click="toggleModal" />
              <q-btn
                :label="extraFee ? 'Actualizar' : 'Guardar'"
                icon="save" class="save-btn" no-caps
                type="submit" :loading="loading"
              />
            </div>

          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- ── Dialog: Associar a Turmas ── -->
    <q-dialog v-model="medium1" persistent>
      <q-card class="dialog-card">

        <div class="dialog-header row items-center q-px-lg q-py-md">
          <div class="dialog-header-icon q-mr-md">
            <q-icon name="login" size="1.1rem" color="white" />
          </div>
          <div class="col">
            <div class="dialog-title">Associar a Turmas</div>
            <div class="dialog-sub">Selecione as turmas que terão este pagamento extra</div>
          </div>
          <q-btn flat round dense icon="close" class="dialog-close-btn" @click="toggleModal1" />
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <div class="section-label q-mb-md">Turmas por Curso</div>

          <div class="q-gutter-md">
            <div
              v-for="course in updatedCourses"
              :key="course.id"
              class="course-block"
            >
              <!-- Course Header -->
              <div class="course-block-header row items-center q-px-md q-py-sm">
                <div class="course-avatar q-mr-sm">
                  <q-icon name="school" color="white" size="1rem" />
                </div>
                <div class="course-name">{{ course.name }}</div>
              </div>

              <!-- Classes -->
              <div class="q-pa-md q-gutter-sm">
                <div
                  v-for="(classe, index) in course.classes"
                  :key="index"
                  class="class-check-row row items-center"
                  :class="{ 'class-check-active': classe.hasExtraFees }"
                >
                  <q-checkbox
                    v-model="classe.hasExtraFees"
                    :label="classe.name"
                    :val="classe.id"
                    color="primary"
                    @update:model-value="onChange(classe.hasExtraFees, classe.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <div class="dialog-footer row justify-end q-px-lg q-py-sm">
          <q-btn label="Fechar" icon="close" class="cancel-btn" no-caps flat v-close-popup />
        </div>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useExtraFeeStores } from "../stores";
import { useCourseStores } from "src/pages/course/store";
import columns from "../components/columns/fees";
import useNotify from "src/composables/UseNotify";

/* ── Stores ── */
const extraFeeStore = useExtraFeeStores();
const courseStore = useCourseStores();
const { notifyError, notifySuccess } = useNotify();

/* ── State ── */
const extraFees = ref([]);
const extraFee = ref(null);
const courses = ref([]);
const updatedCourses = ref([]);
const filter = ref("");
const viewMode = ref("list");
const loading = ref(false);
const medium = ref(false);
const medium1 = ref(false);
const formRef = ref(null);
const pagination = ref({ rowsPerPage: 10 });

const form = ref({ name: "", amount: "" });

/* ── Computed ── */
const filteredExtraFees = computed(() => {
  if (!filter.value) return extraFees.value;
  const q = filter.value.toLowerCase();
  return extraFees.value.filter((f) =>
    f.name?.toLowerCase().includes(q)
  );
});

const stats = computed(() => [
  {
    label: "Total",
    value: extraFees.value.length,
    icon: "payments",
    color: "#1a3fa6",
  },
  {
    label: "Valor Médio",
    value: extraFees.value.length
      ? (extraFees.value.reduce((acc, f) => acc + Number(f.amount), 0) / extraFees.value.length).toFixed(0) + " MZN"
      : "—",
    icon: "attach_money",
    color: "#21b573",
  },
  {
    label: "Cursos",
    value: courses.value.length,
    icon: "school",
    color: "#f59e0b",
  },
]);

/* ── Methods ── */
const addExtraFees = () => {
  extraFee.value = null;
  form.value = { name: "", amount: "" };
  toggleModal();
};

const editExtrasFees = (props) => {
  extraFee.value = props.row ?? props;
  form.value = {
    name: extraFee.value.name,
    amount: extraFee.value.amount,
  };
  toggleModal();
};

const onSubmit = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  try {
    if (extraFee.value) {
      await extraFeeStore.update(extraFee.value.id, form.value);
      notifySuccess("Pagamento extra actualizado com sucesso!");
    } else {
      await extraFeeStore.create(form.value);
      notifySuccess("Pagamento extra criado com sucesso!");
    }
    await fetchExtraFees();
    toggleModal();
  } catch (error) {
    notifyError("Erro ao guardar pagamento extra.");
  } finally {
    loading.value = false;
  }
};

const addToClass = (props) => {
  const id = props.row?.id ?? props.id;
  updatedCourses.value = courses.value.map((course) => ({
    ...course,
    classes: course.classes.map((classItem) => ({
      ...classItem,
      hasExtraFees: classItem.extraFees.some((fee) => fee.id === id),
    })),
  }));
  extraFee.value = { id };
  toggleModal1();
};

const onChange = async (val, classId) => {
  try {
    if (val) {
      await extraFeeStore.addToClass({ classId, extraFeeId: extraFee.value.id });
    } else {
      await extraFeeStore.removeFromClass({ classId, extraFeeId: extraFee.value.id });
    }
  } catch (error) {
    notifyError("Erro ao actualizar associação.");
  }
};

const toggleModal = () => { medium.value = !medium.value; };
const toggleModal1 = () => { medium1.value = !medium1.value; };

/* ── Fetch ── */
const fetchExtraFees = async () => {
  try {
    await extraFeeStore.list();
    extraFees.value = extraFeeStore.extraFees;
  } catch (error) {
    notifyError("Erro ao carregar pagamentos extras.");
  }
};

const fetchCourses = async () => {
  try {
    await courseStore.list();
    courses.value = courseStore.courses;
  } catch (error) {
    notifyError("Erro ao carregar cursos.");
  }
};

/* ── Lifecycle ── */
onMounted(() => {
  fetchExtraFees();
  fetchCourses();
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
  width: 36px; height: 36px;
  transition: background 0.2s;
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
.search-input { width: 220px; }
.search-input :deep(.q-field__control) { border-radius: 10px; background: #f8fafc; height: 38px; }
.action-icon-btn {
  background: #f0f4f8; border-radius: 10px;
  width: 36px; height: 36px; transition: background 0.2s;
}
.action-icon-btn:hover { background: #e0e8f7; }
.new-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white; border-radius: 10px;
  padding: 0 18px; height: 38px;
  font-size: 0.88rem; font-weight: 600;
  font-family: "Sora", sans-serif;
  transition: box-shadow 0.2s, transform 0.15s;
}
.new-btn:hover { box-shadow: 0 6px 18px rgba(26,63,166,0.35); transform: translateY(-1px); }

/* ── Stats ── */
.stats-row { padding-top: 1.2rem; }
.stat-card {
  background: white; border-radius: 14px;
  padding: 1rem 1.2rem;
  display: flex; align-items: center; gap: 0.9rem;
  box-shadow: 0 2px 12px rgba(15,40,98,0.05);
  border: 1px solid #edf0f5; transition: box-shadow 0.2s;
}
.stat-card:hover { box-shadow: 0 4px 20px rgba(15,40,98,0.1); }
.stat-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-value { font-family: "Sora", sans-serif; font-size: 1.5rem; font-weight: 700; color: #0f2862; line-height: 1; }
.stat-label { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; font-weight: 500; }

/* ── Table Card ── */
.table-card {
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 2px 20px rgba(15,40,98,0.07);
  border: 1px solid #edf0f5;
}
.table-toolbar { background: #fafbfd; border-bottom: 1px solid #f0f0f0; }
.table-count { font-family: "Sora", sans-serif; font-weight: 700; font-size: 1rem; color: #0f2862; }
.table-count-label { font-size: 0.82rem; color: #9ca3af; }

.edigital-table :deep(thead tr th) {
  font-family: "Sora", sans-serif; font-size: 0.75rem;
  font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: #6b7280;
  background: #fafbfd; border-bottom: 2px solid #edf0f5; padding: 14px 16px;
}
.edigital-table :deep(tbody tr) { transition: background 0.15s; }
.edigital-table :deep(tbody tr:hover) { background: #f5f8ff !important; }
.edigital-table :deep(tbody tr td) {
  font-size: 0.875rem; color: #374151;
  padding: 12px 16px; border-bottom: 1px solid #f3f4f6;
}
.tbl-btn { border-radius: 8px !important; width: 32px; height: 32px; transition: background 0.15s; }
.tbl-btn-primary { color: #1a3fa6 !important; }
.tbl-btn-primary:hover { background: #e8f0fe !important; }
.tbl-btn-green { color: #21b573 !important; }
.tbl-btn-green:hover { background: #dcfce7 !important; }

/* ── Grid ── */
.grid-card {
  background: white; border-radius: 14px;
  border: 1px solid #edf0f5; padding: 1.2rem;
  box-shadow: 0 2px 12px rgba(15,40,98,0.05);
  transition: box-shadow 0.2s, transform 0.15s;
}
.grid-card:hover { box-shadow: 0 6px 24px rgba(15,40,98,0.12); transform: translateY(-2px); }
.grid-card-header { display: flex; align-items: center; margin-bottom: 0.5rem; }
.fee-avatar {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 12px;
}
.grid-amount {
  font-family: "Sora", sans-serif;
  font-weight: 700; font-size: 1rem; color: #21b573;
}
.grid-name { font-family: "Sora", sans-serif; font-weight: 600; font-size: 0.95rem; color: #0f2862; }
.grid-card-actions { margin-top: 1rem; border-top: 1px solid #f0f4f8; padding-top: 0.8rem; }
.grid-action-btn { border-radius: 8px; font-size: 0.78rem; color: #6b7280 !important; background: #f8fafc; padding: 0 10px; }
.grid-action-primary { color: #1a3fa6 !important; background: #eff6ff !important; }
.grid-action-green { color: #21b573 !important; background: #dcfce7 !important; }

/* ── Dialog ── */
.dialog-card {
  width: 700px; max-width: 92vw;
  border-radius: 16px !important; overflow: hidden;
  font-family: "DM Sans", sans-serif;
}
.dialog-header { background: #fafbfd; border-bottom: 1px solid #f0f0f0; }
.dialog-header-icon {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.dialog-title { font-family: "Sora", sans-serif; font-size: 0.95rem; font-weight: 700; color: #0f2862; }
.dialog-sub { font-size: 0.75rem; color: #9ca3af; margin-top: 1px; }
.dialog-close-btn { background: #f0f4f8; color: #6b7280 !important; border-radius: 8px; }
.dialog-footer { background: #fafbfd; }

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
.amount-tag { font-size: 0.78rem; font-weight: 700; color: #1a3fa6; font-family: "Sora", sans-serif; }

/* ── Course Block ── */
.course-block {
  background: white; border-radius: 12px;
  border: 1px solid #edf0f5; overflow: hidden;
  box-shadow: 0 2px 8px rgba(15,40,98,0.04);
}
.course-block-header {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  padding: 0.6rem 1rem;
}
.course-avatar {
  width: 28px; height: 28px;
  background: rgba(255,255,255,0.2);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.course-name { font-family: "Sora", sans-serif; font-weight: 700; font-size: 0.88rem; color: white; }
.class-check-row {
  background: #f8fafc; border-radius: 8px;
  padding: 4px 8px; transition: background 0.15s;
}
.class-check-row:hover { background: #f0f6ff; }
.class-check-active { background: #eff6ff !important; border: 1px solid #dbeafe; }

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
.save-btn:hover { box-shadow: 0 6px 18px rgba(26,63,166,0.35); transform: translateY(-1px); }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .search-input { width: 100%; order: 3; }
  .stats-row { padding: 1rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
}
</style>

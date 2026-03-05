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
          <q-breadcrumbs-el label="Turmas" class="breadcrumb-link" />
          <q-breadcrumbs-el :label="classe?.name ?? 'Horário'" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="calendar_month" size="1.3rem" color="white" />
          </div>
          <span>Horário{{ classe ? ` — ${classe.name}` : '' }}</span>
        </div>
      </div>
    </div>

    <div class="q-px-xl q-pt-lg q-pb-xl q-gutter-lg">

      <!-- Card: Info da Turma -->
      <q-card class="form-card" flat>

        <div class="form-card-header row items-center q-px-lg q-py-md">
          <div class="form-header-icon q-mr-md">
            <q-icon name="class" size="1.2rem" color="white" />
          </div>
          <div class="col">
            <div class="form-header-title">Informações da Turma</div>
            <div class="form-header-sub">Detalhes e horário semanal da turma seleccionada</div>
          </div>
          <!-- Pill de aulas -->
          <div class="permissions-count-pill" v-if="classe">
            <q-icon name="event" size="0.9rem" color="white" class="q-mr-xs" />
            {{ classe.schedules?.length ?? 0 }} aula(s)
          </div>
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg" v-if="classe">
          <div class="section-label q-mb-md">Resumo do Horário</div>

          <!-- Stats inline -->
          <div class="row q-gutter-md q-mb-md">
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
        </q-card-section>

        <!-- Loading -->
        <q-card-section v-if="loading" class="column items-center q-pa-xl">
          <q-spinner-dots color="primary" size="2.5rem" />
          <div class="text-grey-5 q-mt-sm" style="font-size:0.85rem">A carregar turma...</div>
        </q-card-section>

      </q-card>

      <!-- Card: Horário Semanal -->
      <q-card class="form-card" flat v-if="classe">

        <div class="form-card-header row items-center q-px-lg q-py-md">
          <div class="form-header-icon q-mr-md">
            <q-icon name="calendar_month" size="1.2rem" color="white" />
          </div>
          <div>
            <div class="form-header-title">Horário Semanal</div>
            <div class="form-header-sub">
              {{ classe.schedules?.length ?? 0 }} aula(s) agendada(s) para a turma {{ classe.name }}
            </div>
          </div>
        </div>

        <q-separator />

        <q-card-section class="q-pa-lg schedule-wrap">
          <ScheduleComponent
            ref="scheduleRef"
            :classe="classe"
          />
        </q-card-section>

      </q-card>

      <!-- Empty State (sem turma) -->
      <q-card v-else-if="!loading" class="form-card empty-card" flat>
        <q-card-section class="column items-center q-py-xl">
          <div class="empty-icon-wrap q-mb-md">
            <q-icon name="calendar_month" size="3rem" color="white" />
          </div>
          <div class="empty-title">Horário não disponível</div>
          <div class="empty-sub">Não foi possível carregar os dados da turma</div>
        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useClassStores } from "../store";
import useNotify from "src/composables/UseNotify";
import ScheduleComponent from "src/pages/schedule/pages/Create.vue";

/* ── Router / Store ── */
const route = useRoute();
const classStores = useClassStores();
const { notifyError } = useNotify();

/* ── Params ── */
const { classId } = route.params;

/* ── State ── */
const classe = ref(null);
const scheduleRef = ref(null);
const loading = ref(false);

/* ── Computed ── */
const stats = computed(() => {
  const schedules = classe.value?.schedules ?? [];
  const days = new Set(schedules.map((s) => s.dayWeek));
  const disciplines = new Set(schedules.map((s) => s.discipline?.name));
  return [
    {
      label: "Aulas Agendadas",
      value: schedules.length,
      icon: "event",
      color: "#1a3fa6",
    },
    {
      label: "Dias com Aulas",
      value: days.size,
      icon: "calendar_today",
      color: "#21b573",
    },
    {
      label: "Disciplinas",
      value: disciplines.size,
      icon: "menu_book",
      color: "#f59e0b",
    },
  ];
});

/* ── Fetch ── */
const fetchClass = async () => {
  loading.value = true;
  try {
    await classStores.findOne(classId);
    classe.value = classStores.classe;
  } catch (error) {
    notifyError("Erro ao carregar a turma.");
  } finally {
    loading.value = false;
  }
};

/* ── Lifecycle ── */
onMounted(async () => {
  await fetchClass();
  if (scheduleRef.value?.generatePeriods) {
    scheduleRef.value.generatePeriods();
    classe.value?.schedules?.forEach(({ dayWeek, period, discipline }) => {
      const colIndex = scheduleRef.value.days.indexOf(dayWeek);
      if (colIndex !== -1 && period < scheduleRef.value.schedule.length) {
        scheduleRef.value.schedule[period].slots[colIndex] = {
          disciplineName: discipline.name,
        };
      }
    });
  }
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

/* ── Stats ── */
.stat-card {
  background: white;
  border-radius: 14px;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.05);
  border: 1px solid #edf0f5;
  transition: box-shadow 0.2s;
}
.stat-card:hover { box-shadow: 0 4px 20px rgba(15, 40, 98, 0.1); }
.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-value {
  font-family: "Sora", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f2862;
  line-height: 1;
}
.stat-label { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; font-weight: 500; }

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
.form-header-sub { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; }

/* ── Permissions Count Pill ── */
.permissions-count-pill {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  color: white;
  border-radius: 20px;
  padding: 4px 12px;
  font-family: "Sora", sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
}

/* ── Section Label ── */
.section-label {
  font-family: "Sora", sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
}

/* ── Empty State ── */
.empty-card { background: white; }
.empty-icon-wrap {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-title {
  font-family: "Sora", sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f2862;
  margin-bottom: 6px;
}
.empty-sub { font-size: 0.85rem; color: #9ca3af; text-align: center; max-width: 320px; }

/* ── Schedule ── */
.schedule-wrap { overflow-x: auto; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; }
  .edigital-page .q-px-xl {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
</style>

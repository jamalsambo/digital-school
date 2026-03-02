<template>
  <q-page class="edigital-page">

    <!-- 🔷 Topbar -->
    <div class="page-topbar">
      <div>
        <div class="page-title">
          Calendário Académico
        </div>
        <div class="page-subtitle">
          Gestão de eventos do ano lectivo {{ currentYear }}
        </div>
      </div>

      <q-btn
        class="tbl-btn"
        icon="add"
        label="Novo Evento"
        no-caps
        @click="toggleModal"
      />
    </div>

    <!-- 🔷 Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">{{ events.length }}</div>
        <div class="stat-label">Total de Eventos</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">
          {{ upcomingEvents }}
        </div>
        <div class="stat-label">Próximos Eventos</div>
      </div>
    </div>

    <!-- 🔷 Timeline Card -->
    <q-card flat bordered class="edigital-card">
      <q-card-section>

        <q-timeline color="primary">
          <q-timeline-entry
            v-for="event in events"
            :key="event.id"
            :title="event.title"
            :subtitle="formatDate(event.date)"
            icon="event"
          >
            {{ event.description }}
          </q-timeline-entry>
        </q-timeline>

      </q-card-section>
    </q-card>

    <!-- 🔷 Modal -->
    <q-dialog v-model="medium" persistent>
      <q-card class="edigital-modal">

        <q-card-section>
          <div class="modal-title">
            Criar Novo Evento
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">

              <q-input
                class="col-12"
                v-model="form.eventName"
                label="Nome do evento"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />

              <q-input
                class="col-12"
                v-model="form.description"
                label="Descrição"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />

              <q-input
                class="col-md-6 col-12"
                v-model="form.date"
                type="date"
                label="Data"
                outlined
                dense
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />

              <q-select
                class="col-md-6 col-12"
                v-model="form.eventType"
                :options="['Aula', 'Avaliação']"
                label="Tipo"
                outlined
                dense
                clearable
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />

            </div>

            <div class="modal-actions">
              <q-btn
                label="Cancelar"
                flat
                class="tbl-btn-secondary"
                @click="toggleModal"
              />

              <q-btn
                label="Guardar"
                type="submit"
                class="tbl-btn"
              />
            </div>

          </q-form>
        </q-card-section>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useCalendarStores } from "../store";
import useNotify from "src/composables/UseNotify";

/* setup store */
const calendarStores = useCalendarStores();
const { notifyError, notifySuccess } = useNotify();

/* setup state */
const currentYear = new Date().getFullYear();
const events = ref([]);
const medium = ref(false);
const form = ref({
  eventName: "",
  eventType: "",
  description: null,
  date: "",
  year: currentYear,
});

const upcomingEvents = computed(() => {
  const today = new Date();
  return events.value.filter(e => new Date(e.date) >= today).length;
});

/* methods */
const onSubmit = async () => {
 try {
  await calendarStores.create(form.value);
  await fetchCalendar()
  notifySuccess("Novo evento criado com sucesso");
  toggleModal();
 } catch (error) {
  notifyError("Erro ao criar evento")
 }

};
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const fetchCalendar = async () => {
  try {
    await calendarStores.list();
  const data = calendarStores.events;
  events.value = data.map((event) => ({
    id: event.id,
    title: event.eventName,
    date: new Date(event.date),
    icon: "school",
    description: event.description,
    color: "blue",
  }));
  } catch (error) {
    notifyError("Erro ao carregar calendar")
  }
};

const toggleModal = () => {
  medium.value = !medium.value;
};

onMounted(async () => {
  await fetchCalendar();
});
</script>

<style scoped>


.edigital-page {
  padding: 24px;
}

.page-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
}

.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #f9fafb;
  padding: 16px 24px;
  border-radius: 12px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

.edigital-card {
  border-radius: 16px;
}

.edigital-modal {
  width: 850px;
  max-width: 90vw;
  border-radius: 16px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>

<template>
  <q-page padding>
    <q-dialog v-model="medium" persistent>
      <q-card style="width: 900px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Criar novo evento</div>
        </q-card-section>
        <q-separator spaced />
        <q-card-section>
          <q-form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-sm">
              <q-input
                class="col-md-12 col-sm-12 col-xs-12"
                v-model="form.eventName"
                label="Nome do evento"
                :rules="[(val) => !!val || 'Campo obrigatória']"
                outlined
                dense
              />
              <q-input
                class="col-md-12 col-sm-12 col-xs-12"
                v-model="form.description"
                label="Descrição  "
                :rules="[(val) => !!val || 'Campo obrigatória']"
                outlined
                dense
              />
              <q-input
                class="col-md-6 col-sm-6 col-xs-12"
                v-model="form.date"
                type="date"
                label="Data do evento"
                outlined
                :rules="[(val) => !!val || 'Campo obrigatória.']"
                dense
              />
              <q-select
              class="col-md-6 col-sm-12 col-xs-12"
              v-model="form.eventType"
              :options="['Aula', 'Avaliação']"
              label="Tipo de evento"
              option-label="name"
              option-value="id"
              map-options
              outlined
              emit-value
              :rules="[(val) => !!val || 'Campo obrigatória.']"
              dense=""
              clearable=""
            />
            </div>
            <div class="row justify-end q-gutter-sm">
              <q-btn
                label="Cancelar"
                color="negative"
                icon="close"
                outline
                @click="toggleModal"
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
      </q-card>
    </q-dialog>
    <q-card flat bordered class="q-mb-md">
      <q-card flat bordered class="q-pa-md shadow-2">
        <div class="row items-center justify-between">
          <div class="text-h6 text-primary">
            Calendario academico - {{ currentYear }}
          </div>
          <q-btn
            color="primary"
            icon="add"
            label="Novo Evento"
            class="q-mr-sm"
            @click="toggleModal"
            flat
          />
        </div>
        <q-separator spaced />
        <q-timeline color="primary">
          <q-timeline-entry
            v-for="event in events"
            :key="event.id"
            :title="event.title"
            :subtitle="formatDate(event.date)"
            :icon="event.icon"
            :color="event.color"
          >
            {{ event.description }}
          </q-timeline-entry>
        </q-timeline>
      </q-card>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
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

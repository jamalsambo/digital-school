<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Criar Notificação</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit="onSubmit">
        <!-- Destinatários -->
        <div class="row q-col-gutter-sm">
          <q-select
            class="col-md-12 col-sm-12 col-xs-12"
            dense
            v-model="form.recipient"
            :options="recipients"
            label="Enviar para"
            outlined
            @update:model-value="updateOptions"
            :rules="[(val) => !!val || 'Os receptores e obrigatorio.']"
          />

          <!-- Se for para Estudantes, permitir selecionar Turma e Curso -->

          <q-checkbox
            v-if="form.recipient === 'Estudantes'"
            class="col-md-12 col-sm-12 col-xs-12"
            v-model="customModel"
            color="secondary"
            label="Todas"
            true-value="yes"
            false-value="no"
            @update:model-value="updateCustomModel"
            :rules="[(val) => !!val || 'Este campo é obrigatório.']"
          />
          <q-select
            class="col-md-6 col-sm-12 col-xs-12"
            dense
            v-if="form.recipient === 'Estudantes' && customModel === 'no'"
            v-model="course"
            :options="courses"
            label="Selecione o Curso"
            option-value="id"
            option-label="name"
            map-options
            outlined
            @update:model-value="updateCourses"
            :rules="[(val) => !!val || 'Este campo é obrigatório.']"
          />

          <q-select
            class="col-md-6 col-sm-12 col-xs-12"
            dense
            v-if="form.recipient === 'Estudantes' && customModel === 'no'"
            v-model="classe"
            :options="classes"
            label="Selecione a Turma"
            outlined
            option-value="id"
            option-label="name"
            map-options
            @update:model-value="updateClasses"
          />

          <!-- Tipo de Notificação -->
          <q-select
            class="col-md-6 col-sm-12 col-xs-12"
            dense
            v-model="form.type"
            :options="typesNotification"
            label="Tipo de Notificação"
            outlined
          />

          <!-- Meio de Envio -->
          <q-select
            class="col-md-6 col-sm-12 col-xs-12"
            dense
            v-model="form.methodSend"
            :options="meansShipping"
            label="Meio de Envio"
            outlined
          />

          <!-- Data de Envio (Agendamento) -->
          <q-input
            class="col-md-12 col-sm-12 col-xs-12"
            v-model="form.sendDate"
            label="Data de Envio"
            type="datetime-local"
            outlined
            dense
          />
          <q-input
            class="col-md-12 col-sm-12 col-xs-12"
            v-model="form.meetingDate"
            label="Data do encontrado"
            type="datetime-local"
            outlined
            dense
          />
          <!-- Título da Notificação -->
          <q-input
            class="col-md-12 col-sm-12 col-xs-12"
            v-model="form.title"
            label="Título"
            outlined
            dense
          />

          <!-- Mensagem -->
          <q-input
            class="col-md-12 col-sm-12 col-xs-12"
            v-model="form.message"
            label="Mensagem"
            type="textarea"
            outlined
            dense
          />

          <!-- Anexos -->
          <!-- <q-file
           class="col-md-12 col-sm-12 col-xs-12"
            v-model="notificacao.anexo"
            label="Adicionar Anexo"
            outlined
          /> -->
        </div>
        <q-separator spaced />
        <div class="row justify-end q-gutter-sm">
          <q-btn
            label="Cancelar"
            color="negative"
            icon="close"
            outline
            @click="cancel"
            class="q-mr-sm"
            flat
          />
          <q-btn
            label="Enviar Notificação"
            color="positive"
            icon="save"
            type="submit"
            flat
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useCourseStores } from "src/pages/course/store";
import { useClassStores } from "src/pages/class/store";
import { useContactStores } from "src/components/register/contact/store";
import { useNotificationStores } from "../store";
import useNotify from "src/composables/UseNotify";

/* setup store */
const notificationStores = useNotificationStores();
const courseStores = useCourseStores();
const classStores = useClassStores();
const contactStores = useContactStores();
const { notifyError, notifySuccess } = useNotify();

// Estado da Notificação
const form = ref({
  recipient: null,
  type: "",
  title: "",
  message: "",
  isRead: "",
  sendDate: "",
  meetingDate: "",
  methodSend: "",
  isRead: false,
});
const classes = ref();
const course = ref();
const courses = ref([]);
const classe = ref();
const customModel = ref("no");
const contacts = ref([]);

// Opções de seleção
const recipients = ["Todos", "Encarregados", "Estudantes"];
const typesNotification = ["Convocatória", "Aviso", "Lembrete"];
const meansShipping = ["Mensagem", "WhatsApp", "Email"];

// Atualizar opções quando mudar o destinatário
const updateOptions = async (value) => {
  if (value === "Encarregados") {
    await fetchContacts();
    contacts.value = contactStores.contacts.filter(
      (contact) =>
        contact.owner === "Encarregado" && contact.type === "Principal"
    );
  } else if (value === "Todos") {
    await fetchContacts();
    contacts.value = contactStores.contacts.filter(
      (contact) =>
        contact.type === "Principal" &&
        (contact.owner === "Encarregado" || contact.owner === "Estudante")
    );
  }
  classe.value = null;
  course.value = null;
};

/* methods */
const onSubmit = async () => {
  try {
    const promises = contacts.value.map(async (item) => {
      if (item.number !== null) {
        await notificationStores.create({
          ...form.value,
          received: item.number,
        });
      }
    });

    // Executa todas as requisições ao mesmo tempo
    await Promise.all(promises);
    notifySuccess("Notificação enviada com sucesso");
  } catch (error) {
    notifyError("Ocorreu um erro ao enviar");
  }
};

const fetchCourses = async () => {
  try {
    await courseStores.list();
    courses.value = courseStores.courses;
  } catch (error) {
    notifyError("Erro ao carregar cursos");
  }
};

const fetchClasses = async () => {
  try {
    await classStores.list({ today: new Date() });
    contacts.value = classStores.classes.flatMap((cls) =>
      cls.enrollments.map((enrollment) => {
        const mainContact = enrollment.student.contacts.find(
          (c) => c.type === "Principal" && c.owner === "Estudante"
        );

        return {
          number: mainContact ? mainContact.number : null, // Garante que seja null se não encontrar
          owner: mainContact ? mainContact.owner : null,
        };
      })
    );
  } catch (error) {
    notifyError("Erro ao carregar turmas");
  }
};

const fetchContacts = async () => {
  try {
    await contactStores.list();
  } catch (error) {
    notifyError("Erro ao carregar contatos");
  }
};

const updateCourses = (value) => {
  classes.value = value.classes;
};

const updateClasses = (value) => {
  contacts.value = value.enrollments.map((enrollment) => {
    const mainContact = enrollment.student.contacts.find(
      (c) => c.type === "Principal" && c.owner === "Estudante"
    );

    return {
      number: mainContact ? mainContact.number : null, // Garante que seja null se não encontrar
      owner: mainContact ? mainContact.owner : null,
    };
  });
};

const updateCustomModel = (value) => {
  if (value === "no") {
    contacts.value = [];
  } else {
    fetchClasses();
  }
};

onMounted(async () => {
  await fetchCourses();
});
</script>

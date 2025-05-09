<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md q-mx-auto" style="max-width: 600px">
      <q-card-section>
        <div class="text-h6">Justificativa de Ausência</div>
        <div class="text-subtitle2">
          Preencha os campos abaixo para justificar sua ausência
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="sendJustification" class="q-gutter-md">
          <q-input
            v-model="justification"
            type="textarea"
            label="Justificativa"
            filled
            autogrow
            dense
            :rules="[(val) => !!val || 'Justificativa é obrigatória']"
            :disable="userStores.isTeacher"
          />

          <q-file
            v-model="file"
            label="Anexar documento (opcional)"
            filled
            dense
            accept=".pdf, image/*"
            counter
            :disable="userStores.isTeacher"
          >
            <template v-slot:append>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <q-select
           :disable="userStores.isStudent"
            class="col-md-4 col-sm-6 col-xs-12"
            v-model="teacherPosition"
            :options="teacherPositions"
            label="Posição do professor"
            option-label="label"
            option-value="value"
            dense
            outlined
            map-options
            emit-value
          />

          <q-btn
            v-if="!attendance?.justification || userStores.isTeacher"
            label="Enviar Justificativa"
            color="primary"
            type="submit"
            class="full-width"
            :loading="sending"
          />

          <q-btn
            label="Voltar"
            color="secondary"
            type="button"
            class="full-width"
            @click="router.back()"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAttendanceStores } from "../store";
import { useUserStores } from "src/pages/user/store";
import useNotify from "src/composables/UseNotify";
import { useComposablesStores } from "src/composables";
import { useRoute, useRouter } from "vue-router";

/* setup router */
const route = useRoute();
const router = useRouter();

/* setup stores */
const attendanceStores = useAttendanceStores();
const composableStores = useComposablesStores();
const userStores = useUserStores();
const { notifyError, notifyInfo, notifySuccess } = useNotify();

/* setup data */
const { attendanceId } = route.params;
const attendance = ref(null);
const justification = ref("");
const file = ref(null);
const sending = ref(false);
const justificationFile = ref("");
const teacherPosition = ref(false);
const teacherPositions = [
  { value: true, label: "Aceitar Justificativa" },
  { value: false, label: "Recusar Justificativa" },
];

const sendJustification = async () => {
  if (!justification.value) {
    notifyInfo("Justificativa é obrigatória");
    return;
  }

  sending.value = true;
  // Simula envio
  try {
    if (userStores.isTeacher) {
      const payload = { teacherPosition: teacherPosition.value };
      await attendanceStores.update(attendanceId, payload);
      notifySuccess("Feito");
      router.back();
    } else {
      const publicUrl = await composableStores.uploadFromSupabase(
        file.value,
        "student"
      );

      if (publicUrl) {
        const payload = { justification: justification.value, file: publicUrl };
        await attendanceStores.update(attendanceId, payload);
        notifySuccess("Justificativa adicionado com sucesso");
        router.back();
      }
    }

    sending.value = false;
  } catch (error) {
    notifyError("Erro ao justificar");
  }
};

const findOne = async () => {
  try {
    await attendanceStores.findOneAttendance({ id: attendanceId });
    attendance.value = attendanceStores.attendance;
    justification.value = attendance.value?.justification;
    teacherPosition.value = attendance.value.teacherPosition

    if (attendance.value?.file) {
      justificationFile.value = attendance.value?.file;
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(findOne);
</script>

<style scoped>
@media (max-width: 600px) {
  .q-card {
    margin-left: 8px;
    margin-right: 8px;
  }
}
</style>

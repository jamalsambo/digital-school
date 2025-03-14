<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Nova matricula</div>
      </q-card-section>
      <q-separator spaced />
      <q-card-section>
        <q-form @submit="onSubmit">
          <div class="row q-col-gutter-sm">
            <q-select
              class="col-md-4 col-sm-12 col-xs-12"
              v-model="education"
              :options="educationsLevels"
              option-label="name"
              option-value="id"
              label="Ensino"
              outlined
              dense
              map-options
              @update:model-value="onEducationChange"
            />
            <q-select
              class="col-md-4 col-sm-12 col-xs-12"
              v-model="course"
              :options="courses"
              option-label="name"
              option-value="id"
              label="Classe/Estagio/Curso"
              outlined
              dense
              map-options
              @update:model-value="onCourseChange"
            />
            <q-select
              class="col-md-4 col-sm-12 col-xs-12"
              v-model="classe"
              :options="classes"
              label="Turma"
              option-label="name"
              option-value="id"
              outlined
              dense
              @update:model-value="onClasseChange"
              map-options
            />
          </div>
          <div class="text-h7 text-primary text-bold q-mt-sm">
            Informaçoes da turma
          </div>
          <q-separator spaced />
          <q-list dense bordered class="justify-end">
            <q-item>
              <q-item-section>📋 Valor de matricula </q-item-section>
              <q-item-section side>{{
                classe?.enrollmentFeeValue
              }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>📌 Mensalidade</q-item-section>
              <q-item-section side>{{ classe?.monthlyFee }}</q-item-section>
            </q-item>
            <q-item v-if="classe?.renewal !== 0">
              <q-item-section>📋 Valor de inscricao </q-item-section>
              <q-item-section side>{{ classe?.renewalValue }}</q-item-section>
            </q-item>
            <q-item v-if="classe?.renewal !== 0">
              <q-item-section>📌 Renovaçao de inscricao</q-item-section>
              <q-item-section side>{{ classe?.renewal }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>💵 Periodo</q-item-section>
              <q-item-section side
                >{{ classe?.period.start }} -
                {{ classe?.period.end }}</q-item-section
              >
            </q-item>
            <q-item v-if="classe?.monthlyFeeIncluse">
              <q-item-section
                >Nota: Valor da primeira mensalidade inclusa</q-item-section
              >
            </q-item>
          </q-list>

          <!-- Botões de ação -->
          <div class="row justify-end q-gutter-sm q-mt-sm">
            <q-btn
              label="Cancelar"
              color="negative"
              flat
              icon="cancel"
              @click="cancel"
            />
            <q-btn
              type="submit"
              label="Salvar"
              color="primary"
              icon="save"
              flat
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "src/pages/auth/store";
import { useCourseStores } from "src/pages/course/store";
import { useEnrollmentStores } from "../store";
import { useStudentStores } from "src/pages/student/store";
import useNotify from "src/composables/UseNotify";

/* setup router */
const router = useRouter();
const route = useRoute();

/* setup router */
const authStore = useAuthStore();
const courseStores = useCourseStores();
const enrollmentStores = useEnrollmentStores();
const studentStores = useStudentStores();
const { notifyError, notifySuccess } = useNotify();

/* setup data */
const { studentId } = route.params;
const courses = ref([]);
const course = ref();
const classes = ref([]);
const classe = ref();
const educationsLevels = computed(
  () => authStore.user?.userDetails?.institution?.institutionLevels.map((education) =>{
    return{
      id: education.education.id,
      name: education.education.name
    }
  })
);
const education = ref()

/* setup methods */
const onSubmit = async () => {
  const payload = {
    classId: classe.value.id,
    educationId: education.value.id,
  };
  try {
    await enrollmentStores.create(payload);
    if (enrollmentStores.enrollment.id) {
        enrollmentStores.update(enrollmentStores.enrollment.id, {
          studentId: studentId,
        });
        router.back()
        notifySuccess("Matricula registada, aguardando pagamento!")
    } else {
      notifyError("Matricula nao criada.");
    }
  } catch (error) {
    notifyError("Erro na criaça de matricula");
  }
};
const onCourseChange = async (value) => {
  classes.value = value.classes;
};
const onClasseChange = async (value) => {
  classe.value = value;
};
const onEducationChange = async (value) => {
  await fetchCourses(value.id)
}

/* fetchdata */
const fetchCourses = async (education) => {
  try {
    await courseStores.list({ educationId: education });
    courses.value = courseStores.courses;
  } catch (error) {}
};

</script>

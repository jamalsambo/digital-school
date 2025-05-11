<template>
  <q-page padding>
    <div class="q-gutter-lg">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6">Alocar Lider do Grupo</div>

        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <!-- Lista visual informativa de todos os grupos -->
          <div class="text-subtitle1 q-mt-md">Todos os estudantes</div>

          <!-- Selecionar estudante -->
          <q-select
            label="Selecionar Estudante"
            v-model="selectedStudent"
            :options="allStudents"
            option-label="name"
            option-value="id"
            @update:model-value="handleTeamLeader"
            emit-value
            map-options
            clearable
            outlined
            dense
          />
        </q-card-section>

        <q-separator />
        <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Voltar"
              color="negative"
              icon="close"
              outline
              @click="router.back()"
              class="q-mr-sm"
              flat
            />
          </div>
      </q-card>
    </div>
  </q-page>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useGroupStores } from "../store";
import { useStudentStores } from "src/pages/student/store";
import useNotify from "src/composables/UseNotify";

/* use store*/
const router = useRouter();
const route = useRoute();
const groupStores = useGroupStores();
const studentStores = useStudentStores()
const { notifyError, notifySuccess } = useNotify();

/* Data */
const { groupId, classeId } = route.params;
const allStudents = ref([])
const selectedStudent = ref()

/* Methods */
const handleTeamLeader = async (value) => {
    try {
      await groupStores.update(groupId, {teamTeader: value});
      notifySuccess("Lider do grupo adicicionado com sucesso!");

    } catch (error) {
      notifyError("Ocorreu um erro ao tentar criar o grupo!");
    }
};

/* fetch data */
const fetchStudent = async () => {
  try {
    await studentStores.list({ classId: classeId });
    allStudents.value = studentStores.students.map((student) => ({
      id: student.id,
      name: student.basicInformation?.fullName,
    }));
  } catch (error) {
    notifyError("Ocorreu um erro ao carregar os estudantes");
  }
};

onMounted(fetchStudent)
</script>

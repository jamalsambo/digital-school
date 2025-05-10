<template>
  <q-page padding>
    <div class="q-mb-md">
      <q-btn
        color="primary"
        label="Distribuir Estudantes Aos Grupos"
        @click="distributeStudents"
        v-if="availableStudents.length > 0"
      />
    </div>

    <div class="q-mb-md">
      <q-card v-for="group in groups" :key="group.id" class="q-mb-md">
        <q-card-section>
          <div class="text-h6">{{ group.name }}</div>
          <div class="q-mt-sm">
            <div
              v-for="student in group.students"
              :key="student.id"
              class="q-mb-sm"
            >
              <div class="q-gutter-sm row items-center">
                <span class="q-mr-sm">{{ student.name }}</span>
                <q-btn
                  icon="delete"
                  flat
                  round
                  dense
                  size="sm"
                  color="negative"
                  @click="handleRemoveMember(group, student)"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-mb-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Estudantes</div>
          <div class="q-mt-sm" v-if="availableStudents.length > 0">
            <div v-for="student in availableStudents" :key="student.id">
              <div class="q-gutter-sm row items-center">
                <span class="q-mr-sm">{{ student.name }}</span>
                <q-select
                  class="col-grow"
                  v-model="groupSelected"
                  :options="groups"
                  label="Grupos"
                  option-label="name"
                  outlined
                  dense
                  @update:model-value="handleAddMemberOnly(student)"
                />
              </div>
            </div>
          </div>
          <div v-else>
            <span>Todos estudantes alocados</span>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="row justify-end q-gutter-sm">
      <q-btn
        label="Voltar"
        color="negative"
        icon="close"
        @click="router.back()"
        class="q-mr-sm"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useGroupStores } from "../store";
import { useStudentStores } from "src/pages/student/store";
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";

/* setup stores */
const router = useRouter();

/* setup stores */
const groupStores = useGroupStores();
const studentStores = useStudentStores();
const { notifyError, notifySuccess } = useNotify();

/* setup data */
const students = ref([]);
const groups = ref([]);
const groupSelected = ref();

const allocatedStudentIds = computed(() =>
  groups.value.flatMap((group) => group.students.map((student) => student.id))
);

const availableStudents = computed(() =>
  students.value.filter(
    (student) => !allocatedStudentIds.value.includes(student.id)
  )
);

// Função para distribuir os estudantes aleatoriamente pelos grupos
const distributeStudents = async () => {
  // Copiar a lista de estudantes para não modificar o original
  const shuffledStudents = [...availableStudents.value];

  // Embaralhar a lista de estudantes
  for (let i = shuffledStudents.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledStudents[i], shuffledStudents[j]] = [
      shuffledStudents[j],
      shuffledStudents[i],
    ];
  }

  // Limpar os estudantes anteriores dos grupos
  groups.value.forEach((group) => (group.students = []));

  // Distribuir os estudantes nos grupos de forma aleatória
  shuffledStudents.forEach((student, index) => {
    const groupIndex = index % groups.value.length; // Distribui de forma cíclica
    groups.value[groupIndex].students.push(student);
  });

  // Salvar a distribuição no banco de dados
  try {
    await saveGroupsToDatabase();
    notifySuccess("Distribuição salva com sucesso!");
  } catch (error) {
    notifyError("Erro ao salvar a distribuição!");
  }
};

// Função fictícia para salvar os grupos no banco de dados
const saveGroupsToDatabase = async () => {
  const payload = groups.value.flatMap((group) =>
    group.students
      .filter((student) => group.id && student.id) // Garante que ambos existam
      .map((student) => ({
        groupId: group.id,
        studentId: student.id,
      }))
  );

  // Envia apenas se houver dados válidos
  if (payload.length > 0) {
    await Promise.all(
      payload.map((data) =>
        groupStores.addMembers({
          groupId: data.groupId,
          studentId: data.studentId,
        })
      )
    );
  } else {
    notifyError("Nenhum dado válido para salvar");
  }
};

const handleAddMemberOnly = async (student) => {
  try {
    groupStores.addMembers({
      groupId: groupSelected.value.id,
      studentId: student.id,
    });
    const group = groups.value.find((g) => g.id === groupSelected.value?.id);
    if (group) {
      group.students.push(student);
    }
  } catch (error) {
    console.log(error);
  }
};

const handleRemoveMember = async (group, student) => {
  try {
    await groupStores.removeMembers(group.id, student.id);
    await fetchGroups();
  } catch (error) {
    console.log(error);
  }
};

/* fetch data */
const fetchGroups = async () => {
  try {
    await groupStores.list();
    groups.value = groupStores.groups.map((group) => {
      return {
        id: group.id,
        name: group.name,
        students: group.members.map((group) => {
          return {
            id: group.student.id,
            name: group.student.basicInformation?.fullName,
          };
        }),
      };
    });
  } catch (error) {
    notifyError("Erro ao carregar grupos!");
  }
};

const fetchStudents = async () => {
  try {
    await studentStores.list();
    students.value = studentStores.students.map((student) => {
      return {
        id: student.id,
        name: student.basicInformation?.fullName || "NA",
      };
    });
  } catch (error) {
    console.log(error);
    notifyError("Erro ao carregar estudantes!");
  }
};

onMounted(async () => {
  await fetchGroups();
  await fetchStudents();
});
</script>

<style scoped>
.q-card {
  margin-bottom: 10px;
}

.q-btn {
  margin-top: 10px;
}
</style>

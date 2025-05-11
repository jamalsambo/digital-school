<template>
  <q-page padding>
    <div class="q-gutter-lg">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6">Alocar Tarefa a Grupo ou Estudante</div>
          <div class="text-subtitle2 text-grey">
            Você pode atribuir a tarefa a um grupo ou a um estudante individual.
            Se um grupo for atribuído, seus estudantes não poderão ser alocados
            individualmente e vice-versa.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <!-- Selecionar grupo -->
          <div class="text-subtitle1 q-mt-md">Todos os grupos</div>
          <q-select
            label="Selecionar Grupo"
            v-model="selectedGroup"
            :options="availableGroups"
            option-label="name"
            option-value="id"
            @update:model-value="assignGroup"
            emit-value
            map-options
            clearable
            outlined
            dense
          />

          <!-- Lista visual informativa de todos os grupos -->
          <div class="text-subtitle1 q-mt-md">Todos os estudantes</div>

          <!-- Selecionar estudante -->
          <q-select
            label="Selecionar Estudante"
            v-model="selectedStudent"
            :options="availableStudents"
            option-label="name"
            option-value="id"
            @update:model-value="assignStudent"
            emit-value
            map-options
            clearable
            outlined
            dense
          />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle2">Grupos Atribuídos</div>
                  <q-list bordered class="q-mt-md rounded-borders">
                    <q-item v-for="group in assignedGroups" :key="group.id">
                      <q-item-section>
                        {{ group.name }}
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          dense
                          round
                          icon="delete"
                          color="negative"
                          @click="removeGroup(group.id)"
                        >
                          <q-tooltip>Remover grupo</q-tooltip>
                        </q-btn>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle2">Estudantes Atribuídos</div>
                  <q-list bordered class="q-mt-md rounded-borders">
                    <q-item
                      v-for="student in assignedStudents"
                      :key="student.id"
                    >
                      <q-item-section>
                        {{ student.name }}
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          flat
                          dense
                          round
                          icon="delete"
                          color="negative"
                          @click="removeStudent(student.id)"
                        >
                          <q-tooltip>Remover estudante</q-tooltip>
                        </q-btn>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
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
import { useRoute, useRouter } from "vue-router";
import { useTaskStores } from "../store";
import { useGroupStores } from "src/pages/academic/group/store";
import { useStudentStores } from "src/pages/student/store";
import useNotify from "src/composables/UseNotify";

/* setup route */
const route = useRoute();
const router = useRouter()

/* use store */
const taskStores = useTaskStores();
const groupStores = useGroupStores();
const studentStores = useStudentStores();
const { notifyError } = useNotify();

/* setup data */
const { id } = route.params;
const task = ref();
const allGroups = ref([]);

const allStudents = ref([]);

const assignedGroups = ref([]);
const assignedStudents = ref([]);

const selectedGroup = ref(null);

const selectedStudent = ref(null);

const availableStudents = computed(() => {
  const blockedIds = assignedStudents.value.map((s) => s.id);
  const groupStudentIds = assignedGroups.value.flatMap((g) => g.students);
  const excludedIds = new Set([...blockedIds, ...groupStudentIds]);

  return allStudents.value.filter((s) => !excludedIds.has(s.id));
});

const availableGroups = computed(() => {
  const assignedGroupIds = assignedGroups.value.map((g) => g.id);

  const studentIdsAssignedIndividually = assignedStudents.value.map(
    (s) => s.id
  );

  return allGroups.value.filter((group) => {
    // Não exibir se o grupo já foi atribuído
    if (assignedGroupIds.includes(group.id)) return false;

    // Não exibir se qualquer estudante do grupo já foi atribuído individualmente
    return group.students.every(
      (sId) => !studentIdsAssignedIndividually.includes(sId)
    );
  });
});

const assignGroup = async (groupId) => {
  try {
    const group = allGroups.value.find((g) => g.id === groupId);
    if (!group) return;
    assignedGroups.value.push(group);
    selectedGroup.value = null;
    await taskStores.addToGroup({ groupId: groupId, taskId: id });
  } catch (error) {
    console.log(error);
  }
};

const removeGroup = async (groupId) => {
  try {
    await taskStores.removeGroupTask({ groupId: groupId, taskId: id });
    assignedGroups.value = assignedGroups.value.filter((g) => g.id !== groupId);
  } catch (error) {
    console.log(error);
  }
};

const assignStudent = async (studentId) => {
  try {
    const student = allStudents.value.find((s) => s.id === studentId);
  if (!student) return;
  assignedStudents.value.push(student);
  selectedStudent.value = null;
  await taskStores.AddToStudent({ studentId: studentId, taskId: id });
  } catch (error) {
    console.log(error)
  }
};

const removeStudent = (studentId) => {
  assignedStudents.value = assignedStudents.value.filter(
    (s) => s.id !== studentId
  );
};

/* fetch data */
const fetchTask = async () => {
  try {
    await taskStores.findOne(id);
    task.value = taskStores.task;
  } catch (error) {
    notifyError("Ocorreu um errou ao carregar a tarefa");
  }
};

const fetchGroups = async () => {
  try {
    await groupStores.list({ classe: task.value.classId });
    allGroups.value = groupStores.groups.map((group) => {
      return {
        id: group.id,
        name: group.name,
        students: group.members.map((student) => student.student.id),
      };
    });
    task.value.groups.forEach((group) => assignGroup(group.id));
  } catch (error) {
    notifyError("Ocorreu um erro ao carregar os grupos");
  }
};

const fetchStudent = async () => {
  try {
    await studentStores.list({ classId: task.value.classId });
    allStudents.value = studentStores.students.map((student) => ({
      id: student.id,
      name: student.basicInformation?.fullName,
    }));
    task.value.students.forEach((student) => assignStudent(student.studentId));
  } catch (error) {
    notifyError("Ocorreu um erro ao carregar os estudantes");
  }
};

onMounted(async () => {
  await fetchTask();
  await fetchGroups();
  await fetchStudent();
});
</script>

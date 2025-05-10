<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <q-checkbox
          v-model="selectAll"
          label="Selecionar Todos"
          @update:model-value="toggleAll"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-item-section>
          <q-checkbox
          v-for="(item, index) in items"
          :key="index"
          :val="item.id"
          :label="item.name ?? item.basic_information?.fullName"
          :model-value="isSelected(item.id)"
          @update:model-value="(value) => toggleItem(value, item.id)"
        />
        </q-item-section>

      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useTaskStores } from "../store";
import { useGroupStores } from "src/pages/academic/group/store";
import { useStudentStores } from "src/pages/student/store";
import useNotify from "src/composables/UseNotify";

/* use store */
const route = useRoute();
const taskStores = useTaskStores();
const groupStores = useGroupStores();
const studentStores = useStudentStores();
const { notifyError, notifySuccess, notifyInfo } = useNotify();

/* data */
const { id, entity } = route.params;
const task = ref();
const items = ref([]);
const selectedItems = ref([]);
const selectAll = ref(false);
const isSelected = (value) => {
  const tes = selectedItems.value.find((c) => c.id === value);
  return !!tes
}

/* Methods */

const toggleAll = (checked) => {
  try {
    if (checked) {
      selectedItems.value = items.value.map((item) => {return {id: item.id} });
      addToGroup();
    } else {
      removeGroupTask();
      selectedItems.value = [];
    }
  } catch (error) {
    notifyError("Ocorreu um erro ao adicionar a tarefa");
  }
};

const toggleItem = async (checked, value) => {
  try {
    if (checked) {
      selectedItems.value.push({id:value});
      addToGroup();
    } else {
      selectedItems.value = selectedItems.value.filter(
        (item) =>  item.id !== value
      );

      if (entity==="groups") {
        await taskStores.removeGroupTask({ groupId: value, taskId: id });
      } else {
        await taskStores.removeStudentTask({ studentId: value, taskId: id });
      }
      notifyInfo("Tarefas removida com sucesso");
    }
  } catch (error) {
    notifyError("Ocorreu um erro ao adicionar a tarefa");
  }
};

const addToGroup = async () => {
  try {
    const promises = selectedItems.value.map(async (item) => {
      if (entity==="groups") {
        await taskStores.addToGroup({ groupId: item.id, taskId: id });
      } else  {
        await taskStores.AddToStudent({ studentId: item.id, taskId: id });
      }
    });

    // Executa todas as requisições ao mesmo tempo
    await Promise.all(promises);
    notifySuccess("Tarefas adicionadas com sucesso");
  } catch (error) {
    notifyError("Ocorreu um erro ao adicionar a tarefa");
  }
};

const removeGroupTask = async () => {
  try {
    const promises = selectedItems.value.map(async (item) => {
      if (entity==="groups") {
        await taskStores.removeGroupTask({ groupId: item.id, taskId: id });
      } else {
        await taskStores.removeStudentTask({ studentId: item.id, taskId: id });
      }
    });

    // Executa todas as requisições ao mesmo tempo
    await Promise.all(promises);
    notifyInfo("Tarefas removida com sucesso");
  } catch (error) {
    notifyError("Ocorreu um erro ao adicionar a tarefa aos grupos");
  }
};


watch(selectedItems, (newVal) => {
  selectAll.value = newVal.length === items.value.length;
});

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
    await groupStores.list({ classe: id });
    items.value = groupStores.groups;

  } catch (error) {
    notifyError("Ocorreu um erro ao carregar os grupos");
  }
};

const fetchStudent = async () => {
  try {
    await studentStores.list({ classId: task.value.classId });
    items.value = studentStores.students;
  } catch (error) {
    notifyError("Ocorreu um erro ao carregar os estudantes");
  }
};

onMounted(async () => {
  await fetchTask();

  if (entity==="groups") {
    await fetchGroups();
    selectedItems.value = taskStores?.task?.groups
  } else if (entity==="students") {
    await fetchStudent();
    selectedItems.value = taskStores?.task?.students.map((student) => {
      return  {id:student.studentId};
    })
  }
});
</script>

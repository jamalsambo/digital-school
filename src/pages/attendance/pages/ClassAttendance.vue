<template>
  <q-page padding>
    <Tables :columns="columns" :rows="classAttendances">
      <template #new>
        <q-btn
          color="primary"
          icon="add"
          label="Marcar Presencas"
          no-caps
          class="q-ml-sm"
          @click="newAttendance"
        />
      </template>
      <template #actions="{props}">
        <q-btn
          color="negative"
          icon="edit"
          no-caps
          flat
           @click="editAttendance(props)"
          />
      </template>
    </Tables>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAttendanceStores } from "../store";
import Tables from "src/components/Tables.vue";
import columns from "../components/columns/ClassAttendanceColumns";

/* use stores */
const route = useRoute();
const router = useRouter();
const attendanceStores = useAttendanceStores();

/* data */
const { classe, discipline } = route.params;
const classAttendances = ref([]);
const classAttendance = ref();

/* methods */
const newAttendance = async () => {
  try {
    await attendanceStores.createClassAttendance({
      classId: classe,
      disciplineId: discipline,
      classDate: new Date()
    });
    classAttendance.value = attendanceStores.classAttendance;
    router.push({
      name: "create-attendance",
      params: {
        attendance: classAttendance.value.id,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const editAttendance = (row) => {
  console.log(row);
  router.push({
      name: "create-attendance",
      params: {
        attendance: row.key,
      },
    })
}

const fetchClassAttendances = async () => {
  try {
    await attendanceStores.fetchClassAttendances();
    classAttendances.value = attendanceStores.classAttendances;
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchClassAttendances();
});
</script>

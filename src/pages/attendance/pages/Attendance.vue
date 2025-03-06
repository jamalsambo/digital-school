<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-separator />
      <q-card-section>
        <q-item-section>
          <q-list bordered>
            <q-item v-for="student in students" :key="student.id" clickable>
              <q-item-section>
                <span>{{ student.fullName }}</span>
              </q-item-section>

              <q-item-section side>
                <q-option-group
                  v-model="student.status"
                  :options="statusOptions"
                  type="radio"
                  @update:model-value="(value) => toggleItem(value, student)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-item-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { useStudentStores } from "src/pages/student/store";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAttendanceStores } from "../store";
import useNotify from "src/composables/UseNotify";

/* use store */
const route = useRoute();
const studentStores = useStudentStores();
const attendanceStores = useAttendanceStores();
const { notifyError } = useNotify();

/* data */
const { classe, attendance } = route.params;
const students = ref([]);
const attendanceOne = ref(null);
const attendences = ref([]);
const statusOptions = ref([
  { label: "Presente", value: "Presente" },
  { label: "Ausente", value: "Ausente" },
  { label: "Atrasado", value: "Atrasado" },
  { label: "Justificado", value: "Justificado" },
]);

/* Methods */
const fetchStudent = async () => {
  try {
    await studentStores.list({ classId: classe });
    students.value = studentStores.students.map((student) => {
      const isActive =  attendences.value.find((att) => att.studentId === student.id);
      return {
        id: student.id,
        fullName: student.basic_information?.fullName,
        status: isActive? isActive.status : "",
      };
    });
  } catch (error) {
    notifyError("Ocorreu um erro ao carregar os estudantes");
  }
};

const toggleItem = async (value, item) => {
  const payload = {
    studentId: item.id,
    classAttendanceId: attendance,
    status: value,
  };
  try {
    await attendanceStores.findOneAttendance({
      studentId: item.id,
      classAttendanceId: attendance,
    });
    attendanceOne.value = attendanceStores.attendance;

    if (attendanceOne.value) {
      await attendanceStores.update(attendanceOne.value.id, payload);
    } else {
      await attendanceStores.create(payload);
    }
  } catch (error) {
    notifyError("Ocorreu um erro ao salvar a presença");
  }
};

const fetchClassAttendance = async () => {
  try {
    await attendanceStores.fetchClassAttendance(attendance);
    attendences.value = attendanceStores.classAttendance.attendances;
  } catch (error) {
    console.log("Ocorreu um erroor", error);
  }
};

onMounted(async () => {
  await fetchClassAttendance();
  await fetchStudent();

});
</script>

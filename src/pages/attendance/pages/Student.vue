<template>
  <q-page padding>
    <q-list bordered class="rounded-borders q-pa-md">
      <q-item>
        <q-item-section>
          <!-- Cabeçalho da Disciplina -->
          <div
            class="text-bold text-uppercase bg-primary text-white q-pa-sm rounded-borders"
          >
            Presencas
          </div>

          <q-list padding bordered class="rounded-borders">
            <q-expansion-item
              v-for="(attendance, index) in attendances"
              :key="index"
              dense
              expand-separator
              icon="note"
              :label="attendance.months"
            >
              <q-list bordered class="rounded-borders q-pa-md">
                <q-item v-for="att in attendance.attendances" :key="att.id">
                  <q-item-section class="q-py-sm">
                    <div class="q-gutter-sm">
                      <div class="row items-center q-col-gutter-sm">
                        <!-- Data da Aula -->
                        <div class="col-12 col-sm-4">
                          <div class="text-caption text-grey-7">
                            {{ att.attendance.classAttendance.classDate }}
                          </div>
                        </div>

                        <!-- Nome da Disciplina -->
                        <div class="col-12 col-sm-5">
                          <div class="text-caption text-weight-medium">
                            {{
                              att.attendance.classAttendance.discipline.activity
                                ?.name
                            }}
                          </div>
                        </div>

                        <!-- Status -->
                        <div class="col-12 col-sm-3">
                          <div class="text-caption text-positive">
                            {{ att.attendance.status }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn
                      color="primary"
                      icon="visibility"
                      @click="onClick(att.attendance.id)"
                      dense
                      flat
                      round
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-list>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useStudentStores } from "src/pages/student/store";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import scripts from "src/composables/Scripts";

/* setup store */
const route = useRoute();
const router = useRouter();
const studentStores = useStudentStores();
const { filterEnrollmentsByYear } = scripts();

/* setup data */
const { id } = route.params;
const studentId = ref(route.params.id || id);
const student = ref();
const enrollment = ref();
const attendances = ref([]);

/* methods */
const onClick = (attendanceId) => {
  router.push({
    name: "justication-attendance",
    params: { id: id, attendanceId: attendanceId },
  });
};

/* fetch data */
const fetchStudent = async () => {
  try {
    await studentStores.findOne(studentId.value);
    student.value = studentStores.student;
    enrollment.value = filterEnrollmentsByYear(
      student.value.enrollments,
      new Date().getFullYear()
    );
    attendances.value = groupAttendancesMonth(student.value.attendances);
  } catch (error) {
    console.log(error);
    notifyError("Erro ao carregar a estudnte");
  }
};

const groupAttendancesMonth = (data) => {
  const grouped = {};
  data.forEach((attendance) => {
    const currentDate = new Date(attendance.classAttendance.classDate);
    const month = currentDate.toLocaleString("pt-BR", { month: "long" });

    if (!grouped[month]) {
      grouped[month] = {
        months: month,
        attendances: [],
      };
    }
    grouped[month].attendances.push({
      attendance: attendance,
    });
  });
  return Object.values(grouped);
};

onBeforeRouteUpdate((to) => {
  studentId.value = to.params.id || id;
  fetchStudent();
});

onMounted(async () => {
  await fetchStudent();
});
</script>

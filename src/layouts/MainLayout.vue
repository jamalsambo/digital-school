<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title> Quasar App </q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            round
            dense
            flat
            color="white"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()"
            v-if="$q.screen.gt.sm"
          >
          </q-btn>
          <q-btn
            round
            dense
            flat
            color="white"
            icon="fab fa-github"
            type="a"
            href="https://github.com/pratik227/quasar-admin"
            target="_blank"
          >
          </q-btn>
          <q-btn
            round
            dense
            flat
            style="color: red !important"
            type="a"
            href="https://github.com/sponsors/pratik227"
            target="_blank"
          >
            <i class="fa fa-heart fa-2x fa-beat"></i>
          </q-btn>
          <q-btn round dense flat color="white" icon="notifications">
            <q-badge color="red" text-color="white" floating> 5 </q-badge>
            <q-menu>
              <q-list style="min-width: 100px">
                <messages></messages>
                <q-card class="text-center no-shadow no-border">
                  <q-btn
                    label="View All"
                    style="max-width: 120px !important"
                    flat
                    dense
                    class="text-indigo-8"
                  ></q-btn>
                </q-card>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <q-btn icon="person">
                <q-menu>
                  <div class="row no-wrap q-pa-md">
                    <div class="column">
                      <div class="text-h6 q-mb-md">Settings</div>
                      <q-toggle v-model="mobileData" label="Use Mobile Data" />
                      <q-toggle v-model="bluetooth" label="Bluetooth" />
                    </div>

                    <q-separator vertical inset class="q-mx-lg" />

                    <div class="column items-center">
                      <q-avatar size="72px">
                        <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
                      </q-avatar>

                      <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

                      <q-btn
                        color="primary"
                        label="Logout"
                        push
                        size="sm"
                        @click="handleLogout"
                      />
                    </div>
                  </div>
                </q-menu>
              </q-btn>
              <!-- <img src="https://cdn.quasar.dev/img/boy-avatar.png" /> -->
            </q-avatar>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-primary text-white"
    >
      <q-list>
        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard D-School</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Menu do funcionario -->
        <div
          v-if="user?.userDetails?.userType?.name === 'Funcionario' &&
            (user?.userDetails?.teacher?.toLowerCase() === 'nao' ||
              user.userDetails.teacher === null)
          "
        >
          <q-expansion-item icon="menu_open" label="Instituição">
            <q-item
               to="/institutions"
              class="q-ml-xl"
              active-class="q-item-no-link-highlighting"
                 :header-inset-level="0.85"
            >
              <q-item-section avatar>
                <q-icon name="history_edu" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Listar</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              to="/rooms"
              class="q-ml-xl"
              active-class="q-item-no-link-highlighting"
            >
              <q-item-section avatar>
                <q-icon name="room" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Salas</q-item-label>
              </q-item-section>
            </q-item>
            <q-expansion-item
              :header-inset-level="0.85"
              label="Horarios"
              icon="schedule"
            >
              <q-item
                to="/periods"
                style="margin-left: 55px !important"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="calendar_month" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Listar</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                to="/periods/fixe/activity"
                style="margin-left: 55px !important"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="calendar_month" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Actidades Fixas</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                to="/periods/fixes"
                style="margin-left: 55px !important"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="calendar_month" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Horarios Fixos</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-item
              to="/students"
              class="q-ml-xl"
              active-class="q-item-no-link-highlighting"
            >
              <q-item-section avatar>
                <q-icon name="diversity_3" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Estudantes</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              to="/employees"
              class="q-ml-xl"
              active-class="q-item-no-link-highlighting"
            >
              <q-item-section avatar>
                <q-icon name="groups_2" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Funcionarios</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item icon="map" label="Controle Academico">
            <q-expansion-item
              v-for="(item, index) in educationsLevels"
              :key="index"
              :header-inset-level="0.85"
              :label="item.education.name"
              :icon="getIcon(item.name)"
            >
              <q-item
                to="/academic-calendar"
                style="margin-left: 55px !important"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="calendar_month" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Calendario academico</q-item-label>
                </q-item-section>
              </q-item>
              <!-- discplinas -->
              <q-item
                :to="`/education/${item.education.id}/module${getRouteForDiscipline(
                  item.education.name
                )}`"
                style="margin-left: 55px !important"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="psychology" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{
                    getNameForDiscipline(item.education.name)
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <!-- curriculums -->
              <q-item
                :to="`/education/${item.education.id}/curriculums`"
                style="margin-left: 55px !important"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="check_box_outline_blank" />
                </q-item-section>
                <q-item-section>
                  <q-item-label> Planos curriculares </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                :to="`/education/${item.education.id}${getRoute(item.education.name)}`"
                style="margin-left: 55px !important"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="school" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ getName(item.education.name) }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                :to="`/education/${item.education.id}/enrollments`"
                style="margin-left: 55px !important"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="school" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Matriculas</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
          </q-expansion-item>

          <q-expansion-item icon="map" label="Controle Financeiro">
            <q-list class="q-pl-lg">
              <q-item
                 :to="{ name: 'invoices' }"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="map" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Facturas</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                 :to="{ name: 'receipts' }"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="map" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Recibos</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                to="/finance/expenses-categories"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="map" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Categoria das despensas</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                to="/financial-control/expenses"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="map" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Despensas</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-expansion-item icon="map" label="Extras">
            <q-list class="q-pl-lg">
              <q-item
                to="/evolution/types"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="trending_up" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Tipos de avaliaçoês</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                to="/extras-fees"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="bubble_chart" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Pagamentos extras</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                to="/notifications"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="notifications" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Notificações</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </div>

        <!-- Menu do funcionario professor -->
        <div
          v-if="user?.userDetails?.userType?.name === 'Funcionario' &&
            user.userDetails.teacher?.toLowerCase() === 'sim'
          "
        >
          <q-item
            :to="`/employee/${user.userDetails.id}/teachings`"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Turmas</q-item-label>
            </q-item-section>
          </q-item>
          <q-item to="/tasks" active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Tarefas</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <!-- Menu do estudante -->
        <div v-if="user?.userDetails?.userType?.name === 'Estudante'">
          <q-item
            :to="`/student/${user.userDetails.id}/evolutions/normal`"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="emoji_symbols" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Notas</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            :to="`/student/${user.userDetails.id}/enrollments`"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Matriculas</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            :to="`/student/${user.userDetails.id}/payments/${'view'}`"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="money" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Pagamentos</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            :to="`/student/${user.userDetails.id}/attendances`"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="crisis_alert" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Presenças</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <!-- Menu do encarregado -->
        <div v-if="user?.userDetails?.userType?.name === 'Encarregado'">
          <q-list>
            <q-expansion-item
              v-for="student in students"
              :key="student.id"
              icon="map"
              :label="student?.basicInformation?.fullName"
            >
              <q-list class="q-pl-lg">
                <q-item
                  :to="`/student/${student.id}/evolutions/normal`"
                  active-class="q-item-no-link-highlighting"
                >
                  <q-item-section avatar>
                    <q-icon name="emoji_symbols" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Notas</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  :to="`/student/${student.id}/enrollments`"
                  active-class="q-item-no-link-highlighting"
                >
                  <q-item-section avatar>
                    <q-icon name="school" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Matriculas</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  :to="`/student/${student.id}/payments/${'view'}`"
                  active-class="q-item-no-link-highlighting"
                >
                  <q-item-section avatar>
                    <q-icon name="money" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Pagamentos</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  :to="`/student/${student.id}/attendances`"
                  active-class="q-item-no-link-highlighting"
                >
                  <q-item-section avatar>
                    <q-icon name="crisis_alert" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Presenças</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-list>
        </div>

        <!-- <div v-else>
          <q-expansion-item icon="menu_open" label="Instituição">
            <q-item
              to="/institutions"
              class="q-ml-xl"
              active-class="q-item-no-link-highlighting"
            >
              <q-item-section avatar>
                <q-icon name="history_edu" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Listar</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              to="/employees"
              class="q-ml-xl"
              active-class="q-item-no-link-highlighting"
            >
              <q-item-section avatar>
                <q-icon name="groups_2" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Funcionarios</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </div> -->
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import Messages from "./Messages.vue";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/pages/auth/store";
import { useStudentStores } from "src/pages/student/store";
import useNotify from "src/composables/UseNotify";

const router = useRouter();
const authStore = useAuthStore();
const studentStores = useStudentStores();
const { notifyError, notifyInfo } = useNotify();

const leftDrawerOpen = ref(false);
const $q = useQuasar();

const user = computed(() => authStore.user);
const students = computed(() => studentStores.students);
const educationsLevels = computed(
  () => authStore.user?.userDetails?.institution?.institutionLevels
);

const getIcon = (name) => {
  switch (name) {
    case "Ensino Infantil":
      return "child_care";
    case "Ensino Fundamental":
      return "school";
    case "Ensino Médio":
      return "menu_book";
    default:
      return "help_outline";
  }
};

const getName = (name) => {
  switch (name) {
    case "Ensino Infantil":
      return "Estágios";
    case "Ensino Fundamental":
      return "Classes";
    case "Ensino Médio":
      return "Classes";
    case "Ensino Técnico":
      return "Cursos";
    default:
      return "help_outline";
  }
};

const getNameForDiscipline = (name) => {
  switch (name) {
    case "Ensino Infantil":
      return "Actividades";
    case "Ensino Fundamental":
      return "Disciplines";
    case "Ensino Médio":
      return "Disciplines";
    case "Ensino Técnico":
      return "Disciplines";
    default:
      return "Disciplines";
  }
};

const getRoute = (name) => {
  switch (name) {
    case "Ensino Infantil":
      return "/internships";
    case "Ensino Fundamental":
      return "/classes";
    case "Ensino Médio":
      return "/classes";
    case "Ensino Técnico":
      return "/courses";
    default:
      return "help_outline";
  }
};

const getRouteForDiscipline = (name) => {
  switch (name) {
    case "Ensino Infantil":
      return "/activities";
    case "Ensino Fundamental":
      return "/disciplines";
    case "Ensino Médio":
      return "/disciplines";
    case "Ensino Técnico":
      return "/disciplines";
    default:
      return "disciplines";
  }
};

const handleLogout = () => {
  try {
    authStore.signOut();
    notifyInfo("Logout efetuado com sucesso!");
    router.push("/login");
  } catch (error) {
    notifyError("Erro ao efectuar logout");
  }
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

onMounted(() => {
  if (user.value && user.value.userDetails?.userType?.name === "Encarregado") {
    try {
      studentStores.list({
        telephone: user.value.username,
        owner: "Encarregado",
        telephoneType: "Principal",
      });
    } catch (error) {
      notifyError("Erro ao carregar estudantes");
    }
  }
});
</script>

<style>
/* FONT AWESOME GENERIC BEAT */
.fa-beat {
  animation: fa-beat 5s ease infinite;
}

@keyframes fa-beat {
  0% {
    transform: scale(1);
  }
  5% {
    transform: scale(1.25);
  }
  20% {
    transform: scale(1);
  }
  30% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.25);
  }
  50% {
    transform: scale(1);
  }
  55% {
    transform: scale(1.25);
  }
  70% {
    transform: scale(1);
  }
}
</style>

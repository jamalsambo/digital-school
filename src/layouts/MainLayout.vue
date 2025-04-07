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
        <q-toolbar-title> E-Digital </q-toolbar-title>
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
            <q-item-label>Dashboard E-Digital</q-item-label>
          </q-item-section>
        </q-item>
        <!-- Menu Super usuario -->
        <div v-if="user?.userType === 'Super'">
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
          <q-item to="/plans" active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Planos</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <!-- Menu do funcionario -->
        <div v-if="user?.userType === 'Funcionario'">
          <q-expansion-item
            icon="menu_open"
            label="Instituição"
            v-if="
              userStores.hasViewInstitution ||
              userStores.hasViewRooms ||
              userStores.hasViewHoraryInstitution
            "
          >
            <q-item
              to="/institutions"
              class="q-ml-xl"
              active-class="q-item-no-link-highlighting"
              :header-inset-level="0.85"
              v-if="userStores.hasViewInstitution"
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
              v-if="userStores.hasViewRooms"
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
              v-if="userStores.hasViewHoraryInstitution"
            >
              <q-item
                to="/periods"
                style="margin-left: 55px !important"
                active-class="q-item-no-link-highlighting"
                v-if="userStores.hasViewHoraryInstitution"
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
          </q-expansion-item>

          <q-expansion-item
            icon="diversity_3"
            label="Estudantes"
            v-if="hasViewStudents"
          >
            <q-list class="q-pl-lg">
              <q-item
                to="/students"
                active-class="q-item-no-link-highlighting"
                v-if="hasViewStudents"
              >
                <q-item-section avatar>
                  <q-icon name="list" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Listar</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-expansion-item
            icon="groups_2"
            label="Funcionarios"
            v-if="userStores.hasViewEmployees"
          >
            <q-list class="q-pl-lg">
              <q-item
                to="/employees"
                active-class="q-item-no-link-highlighting"
                v-if="userStores.hasViewEmployees"
              >
                <q-item-section avatar>
                  <q-icon name="list" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Listar</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-expansion-item
            icon="map"
            label="Controle Academico"
            v-if="
              userStores.hasViewCalendar ||
              userStores.hasViewEvolutionTypes ||
              userStores.hasCreateDisciplines ||
              userStores.hasCreateCurriculum
            "
          >
            <q-item
              to="/academic-calendar"
              style="margin-left: 55px !important"
              active-class="q-item-no-link-highlighting"
              v-if="userStores.hasViewCalendar"
            >
              <q-item-section avatar>
                <q-icon name="calendar_month" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Calendario academico</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              to="/evolution/types"
              style="margin-left: 55px !important"
              active-class="q-item-no-link-highlighting"
              v-if="userStores.hasViewEvolutionTypes"
            >
              <q-item-section avatar>
                <q-icon name="trending_up" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Tipos de avaliaçoês</q-item-label>
              </q-item-section>
            </q-item>
            <!-- discplinas -->
            <q-item
              :to="`/education/${
                educationLevel?.id
              }/module${getRouteForDiscipline(educationLevel?.name)}`"
              style="margin-left: 55px !important"
              active-class="q-item-no-link-highlighting"
              v-if="userStores.hasCreateDisciplines"
            >
              <q-item-section avatar>
                <q-icon name="psychology" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{
                  getNameForDiscipline(educationLevel?.name)
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <!-- curriculums -->
            <q-item
              :to="`/education/${educationLevel?.id}/curriculums`"
              style="margin-left: 55px !important"
              active-class="q-item-no-link-highlighting"
              v-if="userStores.hasCreateCurriculum"
            >
              <q-item-section avatar>
                <q-icon name="check_box_outline_blank" />
              </q-item-section>
              <q-item-section>
                <q-item-label> Planos curriculares </q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              :to="`/education/${educationLevel?.id}${getRoute(
                educationLevel?.name
              )}`"
              style="margin-left: 55px !important"
              active-class="q-item-no-link-highlighting"
              v-if="userStores.hasCreateClasse"
            >
              <q-item-section avatar>
                <q-icon name="school" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ getName(educationLevel?.name) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              :to="`/education/${educationLevel?.id}/enrollments`"
              style="margin-left: 55px !important"
              active-class="q-item-no-link-highlighting"
              v-if="userStores?.hasViewEnrollment"
            >
              <q-item-section avatar>
                <q-icon name="school" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Matriculas</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              :to="`/education/${educationLevel?.id}/bulletins`"
              style="margin-left: 55px !important"
              active-class="q-item-no-link-highlighting"
              v-if="userStores?.hasViewBulletins"
            >
              <q-item-section avatar>
                <q-icon name="school" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Boletins</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-expansion-item
            icon="map"
            label="Controle Financeiro"
            v-if="
              userStores.hasViewInvoices ||
              userStores.hasViewReceipts ||
              userStores.hasViewPaymentsExtras ||
              userStores.hasViewPaymentsExtras
            "
          >
            <q-list class="q-pl-lg">
              <q-item
                :to="`/finance/institution/${user.institutionId}/invoices/`"
                active-class="q-item-no-link-highlighting"
                v-if="userStores.hasViewInvoices"
              >
                <q-item-section avatar>
                  <q-icon name="map" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Facturas</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                :to="`/finance/institution/${user.institutionId}/receipts/`"
                active-class="q-item-no-link-highlighting"
                v-if="userStores.hasViewReceipts"
              >
                <q-item-section avatar>
                  <q-icon name="map" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Recibos</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                :to="`/finance/institution/${user.institutionId}/payment-types/`"
                active-class="q-item-no-link-highlighting"
                v-if="userStores.hasViewPaymentsTypes"
              >
                <q-item-section avatar>
                  <q-icon name="bubble_chart" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Tipos de pagamento</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                to="/extras-fees"
                active-class="q-item-no-link-highlighting"
                v-if="userStores.hasViewPaymentsExtras"
              >
                <q-item-section avatar>
                  <q-icon name="bubble_chart" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Pagamentos extras</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                to="/finance/expenses-categories"
                active-class="q-item-no-link-highlighting"
                v-if="userStores.hasViewExpensesCategories"
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
                v-if="userStores.hasViewExpenses"
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

          <q-expansion-item icon="inventory_2" label="Controle estoque">
            <q-list class="q-pl-lg">
              <q-item
                :to="`/stock/move`"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="compare_arrows" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Movimentos</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                :to="`/stock/move/in`"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="arrow_downward" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Entrada</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                :to="`/stock/move/out/`"
                active-class="q-item-no-link-highlighting"
                v-if="userStores.hasViewPaymentsTypes"
              >
                <q-item-section avatar>
                  <q-icon name="arrow_upward" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Saida</q-item-label>
                </q-item-section>
              </q-item>

              <q-expansion-item label="Produtos" icon="conveyor_belt">
                <q-item
                  to="/stock/products"
                  style="margin-left: 55px !important"
                  active-class="q-item-no-link-highlighting"
                >
                  <q-item-section avatar>
                    <q-icon name="list" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Listar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  to="/stock/products/categories"
                  style="margin-left: 55px !important"
                  active-class="q-item-no-link-highlighting"
                >
                  <q-item-section avatar>
                    <q-icon name="category" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Categorias</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  to="/stock/products/suppliers"
                  style="margin-left: 55px !important"
                  active-class="q-item-no-link-highlighting"
                >
                  <q-item-section avatar>
                    <q-icon name="local_shipping" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Fornecedores</q-item-label>
                  </q-item-section>
                </q-item>
              </q-expansion-item>
            </q-list>
          </q-expansion-item>

          <q-expansion-item
            icon="notifications"
            label="Notificações"
            v-if="
              userStores.hasViewNotifications ||
              userStores.hasCreateNotifications ||
              userStores.hasEditNotifications
            "
          >
            <q-list class="q-pl-lg">
              <q-item
                to="/notifications"
                active-class="q-item-no-link-highlighting"
              >
                <q-item-section avatar>
                  <q-icon name="notifications" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Listar</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-item
            :to="`/employee/${userStores?.user?.employee?.id}/teachings`"
            active-class="q-item-no-link-highlighting"
            v-if="user?.teacher === 'Sim'"
          >
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Turmas</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div v-if="user?.userType === 'Estudante'">
          <q-item
            :to="`/student/${userStores?.user?.student?.id}/evolutions/normal`"
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
            :to="`/student/${userStores?.user?.student?.id}/enrollments`"
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
            :to="`/student/${userStores?.user?.student?.id}/payments/${'view'}`"
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
            :to="`/student/${userStores?.user?.student?.id}/attendances`"
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
        <div v-if="user?.userType === 'Encarregado'">
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
import { useUserStores } from "src/pages/user/store";
import { useInstitutionStores } from "src/pages/institution/store";
import useNotify from "src/composables/UseNotify";

/* setup router */
const router = useRouter();

/* setup router */
const authStore = useAuthStore();
const studentStores = useStudentStores();
const institutionStores = useInstitutionStores();
const userStores = useUserStores();
const { notifyError, notifyInfo } = useNotify();

/* setup data */
const leftDrawerOpen = ref(false);
const $q = useQuasar();
const user = computed(() => authStore.user);
const students = computed(() => studentStores.students);
const educationLevel = ref();

const hasViewStudents = ref();
const hasViewEmployees = ref();

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

/* fetch data */
const fetchInstitution = async () => {
  try {
    await institutionStores.findOne(user.value.institutionId);
    educationLevel.value = institutionStores.institution.educationLevel;
  } catch (error) {
    notifyError("Erro ao carregar instituicao");
  }
};
const fetchUser = async () => {
  try {
    await userStores.findOne(user.value.sub);
    hasViewStudents.value = userStores.hasViewStudents;
    hasViewEmployees.value = userStores.hasViewEmployees;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await fetchUser();
  await fetchInstitution();
  if (user.value && user.value.userType === "Encarregado") {
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

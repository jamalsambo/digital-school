<template>
  <q-page class="edigital-page">

    <!-- Top Bar -->
    <div class="page-topbar row items-center q-px-xl q-py-md">
      <q-btn
        flat round dense
        icon="arrow_back_ios_new"
        class="back-btn q-mr-md"
        @click="$router.back()"
      />

      <div class="col">
        <q-breadcrumbs class="breadcrumb-nav" active-color="primary" separator="›">
          <q-breadcrumbs-el label="Dashboard" icon="home" to="/" class="breadcrumb-link" />
          <q-breadcrumbs-el label="Notificações" class="breadcrumb-active" />
        </q-breadcrumbs>

        <div class="page-title row items-center q-mt-xs">
          <div class="title-icon-wrap q-mr-sm">
            <q-icon name="notifications" size="1.3rem" color="white" />
          </div>
          <span>Notificações</span>
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <!-- Search -->
        <q-input
          v-model="filter"
          dense outlined
          placeholder="Pesquisar notificações..."
          class="search-input"
          debounce="300"
          clearable
        >
          <template #prepend>
            <q-icon name="search" color="grey-5" size="1.1rem" />
          </template>
        </q-input>

        <!-- Refresh -->
        <q-btn
          flat round dense icon="refresh"
          class="action-icon-btn"
          :loading="loading"
          @click="fetchNotifications"
        >
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>

        <!-- Add -->
        <q-btn
          unelevated no-caps
          icon="add" label="Nova Notificação"
          class="new-btn"
          @click="addNotification"
        />
      </div>
    </div>

    <!-- Stats Row -->
    <div class="stats-row q-px-xl q-mb-lg row q-gutter-md">
      <div class="stat-card col" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="`background:${stat.color}18`">
          <q-icon :name="stat.icon" size="1.3rem" :style="`color:${stat.color}`" />
        </div>
        <div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="q-px-xl q-pb-xl">
      <q-card class="table-card" flat>
        <q-card-section class="q-pa-none">

          <!-- Toolbar -->
          <div class="table-toolbar row items-center justify-between q-px-lg q-py-md">
            <div class="row items-center q-gutter-xs">
              <span class="table-count">{{ filteredNotifications.length }}</span>
              <span class="table-count-label">notificação(ões) encontrada(s)</span>
            </div>
            <div class="row items-center q-gutter-xs">
              <q-btn
                flat round dense icon="view_list"
                :color="viewMode === 'list' ? 'primary' : 'grey-5'"
                size="sm" @click="viewMode = 'list'"
              />
              <q-btn
                flat round dense icon="grid_view"
                :color="viewMode === 'grid' ? 'primary' : 'grey-5'"
                size="sm" @click="viewMode = 'grid'"
              />
            </div>
          </div>

          <q-separator />

          <!-- Loading -->
          <div v-if="loading" class="column items-center q-pa-xl">
            <q-spinner-dots color="primary" size="2.5rem" />
            <div class="text-grey-5 q-mt-sm" style="font-size:0.85rem">A carregar notificações...</div>
          </div>

          <!-- Empty -->
          <div v-else-if="!filteredNotifications.length" class="empty-state">
            <div class="empty-icon-wrap q-mb-md">
              <q-icon name="notifications_off" size="2.5rem" color="white" />
            </div>
            <div class="empty-title">Nenhuma notificação encontrada</div>
            <div class="empty-sub">
              {{ filter ? 'Tente outro termo de pesquisa' : 'Clique em "Nova Notificação" para começar' }}
            </div>
            <q-btn
              v-if="!filter"
              unelevated no-caps icon="add"
              label="Nova Notificação"
              class="new-btn q-mt-md"
              @click="addNotification"
            />
          </div>

          <!-- LIST VIEW -->
          <q-table
            v-else-if="viewMode === 'list'"
            class="edigital-table no-shadow"
            :rows="filteredNotifications"
            :columns="NotificationColumns"
            row-key="id"
            flat
            v-model:pagination="pagination"
          >
            <template #body-cell-actions="props">
              <q-td :props="props">
                <div class="row no-wrap items-center q-gutter-xs">
                  <q-btn
                    flat round dense icon="edit"
                    class="tbl-btn tbl-btn-primary"
                    @click="editNotification(props.row)"
                  >
                    <q-tooltip>Editar</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat round dense icon="delete"
                    class="tbl-btn" color="negative"
                    @click="deleteNotification(props.row)"
                  >
                    <q-tooltip>Eliminar</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </template>
          </q-table>

          <!-- GRID VIEW -->
          <div v-else class="grid-view q-pa-lg row q-gutter-md">
            <div
              v-for="notification in filteredNotifications"
              :key="notification.id"
              class="grid-card col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div class="grid-card-header row items-center justify-between">
                <q-avatar size="48px" class="notif-avatar">
                  <q-icon name="notifications" color="white" />
                </q-avatar>
                <q-chip
                  dense
                  :class="notification.status === 'Activo' ? 'chip-activo' : 'chip-inactivo'"
                >
                  {{ notification.status ?? 'Activo' }}
                </q-chip>
              </div>

              <div class="grid-card-body q-mt-sm">
                <div class="grid-name">{{ notification.title ?? notification.name }}</div>
                <div class="grid-info row items-center q-gutter-xs q-mt-xs" v-if="notification.message">
                  <q-icon name="message" size="0.9rem" color="grey-5" />
                  <span class="ellipsis">{{ notification.message }}</span>
                </div>
              </div>

              <div class="grid-card-actions row q-gutter-xs">
                <q-btn
                  flat dense no-caps icon="edit" label="Editar"
                  class="grid-action-btn grid-action-primary"
                  @click="editNotification(notification)"
                />
                <q-btn
                  flat dense no-caps icon="delete" label="Eliminar"
                  class="grid-action-btn" color="negative"
                  @click="deleteNotification(notification)"
                />
              </div>
            </div>
          </div>

        </q-card-section>
      </q-card>
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useNotificationStores } from "../store";
import NotificationColumns from "../components/NotificationsColumns";
import useNotify from "src/composables/UseNotify";

/* ── Router / Store ── */
const router = useRouter();
const notificationStores = useNotificationStores();
const { notifyError } = useNotify();

/* ── State ── */
const notifications = ref([]);
const filter = ref("");
const viewMode = ref("list");
const loading = ref(false);
const pagination = ref({ rowsPerPage: 10 });

/* ── Computed ── */
const filteredNotifications = computed(() => {
  if (!filter.value) return notifications.value;
  const q = filter.value.toLowerCase();
  return notifications.value.filter((n) =>
    n.title?.toLowerCase().includes(q) ||
    n.name?.toLowerCase().includes(q) ||
    n.message?.toLowerCase().includes(q)
  );
});

const stats = computed(() => [
  {
    label: "Total",
    value: notifications.value.length,
    icon: "notifications",
    color: "#1a3fa6",
  },
  {
    label: "Activas",
    value: notifications.value.filter(
      (n) => n.status === "Activo" || !n.status
    ).length,
    icon: "notifications_active",
    color: "#21b573",
  },
  {
    label: "Inactivas",
    value: notifications.value.filter(
      (n) => n.status && n.status !== "Activo"
    ).length,
    icon: "notifications_off",
    color: "#f57c00",
  },
]);

/* ── Methods ── */
const addNotification = () => {
  router.push({ name: "notification-create" });
};

const editNotification = (notification) => {
  router.push({ name: "notification-edit", params: { id: notification.id } });
};

const deleteNotification = async (notification) => {
  // TODO: implementar lógica de eliminação
};

const fetchNotifications = async () => {
  loading.value = true;
  try {
    await notificationStores.list();
    notifications.value = notificationStores.notifications;
  } catch (error) {
    notifyError("Erro ao carregar notificações.");
  } finally {
    loading.value = false;
  }
};

/* ── Lifecycle ── */
onMounted(async () => {
  await fetchNotifications();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap");

.edigital-page {
  min-height: 100vh;
  background: #f0f4f8;
  font-family: "DM Sans", sans-serif;
}

/* ── Top Bar ── */
.page-topbar {
  background: #ffffff;
  border-bottom: 1px solid #e8edf3;
  position: sticky; top: 0; z-index: 10;
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.06);
}
.back-btn {
  background: #f0f4f8; color: #1a3fa6 !important;
  border-radius: 10px; width: 36px; height: 36px; transition: background 0.2s;
}
.back-btn:hover { background: #e0e8f7; }
.breadcrumb-nav { font-size: 0.78rem; }
.breadcrumb-link { color: #9ca3af !important; }
.breadcrumb-active { color: #1a3fa6 !important; font-weight: 600; }
.page-title {
  font-family: "Sora", sans-serif;
  font-size: 1.3rem; font-weight: 700; color: #0f2862;
}
.title-icon-wrap {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.search-input { width: 220px; }
.search-input :deep(.q-field__control) { border-radius: 10px; background: #f8fafc; height: 38px; }
.action-icon-btn {
  background: #f0f4f8; border-radius: 10px;
  width: 36px; height: 36px; transition: background 0.2s;
}
.action-icon-btn:hover { background: #e0e8f7; }
.new-btn {
  background: linear-gradient(135deg, #1a3fa6 0%, #0f2862 100%);
  color: white; border-radius: 10px; padding: 0 18px; height: 38px;
  font-size: 0.88rem; font-weight: 600; font-family: "Sora", sans-serif;
  transition: box-shadow 0.2s, transform 0.15s;
}
.new-btn:hover { box-shadow: 0 6px 18px rgba(26, 63, 166, 0.35); transform: translateY(-1px); }

/* ── Stats ── */
.stats-row { padding-top: 1.2rem; }
.stat-card {
  background: white; border-radius: 14px; padding: 1rem 1.2rem;
  display: flex; align-items: center; gap: 0.9rem;
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.05);
  border: 1px solid #edf0f5; transition: box-shadow 0.2s;
}
.stat-card:hover { box-shadow: 0 4px 20px rgba(15, 40, 98, 0.1); }
.stat-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-value { font-family: "Sora", sans-serif; font-size: 1.5rem; font-weight: 700; color: #0f2862; line-height: 1; }
.stat-label { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; font-weight: 500; }

/* ── Table Card ── */
.table-card {
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 2px 20px rgba(15, 40, 98, 0.07);
  border: 1px solid #edf0f5;
}
.table-toolbar { background: #fafbfd; border-bottom: 1px solid #f0f0f0; }
.table-count { font-family: "Sora", sans-serif; font-weight: 700; font-size: 1rem; color: #0f2862; }
.table-count-label { font-size: 0.82rem; color: #9ca3af; }

.edigital-table :deep(thead tr th) {
  font-family: "Sora", sans-serif; font-size: 0.75rem;
  font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: #6b7280;
  background: #fafbfd; border-bottom: 2px solid #edf0f5; padding: 14px 16px;
}
.edigital-table :deep(tbody tr) { transition: background 0.15s; }
.edigital-table :deep(tbody tr:hover) { background: #f5f8ff !important; }
.edigital-table :deep(tbody tr td) {
  font-size: 0.875rem; color: #374151;
  padding: 12px 16px; border-bottom: 1px solid #f3f4f6;
}
.tbl-btn { border-radius: 8px !important; width: 32px; height: 32px; transition: background 0.15s; }
.tbl-btn-primary { color: #1a3fa6 !important; }
.tbl-btn-primary:hover { background: #e8f0fe !important; }

/* ── Grid ── */
.grid-card {
  background: white; border-radius: 14px;
  border: 1px solid #edf0f5; padding: 1.2rem;
  box-shadow: 0 2px 12px rgba(15, 40, 98, 0.05);
  transition: box-shadow 0.2s, transform 0.15s;
}
.grid-card:hover { box-shadow: 0 6px 24px rgba(15, 40, 98, 0.12); transform: translateY(-2px); }
.grid-card-header { display: flex; align-items: center; margin-bottom: 0.5rem; }
.notif-avatar {
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 12px;
}
.grid-name { font-family: "Sora", sans-serif; font-weight: 600; font-size: 0.95rem; color: #0f2862; }
.grid-info { font-size: 0.8rem; color: #9ca3af; }
.ellipsis { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 150px; }
.grid-card-actions { margin-top: 1rem; border-top: 1px solid #f0f4f8; padding-top: 0.8rem; }
.grid-action-btn { border-radius: 8px; font-size: 0.78rem; color: #6b7280 !important; background: #f8fafc; padding: 0 10px; }
.grid-action-primary { color: #1a3fa6 !important; background: #eff6ff !important; }

/* ── Status Chips ── */
.chip-activo { background: #dcfce7; color: #16a34a; font-weight: 700; font-size: 0.72rem; border-radius: 6px; }
.chip-inactivo { background: #fff3e0; color: #f57c00; font-weight: 700; font-size: 0.72rem; border-radius: 6px; }

/* ── Empty State ── */
.empty-state {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 3.5rem 2rem; text-align: center;
}
.empty-icon-wrap {
  width: 72px; height: 72px;
  background: linear-gradient(135deg, #1a3fa6, #0f2862);
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
}
.empty-title { font-family: "Sora", sans-serif; font-size: 1rem; font-weight: 700; color: #6b7280; margin-bottom: 4px; }
.empty-sub { font-size: 0.82rem; color: #d1d5db; max-width: 280px; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .page-topbar { padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .search-input { width: 100%; order: 3; }
  .stats-row { padding: 1rem; }
  .edigital-page .q-px-xl { padding-left: 1rem !important; padding-right: 1rem !important; }
}
</style>

<template>
  <q-page padding>
    <Tables :columns="NotificationColumns" :rows="notifications">
      <template #new>
        <q-btn
          color="primary"
          icon="add"
          label="Nova noticafição"
          no-caps
          class="q-ml-sm"
          @click="addNotification"
        />
      </template>
    </Tables>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useNotificationStores } from "../store";
import Tables from "src/components/Tables.vue";
import NotificationColumns from "../components/NotificationsColumns";

/* router setup */
const router = useRouter();

/* stores setup */
const notificationStores = useNotificationStores();

/* data */
const notifications = ref([]);

/* methods */
const addNotification = () => {
  router.push({ name: "notification-create" });
};

const fetchNotifications = async () => {
  try {
    await notificationStores.list()
    notifications.value = notificationStores.notifications
  } catch (error) {

  }
}


onMounted( async () => {
  await fetchNotifications()
})
</script>

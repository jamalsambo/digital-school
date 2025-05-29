<template>
  <div class="bg-primary text-white">
    <q-toolbar>
      <div class="row full-width q-pa-md">
        <div class="col-12 col-md-4 q-pa-md">
          <div class="text-h6 q-mb-md">Contatos</div>
          <div class="q-mb-sm">
            <q-icon name="phone" size="1rem" class="q-mr-sm" />
            <span
              >{{ institution?.mainContact }} /
              {{ institution?.alternativeContact }} /
              {{ institution?.fixed }}</span
            >
          </div>
          <div class="q-mb-sm">
            <q-icon name="email" size="1rem" class="q-mr-sm" />
            <span>{{ institution?.email }}</span>
          </div>
          <div>
            <q-icon name="access_time" size="1rem" class="q-mr-sm" />
            <span>Seg-Sex: 08:00 - 18:00</span>
          </div>
        </div>
        <div class="col-12 col-md-4 q-pa-md">
          <div class="text-h6 q-mb-md">Localização</div>
          <div class="q-mb-sm">
            <q-icon name="place" size="1rem" class="q-mr-sm" />
            <span>{{ institution?.address }}</span>
          </div>
          <div>
            <q-icon name="map" size="1rem" class="q-mr-sm" />
            <span
              >{{ institution?.neighborhood }},
              {{ institution?.district?.name }}</span
            >
          </div>
        </div>
        <div class="col-12 col-md-4 q-pa-md">
          <div class="text-h6 q-mb-md">Redes Sociais</div>
          <div class="row q-gutter-sm">
            <q-btn round flat icon="fab fa-facebook" />
            <q-btn round flat icon="fab fa-instagram" />
            <q-btn round flat icon="fab fa-twitter" />
            <q-btn round flat icon="fab fa-youtube" />
            <q-btn round flat icon="fab fa-linkedin" />
          </div>
        </div>
      </div>
    </q-toolbar>
    <div class="text-center q-pa-sm bg-primary">
      © 2025 Escola X. Todos os direitos reservados.
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { useSiteStores } from '../store';
const siteStores = useSiteStores();
const institution = computed(() => siteStores.institution);
</script>

<style scoped>
.full-height {
  height: 400px;
}
.banner-content {
  position: absolute;
  bottom: 20%;
  left: 10%;
  color: white;
}

.custom-caption {
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>

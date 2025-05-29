<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="row items-center">
          <q-avatar>
            <img :src="`${apiUrl}/upload/${institution?.logo}`" />
          </q-avatar>
          <span class="q-ml-md">{{ institution?.name }}</span>
        </q-toolbar-title>

        <!-- Ícone de menu -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="q-mr-sm lt-md"
          @click="drawerOpen = !drawerOpen"
        />

        <!-- Navegação com router-link -->
        <div class="gt-sm row items-center">
          <q-btn
            flat
            :to="`/${schoolSlug}`"
            label="Início"
            :exact="true"
            active-class="text-primary bg-grey-3"
          />
          <q-btn
            flat
            :to="`/${schoolSlug}/about-us`"
            label="Sobre nos"
            active-class="text-primary bg-grey-3"
          />
          <q-btn
            flat
            :to="`/${schoolSlug}/educations`"
            label="Formação"
            exact
            active-class="text-primary bg-grey-2"
          />
          <q-btn
            flat
            :to="`/${schoolSlug}/extensions`"
            label="Extensão"
            exact
            active-class="text-primary bg-grey-2"
          />
          <q-btn
            flat
            :to="`/${schoolSlug}/contact`"
            label="Contacto"
            exact
            active-class="text-primary bg-grey-2"
          />
          <q-btn
            label="Login"
            href="http://localhost:9000/"
            target="_blank"
            exact
            active-class="text-primary bg-grey-2"
            f
          />
        </div>
      </q-toolbar>

      <!-- Drawer para mobile -->
      <q-drawer v-model="drawerOpen" side="left" overlay>
        <q-list>
          <q-item class="text-black" clickable   :to="`/${schoolSlug}`" v-close-popup>
            <q-item-section>Início</q-item-section>
          </q-item>

          <q-item class="text-black" clickable   :to="`/${schoolSlug}/about-us`" v-close-popup>
            <q-item-section>"Sobre nos</q-item-section>
          </q-item>

          <q-item class="text-black" clickable  :to="`/${schoolSlug}/educations`" v-close-popup>
            <q-item-section>Formação</q-item-section>
          </q-item>

          <q-item class="text-black"  clickable  :to="`/${schoolSlug}/extensions`" v-close-popup>
            <q-item-section>Extensão</q-item-section>
          </q-item>

            <q-item class="text-black"  clickable  :to="`/${schoolSlug}/contact`" v-close-popup>
            <q-item-section>Contacto</q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
    </q-header>

    <!-- CONTEÚDO DAS ROTAS -->
    <q-page-container>
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>

    <!-- FOOTER -->

    <Footer />
  </q-layout>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useSiteStores } from "../store";
import { onMounted, ref } from "vue";
import Footer from "../components/Footer.vue";
const apiUrl = import.meta.env.VITE_API_URL;

/* setup store */
const siteStores = useSiteStores();
const route = useRoute();

/* setup data */
const schoolSlug = route.params.schoolSlug;
const institution = ref();

const drawerOpen = ref(false);

onMounted(async () => {
  try {
    await siteStores.findDomain(schoolSlug);
    institution.value = siteStores.institution;
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
});
</script>

<style scoped>
.logo {
  width: 120px;
}

.full-height {
  height: 400px;
}

/* Para ocultar as abas em telas pequenas */
.lt-md {
  display: none;
}

/* Para exibir as abas apenas em telas maiores */
.gt-sm {
  display: flex;
}

/* Estilos responsivos usando Quasar */
@media (max-width: 600px) {
  .lt-md {
    display: flex;
  }
  .gt-sm {
    display: none;
  }
}
</style>

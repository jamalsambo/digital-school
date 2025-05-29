<template>
  <q-page class="q-pa-md">
    <div class="text-h4 text-primary q-mb-md">{{ education }}</div>
    <!-- <div class="text-subtitle1 q-mb-md text-justify">{{ curso.descricao }}</div> -->

    <q-separator spaced />

    <div v-for="(area, index) in educationDetalhes?.developmentAreas" :key="index" class="q-mb-lg">
      <div class="text-h6 text-indigo-9">{{ area.name }}</div>
      <div class="text-body2 q-mb-sm text-justify">{{ area?.description }}</div>

      <q-list bordered class="q-mb-md">
        <q-item-label header class="text-grey"
          >Atividades / Disciplinas</q-item-label
        >

        <q-item v-for="(disciplina, dIndex) in area.developmentAreaActivities" :key="dIndex">
          <q-item-section avatar>
            <q-icon name="book" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ disciplina.activity?.name }}</q-item-label>
            <!-- <q-item-label caption>{{ disciplina.descricao }}</q-item-label> -->
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator />
    </div>
  </q-page>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useSiteStores } from "../../store";
import { onMounted, ref } from "vue";

const route = useRoute();

const siteStores = useSiteStores();

const { education } = route.params;
const educationDetalhes = ref()

const fetchEducation = async () => {
  try {
    await siteStores.findEducationByName(education)
    educationDetalhes.value = siteStores.education.curriculums.find((curriculum) => curriculum.status === 'ACTIVO')
  } catch (error) {
    console.log(error);
  }
};

onMounted(fetchEducation)
</script>

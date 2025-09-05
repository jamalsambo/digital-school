<template>
  <q-page class="q-pa-md">
        <!-- Cabeçalho -->
    <div class="text-center q-mb-xl">
      <q-img
        src="https://zcrdvyfthzdhruqqiism.supabase.co/storage/v1/object/public/student/9bc2b203-d346-41c5-b645-2b58ac987d20"
        style="height: 300px; object-fit: cover"
        class="rounded-borders"
      />
      <h1 class="q-mt-md text-primary">Nossas areas de Aprendizado</h1>
      <p class="text-subtitle2 text-grey-7">
        Uma instituição comprometida com a excelência no Aprendizado.
      </p>
    </div>

    <div class="q-col-gutter-md row">
      <div
        v-for="curso in educations"
        :key="curso.id"
        class="col-xs-12 col-sm-6 col-md-4"
      >
        <q-card class="q-hoverable">
          <q-img
            src="https://zcrdvyfthzdhruqqiism.supabase.co/storage/v1/object/public/student/9bc2b203-d346-41c5-b645-2b58ac987d20"
            alt="Imagem do curso"
            height="150px"
            class="q-img-cover"
          />
          <q-card-section>
            <div class="text-h6">{{ curso.name }}</div>
            <div class="text-caption text-grey">Base educacional sólida para crianças.</div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn
              color="primary"
              flat
              :to="`/${schoolSlug}/education/${curso.name}`"
              label="Ver detalhes"
              icon="visibility"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useSiteStores } from '../../store';
import { ref } from 'vue';

/* setup router */
const route = useRoute()

/* setup stores */
const siteStores = useSiteStores();

/* setup stores */
const educations =ref([])

const fetchData = async () => {
  try {
      await siteStores.findCorses(  "8d0c4213-9c7a-4ec8-b790-ba916275e9ee")
      educations.value = siteStores.courses
  } catch (error) {
    console.log(error)
  }
}

const schoolSlug = route.params.schoolSlug;

onMounted(fetchData)
</script>

<template>
  <q-page class="q-pa-md">
    <!-- Cabeçalho -->
    <div class="text-center q-mb-xl">
      <q-img
        src="https://zcrdvyfthzdhruqqiism.supabase.co/storage/v1/object/public/student/9bc2b203-d346-41c5-b645-2b58ac987d20"
        style="height: 300px; object-fit: cover"
        class="rounded-borders"
      />
      <h1 class="q-mt-md text-primary">Sobre a {{ institution?.name }}</h1>
      <p class="text-subtitle2 text-grey-7">
        Uma instituição comprometida com a excelência no ensino superior.
      </p>
    </div>

    <!-- Seções -->
    <q-separator spaced />
    <SectionCard
      title="Nossa Missão"
      icon="flag"
      text="Oferecer educação de qualidade com foco em inovação, inclusão e desenvolvimento sustentável, formando cidadãos comprometidos com o progresso social."
    />

    <SectionCard
      title="Nossa Visão"
      icon="visibility"
      text="Ser uma referência nacional e internacional no ensino superior, reconhecida pela excelência acadêmica e impacto social."
    />

    <SectionCard
      title="Nossos Valores"
      icon="favorite"
      text="Ética, Inclusão, Excelência, Inovação e Responsabilidade Social."
    />
  </q-page>
</template>

<script setup>
import SectionCard from '../../components/SectionCard.vue';
import { computed } from 'vue';
import { useSiteStores } from '../../store';
const siteStores = useSiteStores();
const institution = computed(() => siteStores.institution);
</script>

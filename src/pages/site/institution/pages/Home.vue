<template>
  <!-- Banner principal -->
  <div class="q-pa-md">
    <CarouselSite :carrosel-imagens="mainCarroselImagens" />
  </div>

  <!-- História/Sobre a Escola -->
  <div class="q-pa-md q-my-md bg-grey-2">
    <div class="row items-center">
      <div class="col-12 col-md-6 q-pa-md">
        <div class="text-h4 text-primary q-mb-md">Nossa História</div>
        <div v-html="institution?.aboutUs" class="preview-content" />
      </div>
      <div class="col-12 col-md-6 q-pa-md text-center">
        <CarouselSite :carrosel-imagens="aboutUsCarroselImagens" />
      </div>
    </div>
  </div>

  <!-- Seção de "Por que escolher" e "Programas" -->
  <div class="row q-col-gutter-md q-py-lg">
    <div class="col-12 col-md-6">
      <ChooseMe />
    </div>
    <div class="col-12 col-md-6">
      <Programs />
    </div>
  </div>

  <div class="q-pa-md q-my-md bg-grey-2">
    <div class="text-h4 text-primary q-mb-md">Notícias & Eventos</div>
    <div class="row q-col-gutter-md q-py-lg">
      <div class="col-12 col-md-4 ">
        <EventCard
          day="28"
          month="Agosto"
          title="VI Conselho Geral"
          location="Cidade da Beira"
        />

        <EventCard

          day="05"
          month="Setembro"
          title="Formação de Professores"
          location="Maputo"
        />
      </div>
      <div class="col-12 col-md-8">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-4 q-mb-md">
            <Events />
          </div>
          <div class="col-12 col-md-4 q-mb-md">
            <Events />
          </div>
          <div class="col-12 col-md-4 q-mb-md">
            <Events />
          </div>
        </div>
      </div>
    </div>
  </div>

    <div class="q-pa-md q-my-md bg-grey-2">
      <div class="text-h5 text-primary q-mb-md">Estudantes em Ação</div>

    <q-carousel
      v-model="slide"
      animated
      control-color="primary"
      arrows
       :autoplay="true"
      swipeable
      infinite
      height="500px"
    >
      <q-carousel-slide
        v-for="(group, index) in groupedAtividades"
        :key="index"
        :name="index"
        class="row q-col-gutter-md justify-center items-start q-pa-md"
      >
        <div
          v-for="(item, idx) in group"
          :key="idx"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card class="my-card" style="width: 100%">
            <q-img :src="item.imagem" height="300px" />
            <q-card-section>
              <div class="text-subtitle1 text-bold">{{ item.titulo }}</div>
              <div class="text-caption text-grey-7">{{ item.descricao }}</div>
            </q-card-section>
          </q-card>
        </div>
      </q-carousel-slide>
    </q-carousel>

    </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { useSiteStores } from "../../store";
import CarouselSite from "../../components/CarouselSite.vue";
import ChooseMe from "../../components/ChooseMe.vue";
import Programs from "../../components/Programs.vue";
import Events from "../../components/NewsCard.vue";
import EventCard from "../../components/EventCard.vue";


/* setup stores */
const siteStores = useSiteStores();

/* setup data */

const institution = computed(() => siteStores.institution);
const mainCarroselImagens = computed(
  () => siteStores.institution.mainCarroselImagens
);
const aboutUsCarroselImagens = computed(
  () => siteStores.institution.aboutUsCarroselImagens
);
const slide = ref(0)
const atividades = [
  {
    titulo: 'Feira de Ciências',
    descricao: 'Alunos apresentando projetos científicos com criatividade.',
    imagem: 'https://cdn.quasar.dev/img/parallax2.jpg'
  },
  {
    titulo: 'Educação Física',
    descricao: 'Momentos de esporte e lazer.',
    imagem: 'https://cdn.quasar.dev/img/parallax2.jpg'
  },
  {
    titulo: 'Robótica',
    descricao: 'Tecnologia e inovação desde cedo.',
    imagem: 'https://cdn.quasar.dev/img/parallax2.jpg'
  },
  {
    titulo: 'Pintura Criativa',
    descricao: 'Expressando ideias com arte.',
    imagem: 'https://cdn.quasar.dev/img/parallax2.jpg'
  },
  {
    titulo: 'Teatro Escolar',
    descricao: 'Desenvolvendo expressão e trabalho em grupo.',
    imagem: 'https://cdn.quasar.dev/img/parallax2.jpg'
  },
  {
    titulo: 'Feira do Livro',
    descricao: 'Incentivando a leitura.',
    imagem: 'https://cdn.quasar.dev/img/parallax2.jpg'
  }
]

// Agrupa em blocos de 3
const groupedAtividades = computed(() => {
  const chunkSize = 3
  const result = []
  for (let i = 0; i < atividades.length; i += chunkSize) {
    result.push(atividades.slice(i, i + chunkSize))
  }
  return result
})
</script>

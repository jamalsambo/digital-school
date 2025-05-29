<template>
  <q-page class="q-pa-md">
    <div class="text-h4 text-primary q-mb-md">{{ instituicao.nome }}</div>
    <div class="text-body1 q-mb-lg text-justify">{{ instituicao.descricao }}</div>

    <q-separator spaced />

    <div v-for="(filial, index) in instituicao.filiais" :key="index" class="q-mb-xl">
      <div class="text-h6 text-indigo-9">{{ filial.nome }} - {{ filial.cidade }}</div>
      <div class="text-caption text-grey">{{ filial.endereco }}</div>

      <q-list bordered class="q-mt-sm">
        <q-item-label header class="text-grey-8">Cursos disponíveis</q-item-label>

        <q-item v-for="(curso, i) in filial.cursos" :key="i" clickable>
          <q-item-section avatar>
            <q-icon name="school" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ curso.nome }}</q-item-label>
            <q-item-label caption>{{ curso.resumo }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator class="q-my-md" />
    </div>
  </q-page>
</template>

<script setup>
const instituicao = {
  nome: 'Instituto Nacional de Tecnologia',
  descricao: 'Instituição com várias filiais que oferecem cursos técnicos e profissionais em várias áreas.',

  filiais: [
    {
      nome: 'Filial Beira',
      cidade: 'Beira',
      endereco: 'Av. Eduardo Mondlane, nº 123',
      cursos: [
        { nome: 'Informática', resumo: 'Curso técnico em TI e desenvolvimento de software.' },
        { nome: 'Contabilidade', resumo: 'Curso técnico de gestão e finanças empresariais.' }
      ]
    },
    {
      nome: 'Filial Maputo',
      cidade: 'Maputo',
      endereco: 'Rua da Unidade, nº 45',
      cursos: [
        { nome: 'Gestão Empresarial', resumo: 'Curso voltado à administração moderna.' },
        { nome: 'Logística', resumo: 'Curso técnico em transporte e cadeias de suprimento.' }
      ]
    }
  ]
}
</script>

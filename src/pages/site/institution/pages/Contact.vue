<template>
  <q-page class="q-pa-md">
    <div class="text-h4 text-primary q-mb-md">Contacte-nos</div>

    <div class="q-gutter-md row">
      <!-- Informação da sede -->
      <q-card class="col-12 col-md-5">
        <q-card-section>
          <div class="text-h6">Sede</div>
          <div class="q-mt-sm">
            <q-icon name="location_on" color="primary" /> Av. Eduardo Mondlane, Beira
          </div>
          <div>
            <q-icon name="phone" color="primary" /> +258 82 123 4567
          </div>
          <div>
            <q-icon name="email" color="primary" /> info@instituicao.gov.mz
          </div>
        </q-card-section>
      </q-card>

      <!-- Mapa -->
      <q-card class="col-12 col-md-7">
        <q-card-section class="q-pa-none">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!..."
            width="100%"
            height="300"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
          ></iframe>
        </q-card-section>
      </q-card>
    </div>

    <!-- Formulário de contacto -->
    <q-form @submit="onSubmit" class="q-mt-xl q-gutter-md">
      <div class="text-h6">Envie-nos uma mensagem</div>

      <q-input filled label="Nome" v-model="form.nome" />
      <q-input filled label="Email" v-model="form.email" type="email" />
      <q-input filled label="Assunto" v-model="form.assunto" />
      <q-input
        filled
        label="Mensagem"
        v-model="form.mensagem"
        type="textarea"
        autogrow
      />

      <q-btn label="Enviar" color="primary" type="submit" />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const form = ref({
  nome: '',
  email: '',
  assunto: '',
  mensagem: ''
})

function onSubmit () {
  $q.notify({
    type: 'positive',
    message: 'Mensagem enviada com sucesso!'
  })

  // Aqui você pode enviar os dados para um backend
  form.value = {
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  }
}
</script>

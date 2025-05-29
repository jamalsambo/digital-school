<template>
  <q-card class="full-height">
    <q-card-section class="bg-secondary text-white">
      <div class="text-h5">Por que escolher a {{ institution?.name }}?</div>
    </q-card-section>
    <q-card-section>
      <div class="q-py-sm">
        <div class="row items-center q-mb-md">
          <q-icon name="school" size="2rem" color="primary" class="q-mr-md" />
          <div>
            <div class="text-subtitle1 text-weight-bold">
              Educação de Qualidade
            </div>
            <div class="text-body2">
              Oferecemos o melhor ensino com professores qualificados
            </div>
          </div>
        </div>
        <div class="row items-center q-mb-md">
          <q-icon
            name="psychology"
            size="2rem"
            color="primary"
            class="q-mr-md"
          />
          <div>
            <div class="text-subtitle1 text-weight-bold">
              Desenvolvimento Integral
            </div>
            <div class="text-body2">
              Focamos no crescimento acadêmico e pessoal dos alunos
            </div>
          </div>
        </div>
        <div class="row items-center q-mb-md">
          <q-icon
            name="emoji_events"
            size="2rem"
            color="primary"
            class="q-mr-md"
          />
          <div>
            <div class="text-subtitle1 text-weight-bold">Reconhecimento</div>
            <div class="text-body2">
              Nossa instituição é reconhecida pela excelência no ensino
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup></script>

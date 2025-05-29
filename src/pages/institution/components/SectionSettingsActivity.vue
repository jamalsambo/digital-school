<template>
  <div class="border q-pa-md shadow-2">
    <div v-if="!isAddImgACtivity">
      <div class="row items-center justify-between">
        <span class="text-weight-bold"> Imagens do carrosel Actividades</span>
        <q-btn
          color="primary"
          icon="add"
          label="Adicionar"
          class="q-mr-sm"
          @click="isAddImgACtivity = true"
          flat
        />
      </div>
      <q-separator spaced />
      <q-list bordered>
        <q-item v-for="(item, index) in activityCarroselImagens" :key="index">
          <q-item-section>
            <div>
              <q-card class="my-card" style="width: 200px">
                <q-img :src="`${item?.imagen}`">
                  <div class="absolute-bottom text-subtitle2 text-center">
                    {{ item.description }}
                  </div>
                </q-img>
              </q-card>
            </div>
          </q-item-section>
          <q-item-section side>
            <q-btn flat dense round icon="delete" color="negative" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-else>
      <div class="row items-center justify-between">
        <span class="text-weight-bold"
          >Adicionar imagens de carrosel sobre nos</span
        >
      </div>
      <q-separator spaced />
      <q-form ref="formRef" @submit="handleUploaFileActivityCarrocel">
        <div class="row q-col-gutter-sm">
          <q-file
            class="col-md-5 col-sm-12 col-xs-12"
            v-model="form.file"
            label="Selecione um arquivo"
            outlined=""
            counter
            dense
          />
          <q-input
            class="col-md-7 col-sm-12 col-xs-12"
            v-model="form.description"
            label="Legenda"
            outlined
            dense
            placeholder="Digite o dominio da instituiçao"
          />
        </div>
         <slot name="actions"></slot>
      </q-form>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'

const isAddImgACtivity = ref(false)
const props = defineProps({
  activityCarroselImagens: { type: Array, required: false},
})

// dados do formulário
const form = reactive({
  file: null,
  description: ''
})

// referência ao formulário para validação
const formRef = ref(null)

// função que pode ser chamada pelo pai
function validateAndGetData() {
  return formRef.value.validate().then((valid) => {
    if (valid) {
      return { ...form }
    } else {
      throw new Error('Form inválido')
    }
  })
}

// expor para o pai
defineExpose({
  validateAndGetData
})
</script>

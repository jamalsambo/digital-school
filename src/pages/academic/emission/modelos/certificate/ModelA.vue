<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card flat bordered class="certificate-card">
      <q-card-section class="text-center bg-primary text-white">
        <div class="text-h4 text-weight-bold">{{ institution.name }}</div>
        <div class="text-subtitle1">{{ motto }}</div>
      </q-card-section>

      <q-card-section class="text-center q-pt-md">
        <div class="text-h5 q-mb-md text-primary">CERTIFICADO DE CONCLUSÃO</div>
        <div class="text-body1 q-mb-sm">Certificamos que</div>
        <div class="text-h4 text-weight-bold q-mb-md text-secondary">{{ studentName }}</div>
        <div class="text-body1 q-mb-sm">concluiu com sucesso o curso de</div>
        <div class="text-h5 text-weight-bold q-mb-md text-primary">{{ courseName }}</div>
        <div class="text-body1 q-mb-md">com carga horária de **{{ workload }}** horas, em **{{ completionDate }}**.</div>

        <div class="row justify-around q-mt-lg">
          <div class="col-auto text-center">
            <q-img src="path/to/signature-director.png" style="width: 150px; height: auto;" />
            <q-separator class="q-my-sm" />
            <div class="text-body2">_________________________</div>
            <div class="text-body2 text-weight-bold">{{ directorName }}</div>
            <div class="text-body2">Diretor(a)</div>
          </div>
          <div class="col-auto text-center">
            <q-img src="path/to/signature-coordinator.png" style="width: 150px; height: auto;" />
            <q-separator class="q-my-sm" />
            <div class="text-body2">_________________________</div>
            <div class="text-body2 text-weight-bold">{{ coordinatorName }}</div>
            <div class="text-body2">Coordenador(a) do Curso</div>
          </div>
        </div>

        <div class="text-caption q-mt-lg text-grey-7">
          Emitido em {{ issueDate }} | Código de Verificação: **{{ verificationCode }}**
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { useInstitutionStores } from 'src/pages/institution/store';

const institutionStores = useInstitutionStores()

const institution = computed(() => institutionStores.institution)

const props = defineProps({
  institutionName: {
    type: String,
    default: 'Nome da Instituição de Ensino',
  },
  motto: {
    type: String,
    default: 'Seu futuro começa aqui!',
  },
  studentName: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  workload: {
    type: [String, Number],
    required: true,
  },
  completionDate: {
    type: String,
    required: true,
  },
  directorName: {
    type: String,
    default: 'Nome do(a) Diretor(a)',
  },
  coordinatorName: {
    type: String,
    default: 'Nome do(a) Coordenador(a)',
  },
  issueDate: {
    type: String,
    default: new Date().toLocaleDateString('pt-BR'),
  },
  verificationCode: {
    type: String,
    default: () => Math.random().toString(36).substring(2, 15).toUpperCase(), // Exemplo de código gerado
  },
});
</script>

<style lang="scss" scoped>
.certificate-card {
  width: 100%;
  max-width: 900px; // Tamanho ideal para um certificado
  border: 5px solid $primary; // Borda decorativa
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  background: radial-gradient(circle, #ffffff 0%, #f0f0f0 100%); // Gradiente suave

  .q-card-section {
    padding: 24px;
  }

  .text-h4, .text-h5 {
    font-family: 'Georgia', serif; // Fonte mais formal
  }

  .text-primary {
    color: $primary !important;
  }

  .text-secondary {
    color: $secondary !important;
  }

  .q-img {
    border-bottom: 1px dashed $grey-5; // Linha para assinatura
    margin-bottom: 8px;
  }
}

// Estilos para impressão (opcional)
@media print {
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .certificate-card {
    border: none !important;
    box-shadow: none !important;
    max-width: none;
    width: auto;
  }
  .q-page {
    padding: 0 !important;
  }
}
</style>
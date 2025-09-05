<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md q-mb-lg">
      <div class="text-h5 q-mb-md">Selecione o Modelo de Certificado</div>
      <q-select
        v-model="selectedModel"
        :options="certificateModels"
        label="Escolha um Modelo"
        emit-value
        map-options
        outlined
        dense
      />
    </div>

    <q-separator class="q-mb-lg" />
    <model-a v-if="selectedModel==='CertificateModelA'"/>
    <model-b v-if="selectedModel==='CertificateModelB'" />

  </q-page>
</template>

<script setup>
import { ref, } from 'vue';
import { useQuasar } from 'quasar';
// Importe as bibliotecas para PDF
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ModelA from '../modelos/certificate/ModelA.vue';
import ModelB from '../modelos/certificate/ModelB.vue';

const $q = useQuasar();

// Opções de modelos de certificado
const certificateModels = ref([
  { label: 'Modelo Padrão (A)', value: 'CertificateModelA' },
  { label: 'Modelo Moderno (B)', value: 'CertificateModelB' },
  // Adicione mais modelos aqui
]);

// Modelo selecionado atualmente
const selectedModel = ref('CertificateModelA'); // Define o modelo padrão

// Função para gerar PDF
const generatePdf = async () => {
  $q.loading.show({
    message: 'Gerando PDF... Por favor, aguarde.',
  });

  try {
    const certificateElement = document.querySelector('.certificate-card'); // Certifique-se que seu componente de certificado tem essa classe
    if (!certificateElement) {
      throw new Error("Elemento do certificado não encontrado para gerar PDF.");
    }

    const canvas = await html2canvas(certificateElement, { scale: 2 }); // Aumentar a escala para melhor qualidade
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4'); // 'landscape' para orientação paisagem

    const imgWidth = 297; // A4 landscape width in mm
    const pageHeight = 210; // A4 landscape height in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`certificado_${certificateData.value.studentName.replace(/\s/g, '_')}.pdf`);
    $q.notify({
      type: 'positive',
      message: 'PDF gerado com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    $q.notify({
      type: 'negative',
      message: `Erro ao gerar PDF: ${error.message}`,
    });
  } finally {
    $q.loading.hide();
  }
};
</script>

<style lang="scss" scoped>
.certificate-preview-container {
  border: 1px dashed $grey-5;
  padding: 16px;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $grey-1;
}
</style>
<template>
  <div class="invoice-container" ref="invoiceContent" padding="">
  <div class="print-container q-pa-xl">
    <!-- Cabeçalho Institucional -->
    <div class="header text-center q-mb-xl">
      <div class="row items-center">
        <div class="col-3">
          <img
            src="https://via.placeholder.com/150x150?text=Logo+Escola"
            class="school-logo"
            alt="Logo da Escola"
          />
        </div>
        <div class="col-6">
          <div class="text-h4 text-weight-bold">{{ institution?.name }}</div>
        </div>
        <div class="col-3 text-right"></div>
      </div>
    </div>

    <!-- Dados do Aluno -->
    <div class="student-info q-mb-xl">
      <div class="info-box q-pa-md">
        <div class="row q-col-gutter-lg">
          <div class="col-4">
            <strong>Nome:</strong> {{ student?.basicInformation?.fullName }}
          </div>
          <div class="col-2">
            <strong>Numero:</strong> {{ student?.number }}
          </div>
          <div class="col-3">
            <strong>Nascimento:</strong>
            {{ student?.basicInformation.dateBirth }}
          </div>
          <div class="col-3">
            <strong>Turma:</strong>
            {{ classe?.name + "-" + classe?.course?.name }}
          </div>
        </div>
      </div>
    </div>
    <!-- Quadro de Resultados -->
    <div class="results-section">
      <div class="q-table__container">
        <table border="1" cellspacing="0" class="rounded-borders">
          <tbody>
            <tr>
              <td class="q-pa-none">N</td>
              <td class="q-pa-none">Ano de Frequencia</td>
              <td class="q-pa-none">Disciplina</td>
              <td class="q-pa-none">Aproveitamento</td>
            </tr>
            <template
              v-for="(disciplines, cicle) in groupedByCicle"
              :key="cicle"
            >
              <template
                v-for="(data, disciplineName, index) in disciplines"
                :key="disciplineName"
              >
                <tr>
                  <td
                    class="q-pa-none text-center"
                    colspan="4"
                    v-if="index === 0"

                  >
                    {{ cicle }}º Trimestre
                  </td>
                </tr>
                <tr>
                  <td>{{index+1}}</td>
                  <td>{{ 2025  }}</td>
                  <td >{{disciplineName }}</td>
                  <td>{{ data.avg }}</td>
                </tr>
              </template>
              <tr>
               <td> Media final</td>
                <td  colspan="2"></td>
                <td>  {{ Number(totalSum) / Number(totalCount) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Rodapé Institucional -->
    <div class="footer q-mt-xl">
      <div class="signature-area row q-col-gutter-xl">
        <div class="col-6 text-center">
          <div class="border-top q-pt-md">
            Assinatura do Coordenador Pedagógico
          </div>
          <div class="signature-line q-mt-md">____________________________________</div>
          <div class="text-caption">Data: _____/_____/_____</div>
          <div class="signature-line q-mt-md"></div>
          <div class="text-caption"></div>
        </div>
        <div class="col-6 text-center">
          <div class="border-top q-pt-md">Assinatura do Responsável</div>
          <div class="signature-line q-mt-md">____________________________________</div>
          <div class="text-caption">Data: _____/_____/_____</div>
        </div>
      </div>

      <div class="disclaimer q-mt-xl text-caption text-center"></div>
    </div>

  </div>
</div>
<div class="row justify-end q-gutter-sm">
    <q-btn
      label="Voltar"
      color="secondary"
      icon="back"
      type="button"
      flat
      @click="router.back()"
    />
    <q-btn
      label="Imprimir"
      color="positive"
      icon="print"
      type="button"
      flat
      @click="exportToPDF"
    />
  </div>
</template>

<script setup>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ref, computed, onMounted } from "vue";
import { useStudentStores } from "src/pages/student/store";
import { useClassStores } from "src/pages/class/store";
import { useInstitutionStores } from "src/pages/institution/store";
import { useRoute, useRouter } from "vue-router";

/* setup router */
const route = useRoute();
const router = useRouter()

/* setup stores */
const studentsStores = useStudentStores();
const classStores = useClassStores();
const institutionStores = useInstitutionStores();

/* setup data */
const { studentId, classId } = route.params;
const student = ref(null);
const evolutions = ref([]);
const classe = ref();
const institution = computed(() => institutionStores.institution);

/* setup methods */

/* fetch data */
const fetchData = async () => {
  try {
    await studentsStores.findOne(studentId);
    student.value = studentsStores.student;
    evolutions.value = studentsStores.student.evolutions;

    await classStores.findOne(classId);
    classe.value = classStores.classe;
  } catch (error) {
    console.log(error);
  }
};


let totalSum = 0
let totalCount = 0

const groupedByCicle = computed(() => {
  const result = {};

  evolutions.value.forEach((item) => {
    const cicle = item.cicle;
    const disciplineName = item.developmentAreaActivity.activity.name;

    if (!result[cicle]) {
      result[cicle] = {};
    }

    if (!result[cicle][disciplineName]) {
      result[cicle][disciplineName] = {
        notes: [],
        avg: 0,
      };
    }

    result[cicle][disciplineName].notes.push({
      note: Number(item.note),
      type: item.testTypeId,
    });
  });

  // Calcular a média
  Object.keys(result).forEach((cicle) => {
    Object.keys(result[cicle]).forEach((discipline) => {
      const notes = result[cicle][discipline].notes;
      notes.forEach((n) => {
      totalSum += n.note
      totalCount++
      })
      const avg = notes.reduce((acc, n) => acc + n.note, 0) / notes.length;
      result[cicle][discipline].avg = avg.toFixed(2);
    });
  });

  return result;
});

const exportToPDF = async () => {
  const invoiceContent = document.querySelector(".invoice-container");
  try {
    // Capturar o conteúdo como uma imagem
    const canvas = await html2canvas(invoiceContent, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Criar o PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Adicionar a imagem ao PDF
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Acionar a janela de impressão
    pdf.autoPrint();

    // Abrir o PDF em uma nova aba para impressão
    const pdfBlob = pdf.output("bloburl");
    window.open(pdfBlob, "_blank");
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
  }
};

onMounted(async () => {
  await fetchData();
});
</script>

<style scoped>
@media print {
  .print-container {
    width: 210mm !important;
    min-height: 297mm !important;
    padding: 15mm !important;
    font-size: 12pt !important;
  }

  .school-logo {
    filter: grayscale(100%);
  }

  .qrcode {
    opacity: 0.9;
  }

  .signature-line {
    border-bottom: 1px solid #000;
    width: 70%;
    margin: 15px auto;
  }

  .info-box {
    border: 1px solid #ddd !important;
    border-radius: 4px;
  }
}

.header {
  border-bottom: 2px solid #000;
  padding-bottom: 20px;
}

.student-info {
  font-size: 1.1rem;
}

.grades-table {
  font-size: 0.95rem;
}

.grades-table :deep(th) {
  background-color: #f8f9fa !important;
  font-weight: 600;
}

.q-table td {
  border: 1px solid #ccc;
  height: 50px;
  width: 150px;
  text-align: center;

}

.q-table__container {
  max-width: 800px;
  margin: 0 auto;
}
 table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Arial', sans-serif;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 8px 12px;
    text-align: center;
  }

  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #fafafa;
  }

  .trimestre-row {
    background-color: #e3f2fd;
    font-weight: bold;
    text-align: left;
  }
</style>

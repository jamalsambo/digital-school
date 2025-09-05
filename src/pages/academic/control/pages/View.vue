<template>
  <q-page class="q-pa-md certificate-page">
    <q-card class="certificate-card shadow-2">
      <q-card-section class="text-center q-pb-none">
        <div class="row items-center justify-center q-gutter-md">
          <q-img src="~assets/mozambique_coat_of_arms.png" alt="Emblema de Moçambique" class="coat-of-arms" width="80px" height="80px" />
          <div>
            <div class="text-h6 text-uppercase text-weight-bold">República de Moçambique</div>
            <div class="text-subtitle1 text-weight-medium">Ministério da Educação e Desenvolvimento Humano</div>
            <div class="text-subtitle2 text-weight-regular">{{ institutionName }}</div>
            <div class="text-caption">Registo n.º: {{ institutionRegistration }}</div>
          </div>
        </div>
        <q-separator class="q-my-md" />
        <div class="text-h5 text-uppercase text-weight-bolder certificate-title q-mb-md">
          Certificado de Habilitações Literárias
        </div>
      </q-card-section>

      <q-card-section class="q-pt-sm certificate-details">
        <div class="q-mb-md">
          Certificamos que o(a) estudante:
          <div class="text-h6 text-weight-bold q-mt-xs">{{ student.fullName }}</div>
          <div class="text-subtitle2">N.º de Registo: <span class="text-weight-bold">{{ student.registrationNumber }}</span></div>
        </div>

        <div class="q-mb-md">
          Nascido(a) em: <span class="text-weight-medium">{{ student.birthDate }}</span>
          Natural de: <span class="text-weight-medium">{{ student.birthPlace }}</span>
          Filho(a) de: <span class="text-weight-medium">{{ student.fatherName }}</span> e de <span class="text-weight-medium">{{ student.motherName }}</span>.
        </div>

        <div class="q-mb-md">
          Frequentou e concluiu com aproveitamento o(a)
          <span class="text-weight-bold text-uppercase">{{ courseInfo.courseName }}</span>
          no ano letivo de <span class="text-weight-bold">{{ courseInfo.academicYear }}</span>.
        </div>

        <q-separator class="q-my-md" />

        <div class="text-h6 q-mb-sm text-weight-bold">Resultados Acadêmicos por Disciplina:</div>
        <q-list bordered separator>
          <q-item v-for="(data, discipline) in processedAcademicData.disciplinas" :key="discipline">
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ discipline }}</q-item-label>
              <q-item-label caption>Média Final:
                <span :class="data.mediaFinalDisciplina >= processedAcademicData.notaMinimaParaTransitar ? 'text-positive' : 'text-negative'">
                  {{ data.mediaAnualDepoisExame }} valores
                </span>
                <span v-if="data.temExame" class="q-ml-sm">(Média antes do Exame: {{ data.mediaAnualAntesExame }}, Nota Exame: {{ data.notaExame }})</span>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon v-if="data.mediaFinalDisciplina >= processedAcademicData.notaMinimaParaTransitar" name="check_circle" color="positive" size="sm">
                <q-tooltip>Aprovado</q-tooltip>
              </q-icon>
              <q-icon v-else name="cancel" color="negative" size="sm">
                <q-tooltip>Reprovado (ou nota abaixo do mínimo)</q-tooltip>
              </q-icon>
            </q-item-section>
          </q-item>
           
        </q-list>

        <q-separator class="q-my-md" />

        <div class="text-h6 q-mb-sm text-weight-bold">Resumo Final:</div>
        <q-list dense>
          <q-item>
            <q-item-section>
              <q-item-label>Média Global Final:</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label :class="processedAcademicData.mediaGlobalFinal >= processedAcademicData.notaMinimaParaTransitar ? 'text-positive text-weight-bold' : 'text-negative text-weight-bold'">
                {{ processedAcademicData.mediaGlobalFinal }} valores
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Status de Aprovação Global:</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label :class="processedAcademicData.transitaDeClasse ? 'text-positive text-weight-bold' : 'text-negative text-weight-bold'">
                {{ processedAcademicData.transitaDeClasse ? 'APROVADO(A)' : 'NÃO APROVADO(A)' }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Existe Disciplina com Nota Negativa?</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label :class="processedAcademicData.temNotaNegativa ? 'text-negative text-weight-bold' : 'text-positive text-weight-bold'">
                {{ processedAcademicData.temNotaNegativa ? 'Sim' : 'Não' }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator class="q-my-md" />

        <div class="q-mb-md text-justify">
          Para constar e de acordo com a legislação em vigor na República de Moçambique,
          passa-se o presente certificado para os devidos efeitos.
        </div>

        <div class="row justify-between q-mt-xl text-center signatures">
          <div class="col-4">
            <q-separator class="q-mb-sm" />
            <div class="text-weight-bold">O(A) Diretor(a)</div>
            <div class="text-caption">(Nome e Assinatura)</div>
          </div>
          <div class="col-4">
            <q-separator class="q-mb-sm" />
            <div class="text-weight-bold">O(A) Secretário(a)</div>
            <div class="text-caption">(Nome e Assinatura)</div>
          </div>
        </div>

        <div class="q-mt-xl text-caption text-grey-7">
          <div class="row justify-between">
            <div>{{ issueLocation }}, {{ issueDate }}</div>
            <div>N.º de Certificado: <span class="text-weight-bold">{{ certificateNumber }}</span></div>
          </div>
        </div>

      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { date } from 'quasar'; // Para formatação de datas

// --- Dados de Exemplo ---
// Estes dados seriam tipicamente passados via props ou obtidos de uma API
const institutionName = ref('Escola Chiveve');
const institutionRegistration = ref('MINEDH/ESJM/2024/001');
const certificateNumber = ref('CERT-2025/00123'); // Exemplo de número de certificado
const issueLocation = ref('Maputo');
const issueDate = ref(date.formatDate(Date.now(), 'DD de MMMM de YYYY'));

const student = ref({
  fullName: 'Maria de Fátima da Silva',
  registrationNumber: '2024/EST/0056',
  birthDate: '15 de Março de 2008',
  birthPlace: 'Beira, Sofala',
  fatherName: 'António João da Silva',
  motherName: 'Ana Paula Lourenço',
});

const courseInfo = ref({
  courseName: '10.ª Classe', // Ex: 10.ª Classe, Ensino Básico, Curso de Informática
  academicYear: '2024/2025',
});

// Dados acadêmicos simulados (use sua função de processamento aqui)
const rawAcademicData = {
	"1": {
		"total": 16.1,
		"count": 1,
		"cicles": {
			"1": {
				"total": 16.1,
				"count": 1,
				"activities": [
					{
						"id": "dab868a8-d380-4fec-a2db-a5c016da98ef",
						"developmentAreaId": "75a7ee06-5eef-472c-8c3b-31bb46919547",
						"activityId": "be0ae62b-eae3-45b2-a791-0a7d8e0ce68b",
						"hours": 4,
						"credit": 0,
						"exame": false,
						"critical": false,
						"participation": false,
						"cicle": 1,
						"year": 1,
						"createdAt": "2025-06-03T17:34:33.490Z",
						"updatedAt": "2025-06-03T17:34:33.490Z",
						"activity": {
							"id": "be0ae62b-eae3-45b2-a791-0a7d8e0ce68b",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Biologia",
							"createdAt": "2025-06-03T17:28:50.390Z",
							"updatedAt": "2025-06-03T17:28:50.390Z"
						},
						"evolutions": [
							{
								"id": "bdf8a5ca-7c80-4dbe-bbe1-fbccba741192",
								"studentId": "f9cee4b2-16cf-4d52-ab12-f30f14f416ea",
								"developmentAreaActivityId": "dab868a8-d380-4fec-a2db-a5c016da98ef",
								"classId": "7f95942e-6a32-4ab4-9cda-3c12cb179460",
								"courseEvolutionTypeId": "1c1a482c-3833-4c6b-b15a-b35b8d30163b",
								"note": "15",
								"dateCompletion": "2025-06-14",
								"observations": null,
								"createdAt": "2025-06-14T17:47:44.866Z",
								"updatedAt": "2025-06-14T18:05:10.504Z",
								"courseEvolutionType": {
									"id": "1c1a482c-3833-4c6b-b15a-b35b8d30163b",
									"courseId": "542cfd53-d894-49b1-9949-c3de4734a51c",
									"evolutionTypeId": "c4f7f08e-9a29-4d6e-afc3-e1cc126b0786",
									"weight": 50,
									"evolutionType": {
										"id": "c4f7f08e-9a29-4d6e-afc3-e1cc126b0786",
										"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
										"name": "Avaliacao 2",
										"type": "Normal",
										"createdAt": "2025-06-03T17:27:10.717Z",
										"updatedAt": "2025-06-03T17:27:10.717Z"
									}
								},
								"items": [
									{
										"id": "0f667c86-67b2-4fef-91bd-5fccb67460fc",
										"evolutionId": "bdf8a5ca-7c80-4dbe-bbe1-fbccba741192",
										"courseEvolutionTypeItemId": "f2e83f98-bfc2-4bc4-8016-97ee13eb51bd",
										"note": "18",
										"dateCompletion": "2025-06-14",
										"observations": null,
										"createdAt": "2025-06-14T18:52:02.291Z",
										"updatedAt": "2025-06-15T20:42:44.445Z",
										"courseEvolutionTypeItem": {
											"id": "f2e83f98-bfc2-4bc4-8016-97ee13eb51bd",
											"courseEvolutionTypeId": "1c1a482c-3833-4c6b-b15a-b35b8d30163b",
											"name": "Avalicao de recuperacao",
											"weight": 20
										}
									}
								]
							},
							{
								"id": "04f2cf98-472c-44ec-a2ef-663f3934314c",
								"studentId": "f9cee4b2-16cf-4d52-ab12-f30f14f416ea",
								"developmentAreaActivityId": "dab868a8-d380-4fec-a2db-a5c016da98ef",
								"classId": "7f95942e-6a32-4ab4-9cda-3c12cb179460",
								"courseEvolutionTypeId": "9b7331de-ebbd-4fa3-97e8-d5f68b6fff7e",
								"note": "16",
								"dateCompletion": "2025-06-15",
								"observations": null,
								"createdAt": "2025-06-15T20:59:57.062Z",
								"updatedAt": "2025-06-15T20:59:57.062Z",
								"courseEvolutionType": {
									"id": "9b7331de-ebbd-4fa3-97e8-d5f68b6fff7e",
									"courseId": "542cfd53-d894-49b1-9949-c3de4734a51c",
									"evolutionTypeId": "8f1d9968-1597-4ecc-b79d-6614cfc22f15",
									"weight": 50,
									"evolutionType": {
										"id": "8f1d9968-1597-4ecc-b79d-6614cfc22f15",
										"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
										"name": "Avaliacao 1",
										"type": "Normal",
										"createdAt": "2025-06-03T17:27:05.013Z",
										"updatedAt": "2025-06-03T17:27:05.013Z"
									}
								},
								"items": []
							}
						],
						"averageNormal": 16.1,
						"averageWithExame": 16.1
					},
					{
						"id": "dfdc8a16-b897-4f4b-870c-61cb471a8117",
						"developmentAreaId": "75a7ee06-5eef-472c-8c3b-31bb4691547",
						"activityId": "03adf15d-f7d0-4319-bf29-a34cd53f20db",
						"hours": 2,
						"credit": 0,
						"exame": true,
						"critical": true,
						"participation": false,
						"cicle": 1,
						"year": 1,
						"createdAt": "2025-06-03T17:32:59.630Z",
						"updatedAt": "2025-06-03T17:32:59.630Z",
						"activity": {
							"id": "03adf15d-f7d0-4319-bf29-a34cd53f20db",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Fisica",
							"createdAt": "2025-06-03T17:28:34.232Z",
							"updatedAt": "2025-06-03T17:28:34.232Z"
						},
						"evolutions": [
              {
								"id": "04f2cf98-472c-44ec-a2ef-663f3934314c",
								"studentId": "f9cee4b2-16cf-4d52-ab12-f30f14f416ea",
								"developmentAreaActivityId": "dab868a8-d380-4fec-a2db-a5c016da98ef",
								"classId": "7f95942e-6a32-4ab4-9cda-3c12cb179460",
								"courseEvolutionTypeId": "9b7331de-ebbd-4fa3-97e8-d5f68b6fff7e",
								"note": "8",
								"dateCompletion": "2025-06-15",
								"observations": null,
								"createdAt": "2025-06-15T20:59:57.062Z",
								"updatedAt": "2025-06-15T20:59:57.062Z",
								"courseEvolutionType": {
									"id": "9b7331de-ebbd-4fa3-97e8-d5f68b6fff7e",
									"courseId": "542cfd53-d894-49b1-9949-c3de4734a51c",
									"evolutionTypeId": "8f1d9968-1597-4ecc-b79d-6614cfc22f15",
									"weight": 50,
									"evolutionType": {
										"id": "8f1d9968-1597-4ecc-b79d-6614cfc22f15",
										"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
										"name": "Exame Final",
										"type": "Exame",
										"createdAt": "2025-06-03T17:27:05.013Z",
										"updatedAt": "2025-06-03T17:27:05.013Z"
									}
								},
								"items": []
							}
            ],
						"averageNormal": 15,
						"averageWithExame": null
					},
					{
						"id": "7f19741a-f82f-4fac-8ee3-54711de5c837",
						"developmentAreaId": "75a7ee06-5eef-472c-8c3b-31bb4691547",
						"activityId": "b03b1842-c722-4d2f-8d11-4e68039ae873",
						"hours": 4,
						"credit": 0,
						"exame": true,
						"critical": false,
						"participation": true,
						"cicle": 1,
						"year": 1,
						"createdAt": "2025-06-03T17:33:59.482Z",
						"updatedAt": "2025-06-03T17:33:59.482Z",
						"activity": {
							"id": "b03b1842-c722-4d2f-8d11-4e68039ae873",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Quimica",
							"createdAt": "2025-06-03T17:28:41.846Z",
							"updatedAt": "2025-06-03T17:28:41.846Z"
						},
						"evolutions": [
              {
								"id": "04f2cf98-472c-44ec-a2ef-663f3934314c",
								"studentId": "f9cee4b2-16cf-4d52-ab12-f30f14f416ea",
								"developmentAreaActivityId": "dab868a8-d380-4fec-a2db-a5c016da98ef",
								"classId": "7f95942e-6a32-4ab4-9cda-3c12cb179460",
								"courseEvolutionTypeId": "9b7331de-ebbd-4fa3-97e8-d5f68b6fff7e",
								"note": "11",
								"dateCompletion": "2025-06-15",
								"observations": null,
								"createdAt": "2025-06-15T20:59:57.062Z",
								"updatedAt": "2025-06-15T20:59:57.062Z",
								"courseEvolutionType": {
									"id": "9b7331de-ebbd-4fa3-97e8-d5f68b6fff7e",
									"courseId": "542cfd53-d894-49b1-9949-c3de4734a51c",
									"evolutionTypeId": "8f1d9968-1597-4ecc-b79d-6614cfc22f15",
									"weight": 50,
									"evolutionType": {
										"id": "8f1d9968-1597-4ecc-b79d-6614cfc22f15",
										"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
										"name": "Exame Final",
										"type": "Exame",
										"createdAt": "2025-06-03T17:27:05.013Z",
										"updatedAt": "2025-06-03T17:27:05.013Z"
									}
								},
								"items": []
							}
            ],
						"averageNormal": 9,
						"averageWithExame": null
					},
					{
						"id": "bba31b4d-4b82-4f5d-ba6f-4bdbdfd04f58",
						"developmentAreaId": "7deb9606-744b-443a-8669-07af69216c74",
						"activityId": "db8deeaa-5690-43d1-a448-9e07eefd96e9",
						"hours": 5,
						"credit": 0,
						"exame": true,
						"critical": true,
						"participation": false,
						"cicle": 1,
						"year": 1,
						"createdAt": "2025-06-03T17:35:12.690Z",
						"updatedAt": "2025-06-03T17:35:12.690Z",
						"activity": {
							"id": "db8deeaa-5690-43d1-a448-9e07eefd96e9",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Portugues",
							"createdAt": "2025-06-03T17:28:16.009Z",
							"updatedAt": "2025-06-03T17:28:16.009Z"
						},
						"evolutions": [],
						"averageNormal": null, // Testando disciplina sem averageNormal
						"averageWithExame": null
					},
					{
						"id": "d1687140-d663-4deb-a914-455cf472d4ab",
						"developmentAreaId": "7deb9606-744b-443a-8669-07af69216c74",
						"activityId": "887070dc-c7bb-457f-baeb-5c32c3a37da1",
						"hours": 5,
						"credit": 0,
						"exame": true,
						"critical": true,
						"participation": false,
						"cicle": 1,
						"year": 1,
						"createdAt": "2025-06-03T17:35:35.648Z",
						"updatedAt": "2025-06-03T17:35:35.648Z",
						"activity": {
							"id": "887070dc-c7bb-457f-baeb-5c32c3a37da1",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Matematica",
							"createdAt": "2025-06-03T17:28:25.979Z",
							"updatedAt": "2025-06-03T17:28:25.979Z"
						},
						"evolutions": [],
						"averageNormal": null, // Testando disciplina sem averageNormal
						"averageWithExame": null
					}
				],
				"globalAverage": 16.1
			},
			"2": {
				"total": 0,
				"count": 0,
				"activities": [
					{
						"id": "cc635e36-6c88-40e5-b391-d513709cd2ce",
						"developmentAreaId": "75a7ee06-5eef-472c-8c3b-31bb4691547",
						"activityId": "be0ae62b-eae3-45b2-a791-0a7d8e0ce68b",
						"hours": 4,
						"credit": 0,
						"exame": false,
						"critical": false,
						"participation": false,
						"cicle": 2,
						"year": 1,
						"createdAt": "2025-06-03T17:34:33.507Z",
						"updatedAt": "2025-06-03T17:34:33.507Z",
						"activity": {
							"id": "be0ae62b-eae3-45b2-a791-0a7d8e0ce68b",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Biologia",
							"createdAt": "2025-06-03T17:28:50.390Z",
							"updatedAt": "2025-06-03T17:28:50.390Z"
						},
						"evolutions": [],
						"averageNormal": null,
						"averageWithExame": null
					},
					{
						"id": "0997cca7-9d09-46c6-bc2f-d2fddd95ff6c",
						"developmentAreaId": "75a7ee06-5eef-472c-8c3b-31bb4691547",
						"activityId": "b03b1842-c722-4d2f-8d11-4e68039ae873",
						"hours": 4,
						"credit": 0,
						"exame": true,
						"critical": false,
						"participation": true,
						"cicle": 2,
						"year": 1,
						"createdAt": "2025-06-03T17:33:59.485Z",
						"updatedAt": "2025-06-03T17:33:59.485Z",
						"activity": {
							"id": "b03b1842-c722-4d2f-8d11-4e68039ae873",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Quimica",
							"createdAt": "2025-06-03T17:28:41.846Z",
							"updatedAt": "2025-06-03T17:28:41.846Z"
						},
						"evolutions": [],
						"averageNormal": null,
						"averageWithExame": null
					},
					{
						"id": "9d0062b6-9cf1-4177-b2cb-7734b470fc24",
						"developmentAreaId": "75a7ee06-5eef-472c-8c3b-31bb4691547",
						"activityId": "03adf15d-f7d0-4319-bf29-a34cd53f20db",
						"hours": 2,
						"credit": 0,
						"exame": true,
						"critical": true,
						"participation": false,
						"cicle": 2,
						"year": 1,
						"createdAt": "2025-06-03T17:32:59.630Z",
						"updatedAt": "2025-06-03T17:32:59.630Z",
						"activity": {
							"id": "03adf15d-f7d0-4319-bf29-a34cd53f20db",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Fisica",
							"createdAt": "2025-06-03T17:28:34.232Z",
							"updatedAt": "2025-06-03T17:28:34.232Z"
						},
						"evolutions": [],
						"averageNormal": null,
						"averageWithExame": null
					},
					{
						"id": "c6894294-f6a0-4d01-a944-5c6aa19e7d6d",
						"developmentAreaId": "7deb9606-744b-443a-8669-07af69216c74",
						"activityId": "db8deeaa-5690-43d1-a448-9e07eefd96e9",
						"hours": 5,
						"credit": 0,
						"exame": true,
						"critical": true,
						"participation": false,
						"cicle": 2,
						"year": 1,
						"createdAt": "2025-06-03T17:35:12.691Z",
						"updatedAt": "2025-06-03T17:35:12.691Z",
						"activity": {
							"id": "db8deeaa-5690-43d1-a448-9e07eefd96e9",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Portugues",
							"createdAt": "2025-06-03T17:28:16.009Z",
							"updatedAt": "2025-06-03T17:28:16.009Z"
						},
						"evolutions": [],
						"averageNormal": null,
						"averageWithExame": null
					},
					{
						"id": "e6fa3c5a-ee10-44ac-b894-b0d3dabec88c",
						"developmentAreaId": "7deb9606-744b-443a-8669-07af69216c74",
						"activityId": "887070dc-c7bb-457f-baeb-5c32c3a37da1",
						"hours": 5,
						"credit": 0,
						"exame": true,
						"critical": true,
						"participation": false,
						"cicle": 2,
						"year": 1,
						"createdAt": "2025-06-03T17:35:35.653Z",
						"updatedAt": "2025-06-03T17:35:35.653Z",
						"activity": {
							"id": "887070dc-c7bb-457f-baeb-5c32c3a37da1",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Matematica",
							"createdAt": "2025-06-03T17:28:25.979Z",
							"updatedAt": "2025-06-03T17:28:25.979Z"
						},
						"evolutions": [],
						"averageNormal": null,
						"averageWithExame": null
					}
				],
				"globalAverage": null
			},
			"3": {
				"total": 0,
				"count": 0,
				"activities": [
					{
						"id": "48837ea4-6f2e-4e70-af89-ea801770c82a",
						"developmentAreaId": "75a7ee06-5eef-472c-8c3b-31bb4691547",
						"activityId": "b03b1842-c722-4d2f-8d11-4e68039ae873",
						"hours": 4,
						"credit": 0,
						"exame": true,
						"critical": false,
						"participation": true,
						"cicle": 3,
						"year": 1,
						"createdAt": "2025-06-03T17:33:59.463Z",
						"updatedAt": "2025-06-03T17:33:59.463Z",
						"activity": {
							"id": "b03b1842-c722-4d2f-8d11-4e68039ae873",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Quimica",
							"createdAt": "2025-06-03T17:28:41.846Z",
							"updatedAt": "2025-06-03T17:28:41.846Z"
						},
						"evolutions": [],
						"averageNormal": null,
						"averageWithExame": null
					},
					{
						"id": "4852c1f3-6bef-42ce-8564-9760e4a0da40",
						"developmentAreaId": "75a7ee06-5eef-472c-8c3b-31bb4691547",
						"activityId": "be0ae62b-eae3-45b2-a791-0a7d8e0ce68b",
						"hours": 4,
						"credit": 0,
						"exame": false,
						"critical": false,
						"participation": false,
						"cicle": 3,
						"year": 1,
						"createdAt": "2025-06-03T17:34:33.496Z",
						"updatedAt": "2025-06-03T17:34:33.496Z",
						"activity": {
							"id": "be0ae62b-eae3-45b2-a791-0a7d8e0ce68b",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Biologia",
							"createdAt": "2025-06-03T17:28:50.390Z",
							"updatedAt": "2025-06-03T17:28:50.390Z"
						},
						"evolutions": [],
						"averageNormal": null,
						"averageWithExame": null
					},
					{
						"id": "a013c985-38f6-4e69-afe8-61bdce744622",
						"developmentAreaId": "75a7ee06-5eef-472c-8c3b-31bb4691547",
						"activityId": "03adf15d-f7d0-4319-bf29-a34cd53f20db",
						"hours": 2,
						"credit": 0,
						"exame": true,
						"critical": true,
						"participation": false,
						"cicle": 3,
						"year": 1,
						"createdAt": "2025-06-03T17:32:59.634Z",
						"updatedAt": "2025-06-03T17:32:59.634Z",
						"activity": {
							"id": "03adf15d-f7d0-4319-bf29-a34cd53f20db",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Fisica",
							"createdAt": "2025-06-03T17:28:34.232Z",
							"updatedAt": "2025-06-03T17:28:34.232Z"
						},
						"evolutions": [],
						"averageNormal": null,
						"averageWithExame": null
					},
					{
						"id": "66c21203-99fd-4155-98ca-105f0d281033",
						"developmentAreaId": "7deb9606-744b-443a-8669-07af69216c74",
						"activityId": "db8deeaa-5690-43d1-a448-9e07eefd96e9",
						"hours": 5,
						"credit": 0,
						"exame": true,
						"critical": true,
						"participation": false,
						"cicle": 3,
						"year": 1,
						"createdAt": "2025-06-03T17:35:12.692Z",
						"updatedAt": "2025-06-03T17:35:12.692Z",
						"activity": {
							"id": "db8deeaa-5690-43d1-a448-9e07eefd96e9",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Portugues",
							"createdAt": "2025-06-03T17:28:16.009Z",
							"updatedAt": "2025-06-03T17:28:16.009Z"
						},
						"evolutions": [],
						"averageNormal": null,
						"averageWithExame": null
					},
					{
						"id": "aa0bcf0c-6bd0-467c-b52b-3041a496d563",
						"developmentAreaId": "7deb9606-744b-443a-8669-07af69216c74",
						"activityId": "887070dc-c7bb-457f-baeb-5c32c3a37da1",
						"hours": 5,
						"credit": 0,
						"exame": true,
						"critical": true,
						"participation": false,
						"cicle": 3,
						"year": 1,
						"createdAt": "2025-06-03T17:35:35.653Z",
						"updatedAt": "2025-06-03T17:35:35.653Z",
						"activity": {
							"id": "887070dc-c7bb-457f-baeb-5c32c3a37da1",
							"institutionId": "4715c60e-a4ba-46d3-aeb2-e51a244017d0",
							"educationId": "6a88cc7a-77fe-4768-9317-142f4d719406",
							"name": "Matematica",
							"createdAt": "2025-06-03T17:28:25.979Z",
							"updatedAt": "2025-06-03T17:28:25.979Z"
						},
						"evolutions": [],
						"averageNormal": null,
						"averageWithExame": null
					}
				],
				"globalAverage": null
			}
		},
		"globalAverage": 16.1
	}
};

// Re-utilizando a função de processamento de dados acadêmicos
// (Certifique-se de que esta função esteja disponível, seja importada ou definida no mesmo arquivo)
const processedAcademicData = ref({});

function processarDadosAcademicos(data) {
  const resultados = {};
  let totalGlobalMediasFinais = 0;
  let countDisciplinasComMediaFinal = 0;
  let temNotaNegativa = false;
  const notaMinimaParaTransitar = 10;

  for (const yearKey in data) {
    const yearData = data[yearKey];

    if (yearData.cicles) {
      for (const cicleKey in yearData.cicles) {
        const cicleData = yearData.cicles[cicleKey]; // Correção crucial aqui

        if (cicleData.activities) {
          cicleData.activities.forEach(activity => {
            const disciplineName = activity.activity.name;

            if (!resultados[disciplineName]) {
              resultados[disciplineName] = {
                totalNotasNormais: 0,
                countNotasNormais: 0,
                notaExame: null,
                temExame: false,
                evolutionsExame: [],
                mediaFinalDisciplina: null
              };
            }

            if (activity.exame === true) {
                resultados[disciplineName].temExame = true;
            }

            if (activity.averageNormal !== null && typeof activity.averageNormal === 'number') {
              resultados[disciplineName].totalNotasNormais += activity.averageNormal;
              resultados[disciplineName].countNotasNormais += 1;
            }

            if (activity.evolutions && activity.evolutions.length > 0) {
              activity.evolutions.forEach(evolution => {
                if (evolution.courseEvolutionType && evolution.courseEvolutionType.evolutionType && evolution.courseEvolutionType.evolutionType.type === 'Exame') {
                  const exameNote = parseFloat(evolution.note);
                  if (!isNaN(exameNote)) {
                    resultados[disciplineName].notaExame = exameNote;
                    resultados[disciplineName].evolutionsExame.push({
                      note: evolution.note,
                      dateCompletion: evolution.dateCompletion,
                      evolutionTypeName: evolution.courseEvolutionType.evolutionType.name
                    });
                  }
                }
              });
            }
          });
        }
      }
    }
  }

  const mediasAnuaisFinais = {};
  for (const discipline in resultados) {
    const { totalNotasNormais, countNotasNormais, notaExame, temExame, evolutionsExame } = resultados[discipline];

    let mediaAnualAntesExame = countNotasNormais > 0 ? (totalNotasNormais / countNotasNormais) : 0;
    let mediaFinalCalculada;

    if (temExame) {
      const notaExameConsiderada = notaExame !== null ? notaExame : 0;
      mediaFinalCalculada = (2 * mediaAnualAntesExame + notaExameConsiderada) / 3;
    } else {
      mediaFinalCalculada = mediaAnualAntesExame;
    }

    totalGlobalMediasFinais += mediaFinalCalculada;
    countDisciplinasComMediaFinal += 1;

    if (mediaFinalCalculada < notaMinimaParaTransitar) {
        temNotaNegativa = true;
    }

    mediasAnuaisFinais[discipline] = {
      mediaAnualAntesExame: mediaAnualAntesExame.toFixed(2),
      mediaAnualDepoisExame: mediaFinalCalculada.toFixed(2),
      notaExame: notaExame !== null ? notaExame.toFixed(2) : '0.00',
      temExame: temExame,
      evolutionsExame: evolutionsExame,
      mediaFinalDisciplina: mediaFinalCalculada
    };
  }

  const mediaGlobalFinal = countDisciplinasComMediaFinal > 0 ? (totalGlobalMediasFinais / countDisciplinasComMediaFinal) : 0;

  let transitaDeClasse = false;
  if (mediaGlobalFinal >= notaMinimaParaTransitar && !temNotaNegativa) {
      transitaDeClasse = true;
  }

  return {
    disciplinas: mediasAnuaisFinais,
    mediaGlobalFinal: mediaGlobalFinal.toFixed(2),
    transitaDeClasse: transitaDeClasse,
    temNotaNegativa: temNotaNegativa,
    notaMinimaParaTransitar: notaMinimaParaTransitar
  };
}


onMounted(() => {
  processedAcademicData.value = processarDadosAcademicos(rawAcademicData);
});

// Nota: Você precisará de uma imagem 'mozambique_coat_of_arms.png'
// na pasta `src/assets` do seu projeto Quasar para que o emblema apareça.
</script>

<style lang="scss" scoped>
.certificate-page {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Alinha ao topo para certificados maiores */
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
}

.certificate-card {
  width: 100%;
  max-width: 800px; /* Largura ideal para um certificado */
  min-height: 1122px; /* Tamanho A4 aproximado (794px width for A4 at 96dpi) */
  background: white;
  padding: 40px;
  box-sizing: border-box;
  font-family: 'Times New Roman', serif; /* Fonte mais formal */
  color: #333;
  position: relative;
  // Borda decorativa (opcional)
  border: 5px double #a9a9a9;
  border-radius: 8px;
}

.coat-of-arms {
  max-width: 100px;
  height: auto;
  margin-right: 20px;
}

.certificate-title {
  color: #1a237e; /* Azul escuro para o título */
  font-size: 2.2em;
  margin-top: 0;
}

.certificate-details {
  line-height: 1.8;
  font-size: 1.1em;
}

.signatures {
  margin-top: 60px;
}

.signatures > div {
  width: 30%; // Ajuste para 3 colunas ou manter 2 e ajustar largura
  display: inline-block; // Para manter na mesma linha com q-gutter-md
}

.q-separator {
  background-color: #ccc;
  height: 2px;
}

.text-positive {
  color: #28a745; // Verde para sucesso
}
.text-negative {
  color: #dc3545; // Vermelho para insucesso
}
.text-info {
  color: #17a2b8; // Azul claro
}
.text-primary {
  color: #007bff; // Azul padrão Quasar
}
.text-success {
  color: #28a745;
}
.text-warning {
  color: #ffc107;
}

/* Estilos para impressão */
@media print {
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .certificate-page {
    padding: 0;
    margin: 0;
    box-shadow: none;
    background-color: white;
  }
  .certificate-card {
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    width: 210mm; /* A4 width */
    height: 297mm; /* A4 height */
    margin: 0;
    padding: 20mm; /* Margens para impressão */
  }
  .coat-of-arms {
    // Ajuste se necessário para impressão
  }
}
</style>
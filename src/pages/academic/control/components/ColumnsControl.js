import { useInstitutionStores } from "src/pages/institution/store";

export default function getColumns() {
  const institutionStore = useInstitutionStores();

  const istechnical = institutionStore.istechnical;
  const isInfantil = institutionStore.isInfantil;
  const isHigh = institutionStore.isHigh;
  const isFree = institutionStore.isFree

  return [
    { name: "name", label: "Disciplina", field: "name", align: "left" },
    istechnical || isFree && {
      name: "notas",
      label: "Notas",
      field: "notas",
      align: "left",
    },
    isHigh && { name: "notas", label: "Notas", field: "notas", align: "left" },

    isInfantil && {
      name: "observations",
      label: "Relatório Desenvolvimento",
      field: "observations",
      align: "left",
    },
    istechnical && {
      name: "situacao",
      label: "Media",
      field: "situacao",
      align: "left",
    },
    isHigh || isFree && {
      name: " ",
      label: "Media",
      field: "media",
      align: "left",
    },

    istechnical && {
      name: "exame",
      label: "Exame",
      field: "exame",
      align: "left",
    },
   
    {
      name: "situacao",
      label: "Situaçao",
      field: "situacao",
      align: "left",
    },
    { name: "actions", label: "Acções", field: "actions", align: "left" },
  ].filter(Boolean);
}

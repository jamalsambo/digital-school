
import { useInstitutionStores } from "src/pages/institution/store";

export default function getColumns() {
  const institutionStore = useInstitutionStores();

  const isInfantil = institutionStore.isInfantil;

  return [
    { name: "name", label: "Nome", field: "name", sortable: true, align: "left" },
    isInfantil  &&   {
      name: "minimumAge",
      label: "Idade minima",
      field: (row) => row?.minimumAge ?? 'Nao aplicavel',
      sortable: true,
      align: "left",
    },
    isInfantil  &&   {
      name: "maximumAge",
      label: "Idade maxima",
      field: (row) => row?.maximumAge ?? 'Nao aplicavel',
      sortable: true,
      align: "left",
    },
    { name: "actions", label: "Acções", field: "actions", align: "left" },
  ].filter(Boolean);
}

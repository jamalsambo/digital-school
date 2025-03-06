const columns = [
  {
    name: "name",
    align: "left",
    label: "Nome",
    field: "name",
    sortable: true,
  },
  {
    name: "vacancy_limit",
    align: "left",
    label: "Vagas",
    field: "vacancy_limit",
    sortable: false,
  },
  {
    name: "period",
    align: "left",
    label: "Periodo",
    field: "period",
    sortable: false,
  },
  {
    name: "startDate",
    align: "left",
    label: "Ano de Inicio",
    field: "startDate",
    sortable: false,
  },
  {
    name: "endDate",
    align: "left",
    label: "Ano de Termino",
    field: "endDate",
    sortable: false,
  },
  {
    name: "room",
    align: "left",
    label: "Sala",
    field: (row) => row?.room.name,
    sortable: false,
  },
  {
    name: "curriculum",
    align: "left",
    label: "Curriculum",
    field: (row) => row?.curriculum?.name,
    sortable: false,
  },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

export default columns;

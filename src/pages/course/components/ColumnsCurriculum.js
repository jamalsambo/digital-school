const columns = [
  {
    name: "name",
    align: "left",
    label: "Nome",
    field: "name",
    sortable: true,
  },
  {
    name: "status",
    align: "left",
    label: "Estado",
    field: "status",
    sortable: false,
  },
  {
    name: "mode",
    align: "left",
    label: "Modalidade",
    field: "mode",
    sortable: false,
  },
  {
    name: "startYear",
    align: "left",
    label: "Ano de Inicio",
    field: "startYear",
    sortable: false,
  },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

export default columns;

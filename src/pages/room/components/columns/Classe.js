const columns = [
  {
    name: "name",
    align: "left",
    label: "Nome",
    field: "name",
    sortable: true,
  },
  {
    name: "location",
    align: "left",
    label: "Localização",
    field: "location",
    sortable: false,
  },
  {
    name: "type",
    align: "left",
    label: "Tipo",
    field: "type",
    sortable: false,
  },
  {
    name: "availability",
    align: "left",
    label: "Disponibilidade",
    field: "availability",
    sortable: false,
  },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

export default columns;

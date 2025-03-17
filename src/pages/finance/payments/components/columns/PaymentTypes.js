const columns = [
  {
    name: "name",
    align: "left",
    label: "Nome",
    field: "name",
    sortable: true,
  },
  {
    name: "cicle",
    align: "left",
    label: "Ciclo de pagamentos",
    field: "cicle",
    sortable: false,
  },
  {
    name: "startDay",
    align: "left",
    label: "Dia de inicio de pagamentos",
    field: "startDay",
    sortable: false,
  },
  {
    name: "pondering",
    align: "left",
    label: "Dias ponderados",
    field: "pondering",
    sortable: false,
  },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

export default columns;

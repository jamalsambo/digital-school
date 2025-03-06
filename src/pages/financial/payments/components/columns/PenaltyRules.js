const columns = [
  {
    name: "daysMin",
    align: "left",
    label: "Intervalo de",
    field: "daysMin",
    sortable: true,
  },
  {
    name: "daysMax",
    align: "left",
    label: "Ate",
    field: "daysMax",
    sortable: false,
  },
  {
    name: "penaltyRate",
    align: "left",
    label: "Aplicar multa de:",
    field: "penaltyRate",
    sortable: false,
  },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

export default columns;

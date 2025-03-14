const columns = [
  {
    name: "number",
    align: "left",
    label: "Número",
    field: "number",
    sortable: true,
  },
  {
    name: "classe",
    align: "left",
    label: "Turma",
    field: (row) => row?.classe?.name,
    sortable: true,
  },
  {
    name: "paymentId",
    align: "left",
    label: "Pagamento",
    field: (row) => row?.paymentId? "Feito": "Aguardando",
    sortable: false,
  },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

export default columns;

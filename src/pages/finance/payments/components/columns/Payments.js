const columns = [
  {
    name: "month",
    align: "left",
    label: "Mes Referente",
    field: (row) => row.month.month,
    sortable: true,
  },
  {
    name: "amount",
    align: "left",
    label: "Valor de Mensalidade",
    field: (row) => row.payment.amount,
    sortable: true,
  },
  {
    name: "status",
    align: "left",
    label: "Estado",
    field: (row) => row.payment.status || "Pendente",
    sortable: true,
  },
  {
    name: "penalts",
    align: "left",
    label: "Multa?",
    field: (row) => row?.payment?.penalts,
    sortable: true,
  },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

export default columns;

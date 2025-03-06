const columns = [
  {
    name: "name",
    align: "left",
    label: "Tipo de pagamento",
    field: (row) => row?.paymentType?.name,
    sortable: false,
  },
  {
    name: "amount",
    align: "left",
    label: "Valor de pagamento",
    field: "amount",
    sortable: true,
  },

  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

export default columns;

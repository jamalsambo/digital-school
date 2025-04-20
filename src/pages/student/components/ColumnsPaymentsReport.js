const columns = [
  {
    name: "month",
    required: true,
    label: "Mês",
    align: "left",
    field: "month",
  },
  {
    name: "paymentType",
    required: true,
    label: "Tipo de pagamento",
    align: "left",
    field: (row) => row.paymentType.name,
  },
  {
    name: "status",
    label: "Status do Pagamento",
    align: "center",
    field: "status",
  },
  {
    name: "paidAmount",
    label: "Valor pago",
    align: "center",
    field: "paidAmount",
  },
];

export default columns

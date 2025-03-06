import scripts from "src/composables/Scripts"

const {formatDate } = scripts()
const columns = [
  // {
  //     name: "description",
  //     align: "left",
  //     label: "Pagamento",
  //     field: "description",
  //     sortable: true,
  //   },
    {
      name: "Documento",
      align: "left",
      label: "Documento",
      field: (row) => row.invoiceNumber,
      sortable: true,
    },
    {
      name: "paymentDate",
      align: "left",
      label: "Date de pagamento",
      field: (row) => formatDate(row.paymentDate),
      sortable: true,
    },
    {
      name: "paymentMethod",
      align: "left",
      label: "Metodo de pagamento",
      field: (row) => row.paymentMethod,
      sortable: true,
    },
    {
      name: "amount",
      align: "left",
      label: "Valor pago",
      field: (row) => row.totalValue,
      sortable: true,
    },
  { name: "actions", align: "left", label: "Ações", field: "actions" },

  ]


  export default columns

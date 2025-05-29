const columns = [
  { name: "name", label: "Nome", field: "name", sortable: true, align: "left" },
  { name: "stock", label: "Stock", field: (row) => row?.stock.quantity, sortable: true, align: "left" },
]

export default columns

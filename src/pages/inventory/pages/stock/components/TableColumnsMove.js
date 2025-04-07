const columns = [
  { name: "type", label: "Produto", field: (row) => row.product.name, sortable: true, align: "left" },
  { name: "type", label: "Tipo", field: "type", sortable: true, align: "left" },
  { name: "quantity", label: "Quantidade", field: "quantity", sortable: true, align: "left" },
  { name: "reference", label: "Referencia", field: "reference", sortable: true, align: "left" },
  { name: "location", label: "Armazem", field: "location", sortable: true, align: "left" },
]

export default columns

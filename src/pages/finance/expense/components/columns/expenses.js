
const columns = [
  {
    name: "name",
    label: "name",
    field: "description",
    sortable: true,
    align: "left"
  },
  {
    name: "category",
    label: "Categoria",
    field: (row) => row.category.name,
    sortable: true,
    align: "left"
  },
  {
    name: "amount",
    label: "Valor",
    field: (row) => row.amount,
    sortable: true,
    align: "left"
  }
]

export default columns

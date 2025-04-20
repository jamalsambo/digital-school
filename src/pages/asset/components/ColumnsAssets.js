const columns = [
  { name: "assetTag", align: "left", label: "Codigo", field: "assetTag", sortable: true },
  { name: "name", align: "left", label: "Nome", field: "name", sortable: true },
  { name: "block", align: "left", label: "Categoria", field: (row) => row.category.name, sortable: true },
  { name: "condition", align: "left", label: "Codiçao", field: "condition", sortable: true },
  { name: "location", align: "left", label: "Local", field: (row) => row.location.name, sortable: true },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
]

export default columns
const columns = [
  { name: "name", label: "Nome", field: "name", sortable: true, align: "left" },
  { name: "price", label: "Preço", field: "price", sortable: true, align: "left" },
  { name: "name", label: "Nivel Educacional", field: (row) => row?.educationLevel?.name, sortable: true, align: "left" },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
]

export default columns;

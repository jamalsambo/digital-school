const columns = [
  { name: "name", label: "Nome", field: (row) => row.evolutionType?.name, sortable: true, align: "left" },
  { name: "weight", label: "Carga", field: 'weight', sortable: true, align: "left" },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
]

export default columns;


const columns = [
  { name: "name", align: "left", label: "Nome", field: "name", sortable: true },
  {
    name: "status",
    align: "left",
    label: "Estado",
    field: "status",
    sortable: true,
  },
  {
    name: "district",
    align: "left",
    label: "Localizacao",
    field: (row) => row?.district?.name,
    sortable: true,
  },
  {
    name: "district",
    align: "left",
    label: "Filial?",
    field: (row) => (row?.parentId ? "sucursal" : "Sede"),
    sortable: true,
  },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

export default columns

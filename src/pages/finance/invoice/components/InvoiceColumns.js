import scripts from "src/composables/Scripts";
const { formatDate } = scripts()
const columns = [
  {
    name: "number",
    label: "Código",
    field:  (row) => row.number,
    sortable: true,
    align: "left",
  },
  {
    name: "note",
    label: "Produto",
    field:  (row) => row.note,
    sortable: true,
    align: "left",
  },
  {
    name: "originalTotal",
    label: "Valor Original",
    field: "originalTotal",
    sortable: true,
    align: "left",
  },
  {
    name: "totalToPay",
    label: "Valor Total",
    field: "totalToPay",
    sortable: true,
    align: "left",
  },
  {
    name: "status",
    label: "Estado",
    field: (row) => row.status,
    sortable: true,
    align: "left",
  },
  {
    name: "dueDate",
    label: "Data limite",
    field: (row) => row?.dueDate? formatDate(row?.dueDate) : '',
    sortable: true,
    align: "left",
  },
  { name: "actions", label: "Ações", align: "center" }
];
export default columns

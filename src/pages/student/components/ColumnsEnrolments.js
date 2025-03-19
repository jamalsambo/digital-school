const columns = [
  {
    name: "number",
    align: "left",
    label: "Número",
    field: "number",
    sortable: true,
  },
  {
    name: "classe",
    align: "left",
    label: "Turma",
    field: (row) => row?.classe?.name,
    sortable: true,
  },
  {
    name: "course",
    align: "left",
    label: "Estagio",
    field: (row) => row?.classe?.course.name,
    sortable: true,
  },
];

export default columns;

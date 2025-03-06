// src/pages/curriculum-plan/columns.js

export const columns = [
  { name: "name", align: "left", label: "Nome", field: "name", sortable: true },
  {
    name: "course",
    align: "left",
    label: "Curso",
    field: (row) => row.course.name,
    sortable: false,
  },
  {
    name: "startYear",
    align: "left",
    label: "Ano de Início",
    field: "startYear",
    sortable: true,
  },
  {
    name: "endYear",
    align: "left",
    label: "Ano de Término",
    field: "endYear",
    sortable: true,
  },
  {
    name: "totalHours",
    align: "left",
    label: "Total de Horas",
    field: "totalHours",
    sortable: true,
  },
  {
    name: "totalCredits",
    align: "left",
    label: "Total de Créditos",
    field: "totalCredits",
    sortable: true,
  },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

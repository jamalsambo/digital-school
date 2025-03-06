const columns = [
  {
    name: "number",
    align: "left",
    label: "Número do Estudante",
    field: "number",
    sortable: true,
  },
  {
    name: "fullName",
    align: "left",
    label: "Nome Completo",
    field: (row) => row?.basic_information?.fullName,
    sortable: false,
  },
  {
    name: "fullName",
    align: "left",
    label: "Nome Completo",
    field: (row) => row?.basic_information?.dateBirth,
    sortable: false,
  },
  {
    name: "gender",
    align: "left",
    label: "Gênero",
    field: (row) => row?.basic_information?.gender,
    sortable: false,
  },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

export default columns;

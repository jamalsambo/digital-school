const columns = [
  { name: "name", label: "Nome", field: "name", sortable: true, align: "left" },
  {
    name: "minimumAge",
    label: "Idade minima",
    field: (row) => row?.minimumAge ?? 'Nao aplicavel',
    sortable: true,
    align: "left",
  },
  {
    name: "maximumAge",
    label: "Idade maxima",
    field: (row) => row?.maximumAge ?? 'Nao aplicavel',
    sortable: true,
    align: "left",
  },
  {
    name: "tuitionFee",
    label: "Valor de mendalidade",
    field: "tuitionFee",
    sortable: true,
    align: "left",
  },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
];

export default columns;

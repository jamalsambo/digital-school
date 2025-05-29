const columns = [
  {
    name: "name",
    align: "left",
    label: "Nome",
    field: "name",
    sortable: true,
  },
  {
    name: "leader",
    label: "Líder do Grupo",
    field: row => row.StudentTeamLeader?.basicInformation?.fullName || '—',
    sortable: false,
    align: "left"
  }
  ,
  {
    name: "actions",
    align: "left",
    label: "Ações",
    field: "actions",
  },
];

export default columns;

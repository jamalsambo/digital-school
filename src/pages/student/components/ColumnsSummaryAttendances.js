const columns = [
  {
    name: "month",
    required: true,
    label: "Mês",
    align: "left",
    field: "month",
  },
  {
    name: "totalDays",
    label: "Dias Totais",
    align: "center",
    field: "totalDays",
  },
  {
    name: "presences",
    label: "Presenças",
    align: "center",
    field: "presences",
  },
  {
    name: "absences",
    label: "Faltas",
    align: "center",
    field: "absences",
  },
  {
    name: "attendanceRate",
    label: "Taxa de Presença",
    align: "center",
    field: "attendanceRate",
  },
];

export default columns

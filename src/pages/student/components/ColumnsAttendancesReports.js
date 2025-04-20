const columns = [
  {
    name: "day",
    required: true,
    label: "Dia",
    align: "left",
    field: (row) => row.classAttendance.classDate,
  },
  {
    name: "status",
    label: "Status",
    align: "center",
    field: "status",
  },
  {
    name: "discipline",
    label: "Disciplina",
    align: "center",
    field: (row) => row.classAttendance.discipline.name
  },
  {
    name: "justification",
    label: "Justificativa",
    align: "center",
    field: "justification",
  },
];

export default columns

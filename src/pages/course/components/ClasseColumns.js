const columns = [
  { name: "name", label: "Nome", field: "name", sortable: true, align: "left" },
  { name: "period", label: "Periodo", field: (row) => `${row?.period?.start} - ${row?.period?.end}`, sortable: true, align: "left" },
  { name: "vacancyLimit", label: "Capacidade", field: "vacancyLimit", sortable: true, align: "left" },
  { name: "startDate", label: "Data de inicio", field: "startDate", sortable: true, align: "left" },
  { name: "endDate", label: "Data de termino", field: "endDate", sortable: true, align: "left" },
  { name: "actions", align: "left", label: "Ações", field: "actions" },
]

export default columns;


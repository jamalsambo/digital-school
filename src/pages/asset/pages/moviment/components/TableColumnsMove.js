const columns = [
  { name: "asset", label: "Patrimonio", field: (row) => row.asset.name, sortable: true, align: "left" },
  { name: "from", label: "Movido de:", field: (row) => row.currentLocation.name, sortable: true, align: "left" },
  { name: "to", label: "Para:", field: (row) => row.destination.name, sortable: true, align: "left" },
  { name: "employee", label: "Fuuncionario", field: (row) => row.employee.basicInformation.fullName, sortable: true, align: "left" },
]

export default columns

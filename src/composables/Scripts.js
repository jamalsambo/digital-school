export default function scripts() {
  const determineRegime = (startDate, endDate, renew) => {
    // Converter as datas para objetos Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calcular a diferença total em meses
    const totalMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    // Determinar o regime com base no intervalo de renovação
    if (renew === 6) {
      return "Semestral";
    } else if (renew === 3) {
      return "Trimestral";
    } else if (renew === 12) {
      return "Anual";
    } else if (renew === 1) {
      return "Mensal";
    } else {
      // Calcular o número de renovações possíveis no período total
      const numRenovations = totalMonths / renew;

      return `Regime customizado: ${renew}-meses (${numRenovations.toFixed(
        1
      )} renovações no período)`;
    }
  };

  const getRegimeName = (regime) => {
    switch (regime) {
      case 3:
        return "Trimestre";
      case 2:
        return "Semestre";
      case 1:
        return "Anual";
      default:
        return "Unico";
    }
  };

  const getActualRegime = (regime) => {
    const month = new Date().getMonth() + 1;
    if ((regime === 3)) {
      if (month <= 5) return 1;
      if (month <= 8) return 2;
      if (month <= 9) return 3;
    } else {
      return month <= 6 ? 1 : 2;
    }
  };

  const addMinutes = (timeString, duration) => {
    // Converter o tempo para um objeto Date
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const date = new Date();
    // Definir horas, minutos e segundos corretamente
    date.setHours(hours, minutes, seconds);
    // Adicionar a duração em minutos
    date.setMinutes(date.getMinutes() + duration);
    // Retornar o horário atualizado no formato "HH:mm:ss"
    return date.toTimeString().slice(0, 8);
  };

  const generateTimeSlots = (data) => {
    const { start, duration, times, normalRange, largeRange, largeRangeTime } =
      data;

    const timeSlots = [];
    let [hours, minutes, segunds] = start.split(":").map(Number);

    for (let i = 1; i <= times; i++) {
      // Adiciona o horário atual ao array
      timeSlots.push(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(segunds).padStart(2, "0")}`
      );

      // Adiciona a duração da aula
      minutes += duration;

      // Adiciona o intervalo correto (normalRange ou largeRangeTime)
      if (i === largeRange) {
        minutes += largeRangeTime;
      } else {
        minutes += normalRange;
      }

      // Ajusta as horas e minutos ao ultrapassar 60 minutos
      if (minutes >= 60) {
        hours += Math.floor(minutes / 60);
        minutes %= 60;
      }
    }

    return timeSlots;
  };

  const filterFn = (val, update, values) => {
    return new Promise((resolve) => {
      if (val === "") {
        update(() => {
          resolve(values);
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        const filtered = values.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
        resolve(filtered);
      });
    });
  };
  /* Funcao para encontrar matricula */
  const filterEnrollmentsByYear = (enrollments, year) => {
    return enrollments.find((enrollment) => {
      const enrollmentYear = new Date(enrollment.createdAt).getFullYear();
      return enrollmentYear === year;
    });
  };
  const getActiveClass = (enrollments) => {
    const today = new Date();

    return (
      enrollments.find((enrollment) => {
        const { startDate, endDate } = enrollment.classe;

        const start = new Date(startDate);
        const end = new Date(endDate);
        console.log(end);
        return today >= start && today <= end;
      })?.classe || null
    );
  };

  /* Funcao para formatar data */
  const formatDate = (dateString) => {
    const dataISO = dateString;
    const data = new Date(dataISO);

    // Usar métodos UTC para evitar conversão automática
    const ano = data.getUTCFullYear();
    const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
    const dia = String(data.getUTCDate()).padStart(2, "0");
    const horas = String(data.getUTCHours()).padStart(2, "0");
    const minutos = String(data.getUTCMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${ano} ${horas}:${minutos}`; // 28/01/2025 21:06
  };

  // funcao pra escrever numero em extenso
  const numberForExtension = (numero) => {
    const unidades = [
      "",
      "um",
      "dois",
      "três",
      "quatro",
      "cinco",
      "seis",
      "sete",
      "oito",
      "nove",
      "dez",
      "onze",
      "doze",
      "treze",
      "catorze",
      "quinze",
      "dezasseis",
      "dezassete",
      "dezoito",
      "dezanove",
    ];

    const dezenas = [
      "",
      "",
      "vinte",
      "trinta",
      "quarenta",
      "cinquenta",
      "sessenta",
      "setenta",
      "oitenta",
      "noventa",
    ];

    const centenas = [
      "",
      "cento",
      "duzentos",
      "trezentos",
      "quatrocentos",
      "quinhentos",
      "seiscentos",
      "setecentos",
      "oitocentos",
      "novecentos",
    ];

    // Função auxiliar para números até 999
    function converterCentenas(num) {
      if (num === 0) return "";
      if (num === 100) return "cem";

      let extenso = "";
      const c = Math.floor(num / 100);
      const resto = num % 100;

      if (c > 0) extenso += centenas[c];
      if (resto > 0) {
        if (c > 0) extenso += " e ";
        if (resto < 20) {
          extenso += unidades[resto];
        } else {
          const d = Math.floor(resto / 10);
          const u = resto % 10;
          extenso += dezenas[d];
          if (u > 0) extenso += " e " + unidades[u];
        }
      }

      return extenso;
    }

    // Caso especial para zero
    if (numero === 0) return "zero";

    let extensoFinal = "";
    const escalas = [
      "",
      " mil",
      " milhão",
      " milhões",
      " mil milhões",
      " biliões",
    ];
    let escalaIdx = 0;

    while (numero > 0) {
      const grupo = numero % 1000;
      if (grupo > 0) {
        let parte = converterCentenas(grupo);
        // Tratamento para "um mil"
        if (escalaIdx === 1 && grupo === 1) parte = "mil";
        else if (escalaIdx > 1 && grupo === 1) parte = "um";
        extensoFinal =
          parte +
          escalas[escalaIdx] +
          (extensoFinal ? " e " + extensoFinal : "");
      }
      numero = Math.floor(numero / 1000);
      escalaIdx++;
    }

    return extensoFinal.trim();
  };
  /* funcao para retornar primeiro e ultimo nome */
  const getFirstAndLastName = (fullName) => {
    const parts = fullName.trim().split(" ");
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];

    return { firstName, lastName };
  };

  const getNotasPorRegime = (evolution, regime, discipline, year = null) => {
    console.log(discipline)
    return evolution
    .filter(({ developmentAreaActivityId, year: y, cicle: c }) => {
        // Se cicle e year foram passados, ignora monthDay e filtra com eles
        return c === regime && y === year && developmentAreaActivityId === discipline;

    })
    .map((note) => note);

  };

  const formatToMZN = (value) => {
    return value.toLocaleString("pt-MZ", {
      style: "currency",
      currency: "MZN",
    });
  };

  const getProgramName = (name) => {
    switch (name) {
      case "internships":
        return "Estagios";
      case "classes":
        return "classes";
      case "classes":
        return "classes";
      case "courses":
        return "Cursos";
      default:
        return "help_outline";
    }
  };

  const getNameForDiscipline = (name) => {
    switch (name) {
      case "activities":
        return "Actividade";
      case "disciplines":
        return "Disciplina";
      default:
        return "Disciplines";
    }
  };

  const getNameForDisciplineEducation = (name) => {
    switch (name) {
      case "Ensino Infantil":
        return "Actividades";
      case "disciplines":
        return "Disciplina";
      default:
        return "Disciplines";
    }
  };

  const  getCurrentYearOfProgram =(startDate, endDate, currentDate = new Date()) =>{
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(currentDate);
    console.log(start)

    if (current < start) return 0; // Ainda não começou
    if (current > end) return -1; // Já terminou

    const diffYears = (current - start) / (1000 * 60 * 60 * 24 * 365.25); // anos com fração

    return Math.floor(diffYears) + 1;
  }

  const enumerateProgramYears = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffYears = Math.floor((end - start) / (1000 * 60 * 60 * 24 * 365.25)); // calcula anos inteiros
    const totalYears = diffYears + 1; // +1 para incluir o ano de início

    return Array.from({ length: totalYears }, (_, i) => i + 1);
  }



  return {
    determineRegime,
    addMinutes,
    generateTimeSlots,
    filterFn,
    filterEnrollmentsByYear,
    formatDate,
    numberForExtension,
    getFirstAndLastName,
    getNotasPorRegime,
    formatToMZN,
    getProgramName,
    getNameForDiscipline,
    getNameForDisciplineEducation,
    getActiveClass,
    getRegimeName,
    getActualRegime,
    getCurrentYearOfProgram,
    enumerateProgramYears
  };
}

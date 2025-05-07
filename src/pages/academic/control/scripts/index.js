export default function ControlAcademicScripts() {
  const groupedDisciplineByYearAndCicle = (curriculum, evolutions) => {
    const groupedByYearAndCicle = {};

    curriculum.developmentAreas.forEach((area) => {
      area.developmentAreaActivities.forEach((dev) => {
        const { cicle, year } = dev;

        // Garante que o ano exista no objeto
        if (!groupedByYearAndCicle[year]) {
          groupedByYearAndCicle[year] = {};
        }

        // Garante que o ciclo exista dentro do ano
        if (!groupedByYearAndCicle[year][cicle]) {
          groupedByYearAndCicle[year][cicle] = [];
        }

        // Filtra as evoluções relacionadas
        const relatedEvolutions = evolutions.filter(
          (e) =>
            e.developmentAreaActivityId === dev.id &&
            parseInt(e.cicle) === parseInt(dev.cicle)
        );

        // Adiciona a atividade agrupada
        groupedByYearAndCicle[year][cicle].push({
          id: dev.id,
          name: dev.activity.name,
          cicle: dev.cicle,
          year: dev.year,
          exame: dev.exame,
          critical: dev.critical,
          participation: dev.participation,
          evolutions: relatedEvolutions,
        });
      });
    });

    return Object.entries(groupedByYearAndCicle).map(([year, cicles]) => ({
      year: Number(year),
      cicles: Object.entries(cicles).map(([cicle, activities]) => ({
        cicle: Number(cicle),
        activities,
      })),
    }));
  };

  const finalAveragesDisciplines = (evolutions, evolutionTypeExame, regime) => {
    const grouped = {};

    evolutions.forEach((e) => {
      const id = e.developmentAreaActivityId
      const name = e.developmentAreaActivity?.activity?.name;
      const exame = e.developmentAreaActivity.exame;
      const critical = e.developmentAreaActivity.critical;
      const participation = e.developmentAreaActivity.participation;

      if (!grouped[name]) {
        grouped[name] = {
          id: id,
          name: name,
          evolutions: [],
          exame: exame,
          critical: critical,
          participation: participation,
          examEvolutions: [],
        };
      }

      grouped[name].evolutions.push({ note: e.note, perception: e.perception, observation: e.observations });

      if (evolutionTypeExame.includes(e.testTypeId) && e.perception === 100) {
        grouped[name].examEvolutions.push({
          note: e.note,
          evolutionType: e.evolutionType.name,
        });
      }
    });

    // Calcular média apenas das disciplinas com exame
    const result = [];
    let status = "";

    Object.values(grouped).forEach((group) => {
      let totalWeighted = 0;

      group.evolutions.forEach((evo) => {
        const note = parseFloat(evo.note);
        const perc = parseFloat(evo.perception);
        if (perc !== 100)
          if (!isNaN(note) && !isNaN(perc)) {
            totalWeighted += note * perc;
          }
      });

      const finalAverage = totalWeighted / 100 / regime;

      if (finalAverage >= 14) {
        status = "Dispensado";
      } else if (finalAverage >= 10) {
        if (group.exame) {
          status = "Admitido";
        } else {
          status = "Aprovado";
        }
      } else {
        if (group.exame) {
          status = "Excluido";
        } else {
          status = "Reprovado";
        }
      }

      result.push({
        id: group.id,
        discipline: group.name,
        exame: group.exame,
        observation: group.observation,
        finalAverage: finalAverage.toFixed(1),
        status: status,
        examEvolutions: group.examEvolutions,
        critical: group.critical,
        participation: group.participation,
      });
    });

    return result;
  };

  const getFinalGradeStatus = (evolutions) => {
    if (!evolutions || evolutions.length === 0) {
      return { approved: false, label: "Sem dados" };
    }

    let somaNotasPonderadas = 0;
    let somaPercentagens = 0;

    evolutions
    .filter((e) => e.evolutionType.type === 'Normal')
    .forEach((e) => {
      const nota = parseFloat(e.note);
      const perc = parseFloat(e.perception);

      if (!isNaN(nota) && !isNaN(perc)) {
        somaNotasPonderadas += nota * perc;
        somaPercentagens += perc;
      }
    });


    if (somaPercentagens === 0) {
      return { approved: false, label: "Sem percentagem" };
    }

    const mediaFinal = somaNotasPonderadas / 100;
    const isApproved = mediaFinal >= 10;

    return {
      approved: isApproved,
      mediaFinal: mediaFinal.toFixed(1),
      label: `${isApproved ? "Aprovado" : "Reprovado"} (${mediaFinal.toFixed(
        1
      )})`,
    };
  };

  const getColor = (score) => {
    if (score >= 9) return "green";
    if (score >= 7) return "orange";
    return "red";
  };

  return {
    groupedDisciplineByYearAndCicle,
    finalAveragesDisciplines,
    getFinalGradeStatus,
    getColor,
  };
}

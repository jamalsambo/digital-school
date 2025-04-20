export default function scripts() {
  const groupedByCicleFinalNotes = (evolutions) => {
    const result = {};

    evolutions.forEach((item) => {
      const cicle = `Ciclo ${item.cicle}`; // ex: "Ciclo 1"
      const disciplineName = item.developmentAreaActivity.activity.name; // <- usa nome fixo aqui porque os dados não têm `activity.name`

      if (!result[cicle]) {
        result[cicle] = {};
      }

      if (!result[cicle][disciplineName]) {
        result[cicle][disciplineName] = {
          notes: [],
          avg: 0,
        };
      }

      result[cicle][disciplineName].notes.push({
        note: Number(item.note),
        type: item.testTypeId,
      });
    });

    // Calcular a média
    Object.keys(result).forEach((cicle) => {
      Object.keys(result[cicle]).forEach((discipline) => {
        const notes = result[cicle][discipline].notes;
        const avg = notes.reduce((acc, n) => acc + n.note, 0) / notes.length;
        result[cicle][discipline].avg = avg.toFixed(2);
      });
    });

    return result;
  }

  return {
    groupedByCicleFinalNotes
  }
}

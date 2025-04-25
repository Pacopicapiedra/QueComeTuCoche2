// Reinicia os datos se cambia o modelo ou os km iniciais, con confirmación
function resetSeModeloCambia() {
  const nuevoModelo = $("modelo").value;
  const nuevosKm    = $("kmInicio").value;

  // Se hai rexistros e cambias algo, preguntámosche
  if (datos.registros.length > 0 
      && (nuevoModelo !== datos.modelo 
       || nuevosKm   !== datos.kmInicio)) {
    const msg = `¡Olla! Cambiar modelo ou km borrará ${datos.registros.length} rexistros.\n¿Queres seguir?`;
    if (!confirm(msg)) {
      // Se cancelas, devolvemos os valores orixinais
      $("modelo").value  = datos.modelo;
      $("kmInicio").value = datos.kmInicio;
      return;
    }
  }

  // Logo, se confirmou ou non había rexistros, facemos o reset estándar
  if (nuevoModelo !== datos.modelo || nuevosKm !== datos.kmInicio) {
    if (datos.registros.length > 0) {
      datos.historico.push({
        modelo: datos.modelo,
        kmInicio: datos.kmInicio,
        registros: datos.registros
      });
    }
    datos.modelo   = nuevoModelo;
    datos.kmInicio = nuevosKm;
    datos.registros         = [];
    datos.ultimaRuedaDel    = null;
    datos.ultimaRuedaTra    = null;
    datos.kmPreviosDel      = 0;
    datos.kmPreviosTra      = 0;
    datos.ultimaMantenimiento = null;
    guardarDatos();
    renderResumen();
  }
}

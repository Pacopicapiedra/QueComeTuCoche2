// docs/main.js
// (...mantense o inicio sen cambios...)

function renderFormulario() {
  const tipo = $("tipo").value;
  let html = "";

  if (tipo === "combustible") {
    html += '<label>Kilómetros:<input type="number" id="km" /></label>';
    html += '<label>Litros:<input type="number" id="litros" /></label>';
    html += '<label>Coste (€):<input type="number" id="coste" /></label>';

  // Agrupamos Avería, Mantenimiento e os novos tipos
  } else if (
    tipo === "mantenimiento" ||
    tipo === "averia" ||
    tipo === "lavado" ||
    tipo === "peajes" ||
    tipo === "gastosvarios"
  ) {
    html += '<label>Kilómetros:<input type="number" id="km" /></label>';
    html += '<label>Coste (€):<input type="number" id="coste" /></label>';
    html += '<label>Concepto:<input type="text" id="detalle" /></label>';

  } else if (tipo === "neumatico") {
    html += '<label>Kilómetros (odómetro actual):<input type="number" id="km" /></label>';
    html += '<label>Coste (€):<input type="number" id="coste" /></label>';
    html += '<label>Posición (delantero/trasero):<input type="text" id="detalle" /></label>';
    html += '<label>Modelo del neumático:<input type="text" id="modeloNeumatico" /></label>';
    html += '<label>Km previos del neumático:<input type="number" id="kmPrevios" /></label>';

  } else if (tipo === "papeles") {
    html += '<label>Coste (€):<input type="number" id="coste" /></label>';
    html += '<label>Concepto:<input type="text" id="detalle" /></label>';
  }

  $("formulario").innerHTML = html;
}

// (...o resto do ficheiro queda igual, xa que guardarRegistro e renderResumen xestionan genérico todos os tipos...)

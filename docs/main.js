// Datos persistidos en localStorage
let datos = JSON.parse(localStorage.getItem("ctg_data")) || {
  modelo: "",
  kmInicio: "",
  registros: [],
  historico: [],
  ultimaRuedaDel: null,
  ultimaRuedaTra: null,
  kmPreviosDel: 0,
  kmPreviosTra: 0,
  ultimaMantenimiento: null
};

// Vars para confirm reset
let prevModelo = datos.modelo;
let prevKmInicio = datos.kmInicio;
$("modelo").addEventListener("focus", ()=> prevModelo = $("modelo").value);
$("kmInicio").addEventListener("focus", ()=> prevKmInicio = $("kmInicio").value);

// Función para acceder aos elementos
const $ = (id) => document.getElementById(id);

// Gardar os datos en localStorage
function guardarDatos() {
  localStorage.setItem("ctg_data", JSON.stringify(datos));
}

// Renderiza o formulario segundo o tipo de gasto
function renderFormulario() {
  const tipo = $("tipo").value;
  let html = "";

  if (tipo === "combustible") {
    html += '<label>Kilómetros:<input type="number" id="km" /></label>';
    html += '<label>Litros:<input type="number" id="litros" /></label>';
    html += '<label>Coste (€):<input type="number" id="coste" /></label>';
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

// Reinicia os datos se cambia o modelo ou os km iniciais
function resetSeModeloCambia() {
  const nuevoModelo = $("modelo").value;
  const nuevosKm = $("kmInicio").value;
  if (datos.registros.length > 0 && (nuevoModelo !== datos.modelo || nuevosKm !== datos.kmInicio)) {
    const msg = `¡Olla! Cambiar modelo ou km fara que se borren ${datos.registros.length} rexistros.
¿Segues adiante?`;
    if (!confirm(msg)) {
      $("modelo").value = prevModelo;
      $("kmInicio").value = prevKmInicio;
      return;
    }
    datos.historico.push({ modelo: datos.modelo, kmInicio: datos.kmInicio, registros: datos.registros });
    datos.modelo = nuevoModelo;
    datos.kmInicio = nuevosKm;
    datos.registros = [];
    datos.ultimaRuedaDel = null;
    datos.ultimaRuedaTra = null;
    datos.kmPreviosDel = 0;
    datos.kmPreviosTra = 0;
    datos.ultimaMantenimiento = null;
    prevModelo = nuevoModelo;
    prevKmInicio = nuevosKm;
    guardarDatos();
    renderResumen();
  }
}

    datos.modelo = $("modelo").value;
    datos.kmInicio = $("kmInicio").value;
    datos.registros = [];
    datos.ultimaRuedaDel = null;
    datos.ultimaRuedaTra = null;
    datos.kmPreviosDel = 0;
    datos.kmPreviosTra = 0;
    datos.ultimaMantenimiento = null;
    guardarDatos();
    renderResumen();
  }
}

// Función que guarda o rexistro introducido
function guardarRegistro() {
  const tipo = $("tipo").value;
  const fecha = new Date().toISOString().split("T")[0];
  const r = {
    tipo,
    fecha,
    km: $("km")?.value || "",
    coste: $("coste")?.value || "",
    detalle: $("detalle")?.value || "",
    litros: "",
    modeloNeumatico: "",
    kmPrevios: ""
  };

  if (tipo === "combustible") {
    r.litros = $("litros")?.value || "";
  }
  if (tipo === "neumatico") {
    r.modeloNeumatico = $("modeloNeumatico")?.value || "";
    r.kmPrevios = $("kmPrevios")?.value || "0";

    const kmVal = parseFloat(r.km) || 0;
    const kmPrevVal = parseFloat(r.kmPrevios) || 0;
    const pos = r.detalle.toLowerCase();
    if (pos.includes("del")) {
      // Resetea os rexistros de neumáticos delanteros previos
      datos.registros = datos.registros.filter(x => !(x.tipo === "neumatico" && x.detalle.toLowerCase().includes("del")));
      datos.ultimaRuedaDel = kmVal;
      datos.kmPreviosDel = kmPrevVal;
    }
    if (pos.includes("tra")) {
      // Resetea os rexistros de neumáticos traseros previos
      datos.registros = datos.registros.filter(x => !(x.tipo === "neumatico" && x.detalle.toLowerCase().includes("tra")));
      datos.ultimaRuedaTra = kmVal;
      datos.kmPreviosTra = kmPrevVal;
    }
  }
  if (tipo === "mantenimiento") {
    const kmVal = parseFloat(r.km) || 0;
    // Actualiza o último mantenimiento (reinicia o conteo)
    datos.ultimaMantenimiento = kmVal;
  }

  datos.registros.push(r);
  guardarDatos();
  renderResumen();
  $("formulario").innerHTML = "";
}

// Renderiza o resumo global e os rexistros gardados
function renderResumen() {
  let html = "<h3>Resumen actual</h3>";
  let kmInicio = parseFloat(datos.kmInicio) || 0;
  let finalKm = kmInicio;
  let litros = 0;
  let combustible = 0;

  datos.registros.forEach(r => {
    const kmVal = parseFloat(r.km) || 0;
    if (r.tipo === "combustible") {
      litros += parseFloat(r.litros || 0);
      combustible += parseFloat(r.coste || 0);
    }
    if (kmVal > finalKm) finalKm = kmVal;
  });

  // Garantir que finalKm teña polo menos os valores dos neumáticos e mantemento
  finalKm = Math.max(finalKm, datos.ultimaRuedaDel || 0, datos.ultimaRuedaTra || 0, datos.ultimaMantenimiento || 0);
  const kmRecorridos = finalKm - kmInicio;

  let l100 = kmRecorridos > 0 ? (litros / kmRecorridos) * 100 : 0;
  let costeKm = kmRecorridos > 0 ? combustible / kmRecorridos : 0;
  let coste100 = costeKm * 100;

  let del = datos.ultimaRuedaDel !== null
    ? ((finalKm - datos.ultimaRuedaDel) + (datos.kmPreviosDel || 0))
    : "—";
  let tra = datos.ultimaRuedaTra !== null
    ? ((finalKm - datos.ultimaRuedaTra) + (datos.kmPreviosTra || 0))
    : "—";
  
  // KM desde o último mantenimiento
  let mant = datos.ultimaMantenimiento !== null
    ? (finalKm - datos.ultimaMantenimiento)
    : "—";

  html += `<p>KM recorridos: ${kmRecorridos}</p>`;
  html += `<p>Litros totales (combustible): ${litros.toFixed(2)} L</p>`;
  html += `<p>Coste total combustible: ${combustible.toFixed(2)} €</p>`;
  html += `<p>Media litros/100km: ${l100.toFixed(2)}</p>`;
  html += `<p>Coste medio/km combustible: ${costeKm.toFixed(3)} €</p>`;
  html += `<p>Coste medio cada 100 km (combustible): ${coste100.toFixed(2)} €</p>`;

  html += `<p>KM con neumáticos delanteros: ${del}</p>`;
  html += `<p>KM con neumáticos traseros: ${tra}</p>`;
  html += `<p>KM desde último mantenimiento: ${mant}</p>`;

  const gastoTotal = datos.registros.reduce((acc, r) => acc + parseFloat(r.coste || 0), 0);
  let gastoKm = kmRecorridos > 0 ? gastoTotal / kmRecorridos : 0;
  let gasto100 = gastoKm * 100;
  html += `<p><strong>💶 Gasto total:</strong> ${gastoTotal.toFixed(2)} €</p>`;
  html += `<p><strong>💶 Gasto total por km:</strong> ${gastoKm.toFixed(3)} €/km</p>`;
  html += `<p><strong>💶 Gasto total cada 100 km:</strong> ${gasto100.toFixed(2)} €/100km</p>`;

  $("resumen").innerHTML = html;

  // Listado de rexistros gardados
  let lista = "<h4>📋 Rexistros gardados:</h4>";
  datos.registros.slice().reverse().forEach(r => {
    let infoExtra = "";
    if (r.tipo === "neumatico") {
      infoExtra = ` - ${r.kmPrevios || "0"} km previos`;
    }
    let infoMant = "";
    if (r.tipo === "mantenimiento") {
      infoMant = " (último mantenimiento)";
    }
    lista += `<p>
      📅 ${r.fecha}
      - ${r.tipo}
      - ${r.km || "—"} km
      - ${r.litros || "—"} L
      - ${r.coste || "—"} €
      - ${r.detalle || ""}
      ${infoExtra} ${infoMant}
    </p>`;
  });
  $("registros").innerHTML = lista;
}

// Exporta a Excel (opcional)
function exportarExcel() {
  if (typeof XLSX === 'undefined') return alert("Falta librería Excel");
  const ws = XLSX.utils.json_to_sheet(datos.registros);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Registros");
  XLSX.writeFile(wb, "ControlaTuGasto.xlsx");
}

// Asigna os event listeners
$("tipo").addEventListener("change", renderFormulario);
$("guardar").addEventListener("click", guardarRegistro);
$("exportar").addEventListener("click", exportarExcel);
$("modelo").addEventListener("change", resetSeModeloCambia);
$("kmInicio").addEventListener("change", resetSeModeloCambia);

// Inicializa os campos e renderiza os formularios e o resumo
$("modelo").value = datos.modelo;
$("kmInicio").value = datos.kmInicio;
renderFormulario();
renderResumen();

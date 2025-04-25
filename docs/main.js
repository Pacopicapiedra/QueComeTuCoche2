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

// Función para acceder aos elementos
const $ = id => document.getElementById(id);

// Guardar datos en localStorage\ nfunction guardarDatos() {
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
  } else if (tipo === "mantenimiento" || tipo === "averia") {
    html += '<label>Kilómetros:<input type="number" id="km" /></label>';
    html += '<label>Coste (€):<input type="number" id="coste" /></label>';
    html += '<label>Concepto:<input type="text" id="detalle" /></label>';
  } else if (tipo === "neumatico") {
    html += '<label>Kilómetros (odómetro actual):<input type="number" id="km" /></label>';
    html += '<label>Coste (€):<input type="number" id="coste" /></label>';
    html += '<label>Posición (delantero/trasero):<input type="text" id="detalle" /></label>';
    html += '<label>Modelo do neumático:<input type="text" id="modeloNeumatico" /></label>';
    html += '<label>Km previos do neumático:<input type="number" id="kmPrevios" /></label>';
  } else if (tipo === "papeles") {
    html += '<label>Coste (€):<input type="number" id="coste" /></label>';
    html += '<label>Concepto:<input type="text" id="detalle" /></label>';
  }

  $("formulario").innerHTML = html;
}

// Reinicia os datos se cambia o modelo ou os km iniciais, con confirmación
function resetSeModeloCambia() {
  const nuevoModelo = $("modelo").value;
  const nuevosKm = $("kmInicio").value;

  // Se cambia algo
  if (nuevoModelo !== datos.modelo || nuevosKm !== datos.kmInicio) {
    // Se hai rexistros, preguntamos
    if (datos.registros.length > 0) {
      const msg = `¡Olla! Cambiar modelo ou km borrará ${datos.registros.length} rexistros.\n¿Queres seguir?`;
      if (!confirm(msg)) {
        // Revertimos campos ao valor antigo
        $("modelo").value = datos.modelo;
        $("kmInicio").value = datos.kmInicio;
        return;
      }
      // Gardar histórico antes do reset
      datos.historico.push({
        modelo: datos.modelo,
        kmInicio: datos.kmInicio,
        registros: datos.registros
      });
    }
    // Reset estándar
    datos.modelo = nuevoModelo;
    datos.kmInicio = nuevosKm;
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
      datos.registros = datos.registros.filter(x => !(x.tipo === "neumatico" && x.detalle.toLowerCase().includes("del")));
      datos.ultimaRuedaDel = kmVal;
      datos.kmPreviosDel = kmPrevVal;
    }
    if (pos.includes("tra")) {
      datos.registros = datos.registros.filter(x => !(x.tipo === "neumatico" && x.detalle.toLowerCase().includes("tra")));
      datos.ultimaRuedaTra = kmVal;
      datos.kmPreviosTra = kmPrevVal;
    }
  }
  if (tipo === "mantenimiento") {
    const kmVal = parseFloat(r.km) || 0;
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

  finalKm = Math.max(finalKm, datos.ultimaRuedaDel || 0, datos.ultimaRuedaTra || 0, datos.ultimaMantenimiento || 0);
  const kmRecorridos = finalKm - kmInicio;
```

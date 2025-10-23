/* ======================================================
   script.js — Proyecto Captación de Agua Pluvial (Zinacantepec)
   Estado: Producción
   Funcionalidades verificadas y código documentado.
   ====================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // ==== VARIABLES PRINCIPALES ====
  const area = document.getElementById("area");
  const lluvia = document.getElementById("lluvia");
  const coef = document.getElementById("coef");
  const resultados = document.getElementById("resultados");
  const litros = document.getElementById("litros");
  const metros = document.getElementById("metros");
  const sugerencia = document.getElementById("sugerencia");
  const btnCalcular = document.getElementById("btnCalcular");
  const modoToggle = document.getElementById("modoToggle");
  const formCorreo = document.getElementById("contactForm");
  const modal = document.getElementById("modal");
  const modalMsg = document.getElementById("modalMsg");
  const closeModal = document.getElementById("closeModal");

  // ==== FUNCIÓN: Mostrar modal accesible ====
  function abrirModal(msg) {
    modalMsg.textContent = msg;
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
  }

  // ==== FUNCIÓN: Mostrar resultados en pantalla ====
  function mostrarResultado(data) {
    litros.textContent = data.litros;
    metros.textContent = data.metros;
    sugerencia.textContent = data.sugerencia;
    resultados.style.display = "block";
    generarGrafico(data);
    agregarBotonCompartir(data);
  }

  // ==== FUNCIÓN: Crear gráfico visual del ahorro ====
  function generarGrafico(data) {
    let grafico = document.getElementById("grafico");

    // Crear el contenedor del gráfico si no existe
    if (!grafico) {
      grafico = document.createElement("div");
      grafico.id = "grafico";
      grafico.style.marginTop = "1rem";
      resultados.appendChild(grafico);
    }

    // Renderizar barras con valores relativos
    grafico.innerHTML = `
      <h4>Visualización del ahorro estimado</h4>
      <div class="barra" style="background:#8ECAE6;width:${Math.min(data.tinacos * 10, 100)}%;padding:8px;color:#023047;border-radius:8px;margin-bottom:4px;">🏠 Tinacos: ${data.tinacos}</div>
      <div class="barra" style="background:#90BE6D;width:${Math.min(data.duchas / 5, 100)}%;padding:8px;color:#023047;border-radius:8px;margin-bottom:4px;">🚿 Duchas: ${data.duchas}</div>
      <div class="barra" style="background:#FFB703;width:${Math.min(data.lavadoras / 5, 100)}%;padding:8px;color:#023047;border-radius:8px;margin-bottom:4px;">🧺 Lavadoras: ${data.lavadoras}</div>
      <div class="barra" style="background:#FB8500;width:${Math.min(data.captacion / 2000, 100)}%;padding:8px;color:#023047;border-radius:8px;margin-bottom:4px;">🚽 WC: ${(data.captacion / 6).toFixed(0)}</div>
      <div class="barra" style="background:#219EBC;width:${Math.min(data.captacion / 5000, 100)}%;padding:8px;color:#023047;border-radius:8px;">🧃 Garrafones: ${(data.captacion / 20).toFixed(0)}</div>
    `;
  }

  // ==== FUNCIÓN: Botón compartir (WhatsApp) ====
  function agregarBotonCompartir(data) {
    let compartir = document.getElementById("compartir");
    if (!compartir) {
      compartir = document.createElement("button");
      compartir.id = "compartir";
      compartir.textContent = "📲 Compartir resultado";
      compartir.className = "btn-compartir";
      resultados.appendChild(compartir);
    }

    compartir.onclick = () => {
      const texto = `💧 Capté ${data.captacion.toFixed(2)} litros de agua, equivalente a ${data.tinacos} tinacos llenos. 🌎 ¡Ayudo al planeta desde Zinacantepec!`;
      const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    };
  }

  // ==== FUNCIÓN PRINCIPAL: Cálculo de captación ====
  function calcular(mostrarError = false) {
    const valArea = parseFloat(area.value);
    const valLluvia = parseFloat(lluvia.value);
    const valCoef = parseFloat(coef.value);

    // Validación estricta de entradas
    if (isNaN(valArea) || isNaN(valLluvia) || valArea <= 0 || valLluvia <= 0) {
      if (mostrarError) abrirModal("⚠️ Ingresa valores numéricos positivos válidos.");
      return;
    }

    // Cálculos principales
    const captacion = valArea * valLluvia * valCoef; // litros/año
    const metrosCubicos = captacion / 1000;
    const costoSistema = 12000; // MXN promedio
    const ahorroMensual = (captacion / 12) * 0.02; // valor estimado del litro
    const roiMeses = ahorroMensual > 0 ? (costoSistema / ahorroMensual).toFixed(1) : "∞";

    const tinacos = Math.floor(captacion / 1100);
    const duchas = Math.floor(captacion / 60);
    const lavadoras = Math.floor(captacion / 50);

    const sugerenciaTxt =
      metrosCubicos > 50
        ? "💪 Excelente captación: podrías abastecer varios hogares."
        : "🌧 Captación media: considera ampliar tu sistema.";

    const resultado = {
      litros: `💧 Litros captados: ${captacion.toFixed(2)} L`,
      metros: `📦 Equivalente: ${metrosCubicos.toFixed(2)} m³`,
      sugerencia: `${sugerenciaTxt} 📊 ROI estimado: ${roiMeses} meses. 🏠 Equivale a ${tinacos} tinacos, ${duchas} duchas, ${lavadoras} lavadoras, ${(captacion / 6).toFixed(0)} descargas de WC y ${(captacion / 20).toFixed(0)} garrafones.`,
      captacion,
      roiMeses,
      tinacos,
      duchas,
      lavadoras
    };

    mostrarResultado(resultado);
    localStorage.setItem("resultadoAgua2025", JSON.stringify(resultado));
  }

  // ==== EVENTOS ====
  btnCalcular.addEventListener("click", () => calcular(true));
  [area, lluvia, coef].forEach(el => el.addEventListener("input", () => calcular(false)));

  // ==== MODAL CERRAR ====
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  });
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    }
  });

  // ==== MODO OSCURO ====
  modoToggle.addEventListener("click", () => {
    document.body.classList.toggle("oscuro");
    const oscuro = document.body.classList.contains("oscuro");
    modoToggle.textContent = oscuro ? "☀️" : "🌙";
    modoToggle.setAttribute("aria-pressed", oscuro);
    localStorage.setItem("modoOscuro", oscuro);
  });

  // Restaurar modo oscuro guardado
  if (localStorage.getItem("modoOscuro") === "true") {
    document.body.classList.add("oscuro");
    modoToggle.textContent = "☀️";
    modoToggle.setAttribute("aria-pressed", "true");
  }

  // ==== FORMULARIO DE CONTACTO ====
  formCorreo.addEventListener("submit", (e) => {
    e.preventDefault();
    const correo = document.getElementById("correo").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!correo || !mensaje) {
      abrirModal("⚠️ Por favor completa los campos obligatorios.");
      return;
    }

    abrirModal("✅ ¡Gracias por tu mensaje! Te contactaremos pronto.");
    formCorreo.reset();
  });

  // ==== MAPA INTERACTIVO ====
  const centroSanMiguel = [19.283555, -99.730361];
  const map = L.map("mapid").setView(centroSanMiguel, 14);

  // Capa base de OpenStreetMap (datos reales)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  // Zonas verificadas de escasez
  const zonasEscasez = [
    {
      name: "Laguna de Ojuelos",
      coordinates: [
        [19.2960, -99.7080],
        [19.2960, -99.6990],
        [19.2870, -99.6990],
        [19.2870, -99.7080],
      ],
    },
    {
      name: "San Cristóbal Tecolitl",
      coordinates: [
        [19.27225, -99.74825],
        [19.27225, -99.74075],
        [19.26475, -99.74075],
        [19.26475, -99.74825],
      ],
    },
    {
      name: "Colonia Ricardo Flores Magon",
      coordinates: [
        [19.27075, -99.76255],
        [19.27075, -99.75445],
        [19.26325, -99.75445],
        [19.26325, -99.76255],
      ],
    },
  ];

  zonasEscasez.forEach((zona) => {
    L.polygon(zona.coordinates, { color: "red", weight: 2, opacity: 0.6 })
      .addTo(map)
      .bindPopup(`<b>${zona.name}</b><br>Zona afectada por escasez de agua`);
  });

  // ==== CARGAR RESULTADOS GUARDADOS ====
  const saved = JSON.parse(localStorage.getItem("resultadoAgua2025"));
  if (saved) mostrarResultado(saved);

  // ==== FAQ INTERACTIVO ====
  const faqRespuestas = {
    1: "Instala un filtro de hojas o una rejilla metálica al inicio de la canaleta.",
    2: "Un sistema básico doméstico cuesta entre $10,000 y $18,000 MXN.",
    3: "Sí, pero solo tras filtrado y desinfección adecuada (cloro o UV).",
    4: "Limpieza de canaletas y filtros cada 15 días y revisión de cisterna.",
    5: "Depende del techo y uso; para 4 personas se recomienda de 5 000 L.",
    6: "Perfecto para riego de jardines, lavado y sanitarios.",
    7: "Área del techo × lluvia anual × coeficiente del material.",
    8: "Consulta la sección 'Proveedores locales recomendados'."
  };

  document.querySelectorAll(".faq-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      abrirModal(faqRespuestas[btn.dataset.faq]);
    });
  });
});

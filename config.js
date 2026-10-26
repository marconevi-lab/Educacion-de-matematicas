// Lógica del panel de configuración (⚙️), compartida entre inicio.html,
// usuarios.html e index.html. Requiere los elementos con id:
// select-tema, select-tamano, select-contraste, select-fuente,
// select-movimiento, boton-config, panel-config y (opcional) boton-restablecer.
(function () {
  const CLAVE_CONFIG = "edu-config-inicio";

  function cargarConfig() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE_CONFIG));
      if (guardado && typeof guardado === "object") return guardado;
    } catch {}
    return { tema: "auto", tamano: "normal", contraste: "normal", fuente: "normal", movimiento: "normal" };
  }

  function guardarConfig(config) {
    localStorage.setItem(CLAVE_CONFIG, JSON.stringify(config));
  }

  function aplicarConfig(config) {
    const raiz = document.documentElement;

    if (config.tema === "light" || config.tema === "dark") {
      raiz.setAttribute("data-theme", config.tema);
    } else {
      raiz.removeAttribute("data-theme");
    }

    raiz.style.setProperty("--tam-texto", config.tamano === "grande" ? "1.15" : "1");

    if (config.contraste === "alto") raiz.setAttribute("data-contraste", "alto");
    else raiz.removeAttribute("data-contraste");

    if (config.fuente === "dislexia") raiz.setAttribute("data-fuente", "dislexia");
    else raiz.removeAttribute("data-fuente");

    if (config.movimiento === "reducido") raiz.setAttribute("data-movimiento", "reducido");
    else raiz.removeAttribute("data-movimiento");
  }

  const selectTema = document.querySelector("#select-tema");
  const selectTamano = document.querySelector("#select-tamano");
  const selectContraste = document.querySelector("#select-contraste");
  const selectFuente = document.querySelector("#select-fuente");
  const selectMovimiento = document.querySelector("#select-movimiento");
  const botonConfig = document.querySelector("#boton-config");
  const panelConfig = document.querySelector("#panel-config");
  const botonRestablecer = document.querySelector("#boton-restablecer");

  const config = cargarConfig();
  if (selectTema) selectTema.value = config.tema;
  if (selectTamano) selectTamano.value = config.tamano;
  if (selectContraste) selectContraste.value = config.contraste;
  if (selectFuente) selectFuente.value = config.fuente;
  if (selectMovimiento) selectMovimiento.value = config.movimiento;
  aplicarConfig(config);

  if (botonConfig && panelConfig) {
    botonConfig.addEventListener("click", () => {
      panelConfig.hidden = !panelConfig.hidden;
    });

    document.addEventListener("click", (e) => {
      if (!panelConfig.hidden && !panelConfig.contains(e.target) && e.target !== botonConfig) {
        panelConfig.hidden = true;
      }
    });
  }

  function escucharCambio(select, campo) {
    if (!select) return;
    select.addEventListener("change", () => {
      config[campo] = select.value;
      guardarConfig(config);
      aplicarConfig(config);
    });
  }

  escucharCambio(selectTema, "tema");
  escucharCambio(selectTamano, "tamano");
  escucharCambio(selectContraste, "contraste");
  escucharCambio(selectFuente, "fuente");
  escucharCambio(selectMovimiento, "movimiento");

  if (botonRestablecer) {
    botonRestablecer.addEventListener("click", () => {
      const confirmado = confirm("Esto borrará el progreso guardado en este navegador (ejercicios completados). No afecta a tu cuenta ni contraseña. ¿Continuar?");
      if (!confirmado) return;
      Object.keys(localStorage)
        .filter((clave) => /progreso/i.test(clave))
        .forEach((clave) => localStorage.removeItem(clave));
      if (document.querySelector("#ejercicios")) {
        location.reload();
      } else {
        alert("Progreso restablecido.");
      }
    });
  }
})();

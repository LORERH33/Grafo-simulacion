const btnAyuda = document.getElementById("btnAyuda");
const panelAyuda = document.getElementById("panelAyuda");
const cerrarAyuda = document.getElementById("cerrarAyuda");

// Abrir / cerrar panel
btnAyuda.addEventListener("click", () => {
    panelAyuda.style.display = panelAyuda.style.display === "block" ? "none" : "block";
});

// Cerrar con ✖
cerrarAyuda.addEventListener("click", () => {
    panelAyuda.style.display = "none";
});
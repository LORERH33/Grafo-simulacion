// matriz.js
document.getElementById("btnGenerar").addEventListener("click", () => {
    // Obtener grafo desde almacenamiento local
    const datos = localStorage.getItem("grafoActual");

    if (!datos) {
        alert("⚠️ No hay grafo guardado. Crea un grafo primero.");
        return;
    }

    let grafo;
    try {
        grafo = JSON.parse(datos);
    } catch (err) {
        alert("❌ Error leyendo el grafo guardado: " + err);
        return;
    }

    const nodos = grafo.nodes || [];
    const aristas = grafo.edges || [];

    // Validaciones estrictas
    if (nodos.length === 0) {
        alert("⚠️ No hay nodos en el grafo. Crea nodos primero.");
        return;
    }

    if (aristas.length === 0) {
        alert("⚠️ No hay aristas en el grafo. Crea aristas primero.");
        return;
    }

    const tabla = document.getElementById("matriz");

    // Encabezado
    let html = "<tr><th></th>";
    nodos.forEach(n => html += `<th>${n.label}</th>`);
    html += "</tr>";

    // Filas: 0/1 según existencia de arista
    nodos.forEach(fila => {
        html += `<tr><th>${fila.label}</th>`;
        nodos.forEach(columna => {
            const arista = aristas.find(a => a.from === fila.id && a.to === columna.id);
            html += `<td>${arista ? 1 : 0}</td>`;
        });
        html += "</tr>";
    });

    tabla.innerHTML = html;
});
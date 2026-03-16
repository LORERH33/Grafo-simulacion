var nodes = new vis.DataSet([]);
var edges = new vis.DataSet([]);
var container = document.getElementById("grafo-container");
var contadorNodos = 0;

// Opciones del grafo
var options = {
    manipulation: {
        enabled: true,
        addNode: function (data, callback) {
            contadorNodos++;
            data.label = "N" + contadorNodos;
            callback(data);
        },
        addEdge: function (data, callback) {
            // Permite aristas al mismo nodo
            var peso = prompt("Ingrese peso (entero):");
            if (peso === null) return;
            if (!Number.isInteger(Number(peso))) { 
                alert("⚠️ Solo números enteros"); 
                return; 
            }
            data.label = peso;
            callback(data);
        }
    },
    edges: { arrows: { to: true }, font: { align: "top" } },
    physics: { enabled: true }
};

var data = { nodes, edges };
var network = new vis.Network(container, data, options);

// ---------------- FUNCIONES ----------------

// Editar peso de arista
function editarPeso() {
    var seleccion = network.getSelectedEdges();
    if (seleccion.length === 0) { alert("Selecciona una arista"); return; }
    var nuevoPeso = prompt("Nuevo peso (entero):");
    if (nuevoPeso === null) return;
    if (!Number.isInteger(Number(nuevoPeso))) { alert("Solo números enteros"); return; }
    edges.update({ id: seleccion[0], label: nuevoPeso });
}

// Borrar todo
function borrarTodo() {
    if (nodes.length === 0 && edges.length === 0) { alert("Grafo vacío"); return; }
    if (!confirm("¿Borrar todo?")) return;
    nodes.clear();
    edges.clear();
    contadorNodos = 0;
}

// Borrar selección
function borrarSeleccion() {
    var ns = network.getSelectedNodes();
    var es = network.getSelectedEdges();
    nodes.remove(ns);
    edges.remove(es);
}

// Guardar grafo en localStorage
 //function guardarGrafo() {
   //   if (nodes.length === 0 && edges.length === 0) {
     //   alert("⚠️ No hay grafo para guardar.");
       // return;
    //}
    //const datos = { nodes: nodes.get(), edges: edges.get() };
    //AlmacenamientoGrafo.setNodos(datos.nodes);
    //AlmacenamientoGrafo.setAristas(datos.edges);
    //AlmacenamientoGrafo.guardarLocal();
    //alert("✅ Grafo guardado correctamente.");
//}

// Exportar JSON + PDF
function exportarGrafo() {
    if (nodes.length === 0 && edges.length === 0) {
        alert("⚠️ No hay grafo para exportar.");
        return;
    }

    const datos = { nodes: nodes.get(), edges: edges.get() };

    // JSON
    const blobJson = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
    const aJson = document.createElement("a");
    aJson.href = URL.createObjectURL(blobJson);
    aJson.download = "grafo.json";
    aJson.click();

    // PDF usando canvas interno de vis
    const canvas = container.getElementsByTagName("canvas")[0];
    if (!canvas) { alert("Error: no se pudo capturar el grafo para PDF."); return; }

    const imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('landscape');
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    let imgWidth = pageWidth - 2 * margin;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pageHeight - 2 * margin) {
        imgHeight = pageHeight - 2 * margin;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    pdf.save("grafo.pdf");
}

// Importar JSON
document.getElementById("btnImportar").addEventListener("click", () => {
    alert("📂 Para importar un grafo, seleccione el archivo .json");
    document.getElementById("importarGrafoInput").click();
});

document.getElementById("importarGrafoInput").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const data = JSON.parse(evt.target.result);
            nodes.clear();
            edges.clear();
            contadorNodos = 0;
            data.nodes.forEach(n => {
                nodes.add({ id: n.id, label: n.label });
                const num = parseInt(n.label.replace("N",""));
                if(num > contadorNodos) contadorNodos = num;
            });
            data.edges.forEach(a => edges.add({ from: a.from, to: a.to, label: a.label }));
            AlmacenamientoGrafo.setNodos(nodes.get());
            AlmacenamientoGrafo.setAristas(edges.get());
            AlmacenamientoGrafo.guardarLocal();
            alert("✅ Grafo importado correctamente");
        } catch(err) {
            alert("❌ Error leyendo JSON: "+err);
        }
    };
    reader.readAsText(file);
});

// ---------------- Actualización automática ----------------
network.on("afterDrawing", () => {
    AlmacenamientoGrafo.setNodos(nodes.get());
    AlmacenamientoGrafo.setAristas(edges.get());
});

network.on("afterManipulation", () => {
    AlmacenamientoGrafo.setNodos(nodes.get());
    AlmacenamientoGrafo.setAristas(edges.get());
});

// ---------------- Matriz de Adyacencia ----------------

function generarMatriz() {
    const nodos = nodes.get();
    const aristas = edges.get();

    if (nodos.length === 0) {
        alert("⚠️ No hay nodos");
        return;
    }

    const tabla = document.getElementById("matriz");
    let html = "<tr><th></th>";

    // Cabeceras de nodos
    nodos.forEach(n => html += `<th>${n.label}</th>`);
    html += `<th class="suma">Suma (Σ)</th><th class="aristas">#Aristas</th></tr>`;

    let sumaColumnas = new Array(nodos.length).fill(0);
    let aristasColumnas = new Array(nodos.length).fill(0);
    let totalAristas = 0;

    // Filas de cada nodo
    nodos.forEach((fila) => {
        let sumaFila = 0;
        let aristasFila = 0;
        html += `<tr><th>${fila.label}</th>`;

        nodos.forEach((columna, j) => {
            let arista = aristas.find(a => a.from === fila.id && a.to === columna.id);
            let valor = arista ? parseInt(arista.label) : 0;
            html += `<td>${valor}</td>`;
            sumaFila += valor;
            sumaColumnas[j] += valor;

            if (arista) {
                aristasFila++;
                aristasColumnas[j]++;
                totalAristas++;
            }
        });

        html += `<td class="suma">${sumaFila}</td><td class="aristas">${aristasFila}</td></tr>`;
    });

    // Fila de sumas de valores (solo suma de valores, no aristas)
    html += `<tr><th class="suma">Suma (Σ)</th>`;
    sumaColumnas.forEach(v => html += `<td class="suma">${v}</td>`);
    html += `<td class="suma"></td>`; // celda vacía
    html += `<td class="aristas"></td>`; // celda vacía también
    html += `</tr>`;

    // Fila de #Aristas con total en la esquina inferior derecha
    html += `<tr><th class="aristas">#Aristas</th>`;
    aristasColumnas.forEach(v => html += `<td class="aristas">${v}</td>`);
    html += `<td class="aristas"></td>`; // celda vacía antes de la esquina
    html += `<td class="interseccion">${totalAristas}</td>`; // esquina inferior derecha
    html += `</tr>`;

    tabla.innerHTML = html;
}
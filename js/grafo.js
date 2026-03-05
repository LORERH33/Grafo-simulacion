let nodos = new vis.DataSet([]);
let aristas = new vis.DataSet([]);
let contadorNodos = 1;

const contenedor = document.getElementById('grafo-container');
const datos = { nodes: nodos, edges: aristas };

const opciones = {
  nodes: {
    shape: 'circle',
    size: 50,
    color: { background: '#1E90FF', border: '#000080' },
    font: { color: 'white', size: 20, face: 'Arial', bold: true },
    borderWidth: 3
  },
  edges: {
    arrows: { to: { enabled: true, scaleFactor: 1.2 } },
    smooth: { type: 'dynamic' },
    color: { color: '#333', highlight: '#1E90FF' },
    font: { color: 'black', size: 16, align: 'middle', background: 'white' },
  },
  physics: false,
  manipulation: {
    enabled: true,
    addNode: function(data, callback) {
      data.label = `N${contadorNodos++}`;
      callback(data);
    },
    addEdge: function(data, callback) {
      const existeDirecta = aristas.get().some(a => a.from === data.from && a.to === data.to);
      const totalEntreNodos = aristas.get().filter(a =>
        (a.from === data.from && a.to === data.to) || (a.from === data.to && a.to === data.from)
      ).length;

      if (existeDirecta) {
        alert("Ya existe una arista en esta dirección.");
        return;
      }
      if (totalEntreNodos >= 2) {
        alert("Solo se permiten dos aristas entre estos nodos (opuestas).");
        return;
      }

      let peso = prompt(`Ingresa el peso de la arista ${nodos.get(data.from).label} → ${nodos.get(data.to).label}`);
      if (!peso) return;
      data.label = peso;

      if (totalEntreNodos === 1) {
        data.smooth = { type: 'curvedCW', roundness: 0.2 };
      } else {
        data.smooth = true;
      }

      callback(data);
    },
    editEdge: function(data, callback) {
      let nuevoPeso = prompt(`Editar peso de la arista:`, data.label);
      if (nuevoPeso !== null) data.label = nuevoPeso;
      callback(data);
    }
  },
  interaction: { multiselect: true, navigationButtons: true, selectable: true }
};

const red = new vis.Network(contenedor, datos, opciones);

function borrarTodo() {
  if (confirm("¿Seguro que quieres borrar todos los nodos y aristas?")) {
    nodos.clear();
    aristas.clear();
    contadorNodos = 1;
  }
}

function borrarSeleccion() {
  const seleccionados = red.getSelection();
  if (!seleccionados.nodes.length && !seleccionados.edges.length) {
    alert("Selecciona nodos o aristas para borrar.");
    return;
  }

  nodos.remove(seleccionados.nodes);
  aristas.remove(seleccionados.edges);
}

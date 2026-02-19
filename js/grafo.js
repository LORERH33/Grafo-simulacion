
let nodos = new vis.DataSet([]);
let aristas = new vis.DataSet([]);
let letraActual = 65; 

const contenedor = document.getElementById('grafo-container');
const datos = { nodes: nodos, edges: aristas };


const opciones = {
    nodes: {
        shape: 'circle',
        size: 150, 
        color: { background: 'lightblue', border: 'navy' },
        font: { color: 'black', size: 24, face: 'Arial' }
    },
    edges: {
        arrows: 'to',       
        smooth: true,
        font: { align: 'middle', color: 'red', size: 16 },
        color: { color: '#000000' }
    },
    physics: false,
    manipulation: {
        enabled: true,
        addNode: function(data, callback) {
            data.label = String.fromCharCode(letraActual++);
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
                data.smooth = { type: 'curvedCCW', roundness: 0.2 };
            } else {
                data.smooth = true;
            }

            callback(data);
        }
    }
};


const red = new vis.Network(contenedor, datos, opciones);


function borrarTodo() {
    if (confirm("¿Seguro que quieres borrar todos los nodos y aristas?")) {
        nodos.clear();
        aristas.clear();
        letraActual = 65;
    }
}

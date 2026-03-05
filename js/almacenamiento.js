// almacenamiento.js
const AlmacenamientoGrafo = {
    nodos: [],
    aristas: [],

    // Actualizar nodos
    setNodos(nodosData) {
        this.nodos = nodosData.map(n => ({ id: n.id, label: n.label }));
    },

    // Actualizar aristas
    setAristas(aristasData) {
        this.aristas = aristasData.map(a => ({
            from: a.from,
            to: a.to,
            peso: a.label
        }));
    },

    // Obtener datos actuales
    getDatos() {
        return {
            nodos: this.nodos,
            aristas: this.aristas
        };
    },

    // Verificar si el grafo está vacío (nodos y aristas)
    estaVacio() {
        return this.nodos.length === 0 || this.aristas.length === 0;
    },

    // Guardar en localStorage
    guardarLocal() {
        localStorage.setItem("grafoActual", JSON.stringify({
            nodes: this.nodos,
            edges: this.aristas
        }));
    }
};
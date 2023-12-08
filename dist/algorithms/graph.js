"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = exports.Edge = void 0;
class Edge {
    constructor(source, target, capacity = Number.MAX_SAFE_INTEGER) {
        this.source = source;
        this.target = target;
        this.capacity = capacity;
        this.flow = 0;
    }
}
exports.Edge = Edge;
class Graph {
    constructor(numNodes) {
        this.edges = [];
        this.level = new Array(numNodes).fill(-1);
    }
    addEdge(edge) {
        // Comprobar si ya existe una arista con el mismo source y target
        const existingEdge = this.edges.find(e => e.source === edge.source && e.target === edge.target);
        if (existingEdge) {
            // Si ya existe, suma las capacidades
            existingEdge.capacity += edge.capacity;
        }
        else {
            // Si no existe, añade la nueva arista al grafo
            this.edges.push(edge);
        }
    }
    getIncomingEdges(node) {
        return this.edges.filter(edge => edge.target === node);
    }
    getOutgoingEdges(node) {
        return this.edges.filter(edge => edge.source === node);
    }
}
exports.Graph = Graph;

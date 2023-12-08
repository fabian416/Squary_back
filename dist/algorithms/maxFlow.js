"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bfs = exports.maxFlow = void 0;
const graph_1 = require("./graph");
function maxFlow(graph, source, sink) {
    let flow = 0;
    while (bfs(graph, source, sink)) {
        let pathFlow = Number.MAX_VALUE;
        let currentNode = sink;
        while (currentNode !== source) {
            const incomingEdges = graph.getIncomingEdges(currentNode);
            for (const edge of incomingEdges) {
                if (graph.level[edge.source] === graph.level[currentNode] - 1) {
                    pathFlow = Math.min(pathFlow, edge.capacity);
                    currentNode = edge.source;
                    break;
                }
            }
        }
        flow += pathFlow;
        currentNode = sink;
        while (currentNode !== source) {
            const incomingEdges = graph.getIncomingEdges(currentNode);
            for (const edge of incomingEdges) {
                if (graph.level[edge.source] === graph.level[currentNode] - 1) {
                    edge.capacity -= pathFlow;
                    const reverseEdge = graph.edges.find(e => e.source === edge.target && e.target === edge.source);
                    if (reverseEdge) {
                        reverseEdge.capacity += pathFlow;
                    }
                    else {
                        graph.addEdge(new graph_1.Edge(edge.target, edge.source, pathFlow));
                    }
                    currentNode = edge.source;
                    break;
                }
            }
        }
    }
    return flow;
}
exports.maxFlow = maxFlow;
function bfs(graph, source, sink) {
    graph.level.fill(-1);
    graph.level[source] = 0;
    const queue = [source];
    while (queue.length) {
        const u = queue.shift();
        const outgoingEdges = graph.getOutgoingEdges(u);
        for (const edge of outgoingEdges) {
            if (graph.level[edge.target] < 0 && edge.capacity > 0) {
                if (edge.target === sink) {
                    return true;
                }
                graph.level[edge.target] = graph.level[u] + 1;
                queue.push(edge.target);
            }
        }
    }
    return false;
}
exports.bfs = bfs;

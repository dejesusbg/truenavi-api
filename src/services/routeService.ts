import Node from '../models/Node';
import Edge from '../models/Edge';

class PriorityQueue<T = string> {
  values: { val: T; priority: number }[];

  constructor() {
    this.values = [];
  }

  enqueue(val: T, priority: number) {
    this.values.push({ val, priority });
    this.sort();
  }

  dequeue(): { val: T; priority: number } | undefined {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }

  isEmpty(): boolean {
    return this.values.length === 0;
  }
}

interface PathResult {
  success: boolean;
  message?: string;
  distance?: number;
  path?: any[];
  edges?: any[];
}

export async function findShortestPath(
  startNodeId: string,
  endNodeId: string
): Promise<PathResult> {
  try {
    const nodes = await Node.find().lean();
    const edges = await Edge.find().lean();

    const graph: Record<string, Record<string, number>> = {};

    nodes.forEach((node) => {
      graph[node._id.toString()] = {};
    });

    edges.forEach((edge) => {
      const startNodeId = edge.startNodeId.toString();
      const endNodeId = edge.endNodeId.toString();

      graph[startNodeId][endNodeId] = edge.distance ?? 0;
      graph[endNodeId][startNodeId] = edge.distance ?? 0;
    });

    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const pq = new PriorityQueue<string>();

    for (let vertex in graph) {
      if (vertex === startNodeId.toString()) {
        distances[vertex] = 0;
        pq.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        pq.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }

    while (!pq.isEmpty()) {
      const currentObj = pq.dequeue();
      if (!currentObj) break;

      const current = currentObj.val;

      if (current === endNodeId.toString()) break;

      for (let neighbor in graph[current]) {
        const distance = graph[current][neighbor];
        const newDistance = distances[current] + distance;

        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = current;
          pq.enqueue(neighbor, newDistance);
        }
      }
    }

    const path: string[] = [];
    let current = endNodeId.toString();

    if (previous[current] === null && current !== startNodeId.toString()) {
      return { success: false, message: 'No path exists between these nodes' };
    }

    while (current) {
      path.unshift(current);
      current = previous[current] ?? '';
    }

    const pathEdges = [];
    for (let i = 0; i < path.length - 1; i++) {
      const edge = edges.find(
        (e) =>
          (e.startNodeId.toString() === path[i] && e.endNodeId.toString() === path[i + 1]) ||
          (e.startNodeId.toString() === path[i + 1] && e.endNodeId.toString() === path[i])
      );

      if (edge) pathEdges.push(edge);
    }

    const pathNodes = path.map((nodeId) => nodes.find((n) => n._id.toString() === nodeId));

    return {
      success: true,
      distance: distances[endNodeId.toString()],
      path: pathNodes,
      edges: pathEdges,
    };
  } catch (error) {
    console.error('Error in findShortestPath:', error);
    return { success: false, message: (error as Error).message };
  }
}

const Node = require('../models/Node');
const Edge = require('../models/Edge');

// Helper class for priority queue
class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }

  isEmpty() {
    return this.values.length === 0;
  }
}

// Dijkstra's algorithm implementation
async function findShortestPath(startNodeId, endNodeId) {
  try {
    // Get all nodes and edges from the database
    const nodes = await Node.find().lean();
    const edges = await Edge.find().lean();

    // Convert the nodes and edges into an adjacency list
    const graph = {};
    
    // Initialize the graph with all nodes
    nodes.forEach(node => {
      graph[node._id.toString()] = {};
    });
    
    // Add all edges to the graph
    edges.forEach(edge => {
      const aId = edge.a_id.toString();
      const bId = edge.b_id.toString();
      
      // Add bidirectional edges (assuming the path can be traversed in both directions)
      graph[aId][bId] = edge.distance;
      graph[bId][aId] = edge.distance;
    });

    // Initialize data structures for Dijkstra's algorithm
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();
    
    // Set initial values
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
    
    // Process nodes in priority order
    while (!pq.isEmpty()) {
      const current = pq.dequeue().val;
      
      if (current === endNodeId.toString()) break;
      
      if (current in graph && distances[current] !== Infinity) {
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
    }
    
    // Reconstruct the path
    const path = [];
    let current = endNodeId.toString();
    
    // No path found
    if (previous[current] === null && current !== startNodeId.toString()) {
      return {
        success: false,
        message: "No path exists between these nodes"
      };
    }
    
    while (current) {
      path.unshift(current);
      current = previous[current];
    }
    
    // Find all the edges that connect the nodes in the path
    const pathEdges = [];
    for (let i = 0; i < path.length - 1; i++) {
      const edge = edges.find(e => 
        (e.a_id.toString() === path[i] && e.b_id.toString() === path[i+1]) || 
        (e.a_id.toString() === path[i+1] && e.b_id.toString() === path[i])
      );
      
      if (edge) {
        pathEdges.push(edge);
      }
    }
    
    // Find the node objects for the path
    const pathNodes = path.map(nodeId => 
      nodes.find(n => n._id.toString() === nodeId)
    );
    
    return {
      success: true,
      distance: distances[endNodeId.toString()],
      path: pathNodes,
      edges: pathEdges
    };
  } catch (error) {
    console.error('Error in findShortestPath:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

module.exports = {
  findShortestPath
};
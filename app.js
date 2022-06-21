const fs = require('fs');

// Generate 20 tickets
function initTickets() {
  const tickets = [];
  for (let i = 0; i < 20; i++) {
    tickets.push({ id: i + 1 });
  }
  return tickets;
}
const tickets = initTickets();

// SQL dependency nodes table
const nodes = [
  { id: 1, ticket_id: 20 },
  { id: 2, ticket_id: 19 },
  { id: 3, ticket_id: 18 },
  { id: 4, ticket_id: 17 },
  { id: 5, ticket_id: 16 },
  { id: 6, ticket_id: 15 },
  { id: 7, ticket_id: 5 },
];

// SQL dependency tickets table
const tickets_nodes = [
  { node_id: 1, ticket_id: 18 },
  { node_id: 1, ticket_id: 19 },
  { node_id: 1, ticket_id: 9 },
  { node_id: 2, ticket_id: 17 },
  { node_id: 2, ticket_id: 16 },
  { node_id: 2, ticket_id: 15 },
  { node_id: 3, ticket_id: 17 },
  { node_id: 3, ticket_id: 16 },
  { node_id: 3, ticket_id: 15 },
  { node_id: 4, ticket_id: 14 },
  { node_id: 4, ticket_id: 13 },
  { node_id: 5, ticket_id: 14 },
  { node_id: 5, ticket_id: 13 },
  { node_id: 6, ticket_id: 14 },
  { node_id: 6, ticket_id: 13 },
  { node_id: 7, ticket_id: 14 },
];

// Find the most dependent tickets
function findMostDependents() {
  const mostDependents = [];
  for (let i = 0; i < nodes.length; i++) {
    const dependencies = [];
    for (let j = 0; j < tickets_nodes.length; j++) {
      if (nodes[i].ticket_id === tickets_nodes[j].ticket_id) {
        dependencies.push(nodes[i].ticket_id);
      }
    }
    if (dependencies.length === 0) {
      mostDependents.push(nodes[i].ticket_id);
    }
  }
  return mostDependents;
}

// Find the direct dependencies of a ticket
function findDirectDependencies(ticket_id) {
  const node = nodes.find(node => node.ticket_id === ticket_id);
  if (node === undefined) return null;
  const directDependencies = tickets_nodes
    .filter(ticket_node => ticket_node.node_id === node.id)
    .map(ticket_node => ticket_node.ticket_id);
  return directDependencies;
}

// Build a dependency tree for a ticket
function buildDependencyTree(ticket_id) {
  // if tickets don't exist, return null
  const ticket = tickets.find(ticket => ticket.id === ticket_id);
  if (ticket === undefined) return null;
  
  const directDependencies = findDirectDependencies(ticket_id);
  if (directDependencies === null) return ticket_id.toString();
  const dependencyTree = {};
  dependencyTree[ticket_id] = directDependencies
  .map(directDependency => buildDependencyTree(directDependency));
  return dependencyTree;
}

// Build all dependency trees for the most dependent tickets
function buildAllDependencyTrees() {
  const dependencyTrees = [];
  const mostDependents = findMostDependents();
  mostDependents.forEach(mostDependent => {
    dependencyTrees.push(buildDependencyTree(mostDependent));
  });
  return dependencyTrees;
}

// Write dependency trees to a file
function writeDependencyTreesToFile() {
  const dependencyTrees = buildAllDependencyTrees();
  fs.writeFileSync('dependencyTrees.json', JSON.stringify(dependencyTrees, null, 2));
}

// Execute write to file
writeDependencyTreesToFile();
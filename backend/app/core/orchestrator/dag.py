from typing import List, Dict, Any
import uuid

class DAGProcessor:
    def __init__(self, nodes: List[Dict[str, Any]]):
        """
        Initialize with a list of nodes.
        nodes = [{"id": uuid_val, "dependencies": [uuid1, uuid2], ...}]
        """
        self.nodes = {node['id']: node for node in nodes}
        self.edges = {node['id']: [] for node in nodes} # Adjacency list (children)
        self.in_degree = {node['id']: 0 for node in nodes}
        
        self._build_graph()

    def _build_graph(self):
        for node_id, node_data in self.nodes.items():
            deps = node_data.get('dependencies', [])
            self.in_degree[node_id] += len(deps)
            for dep_id in deps:
                if dep_id in self.edges:
                    self.edges[dep_id].append(node_id)
                else:
                    self.edges[dep_id] = [node_id]
                    if dep_id not in self.in_degree:
                        self.in_degree[dep_id] = 0

    def is_valid(self) -> bool:
        """Check for circular dependencies using Kahn's algorithm."""
        in_degree_copy = self.in_degree.copy()
        queue = [u for u, deg in in_degree_copy.items() if deg == 0]
        visited_count = 0
        
        while queue:
            u = queue.pop(0)
            visited_count += 1
            for v in self.edges.get(u, []):
                in_degree_copy[v] -= 1
                if in_degree_copy[v] == 0:
                    queue.append(v)
                    
        return visited_count == len(self.nodes)

    def get_execution_order(self) -> List[uuid.UUID]:
        """Returns nodes in topological order."""
        if not self.is_valid():
            raise ValueError("Circular dependency detected in workflow DAG")
            
        order = []
        in_degree_copy = self.in_degree.copy()
        queue = [u for u, deg in in_degree_copy.items() if deg == 0]
        
        while queue:
            u = queue.pop(0)
            order.append(u)
            for v in self.edges.get(u, []):
                in_degree_copy[v] -= 1
                if in_degree_copy[v] == 0:
                    queue.append(v)
                    
        return order

    def get_ready_nodes(self, completed_node_ids: List[uuid.UUID]) -> List[uuid.UUID]:
        """
        Find nodes that have all dependencies met.
        A node is ready if all its dependencies are in completed_node_ids.
        """
        ready = []
        for node_id, node_data in self.nodes.items():
            if node_id in completed_node_ids:
                continue
                
            deps = node_data.get('dependencies', [])
            if all(dep in completed_node_ids for dep in deps):
                ready.append(node_id)
                
        return ready

    def get_subsequent_nodes(self, node_id: uuid.UUID) -> List[uuid.UUID]:
        """Get immediate children of a node."""
        return self.edges.get(node_id, [])

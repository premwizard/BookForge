from typing import List, Dict, Any, Set, Tuple
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
            valid_deps = [d for d in deps if d in self.nodes]
            self.in_degree[node_id] = len(valid_deps)
            for dep_id in valid_deps:
                if dep_id in self.edges:
                    self.edges[dep_id].append(node_id)
                else:
                    self.edges[dep_id] = [node_id]

    def find_missing_dependencies(self) -> Dict[uuid.UUID, List[uuid.UUID]]:
        """Identify node dependencies referencing non-existent node IDs."""
        missing = {}
        for node_id, node_data in self.nodes.items():
            deps = node_data.get('dependencies', [])
            unresolved = [dep for dep in deps if dep not in self.nodes]
            if unresolved:
                missing[node_id] = unresolved
        return missing

    def is_valid(self) -> bool:
        """Check for circular dependencies using Kahn's algorithm."""
        if self.find_missing_dependencies():
            return False

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

    def validate_graph(self) -> Dict[str, Any]:
        """Comprehensive graph analysis returning validation results."""
        missing = self.find_missing_dependencies()
        has_cycles = not self.is_valid()
        
        return {
            "is_valid": len(missing) == 0 and not has_cycles,
            "has_cycles": has_cycles,
            "missing_dependencies": missing,
            "node_count": len(self.nodes),
            "edge_count": sum(len(children) for children in self.edges.values())
        }

    def get_execution_order(self) -> List[uuid.UUID]:
        """Returns nodes in topological order."""
        if not self.is_valid():
            raise ValueError("Invalid DAG: Circular dependency or missing dependencies detected")
            
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

    def get_parallel_stages(self) -> List[List[uuid.UUID]]:
        """Groups nodes into parallel execution levels."""
        if not self.is_valid():
            raise ValueError("Invalid DAG for stage calculation")
            
        in_degree_copy = self.in_degree.copy()
        current_stage = [u for u, deg in in_degree_copy.items() if deg == 0]
        stages = []
        
        while current_stage:
            stages.append(current_stage)
            next_stage = []
            for u in current_stage:
                for v in self.edges.get(u, []):
                    in_degree_copy[v] -= 1
                    if in_degree_copy[v] == 0:
                        next_stage.append(v)
            current_stage = next_stage
            
        return stages

    def get_ready_nodes(self, completed_node_ids: List[uuid.UUID], skipped_node_ids: List[uuid.UUID] = None) -> List[uuid.UUID]:
        """
        Find nodes that have all dependencies met (completed or skipped).
        """
        resolved_ids = set(completed_node_ids)
        if skipped_node_ids:
            resolved_ids.update(skipped_node_ids)

        ready = []
        for node_id, node_data in self.nodes.items():
            if node_id in resolved_ids:
                continue
                
            deps = node_data.get('dependencies', [])
            if all(dep in resolved_ids for dep in deps):
                ready.append(node_id)
                
        return ready

    def get_subsequent_nodes(self, node_id: uuid.UUID) -> List[uuid.UUID]:
        """Get immediate children of a node."""
        return self.edges.get(node_id, [])


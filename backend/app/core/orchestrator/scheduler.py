import uuid
from typing import Dict, Any, List, Optional, Tuple
import logging

logger = logging.getLogger(__name__)

class TaskScheduler:
    """
    Evaluates execution conditions (IF, ELSE, SWITCH, LOOPS, AI confidence threshold, Manual approval)
    and determines node branch eligibility and execution strategies (Sequential vs Parallel).
    """

    @staticmethod
    def evaluate_condition(conditions: Dict[str, Any], context: Dict[str, Any]) -> bool:
        """
        Evaluates node execution conditions against current workflow context data.
        Conditions support:
        - "field": Context data key to evaluate
        - "operator": "eq", "neq", "gt", "gte", "lt", "lte", "contains", "in", "ai_confidence"
        - "value": Expected comparison value
        - "min_confidence": Threshold for AI nodes
        """
        if not conditions:
            return True # No condition implies unconditional execution

        # IF / ELSE branch check
        rule_type = conditions.get("type", "SIMPLE")
        
        if rule_type == "SIMPLE":
            field = conditions.get("field")
            operator = conditions.get("operator", "eq")
            expected_val = conditions.get("value")
            
            if not field:
                return True
                
            actual_val = context.get(field)
            
            if operator == "eq":
                return actual_val == expected_val
            elif operator == "neq":
                return actual_val != expected_val
            elif operator == "gt":
                return actual_val is not None and actual_val > expected_val
            elif operator == "gte":
                return actual_val is not None and actual_val >= expected_val
            elif operator == "lt":
                return actual_val is not None and actual_val < expected_val
            elif operator == "lte":
                return actual_val is not None and actual_val <= expected_val
            elif operator == "contains":
                return expected_val in actual_val if isinstance(actual_val, (list, str)) else False
            elif operator == "ai_confidence":
                min_conf = conditions.get("min_confidence", 0.85)
                ai_score = context.get("ai_confidence_score", 1.0)
                return ai_score >= min_conf
                
        elif rule_type == "APPROVAL":
            # Requires explicit manual approval
            return context.get("manual_approval_granted", False)
            
        elif rule_type == "SWITCH":
            switch_key = conditions.get("field")
            cases = conditions.get("cases", {})
            actual_val = context.get(switch_key)
            target_branch = cases.get(str(actual_val), conditions.get("default"))
            return target_branch is not None

        return True

    @staticmethod
    def filter_runnable_nodes(ready_nodes_data: List[Dict[str, Any]], context: Dict[str, Any]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Splits ready nodes into nodes to execute vs nodes to skip based on condition evaluation.
        """
        to_execute = []
        to_skip = []

        for node in ready_nodes_data:
            conds = node.get("conditions", {})
            if TaskScheduler.evaluate_condition(conds, context):
                to_execute.append(node)
            else:
                to_skip.append(node)

        return to_execute, to_skip

from typing import Any, List
from .commands import CorrectionCommand

class CorrectionEngine:
    """
    Applies a sequence of correction commands to an immutable IFDM base tree to produce
    the Corrected IFDM.
    """
    
    def apply_corrections(self, base_ifdm: Any, commands: List[CorrectionCommand]) -> Any:
        """
        Replays the given commands over the base_ifdm.
        """
        import copy
        # We must operate on a copy to preserve immutability of the base document.
        corrected_ifdm = copy.deepcopy(base_ifdm)
        
        for command in commands:
            corrected_ifdm = command.execute(corrected_ifdm)
            
        return corrected_ifdm

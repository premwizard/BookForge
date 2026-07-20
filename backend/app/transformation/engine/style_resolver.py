from typing import Dict, Any, Optional
from app.transformation.ifdm.models import ComputedStyle

class StyleResolver:
    """
    Computes final styles for a node based on priority order:
    Manual Override > Publisher Rule > Mapped Style > Blueprint Style > Inherited Style > Default Style
    """

    def __init__(self, 
                 default_styles: Dict[str, Any],
                 blueprint_styles: Dict[str, Any],
                 mapped_styles: Dict[str, Any],
                 publisher_rules: Dict[str, Any]):
        self.default_styles = default_styles
        self.blueprint_styles = blueprint_styles
        self.mapped_styles = mapped_styles
        self.publisher_rules = publisher_rules

    def resolve_style(self, 
                      node_type: str, 
                      inherited_style: Optional[ComputedStyle] = None, 
                      manual_override: Optional[Dict[str, Any]] = None) -> ComputedStyle:
        """
        Resolves the final computed style for a node.
        """
        final_style = ComputedStyle()
        
        # 6. Default Style
        if node_type in self.default_styles:
            self._apply_style(final_style, self.default_styles[node_type], "Default")
            
        # 5. Inherited Style
        if inherited_style:
            self._apply_style(final_style, inherited_style.dict(exclude_none=True), "Inherited")
            
        # 4. Blueprint Style
        if node_type in self.blueprint_styles:
            self._apply_style(final_style, self.blueprint_styles[node_type], "Blueprint")
            
        # 3. Mapped Style
        if node_type in self.mapped_styles:
            self._apply_style(final_style, self.mapped_styles[node_type], "Mapped")
            
        # 2. Publisher Rule
        if node_type in self.publisher_rules:
            self._apply_style(final_style, self.publisher_rules[node_type], "Rule")
            
        # 1. Manual Override
        if manual_override:
            self._apply_style(final_style, manual_override, "Manual")
            
        return final_style
        
    def _apply_style(self, target: ComputedStyle, source: Dict[str, Any], source_name: str):
        for key, value in source.items():
            if hasattr(target, key) and value is not None:
                setattr(target, key, value)
        target.resolved_from = source_name

# Publisher Blueprint & Master Template Studio Engine

The **Publisher Blueprint & Master Template Studio Engine** acts as the definitive format & style specification authority of DocForge. It enables publishers, graphic designers, and layout architects to extract, author, inspect, version, and enforce machine-readable publishing blueprints (`.blueprint.json`).

---

## 1. Machine-Readable Blueprint Schema (`.blueprint.json`)

```json
{
  "template_name": "Penguin Standard Academic 6x9",
  "category": "Academic & Fiction",
  "version": 2,
  "page_geometry": {
    "trim_size": "6x9 in",
    "margin_top_in": 1.0,
    "margin_bottom_in": 1.0,
    "margin_inside_in": 1.25,
    "margin_outside_in": 1.0,
    "columns": 1
  },
  "styles": [
    {
      "style_name": "Heading 1",
      "style_type": "paragraph",
      "properties": {
        "font_family": "Garamond",
        "font_size_pt": 24.0,
        "font_weight": "bold",
        "color": "#111827",
        "line_height": 1.2,
        "space_before_pt": 18.0,
        "space_after_pt": 12.0,
        "keep_with_next": true
      }
    },
    {
      "style_name": "Body Text",
      "style_type": "paragraph",
      "properties": {
        "font_family": "Times New Roman",
        "font_size_pt": 11.5,
        "line_height": 1.35,
        "first_line_indent_pt": 18.0,
        "space_after_pt": 6.0
      }
    }
  ],
  "rules": [
    { "rule_type": "ORPHAN_CONTROL", "rule_data": { "min_lines": 2 } },
    { "rule_type": "HEADING_KEEP_WITH_NEXT", "rule_data": { "enabled": true } }
  ]
}
```

---

## 2. AI & Fuzzy Style Mapping Engine

The **Style Mapping Studio** matches raw author styles (`Heading 1`, `Text body`, `CustomQuoteBlock`) to target blueprint styles:

1. **Exact Match (98% Confidence)**: Case-insensitive string equality with target style.
2. **Semantic Match (90% Confidence)**: Keyword heuristics (`H1`/`Title` -> `Heading 1`, `H2` -> `Heading 2`).
3. **Keyword Heuristic (85% Confidence)**: `Quote` -> `Blockquote`, `Grid` -> `Academic Table`.
4. **Batch Approval**: 1-Click approval batch processing for all mappings.

---

## 3. REST API Reference

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/blueprints` | List all publisher templates and active blueprints |
| `POST` | `/api/v1/blueprints` | Create template profile & extract baseline blueprint AST |
| `GET` | `/api/v1/blueprints/{template_id}` | Retrieve template details and latest blueprint AST |
| `POST` | `/api/v1/blueprints/{template_id}/extract` | Re-run DOCX style extraction algorithm |
| `POST` | `/api/v1/blueprints/{template_id}/blueprint/save` | Save new blueprint version snapshot |
| `GET` | `/api/v1/blueprints/{template_id}/mappings` | Get AI style mappings and confidence scores |
| `POST` | `/api/v1/blueprints/{template_id}/mappings/approve` | Bulk approve or override style mappings |

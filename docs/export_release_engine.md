# Multi-Format Export & Enterprise Publishing Release Engine

The **Multi-Format Export & Enterprise Publishing Release Engine** is the final delivery system of DocForge. It packages formatted internal document models (IFDM/LDM) into production-ready publishing release packages across multiple formats.

---

## 1. Supported Export Formats

| Format Tag | Description | Standard / Profile |
| :--- | :--- | :--- |
| `PDF_X1A` | Press-Ready CMYK PDF | PDF/X-1a:2001 (Fogra39 / SWOP, Trim/Bleed Marks) |
| `PDF_A1B` | Archival PDF Container | PDF/A-1b (ISO 19005-1, Embedded Fonts) |
| `EPUB_33` | Accessible Reflowable Ebook | EPUB 3.3 (IDPF / W3C Specification, NCX TOC) |
| `JATS_XML` | Academic Journal Article Schema | NLM / JATS 1.3 XML (PubMed Central Schema) |
| `ICML` | Desktop Publishing Text Thread | Adobe InDesign ICML Exchange Format |
| `HTML5_WEB` | Responsive Web Publication | HTML5 + CSS3 Embedded Web Bundle |

---

## 2. Automated Preflight Quality Check Pipeline

Prior to generating final distribution artifacts, the `PreflightChecker` executes 4 mandatory quality checks:

1. **Image DPI Check**: Verifies all embedded image assets satisfy the 300+ DPI threshold for press printing.
2. **Font Subsetting & Embedding**: Ensures all document typefaces are subsetted and embedded in the PDF container.
3. **Color Profile Conversion**: Verifies RGB color space assets are converted to CMYK (Fogra39 / SWOP).
4. **Accessibility Alt Text**: Verifies all figures contain WCAG-compliant ARIA alt text for screen readers.

---

## 3. Zipped Release Bundler & ONIX 3.0 Manifest

Multi-format releases can be packaged into a single `.zip` archive containing:
- Selected format artifacts (`.pdf`, `.epub`, `.xml`).
- `release_manifest.json` detailing package contents and checksums.
- `onix_manifest.json` formatted to the **ONIX 3.0** metadata standard for international book distribution (ISBN-13, DOI, BISAC subject categories).

---

## 4. REST API Reference

| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/documents/{id}/export` | Trigger asynchronous multi-format export rendering |
| `GET` | `/api/v1/documents/{id}/exports` | List all export artifacts and preflight status |
| `POST` | `/api/v1/export/{export_id}/preflight` | Execute manual pre-flight quality verification run |
| `POST` | `/api/v1/documents/{id}/bundle` | Create zipped multi-format release bundle with ONIX manifest |
| `GET` | `/api/v1/export/bundles/{document_id}` | List release bundles for a document |
| `GET` | `/api/v1/export/{export_id}/download` | Track download analytics and return file download URL |
| `DELETE` | `/api/v1/export/{export_id}` | Remove export artifact from storage |

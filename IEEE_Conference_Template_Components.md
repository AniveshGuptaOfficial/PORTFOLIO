# Components of an IEEE Conference Template

An IEEE conference paper template (LaTeX `conference` option of `IEEEtran.cls`, or the official Word A4/Letter templates) is composed of the following standard components:

## 1. Front Matter Components

1. **Paper Title** — Short, informative title at the top. *Rule: No symbols, special characters, footnotes, math, or sub-titles.*
2. **Authors and Affiliations** — Up to 6 authors listed left-to-right, each with: department/division, organization name, city, country, and email/ORCID (`\IEEEauthorblockN` / `\IEEEauthorblockA`).
3. **Funding / `\thanks{}` Footnote** — Identifies the funding agency; a footnote attached to the title on page 1.
4. **Abstract** — A single concise paragraph (≈150–250 words) summarizing purpose, methods, results, and conclusions. *No symbols, special characters, footnotes, or math allowed.*
5. **Index Terms / Keywords** — 3–6 keywords (`\begin{IEEEkeywords}`) used for indexing and search.

## 2. Body Components

6. **Introduction (Heading 1)** — Motivation, problem statement, objectives, and paper organization.
7. **Main Sections (Heading 1)** — e.g., *Related Work, Methodology/Proposed Approach, System Design, Experimental Setup*, each may have subsections (Heading 2) and further levels (Heading 3/4).
8. **Figures** — Placed at top/bottom of columns; caption *below* the figure, referenced as `Fig. 1`; axis labels spelled out with units in parentheses, 8-pt Times New Roman.
9. **Tables** — Placed at top/bottom of columns; table head *above* the table; footnotes marked with superscript letters.
10. **Equations** — Numbered consecutively in parentheses, centered; variables italicized, symbols defined before or after; use `\eqref{}`.
11. **Results and Discussion** — Analysis of experiments, comparisons, and interpretation (can be one or two sections).
12. **Conclusion (Heading 1)** — Summary of contributions, findings, and future work.

## 3. Back Matter Components

13. **Acknowledgment** — Sponsor/funding credits (unnumbered, "Acknowledgment" heading — spelled without the second "e").
14. **References** — Numbered citations in brackets `[1]`, consecutively, formatted with `IEEEtran.bst` (BibTeX) or the built-in Word `(references)` style.
15. **IEEE Guidance Text (red)** — Template instructions that **must be removed before submission**.

## 4. Layout / Style Components (prescribed — do not modify)

- Two-column format, fixed margins, column widths, and line spacing
- Font: Times New Roman, 10 pt body text
- Section heads in Roman numerals (I, II, III…), subsection heads in capital letters
- 8 pt captions for figures/tables
- Page limit and margins set per the conference's specifications

## Supporting Files in the IEEE Template Package

| Component | Purpose |
|---|---|
| `IEEEtran.cls` (in LaTeX zip) | LaTeX class defining all styles/components |
| `IEEEtran.bst` / `IEEEtranS.bst` (in IEEEtranBST2 zip) | BibTeX styles for the References list |
| `conference-template-a4.docx` | Word template for A4 paper |
| `conference-template-letter.docx` | Word template for US Letter paper |

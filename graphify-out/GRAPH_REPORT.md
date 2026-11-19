# Graph Report - travelwebsite  (2026-11-19)

## Corpus Check
- Corpus is ~5,642 words - fits in a single context window. You may not need a graph.

## Summary
- 82 nodes · 171 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Core Interface Components
- Travel Data and Navigation
- Detail Pages and Planning
- Development Tooling
- Application Bootstrap and Styling
- Project Metadata
- UI Runtime Dependencies
- Build and Run Scripts
- Brand Identity
- HTML Entry and Theme
- Favicon Asset

## God Nodes (most connected - your core abstractions)
1. `App()` - 23 edges
2. `SectionIntro()` - 9 edges
3. `DestinationDetailPage()` - 8 edges
4. `PackageDetailPage()` - 8 edges
5. `SafeImage()` - 7 edges
6. `slugify()` - 7 edges
7. `whatsappUrl()` - 6 edges
8. `PageHero()` - 6 edges
9. `react` - 5 edges
10. `react-router-dom` - 5 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `DestinationDetailPage()`  [EXTRACTED]
  src/App.jsx → src/pages.jsx
- `App()` --calls--> `NotFound()`  [EXTRACTED]
  src/App.jsx → src/pages.jsx
- `App()` --calls--> `PackageDetailPage()`  [EXTRACTED]
  src/App.jsx → src/pages.jsx
- `App()` --calls--> `PageHero()`  [EXTRACTED]
  src/App.jsx → src/pages.jsx
- `App()` --calls--> `PlanningProcess()`  [EXTRACTED]
  src/App.jsx → src/pages.jsx

## Import Cycles
- None detected.

## Communities (11 total, 1 thin omitted)

### Community 0 - "Core Interface Components"
Cohesion: 0.21
Nodes (19): About(), App(), Contact(), Destinations(), EnquiryModal(), Faq(), FloatingActions(), Footer() (+11 more)

### Community 1 - "Travel Data and Navigation"
Cohesion: 0.21
Nodes (13): Header(), serviceIcons, ThemeToggle(), today, business, destinations, faqs, navItems (+5 more)

### Community 2 - "Detail Pages and Planning"
Cohesion: 0.38
Nodes (9): destinationDetails, planningSteps, DestinationDetailPage(), NotFound(), PackageDetailPage(), PageHero(), PlanningProcess(), SafeImage() (+1 more)

### Community 3 - "Development Tooling"
Cohesion: 0.29
Nodes (7): devDependencies, @playwright/cli@^0.1.24, vite@^6.4.6, @vitejs/plugin-react@^4.3.4, @playwright/cli, vite, @vitejs/plugin-react

### Community 4 - "Application Bootstrap and Styling"
Cohesion: 0.33
Nodes (4): react@^19.0.0, react-router-dom@^7.18.5, react, react-router-dom

### Community 5 - "Project Metadata"
Cohesion: 0.40
Nodes (4): name, private, type, version

### Community 6 - "UI Runtime Dependencies"
Cohesion: 0.40
Nodes (5): dependencies, lucide-react@^0.468.0, react-dom@^19.0.0, lucide-react, react-dom

### Community 7 - "Build and Run Scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

### Community 8 - "Brand Identity"
Cohesion: 0.67
Nodes (3): Vpathfinder Travel Solutions Logo — sweeping blue and red ribbons forming a V, with a red airplane climbing from the right stroke, Vpathfinder Travel Solutions Brand, Tagline: We Make Your Dreams Live

### Community 9 - "HTML Entry and Theme"
Cohesion: 0.67
Nodes (3): React Application Root Mount Point, Vpathfinder HTML Entry Document, Initial Theme Bootstrap

## Knowledge Gaps
- **3 isolated node(s):** `Initial Theme Bootstrap`, `React Application Root Mount Point`, `Travel Website Favicon`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 13 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Application Bootstrap and Styling` to `Travel Data and Navigation`, `Detail Pages and Planning`, `Project Metadata`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **What connects `Initial Theme Bootstrap`, `React Application Root Mount Point`, `Travel Website Favicon` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Why does `react-router-dom` connect `Application Bootstrap and Styling` to `Travel Data and Navigation`, `Detail Pages and Planning`, `Project Metadata`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `UI Runtime Dependencies` to `Travel Data and Navigation`, `Detail Pages and Planning`, `Project Metadata`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
# Graph Report - .  (2026-05-30)

## Corpus Check
- Corpus is ~21,168 words - fits in a single context window. You may not need a graph.

## Summary
- 532 nodes · 643 edges · 33 communities (23 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Seller Terminal POS Interface|Seller Terminal POS Interface]]
- [[_COMMUNITY_Customer Rewards Redemption Catalog|Customer Rewards Redemption Catalog]]
- [[_COMMUNITY_Application Shell Layouts|Application Shell Layouts]]
- [[_COMMUNITY_Admin Customer profile ledger|Admin Customer profile ledger]]
- [[_COMMUNITY_Admin Earning Rules Manager|Admin Earning Rules Manager]]
- [[_COMMUNITY_Core API Client Services|Core API Client Services]]
- [[_COMMUNITY_Customer Dashboard Wallet Balance|Customer Dashboard Wallet Balance]]
- [[_COMMUNITY_Node Manifest Dependencies|Node Manifest Dependencies]]
- [[_COMMUNITY_Application Core Routing|Application Core Routing]]
- [[_COMMUNITY_Admin Campaigns Catalog|Admin Campaigns Catalog]]
- [[_COMMUNITY_Unified Persona Selection Hub|Unified Persona Selection Hub]]
- [[_COMMUNITY_Persona Login Controls|Persona Login Controls]]
- [[_COMMUNITY_In-Memory Mock Database Engine|In-Memory Mock Database Engine]]
- [[_COMMUNITY_App Browser compilation config|App Browser compilation config]]
- [[_COMMUNITY_Vite Node compilation config|Vite Node compilation config]]
- [[_COMMUNITY_Role-Based Routing Shell|Role-Based Routing Shell]]
- [[_COMMUNITY_Loyalty API Business Interface|Loyalty API Business Interface]]
- [[_COMMUNITY_Seller Point Transfer History|Seller Point Transfer History]]
- [[_COMMUNITY_Admin Loyalty Segments Manager|Admin Loyalty Segments Manager]]
- [[_COMMUNITY_Customer Points Ledger|Customer Points Ledger]]
- [[_COMMUNITY_Vite Bundler Base config|Vite Bundler Base config]]
- [[_COMMUNITY_ESLint flat linter module|ESLint flat linter module]]
- [[_COMMUNITY_Root Entrypoint HTML Document|Root Entrypoint HTML Document]]
- [[_COMMUNITY_Development Readme Documentation|Development Readme Documentation]]
- [[_COMMUNITY_App Favicon brand icon|App Favicon brand icon]]
- [[_COMMUNITY_App UI icon sprites sheet|App UI icon sprites sheet]]
- [[_COMMUNITY_Surya Group Public Logo Brand|Surya Group Public Logo Brand]]
- [[_COMMUNITY_Hero banner landing visual|Hero banner landing visual]]
- [[_COMMUNITY_React framework SVG Logo|React framework SVG Logo]]
- [[_COMMUNITY_Surya Group Local Asset Logo|Surya Group Local Asset Logo]]
- [[_COMMUNITY_Vite developer tool SVG Logo|Vite developer tool SVG Logo]]

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 31 edges
2. `compilerOptions` - 17 edges
3. `compilerOptions` - 16 edges
4. `api` - 12 edges
5. `API Client Service` - 11 edges
6. `App Root Shell and Router Component` - 8 edges
7. `Auth State Consumer Hook` - 8 edges
8. `Modal()` - 6 edges
9. `scripts` - 5 edges
10. `isEnforcedMock()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Application TypeScript Configuration` --conceptually_related_to--> `Vite Bundler Configuration`  [INFERRED]
  tsconfig.app.json → vite.config.ts
- `Vite Node Environment TypeScript Configuration` --references--> `Vite Bundler Configuration`  [EXTRACTED]
  tsconfig.node.json → vite.config.ts
- `Modal Shared Dialog Component` --semantically_similar_to--> `Toast Alert Center Container`  [INFERRED] [semantically similar]
  src/components/Modal.tsx → src/components/Toast.tsx
- `Rapid Developer Testing Credentials Prefill` --semantically_similar_to--> `Mock DB Bypass and Server Selector Switch`  [INFERRED] [semantically similar]
  src/pages/Login.tsx → src/pages/UnifiedHub.tsx
- `Admin Customers Component` --semantically_similar_to--> `Seller Terminal Component`  [INFERRED] [semantically similar]
  src/pages/admin/Customers.tsx → src/pages/seller/Terminal.tsx

## Hyperedges (group relationships)
- **Cockpit Role-Based Routing Architecture** — layouts_admin_layout, layouts_customer_layout, layouts_seller_layout, app_app, login_component [EXTRACTED 1.00]
- **Global Notification Alert System** — toast_container_component, toast_item_component, authcontext_provider, authcontext_useauth, app_app [EXTRACTED 1.00]
- **Mock Offline Demo Architectural Pattern** — unifiedhub_db_toggle_mechanism, login_quickfill_mechanism, authcontext_provider [INFERRED 0.95]
- **Admin Management Suite** — customers_admincustomers, dashboard_admindashboard, earningrules_adminearningrules, segments_adminsegments [INFERRED 0.85]
- **Customer Loyalty Portal** — catalog_customercatalog, dashboard_customerdashboard, transactions_customertransactions [INFERRED 0.85]
- **Merchant POS Terminal Actions** — terminal_sellerterminal, transactions_sellertransactions, api_api [INFERRED 0.85]

## Communities (33 total, 10 thin omitted)

### Community 0 - "Seller Terminal POS Interface"
Cohesion: 0.04
Nodes (46): addToCartBtnStyle, cartBuilderBoxStyle, cartFormRowStyle, CartItem, cartSummaryRowStyle, cartTableContainerStyle, cartTableStyle, clearCartBtnStyle (+38 more)

### Community 1 - "Customer Rewards Redemption Catalog"
Cohesion: 0.05
Nodes (36): balanceBadgeStyle, cardDescStyle, cardFooterStyle, cardMainStyle, cardsGridStyle, cardStyle, cardTitleStyle, cardTopStyle (+28 more)

### Community 2 - "Application Shell Layouts"
Cohesion: 0.06
Nodes (35): adminContainerStyle, avatarStyle, bodyContentStyle, burgerStyle, customerActionsStyle, customerContainerStyle, customerHeaderStyle, customerLogoTextStyle (+27 more)

### Community 3 - "Admin Customer profile ledger"
Cohesion: 0.06
Nodes (33): actionBtnStyle, auditHeaderStyle, containerStyle, countLabelStyle, dateStyle, filterRowStyle, gridTableStyle, ledgerDescBoxStyle (+25 more)

### Community 4 - "Admin Earning Rules Manager"
Cohesion: 0.06
Nodes (31): actionBtnStyle, addButtonStyle, badgeStyle, containerStyle, dotStyle, formGroupStyle, formStyle, gridTableStyle (+23 more)

### Community 5 - "Core API Client Services"
Cohesion: 0.08
Nodes (29): cardContentStyle, cardFooterStyle, cardLabelStyle, cardStyle, cardValStyle, chartBadgeStyle, chartHeaderStyle, chartRowStyle (+21 more)

### Community 6 - "Customer Dashboard Wallet Balance"
Cohesion: 0.07
Nodes (29): bottomPanelStyle, bottomTitleStyle, containerStyle, dashboardGridStyle, levelTextLabelStyle, levelValueStyle, loaderContainerStyle, milestonesLabelsStyle (+21 more)

### Community 7 - "Node Manifest Dependencies"
Cohesion: 0.07
Nodes (27): dependencies, lucide-react, react, react-dom, react-router-dom, devDependencies, eslint, @eslint/js (+19 more)

### Community 8 - "Application Core Routing"
Cohesion: 0.12
Nodes (23): AdminCampaigns(), AdminCustomers(), AdminDashboard(), AdminEarningRules(), AdminSegments(), closeButtonStyle, containerStyle, iconStyle (+15 more)

### Community 9 - "Admin Campaigns Catalog"
Cohesion: 0.07
Nodes (27): addButtonStyle, barBgStyle, barFgStyle, cardDescStyle, cardFooterStyle, cardMainStyle, cardsGridStyle, cardStyle (+19 more)

### Community 10 - "Unified Persona Selection Hub"
Cohesion: 0.07
Nodes (27): actionLabelStyle, avatarStyle, badgeStyle, cardDescStyle, cardsGridStyle, cardStyle, cardTitleStyle, connectionLabelStyle (+19 more)

### Community 11 - "Persona Login Controls"
Cohesion: 0.10
Nodes (20): ambientGlowStyle, backButtonStyle, cardHeaderStyle, cardSubtitleStyle, cardTitleStyle, containerStyle, contentCardWrapperStyle, formGroupStyle (+12 more)

### Community 12 - "In-Memory Mock Database Engine"
Cohesion: 0.17
Nodes (16): getDb(), KEYS, setDb(), updateSegmentsCustomerCount(), Campaign, Customer, EarningRule, INITIAL_CAMPAIGNS (+8 more)

### Community 13 - "App Browser compilation config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 14 - "Vite Node compilation config"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 15 - "Role-Based Routing Shell"
Cohesion: 0.20
Nodes (17): App Root Shell and Router Component, Authentication State Provider, Auth State Consumer Hook, Admin Campaigns Catalog Table View, Create Campaign Wizard Modal Form, Admin Cockpit Shell Layout, Customer Portal Shell Layout, Role Verification Gate Check (+9 more)

### Community 16 - "Loyalty API Business Interface"
Cohesion: 0.18
Nodes (15): API Client Service, Mock Fallback Design Pattern, Customer Catalog Component, Admin Customers Component, Admin Dashboard Component, Customer Dashboard Component, Earning Rules Multiplier Mechanism, Admin Earning Rules Component (+7 more)

### Community 17 - "Seller Point Transfer History"
Cohesion: 0.14
Nodes (13): containerStyle, dateStyle, gridTableStyle, loaderStyle, memberStyle, noDataStyle, subtitleStyle, tableContainerStyle (+5 more)

### Community 18 - "Admin Loyalty Segments Manager"
Cohesion: 0.14
Nodes (13): containerStyle, formulaStyle, gridTableStyle, loaderStyle, membersBadgeStyle, noDataStyle, subtitleStyle, tableContainerStyle (+5 more)

### Community 19 - "Customer Points Ledger"
Cohesion: 0.14
Nodes (13): badgeStyle, containerStyle, dateStyle, gridTableStyle, loaderStyle, noDataStyle, subtitleStyle, tableContainerStyle (+5 more)

### Community 20 - "Vite Bundler Base config"
Cohesion: 0.40
Nodes (5): files, references, Application TypeScript Configuration, Vite Node Environment TypeScript Configuration, Vite Bundler Configuration

## Knowledge Gaps
- **422 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+417 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `Application Core Routing` to `Seller Terminal POS Interface`, `Customer Rewards Redemption Catalog`, `Application Shell Layouts`, `Admin Customer profile ledger`, `Admin Earning Rules Manager`, `Core API Client Services`, `Customer Dashboard Wallet Balance`, `Admin Campaigns Catalog`, `Unified Persona Selection Hub`, `Persona Login Controls`, `Seller Point Transfer History`, `Admin Loyalty Segments Manager`, `Customer Points Ledger`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `api` connect `Core API Client Services` to `Seller Terminal POS Interface`, `Customer Rewards Redemption Catalog`, `Admin Customer profile ledger`, `Admin Earning Rules Manager`, `Customer Dashboard Wallet Balance`, `Admin Campaigns Catalog`, `Seller Point Transfer History`, `Admin Loyalty Segments Manager`, `Customer Points Ledger`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `Modal()` connect `Admin Earning Rules Manager` to `Seller Terminal POS Interface`, `Admin Campaigns Catalog`, `Admin Customer profile ledger`, `Customer Rewards Redemption Catalog`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _425 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Seller Terminal POS Interface` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `Customer Rewards Redemption Catalog` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `Application Shell Layouts` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
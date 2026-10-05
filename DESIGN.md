# Food Delivery Management Dashboard — Design System Specification

> **Project Source**: Stitch Project `17970512265107570822`  
> **System Name**: Vibrant Cravings / FoodieDash Design System  
> **Design Philosophy**: Modern Editorial & Soft Minimalism with high-chroma appetite appeal, spatial breathing room, and high-clarity data density.

---

## 1. Color Palette

The color system utilizes a tiered Material 3 token structure tailored for a high-energy food delivery consumer experience and high-efficiency operations administration.

### 1.1 Brand & Core Palette

| Token Name | Hex Code | Role / Usage | Contrast / Pairing |
| :--- | :--- | :--- | :--- |
| `primary` | `#b51c00` (`#ff4d2d`) | Brand primary, main CTA buttons, active states, key highlights | `#ffffff` (`on-primary`) |
| `primary-container` | `#db3416` / `#3366cc` | Promoted banners, selected chips, category badges | `#fffbff` (`on-primary-container`) |
| `primary-fixed` | `#ffdad3` / `#d9e2ff` | Soft tinted brand surfaces, subtle tag backgrounds | `#3e0400` (`on-primary-fixed`) |
| `primary-fixed-dim` | `#ffb4a5` / `#b1c5ff` | Light mode border accents, focus glow rings | `#8e1400` (`on-primary-fixed-variant`) |
| `secondary` | `#006d37` (`#27ae60`) | Veg indicators, delivery success, "Open Now" badges, discounts | `#ffffff` (`on-secondary`) |
| `secondary-container` | `#7bf8a1` / `#dfe3e8` | Positive state containers, customer avatar backgrounds | `#007239` (`on-secondary-container`) |
| `secondary-fixed` | `#7efba4` | Highlight tags, free delivery callouts | `#00210c` (`on-secondary-fixed`) |
| `secondary-fixed-dim` | `#61de8a` | Banner gradient backgrounds, secondary accent tint | `#005228` (`on-secondary-fixed-variant`) |
| `tertiary` | `#795600` (`#ffb800`) | Star ratings, Bestseller tags, operational warnings | `#ffffff` (`on-tertiary`) |
| `tertiary-container` | `#986d00` / `#bfab49` | Pending order tags, rating chip surfaces | `#fffbff` (`on-tertiary-container`) |
| `tertiary-fixed` | `#ffdea8` / `#f9e37a` | Coupon & offer notification banner backgrounds | `#271900` (`on-tertiary-fixed`) |
| `tertiary-fixed-dim` | `#ffba20` / `#dcc661` | Star rating stars, warning indicators | `#5e4200` (`on-tertiary-fixed-variant`) |
| `error` | `#ba1a1a` | Destructive actions, cancelled orders, live alert dots | `#ffffff` (`on-error`) |
| `error-container` | `#ffdad6` | Error message boxes, cancellation pill backgrounds | `#93000a` (`on-error-container`) |

### 1.2 Surface & Neutral Foundation

| Token Name | Hex Code | Role / Usage |
| :--- | :--- | :--- |
| `background` / `surface` | `#f9f9fc` | Base app canvas background (cool crisp neutral) |
| `surface-bright` | `#f9f9fc` | High-lighted canvas background |
| `surface-dim` | `#dadadc` | Backdrop blur overlays, secondary canvas layers |
| `surface-container-lowest`| `#ffffff` | Primary cards, modals, checkout white containers |
| `surface-container-low` | `#f3f3f6` | Input fields, category chip inactive backgrounds |
| `surface-container` | `#eeeef0` | Dividers, subtle panel wrappers, borders |
| `surface-container-high`| `#e8e8ea` | Secondary buttons, hovered card states |
| `surface-container-highest`| `#e2e2e5` | Inactive chip borders, subtle table headers |
| `on-background` / `on-surface` | `#1a1c1e` | High-contrast primary headlines & text copy |
| `on-surface-variant` | `#5c403a` / `#434653` | Secondary metadata, descriptions, timestamps, subtitles |
| `outline` | `#906f69` / `#737784` | Form borders, search icons, secondary icons |
| `outline-variant` | `#e5beb6` / `#c3c6d5` | Subtle dividers, ghost card borders (15% opacity) |
| `inverse-surface` | `#2f3133` | Dark tooltips, dark mode surfaces, mobile bottom nav |
| `inverse-on-surface` | `#f0f0f3` | Text on dark tooltips |

### 1.3 Operational Status Logic

| Status | Badge Background | Badge Text Color | Border | Meaning / Intent |
| :--- | :--- | :--- | :--- | :--- |
| **Pending** | `#bfab49` / `#ffdea8` | `#4a3f00` / `#271900` | None | Order placed, awaiting restaurant acceptance |
| **Preparing** | `#dfe3e8` / `#e2e2e5` | `#606569` / `#434653` | None | Food being cooked in kitchen |
| **Out for Delivery**| `#db3416` / `#3366cc` | `#ffffff` | None | Rider assigned & in transit |
| **Delivered** | `#eeeef0` / `#f3f3f6` | `#006d37` / `#b51c00` | 1px solid `#006d37` | Successfully completed order |
| **Cancelled** | `#ffdad6` | `#93000a` | None | Rejected or cancelled order |
| **Veg Dietary** | Transparent / `#ffffff` | `#006d37` | 1px solid `#006d37` | Green outer square with centered green circle |
| **Non-Veg Dietary** | Transparent / `#ffffff` | `#ba1a1a` | 1px solid `#ba1a1a` | Red outer square with centered red circle |

---

## 2. Typography

The design system pairs **Montserrat** (impactful, geometric, appetizing headlines) with **Inter** (crystal-clear, utilitarian body copy) and **Public Sans** (technical data and table microcopy). In editorial admin screens, **Noto Serif** provides a refined executive polish.

### 2.1 Font Families

- **Display & Headlines (Customer)**: `'Montserrat', sans-serif`
- **Display & Headlines (Admin/Editorial)**: `'Noto Serif', serif` / `'Montserrat', sans-serif`
- **Body Text**: `'Inter', sans-serif`
- **Labels & Microcopy**: `'Inter', sans-serif` / `'Public Sans', sans-serif`
- **Icons**: `'Material Symbols Outlined'` (Variable font settings: `FILL` 0 or 1, `wght` 400..700)

### 2.2 Typographic Hierarchy & Scale

| Style Token | Font Family | Size (px/rem) | Line Height | Weight | Tracking | Purpose / Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-lg` | Montserrat | `32px` (`2rem`) | `40px` (`2.5rem`) | `700` (Bold) | `-0.02em` | Main desktop hero headlines & brand logos |
| `display-lg-mobile`| Montserrat | `26px` (`1.625rem`)| `32px` (`2rem`) | `700` (Bold) | `-0.01em` | Mobile brand headlines & hero titles |
| `headline-lg` | Montserrat | `24px` (`1.5rem`) | `32px` (`2rem`) | `600` (SemiBold) | `-0.01em` | Section major titles, restaurant title |
| `headline-md` | Montserrat | `20px` (`1.25rem`) | `28px` (`1.75rem`)| `600` (SemiBold) | Normal | Section headings, modal titles, menu headers |
| `headline-sm` | Montserrat | `18px` (`1.125rem`)| `24px` (`1.5rem`) | `600` (SemiBold) | Normal | Dish titles, subheadings, bento card headers |
| `body-lg` | Inter | `16px` (`1rem`) | `24px` (`1.5rem`) | `400` (Regular) | Normal | Lead paragraphs, restaurant descriptions |
| `body-md` | Inter | `14px` (`0.875rem`)| `20px` (`1.25rem`)| `400` (Regular) | Normal | Primary UI body copy, dish descriptions, table data |
| `body-sm` | Inter | `12px` (`0.75rem`) | `18px` (`1.125rem`)| `400` (Regular) | Normal | Helper text, secondary timestamps, disclaimers |
| `label-md` | Inter / Public Sans | `12px` (`0.75rem`) | `16px` (`1rem`) | `600` (SemiBold) | `+0.05em` | Button text, table headers (uppercase), badges |
| `label-sm` | Inter / Public Sans | `11px` (`0.6875rem`)| `14px` (`0.875rem`)| `500` (Medium) | Normal | Rating counts, metadata pills, tag labels |

---

## 3. Spacing & Grid System

Based on a strict **4px / 8px linear scale** that guarantees mathematical proportion and vertical rhythm across viewports.

### 3.1 Spacing Scale

| Token | Value (px) | Value (rem) | Typical Application |
| :--- | :--- | :--- | :--- |
| `xs` | `4px` | `0.25rem` | Icon-to-text gap, badge inner padding |
| `sm` | `8px` | `0.5rem` | Button vertical padding, chip spacing, inner card gaps |
| `base` | `8px` | `0.5rem` | Core grid unit |
| `md` | `16px` | `1rem` | Card internal padding, standard element gaps |
| `lg` | `24px` | `1.5rem` | Section internal padding, grid column gaps |
| `xl` | `32px` | `2rem` | Major section vertical gaps, hero container margin |
| `xxl` | `48px` | `3rem` | Page level section dividers |

### 3.2 Layout Grids & Container Constraints

- **Max Container Width**: `1280px` (`max-w-[1280px] mx-auto`)
- **Desktop Grid (>=1024px)**: 12-column fluid grid, `24px` gutter, `32px` to `80px` outer margins.
- **Tablet Grid (768px - 1023px)**: 6 or 8-column grid, `16px` to `20px` gutter, `24px` outer margins.
- **Mobile Grid (<768px)**: 4-column fluid grid, `16px` gutter (`grid-gutter`), `20px` side margin (`px-grid-margin`).

---

## 4. Border Radius (Shapes)

A rounded, approachable geometric shape language that creates physical tactile warmth without sacrificing structure.

| Token | Value (rem/px) | Usage |
| :--- | :--- | :--- |
| `sm` | `0.25rem` (`4px`) | Dietary icons, tiny tag pills, inner progress bars |
| `DEFAULT` / `md` | `0.5rem` (`8px`) | Standard buttons, input fields, dropdown menus, toast alerts |
| `lg` | `0.75rem` (`12px`)| Dish cards, table containers, search bars, secondary cards |
| `xl` | `1rem` (`16px`) | Main restaurant cards, modal containers, checkout sections |
| `2xl` | `1.5rem` (`24px`)| Hero promo banners, restaurant hero images, dashboard KPI boxes |
| `full` | `9999px` | Pill buttons, category avatar rings, status badges, search bars |

---

## 5. Elevation, Shadows & Depth

The design avoids harsh stark drop shadows in favor of **ambient diffused shadows**, **glassmorphic backdrops**, and **ghost borders**.

### 5.1 Elevation Levels

```css
/* Level 0: Flat Canvas Base */
.elevation-0 {
  background-color: #f9f9fc;
}

/* Level 1: Cards & Surfaces */
.shadow-level-1 {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

/* Level 2: Floating Sticky Bars & Hovered Cards */
.shadow-level-2 {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

/* Level 3: Modals, Drawers & Mobile Bottom Navigation */
.shadow-level-3 {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
}
```

### 5.2 Glassmorphism & Ghost Borders

```css
/* Glass Panel Treatment */
.glass-panel {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Ghost Border (Crisp Definition without Heavy Stroke) */
.ghost-border {
  box-shadow: inset 0 0 0 1px rgba(195, 198, 213, 0.15);
}
```

---

## 6. Button System

### 6.1 Button Variants & States

| Button Variant | Background | Text Color | Border | Interaction Effects |
| :--- | :--- | :--- | :--- | :--- |
| **Primary (Pill)** | `#b51c00` (`#ff4d2d`) | `#ffffff` | None | `hover:bg-surface-tint active:scale-95 transition-transform` |
| **Primary Container** | `#db3416` / `#3366cc` | `#fffbff` | None | `hover:opacity-90 active:scale-95` |
| **Secondary (Outline)**| Transparent / `#ffffff` | `#b51c00` (`#ff4d2d`) | 1.5px solid `#db3416` | `hover:bg-primary-fixed/20 active:scale-95` |
| **Surface Neutral** | `#f3f3f6` | `#1a1c1e` | None | `hover:bg-surface-container-high active:scale-95` |
| **Ghost / Icon Button**| Transparent | `#5c403a` | None | `hover:bg-surface-container hover:text-primary rounded-full` |
| **Quantity Stepper** | `#ffffff` / `#eeeef0` | `#b51c00` | 1px solid `#e2e2e5` | `w-8 h-8 flex items-center justify-center hover:bg-surface-variant` |

---

## 7. Cards & Layout Containers

### 7.1 Restaurant Card (Customer Web & Mobile)
- **Container**: `bg-surface-container-lowest`, `rounded-xl`, `overflow-hidden`, `shadow-level-1`.
- **Image Header**: 16:9 ratio, smooth zoom on card hover (`group-hover:scale-105 duration-500`).
- **Floating Badges**: Positioned `top-3 left-3`, uppercase 10px bold pills (`bg-primary text-on-primary` for PROMOTED, `bg-secondary text-on-secondary` for discounts).
- **Body**: Title in `headline-sm`, cuisine tags in `body-md text-on-surface-variant`.
- **Footer Metadata**: Rating pill (`bg-secondary` or `bg-tertiary-fixed` with filled star), delivery time (`schedule` icon), price for two (`$` indicators).

### 7.2 Dish / Menu Item Card
- **Layout**: Horizontal flex card or 2-column grid.
- **Left Side**: Veg/Non-veg icon, Dish Title (`headline-sm`), Price (`₹ / $`), detailed description (`line-clamp-2 text-on-surface-variant`).
- **Right Side**: Square 64px to 112px food thumbnail with rounded corners (`rounded-lg`) + floating "+ Add" or quantity stepper button.

### 7.3 KPI Bento Metric Card (Admin)
- **Container**: `bg-surface-container-lowest`, `rounded-xl`, `ghost-border`, `p-6`, `h-40`, flex col between.
- **Background Accent**: Subtle blurred gradient blob in top right corner (`bg-primary/5 rounded-full blur-xl`).
- **Label**: `font-label text-sm text-on-surface-variant uppercase tracking-wider`.
- **Value**: `font-headline text-4xl text-on-background font-bold`.
- **Trend Indicator**: Green/Red icon with percentage comparison (`+12% vs last hour`).

---

## 8. Navigation Patterns

### 8.1 Desktop Header Navbar
- **Height**: `80px` (`h-20`), `sticky top-0 z-50`, `bg-surface` with subtle shadow (`shadow-sm`).
- **Left**: Brand logo (`text-display-lg font-bold text-primary tracking-tight`) + category badge.
- **Center-Left**: Search input with embedded search icon (`rounded-full bg-surface-container-low pl-10 pr-4 py-2.5`).
- **Right Navigation**: Text links (`Offers`, `Help`, `Sign In`) with `hover:text-primary active:scale-95`.
- **Action**: Pill cart button (`bg-primary text-on-primary px-lg py-2 rounded-full`).

### 8.2 Mobile Header App Bar & Location Switcher
- **Height**: Auto sticky header with bottom border (`border-b border-surface-container-highest`).
- **Location Selector**: Location pin in primary color, bold "Delivery Location", truncated address line, dropdown chevron (`expand_more`).
- **Avatar**: Right-aligned 40px circular profile image.

### 8.3 Mobile Bottom Navigation Bar
- **Height**: `64px` (`h-16`), `fixed bottom-0 w-full z-50`, `bg-surface-container-lowest`, `rounded-t-xl`, `shadow-level-3`.
- **4 Primary Tabs**:
  1. **Home** (`home` icon) — Active state: `text-primary font-bold`.
  2. **Search** (`search` icon) — Inactive state: `text-on-surface-variant`.
  3. **Orders** (`shopping_bag` icon).
  4. **Profile** (`person` icon).

### 8.4 Admin Workspace Navigation
- **Category Sticky Sidebar**: Left 250px column with pill buttons and badge counts.
- **Top Tab Switcher**: Pill-shaped horizontal tabs with background color shifts (`bg-surface-container-lowest` + shadow) for active state rather than hard underline bars.

---

## 9. Tables & Data Visualization

### 9.1 Data Tables (Orders & Management)
- **Table Container**: `bg-surface-container-lowest rounded-xl ghost-border overflow-hidden`.
- **Header (`<thead>`)**: `bg-surface-container-low text-on-surface-variant font-label uppercase text-xs tracking-wider py-4 px-6`.
- **Rows (`<tr>`)**: `divide-y divide-surface-variant/30 hover:bg-surface-container-lowest/50 transition-colors`.
- **Data Formatting**:
  - Order ID: Monospace font (`font-mono text-on-surface-variant`).
  - Customer: Circular 32px initial avatar + bold name.
  - Amount: Bold text (`font-medium text-on-background`).
  - Status: Rounded pill status badge.
  - Actions: Icon buttons (`visibility`, `more_vert`).

### 9.2 Charts & Visual Analytics
- **Bar Charts**:
  - Vertical bars using gradient fills (`linear-gradient(to top, primary, primary-container)`).
  - Top border radius: `rounded-t-DEFAULT` (2px-4px).
  - Animation: CSS `@keyframes riseUp` (0 to 1 opacity with height expansion).
- **Pie / Donut Charts**:
  - Rendered via CSS `conic-gradient(primary 0% 45%, tertiary 45% 75%, surface-variant 75% 100%)`.
- **Sparklines & Trend Lines**:
  - Minimal vector curved line displays with semi-transparent area fill underneath.

---

## 10. Responsive Behavior & Breakpoints

| Breakpoint | Width Range | Layout Shifts & Adaptations |
| :--- | :--- | :--- |
| **Mobile** | `< 768px` | • Bottom navigation bar visible; top nav collapsed<br>• 1-column layout for restaurant list & menu items<br>• Search bar full-width below location header<br>• Horizontally swipeable categories & promo banners (`snap-x overflow-x-auto`)<br>• Floating bottom cart summary bar |
| **Tablet** | `768px - 1023px` | • 2-column grid for restaurant listings<br>• Sidebar converts to collapsible drawer or top tab bar<br>• Top navigation links visible; bottom nav suppressed |
| **Desktop** | `>= 1024px` | • Max-width constrained container (`1280px`)<br>• 3-column or 4-column Bento grid for restaurant cards<br>• 2-column split checkout (Details left 7 cols, Bill & summary right 5 cols)<br>• Sticky category side navigation on menu pages (`sticky top-28`) |

---

## 11. Core Component Guidelines

### 11.1 Form Inputs & Text Fields
- **Container**: `bg-surface-container-low` or `bg-surface-container-lowest ghost-border`.
- **Height**: `44px` (standard desktop/mobile), `40px` (dense admin tables).
- **Border Radius**: `rounded-md` or `rounded-full` for search bars.
- **Focus State**: `focus:ring-2 focus:ring-primary focus:border-transparent`.

### 11.2 Dietary Indicators (Veg / Non-Veg)
- Square container `16px x 16px` with `2px` rounded corners and `1px solid` colored border.
- Center circle `8px x 8px` filled:
  - Green (`#006d37`) for Vegetarian.
  - Red (`#ba1a1a`) for Non-Vegetarian.

### 11.3 Quantity Selector Stepper
- Stepper group with `bg-surface-container-high` and `rounded-lg border border-surface-variant`.
- Decrement (`remove`) button + bold quantity label (`font-label-md w-6 text-center`) + Increment (`add`) button.

### 11.4 Bill Details Breakdown
- Container: `bg-surface-container-lowest rounded-xl p-md border border-surface-container-low`.
- Rows: Key-value flex rows (`font-body-md text-on-surface-variant`).
- Platform discounts in `text-secondary` (Green).
- Dashed divider (`border-surface-variant my-sm border-dashed`).
- Total row in bold (`font-headline-sm font-bold text-on-surface`).

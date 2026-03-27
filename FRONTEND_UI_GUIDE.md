# KisanSuraksha Light-Mode UI Migration Guide

This document captures the precise design tokens, global CSS, and component architectures we built for the high-end "Government-Grade Command Center" Light Mode UI. You can use this guide to implement these changes into your active `agriguard-connect` repository.

## 1. Global Tailwind Configuration ([tailwind.config.ts](file:///d:/ClimatX/ClimatX/frontend/tailwind.config.ts))

The new professional, high-contrast light theme relies on removing the `dark` mode entirely and instituting a specific, subtle green-grey color palette.

**Changes required in your [tailwind.config.ts](file:///d:/ClimatX/ClimatX/frontend/tailwind.config.ts)**:
1. Remove `darkMode: ["class"]`. This forces the app to render identical styling irrespective of system-level dark mode settings.
2. Update the `colors` and `fontFamily` configurations to the following:

```typescript
// tailwind.config.ts

export default {
    content: [ // Leave your content array as is ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
                outfit: ["Outfit", "sans-serif"],
                display: ["Outfit", "sans-serif"],
            },
            colors: {
                "bg-base": "#f4f7f4",          // App background
                "bg-surface": "#ffffff",       // Main card background
                "bg-panel": "#edf1ed",         // Lighter nested elements (buttons, pill backgrounds)
                "bg-hover": "#e4e9e4",
                "brand": "#4ca61c",            // Primary vibrant green
                "brand-dim": "rgba(76,166,28,0.08)",
                "brand-border": "rgba(76,166,28,0.20)",
                "t-primary": "#121812",        // Dark rich text for max readability
                "t-secondary": "#4a554a",
                "t-dim": "#718071",
                "bdr": "rgba(0,0,0,0.08)",     // Subtle structural borders
                "bdr2": "rgba(0,0,0,0.12)",
                "risk-h": "#d32f2f",           // High Risk (Red)
                "risk-hbg": "rgba(211,47,47,0.08)",
                "risk-hb": "rgba(211,47,47,0.20)",
                "risk-m": "#f9a825",           // Medium Risk (Yellow/Orange)
                "risk-mbg": "rgba(249,168,37,0.08)",
                "risk-mb": "rgba(249,168,37,0.20)",
                "risk-l": "#2e7d32",           // Low Risk (Green)
                "risk-lbg": "rgba(46,125,50,0.08)",
                "risk-lb": "rgba(46,125,50,0.20)"
            }
        }
    }
}
```

---

## 2. Global CSS ([index.css](file:///d:/ClimatX/ClimatX/frontend/src/index.css))

Force all typography and background attributes into Light Mode layout using the `bg-base` token. Make sure the dark mode classes are not conflicting.

```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-bdr; /* Enforces structural borders everywhere */
  }
  body {
    @apply bg-bg-base text-t-primary selection:bg-brand selection:text-white;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* Scrollbar styling for a cleaner look */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  @apply bg-transparent;
}
::-webkit-scrollbar-thumb {
  @apply bg-bdr2 rounded-full hover:bg-t-dim/20 transition-colors;
}

/* Core Animations */
@keyframes fade-slide {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-slide {
  animation: fade-slide 0.5s cubic-bezier(0, 0, 0.2, 1) forwards;
}
```

---

## 3. Component Architecture: Main Container Style

Every main dashboard card (e.g., in [FarmerView.tsx](file:///d:/ClimatX/ClimatX/frontend/src/components/sections/RoleViews/FarmerView.tsx), [InsurerView.tsx](file:///d:/ClimatX/ClimatX/frontend/src/components/sections/RoleViews/InsurerView.tsx)) should utilize this exact Tailwind structural layout to provide the professional shadow styling and border aesthetics.

**The Container Formula**:
```tsx
<div className="bg-white border-2 border-bdr rounded-[32px] p-10 shadow-xl overflow-hidden relative text-left">
    {/* Component Content */}
</div>
```

---

## 4. Typography Rules

To make data dense yet highly readable:

*   **Main Section Headers**:
    ```tsx
    <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-2xl bg-bg-panel text-brand border border-bdr shadow-sm">
            <Icon size={20} />
        </div>
        <span className="font-outfit font-black text-t-primary text-sm uppercase tracking-[0.2em]">Section Title</span>
    </div>
    ```

*   **Standard Sub Labels (Metadata)**:
    ```tsx
    <span className="font-mono text-[10px] text-t-dim uppercase tracking-[0.25em] font-black">Sub Label</span>
    ```

*   **Primary Data Values (e.g., ₹ Values or Percentages)**:
    ```tsx
    <div className="font-display italic text-3xl text-t-primary font-black tracking-tighter uppercase">{value}</div>
    ```

---

## 5. UI Layout Tips for `agriguard-connect` Views

When modifying your specific role views ([FarmerView.tsx](file:///d:/ClimatX/ClimatX/frontend/src/components/sections/RoleViews/FarmerView.tsx), [SupplierView.tsx](file:///d:/ClimatX/ClimatX/frontend/src/components/sections/RoleViews/SupplierView.tsx)), keep these layout formulas in mind for maximum UI impact:

### A) The Inset "Panel" Container 
For displaying secondary data nested inside the main white cards:
```tsx
<div className="bg-bg-panel/40 rounded-3xl p-6 border-2 border-bdr flex flex-col justify-between group hover:border-brand-border hover:bg-white transition-all shadow-sm">
   {/* Inset content */}
</div>
```

### B) Animated Progress/Drought Bars
For filling progress or threshold bars, use `bg-bg-panel` as the track and the designated dynamic color (e.g., `brand` or `risk-h`) as the thumb:
```tsx
<div className="h-3 bg-bg-panel rounded-full overflow-hidden border border-bdr shadow-inner p-[1px]">
    <div 
       className="h-full rounded-full transition-all duration-1000 ease-out shadow-lg" 
       style={{ width: `70%`, backgroundColor: "var(--brand)" }} 
    />
</div>
```

### C) Recharts Styling
If you are moving over the `LineChart`, enforce the new typography and remove the dark grids:
```tsx
<LineChart ...>
    <CartesianGrid horizontal vertical={false} stroke="rgba(0,0,0,0.05)" strokeDasharray="6 6" />
    <XAxis stroke="var(--t-dim)" tick={{ fontSize: 10, fill: 'var(--t-dim)', fontFamily: 'JetBrains Mono', fontWeight: 800 }} .../>
    <RechartsTooltip contentStyle={{ backgroundColor: 'white', border: '2px solid var(--bdr)', borderRadius: '20px' }} .../>
</LineChart>
```

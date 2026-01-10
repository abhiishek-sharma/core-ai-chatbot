# CORE AI Theme Guide

## 🎨 Developer Reference for CORE AI Design System

This guide provides detailed information about the CORE AI theme implementation, color usage, and styling conventions.

---

## 📐 Color System

### Primary Colors - Core (Blue/Indigo)

**Usage**: Primary actions, branding, main UI elements

```css
core-50:  #f0f4ff  /* Lightest - text on dark backgrounds */
core-100: #e0e9ff
core-200: #c7d7fe
core-300: #a4bcfd  /* Light accents */
core-400: #8b9cfc
core-500: #6366f1  /* Primary brand color */
core-600: #4f46e5
core-700: #4338ca  /* Dark primary */
core-800: #3730a3
core-900: #312e81
core-950: #1e1b4b  /* Darkest */
```

**Examples**:
- Buttons: `bg-gradient-to-br from-core-500 to-core-700`
- Text: `text-core-300`
- Borders: `border-core-500/30`
- Hover: `hover:text-core-400`

### Accent Colors - Cyber (Teal/Cyan)

**Usage**: Status indicators, active states, secondary elements

```css
cyber-50:  #f0fdfa
cyber-100: #ccfbf1
cyber-200: #99f6e4
cyber-300: #5eead4
cyber-400: #2dd4bf
cyber-500: #14b8a6  /* Primary accent */
cyber-600: #0d9488
cyber-700: #0f766e
cyber-800: #115e59
cyber-900: #134e4a
```

**Examples**:
- Status dots: `bg-cyber-500`
- Active badges: `text-cyber-400`
- Glow effects: `shadow-cyber`
- Gradients: `from-cyber-500 to-cyan-600`

### Background Colors - Slate

**Usage**: Backgrounds, surfaces, containers

```css
slate-50:  #f8fafc  /* Light mode (not used) */
slate-100: #f1f5f9
slate-200: #e2e8f0
slate-300: #cbd5e1  /* Light text */
slate-400: #94a3b8
slate-500: #64748b  /* Medium text */
slate-600: #475569
slate-700: #334155
slate-800: #1e293b  /* Surfaces */
slate-850: #172033  /* Custom shade */
slate-900: #0f172a  /* Dark surfaces */
slate-925: #0c1220  /* Custom shade */
slate-950: #0a0a0f  /* Darkest background */
```

**Examples**:
- Body: `bg-slate-950`
- Cards: `bg-slate-900/50`
- Text: `text-slate-300`
- Muted: `text-slate-500`

### Neon Colors (Accent Highlights)

**Usage**: Special effects, error states, highlights

```javascript
neon: {
  pink:   '#ff006e',  // Errors, destructive actions
  purple: '#8338ec',  // Special highlights
  blue:   '#3a86ff',  // Info states
  cyan:   '#00f5ff',  // Bright accents
  green:  '#06ffa5',  // Success states
  yellow: '#ffbe0b'   // Warnings
}
```

---

## 🎭 Visual Effects

### Glassmorphism

**Class**: `.glass`

```css
background: rgba(10, 10, 15, 0.7);
backdrop-filter: blur(10px);
border: 1px solid rgba(99, 102, 241, 0.2);
```

**Usage**:
- Modals
- Sidebars
- Input fields
- Cards

**Example**:
```jsx
<div className="glass border border-core-500/20 rounded-2xl p-6">
  {/* Content */}
</div>
```

### Glow Effects

**Available Shadows**:

```css
shadow-neon      /* Blue glow - primary actions */
shadow-neon-lg   /* Larger blue glow */
shadow-cyber     /* Teal glow - accents */
shadow-cyber-lg  /* Larger teal glow */
shadow-glow      /* Soft multi-purpose glow */
shadow-inner-glow /* Inner glow effect */
```

**Usage Examples**:
```jsx
// Avatar with glow
<div className="avatar-glow bg-gradient-to-br from-core-500 to-core-700">
  <Cpu size={20} />
</div>

// Button with glow on hover
<button className="shadow-neon hover:shadow-neon-lg">
  Action
</button>
```

### Gradients

**Pre-defined Gradients**:

```css
bg-gradient-core   /* Blue to purple gradient */
bg-gradient-cyber  /* Teal gradient */
bg-gradient-neon   /* Multi-color neon */
bg-gradient-mesh   /* Subtle mesh background */
```

**Custom Gradients**:
```jsx
// Primary button
className="bg-gradient-to-br from-core-500 to-core-700"

// Accent button
className="bg-gradient-to-r from-cyber-500 to-cyan-600"

// Text gradient
className="bg-gradient-to-r from-core-200 to-cyber-300 bg-clip-text text-transparent"
```

---

## 🎬 Animations

### Available Animations

```css
animate-fade-in          /* Fade in */
animate-slide-up         /* Slide up from bottom */
animate-slide-in-right   /* Slide in from right */
animate-slide-in-left    /* Slide in from left */
animate-float            /* Floating motion */
animate-glow             /* Pulsing glow */
animate-shimmer          /* Shimmer effect */
animate-scan             /* Scanning line */
animate-pulse            /* Pulse scale */
animate-pulse-slow       /* Slower pulse */
```

### Usage Examples

```jsx
// Welcome screen entrance
<div className="animate-fade-in">
  {/* Content */}
</div>

// Message entrance
<div className="message-enter">
  {/* Uses slideUpFade keyframes */}
</div>

// Floating particles
<div className="animate-float" style={{ animationDelay: '1s' }}>
  <div className="w-2 h-2 bg-core-500 rounded-full" />
</div>

// Glow on hover
<button className="hover:animate-glow">
  Click me
</button>
```

### Custom Animation Delays

```jsx
<div 
  className="animate-pulse"
  style={{ animationDelay: '0.3s' }}
>
  {/* Delayed animation */}
</div>
```

---

## 🧩 Component Patterns

### Glass Panel

```jsx
<div className="glass border border-core-500/20 rounded-2xl p-6 backdrop-blur-xl">
  <div className="relative z-10">
    {/* Content always above blur */}
  </div>
</div>
```

### Glow Button

```jsx
<button className="relative px-5 py-3 bg-gradient-to-br from-core-500 to-core-700 text-white rounded-xl shadow-neon hover:shadow-neon-lg transition-all duration-300 group overflow-hidden">
  {/* Hover shine effect */}
  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
  
  {/* Content */}
  <span className="relative">Button Text</span>
</button>
```

### Status Indicator

```jsx
<div className="flex items-center gap-2">
  <div className="w-2 h-2 bg-cyber-500 rounded-full animate-pulse shadow-cyber" />
  <span className="text-xs font-mono text-slate-500">System Online</span>
</div>
```

### Holographic Border

```jsx
<div className="holo-border rounded-2xl p-6">
  {/* Uses gradient border with padding-box trick */}
</div>
```

### Avatar with Glow

```jsx
<div className="relative">
  <div className="w-10 h-10 bg-gradient-to-br from-core-500 to-core-700 rounded-xl flex items-center justify-center avatar-glow">
    <Icon size={20} className="text-white" />
  </div>
  {/* Status dot */}
  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyber-500 rounded-full animate-pulse shadow-cyber" />
</div>
```

### Card with Hover Effect

```jsx
<div className="glass border border-core-500/20 rounded-2xl p-6 card-hover overflow-hidden group">
  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-core-500/0 to-cyber-500/0 group-hover:from-core-500/10 group-hover:to-cyber-500/5 transition-all duration-500" />
  
  {/* Shimmer effect */}
  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
  
  {/* Content */}
  <div className="relative z-10">
    {/* Your content */}
  </div>
</div>
```

---

## 📏 Spacing & Sizing

### Common Sizes

```css
/* Avatars */
w-10 h-10   /* Standard avatar */
w-14 h-14   /* Large avatar */
w-8 h-8     /* Small avatar */

/* Icons */
size={20}   /* Standard icon */
size={24}   /* Large icon */
size={16}   /* Small icon */

/* Rounded corners */
rounded-xl   /* 12px - standard */
rounded-2xl  /* 16px - cards */
rounded-3xl  /* 24px - modals */

/* Padding */
p-6          /* Standard card padding */
px-8 py-5    /* Modal padding */
p-3          /* Button padding */

/* Gaps */
gap-3        /* Standard gap */
gap-5        /* Large gap */
space-y-8    /* Vertical spacing */
```

---

## 🎯 Typography

### Font Families

```css
font-sans    /* Inter - body text */
font-mono    /* Space Mono - code, labels */
```

### Text Styles

```jsx
// Headings with gradient
<h1 className="text-5xl font-bold bg-gradient-to-r from-core-200 via-core-300 to-cyber-300 bg-clip-text text-transparent">
  Heading
</h1>

// Neon text effect
<span className="neon-text font-bold">
  CORE
</span>

// Monospace labels
<span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
  System
</span>

// Body text
<p className="text-slate-300 leading-relaxed">
  Content
</p>
```

### Common Text Classes

```css
/* Sizes */
text-xs      /* 0.75rem - labels */
text-sm      /* 0.875rem - secondary */
text-base    /* 1rem - body */
text-lg      /* 1.125rem - emphasis */
text-2xl     /* 1.5rem - headers */

/* Weights */
font-normal     /* 400 */
font-medium     /* 500 */
font-semibold   /* 600 */
font-bold       /* 700 */

/* Colors */
text-slate-100  /* Brightest */
text-slate-300  /* Standard */
text-slate-500  /* Muted */
text-core-300   /* Accent */
text-cyber-400  /* Status */
```

---

## 🎨 Best Practices

### 1. Consistent Glow Usage

✅ **Do**:
- Use `shadow-neon` for primary actions
- Use `shadow-cyber` for accents/status
- Apply consistently across similar elements

❌ **Don't**:
- Mix glow types on related elements
- Overuse glows (reduces impact)
- Use glows on non-interactive elements

### 2. Glass Panel Layering

✅ **Do**:
```jsx
<div className="glass border border-core-500/20">
  <div className="relative z-10">
    {/* Content */}
  </div>
</div>
```

❌ **Don't**:
```jsx
<div className="glass">
  {/* No z-index, might blend with background */}
</div>
```

### 3. Animation Performance

✅ **Do**:
- Use `transform` for animations
- Use `opacity` transitions
- Apply `will-change` sparingly

❌ **Don't**:
- Animate `width`, `height`, or `top/left`
- Animate on every element
- Use complex animations on mobile

### 4. Color Opacity

✅ **Do**:
```css
border-core-500/20   /* 20% opacity */
bg-slate-900/50      /* 50% opacity */
text-cyber-400/80    /* 80% opacity */
```

❌ **Don't**:
```css
/* Avoid custom rgba unless necessary */
rgba(99, 102, 241, 0.2)
```

### 5. Gradient Directions

**Common Patterns**:
```css
bg-gradient-to-r     /* Left to right */
bg-gradient-to-br    /* Top-left to bottom-right */
bg-gradient-to-b     /* Top to bottom */
```

**Usage**:
```jsx
// Buttons
className="bg-gradient-to-br from-core-500 to-core-700"

// Overlays
className="bg-gradient-to-b from-core-500/10 to-transparent"

// Text
className="bg-gradient-to-r from-core-200 to-cyber-300"
```

---

## 🔧 Utility Classes Reference

### Custom Utilities (index.css)

```css
.glass               /* Glassmorphism effect */
.glow-button         /* Interactive glow on hover */
.avatar-glow         /* Avatar glow shadow */
.pulse-glow          /* Pulsing glow animation */
.neon-text           /* Neon text shadow */
.holo-border         /* Holographic border */
.cyber-grid          /* Background grid pattern */
.scan-line           /* Scanning line effect */
.card-hover          /* Card lift on hover */
.shimmer             /* Shimmer background */
.spinner             /* Loading spinner */
.sidebar-item        /* Sidebar hover effect */
.message-enter       /* Message entrance animation */
```

---

## 📱 Responsive Considerations

### Breakpoints

```css
sm:   /* 640px */
md:   /* 768px */
lg:   /* 1024px */
xl:   /* 1280px */
2xl:  /* 1536px */
```

### Mobile Adjustments

```jsx
<div className="p-4 md:p-6 lg:p-8">
  {/* Responsive padding */}
</div>

<h1 className="text-3xl md:text-4xl lg:text-5xl">
  {/* Responsive typography */}
</h1>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

---

## 🎯 Quick Reference

### Most Used Combinations

```jsx
// Primary button
"px-6 py-3 bg-gradient-to-br from-core-500 to-core-700 text-white rounded-xl shadow-neon hover:shadow-neon-lg transition-all duration-300"

// Glass card
"glass border border-core-500/20 rounded-2xl p-6 backdrop-blur-xl"

// Status badge
"flex items-center gap-2 px-3 py-1.5 bg-core-500/10 border border-core-500/30 rounded-lg"

// Input field
"w-full glass border border-core-500/30 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-core-500/60 focus:shadow-glow transition-all"

// Icon button
"p-2.5 text-slate-400 hover:text-core-400 hover:bg-core-500/10 rounded-xl transition-all duration-300"
```

---

## 🐛 Common Issues & Solutions

### Issue: Glow not showing

**Solution**: Ensure element has `position: relative` or is in stacking context
```jsx
<div className="relative shadow-neon">
  {/* Content */}
</div>
```

### Issue: Glass effect not working

**Solution**: Check backdrop-filter support and use fallback
```jsx
<div className="glass backdrop-blur-xl">
  {/* Includes both backdrop-filter and background fallback */}
</div>
```

### Issue: Animation jank

**Solution**: Use transform instead of position/size changes
```css
/* Good */
transform: translateX(10px);

/* Bad */
left: 10px;
```

### Issue: Text not visible on gradient

**Solution**: Ensure sufficient contrast
```jsx
// If text isn't visible, adjust opacity or use different shade
<div className="bg-core-500/20 text-slate-200">
  {/* Better contrast */}
</div>
```

---

## 📚 Resources

- **Tailwind Docs**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev
- **Color Tool**: https://uicolors.app
- **Gradient Generator**: https://cssgradient.io

---

**Last Updated**: 2024
**Version**: 3.0.0
**Theme**: CORE AI Neural Interface
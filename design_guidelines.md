# ReCicla+ Angola - Design Guidelines

## Design Approach

**Hybrid Approach:** Drawing inspiration from Linear's clean interface and modern sustainability platforms, combined with Material Design principles for the map and data-heavy sections. Focus on clarity, efficiency, and motivational design that encourages recycling behavior.

## Core Design Principles

1. **Clarity First:** Every interaction should be immediately understandable
2. **Progressive Disclosure:** Complex features revealed as needed
3. **Motivational Design:** Visual feedback celebrating user actions
4. **Mobile-Primary:** Designed for Angola's mobile-first user base

## Typography System

**Primary Font:** Inter (Google Fonts)
- Headings: 600-700 weight, tracking-tight
- Body: 400 weight, leading-relaxed
- Metrics/Stats: 700 weight, tabular-nums

**Hierarchy:**
- Page Titles: text-4xl md:text-5xl font-bold
- Section Headers: text-2xl md:text-3xl font-semibold
- Card Titles: text-lg font-semibold
- Body Text: text-base
- Captions: text-sm
- Stats/Numbers: text-3xl md:text-4xl font-bold

## Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Micro spacing (icon gaps, button padding): 2-4
- Component spacing: 6-8
- Section spacing: 12-16
- Page margins: 16-24

**Container Strategy:**
- Max-width: max-w-7xl
- Content areas: max-w-4xl
- Forms: max-w-2xl
- Padding: px-4 md:px-6 lg:px-8

**Grid Patterns:**
- Stats dashboard: grid-cols-2 lg:grid-cols-4
- Collection cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Profile sections: Two-column split on desktop

## Component Library

### Navigation
- Fixed header with subtle shadow (shadow-sm)
- Logo left, user actions right
- Mobile: Slide-in drawer navigation
- Points counter prominently displayed in header

### Map Interface (Core Feature)
- Full-width container with rounded corners (rounded-xl)
- Floating control panel overlay with backdrop-blur
- Marker clusters for dense areas
- Info cards: Elevated (shadow-lg), rounded-2xl, with micro-animations on hover

### Cards & Containers
- Standard elevation: shadow-md with subtle border
- Interactive cards: Transform on hover (scale-[1.02])
- Rounded corners: rounded-xl for primary cards
- Glass morphism for overlays: backdrop-blur-lg with subtle borders

### Forms
- Large, touchable inputs: h-12 with rounded-lg
- Clear labels above inputs
- Inline validation with smooth transitions
- Upload zones with dotted borders and drag-over states
- Primary actions: Large buttons (h-12 md:h-14)

### Points & Rewards Display
- Prominent badge-style counters with rounded-full
- Progress bars with gradient fills and smooth animations
- Achievement cards with icon, title, and unlock state
- Leaderboard: Ranked list with position badges

### Gamification Elements
- Level badges: Circular with icon and border
- Progress rings: Circular progress indicators
- Stat comparisons: Before/after with arrow indicators
- Medals: Large icon displays with subtle glow effect

### Notifications
- Toast style: Slide from top-right
- Rounded-xl with icon, title, description
- Auto-dismiss with progress bar
- Action buttons for key notifications

## Animation Strategy

**Smooth & Purposeful Only:**
- Page transitions: Fade with slight y-axis movement (20px)
- Card reveals: Stagger children with 50ms delay
- Button interactions: Scale (0.98) on press
- Success states: Confetti or check mark animation (subtle)
- Map markers: Gentle bounce on add
- Points earned: Number count-up animation

**Transition Timing:**
- Micro-interactions: 150ms ease-out
- Modal/drawer: 300ms ease-in-out
- Page changes: 200ms ease-out

## Page Structures

### Landing Page (Unauthenticated)
- Hero: Full-viewport with background illustration/pattern (not photo)
- Three-column features grid
- Impact statistics (animated counters)
- How it works: Stepped process with icons
- Social proof: Testimonial cards
- CTA sections with strong button hierarchy

### Dashboard (Authenticated)
- Stats overview: Four-column metrics
- Map section: Takes 60% viewport height
- Recent activity feed
- Quick actions: Large icon buttons in grid

### Collection Request Flow
- Multi-step form with progress indicator
- Photo upload with preview
- Map picker for location
- Summary card before submission

### Profile Page
- Header with avatar and key stats
- Tabbed sections: History, Impact, Rewards
- Achievement showcase grid
- Points conversion interface

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (single column, full-width components)
- Tablet: 768px-1024px (two columns where appropriate)
- Desktop: > 1024px (full grid layouts)

**Mobile Optimizations:**
- Bottom navigation for key actions
- Swipeable cards for collections
- Map takes full screen on interaction
- Simplified header with hamburger menu

## Icons

**Library:** Heroicons (via CDN)
- Outline style for navigation and secondary actions
- Solid style for active states and primary buttons
- Size hierarchy: 4, 5, 6, 8, 10, 12 (w-{size} h-{size})

## Images

**Hero Section:** Use abstract illustration or pattern representing recycling/sustainability (circular arrows, nature elements, connected nodes). Not a photograph.

**Dashboard:** Icons and illustrations only, no large imagery

**Profile/Impact:** Small illustrations for achievements and milestones

**Collection Cards:** User-uploaded photos of recyclables (if provided), otherwise type-specific icons

**Empty States:** Friendly illustrations with encouraging messages

## Key UX Patterns

- **Immediate Feedback:** Every action shows instant visual response
- **Optimistic Updates:** Show success before server confirmation
- **Error Recovery:** Clear messages with actionable solutions
- **Skeleton Loading:** Content placeholders during data fetch
- **Pull-to-Refresh:** Native feel on mobile lists
- **Infinite Scroll:** For activity feeds and history

## Accessibility

- Minimum touch targets: 44x44px (h-11 w-11 minimum)
- Focus indicators: Ring with offset
- ARIA labels on all interactive elements
- Keyboard navigation throughout
- Screen reader friendly status updates
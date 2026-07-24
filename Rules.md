# RULES.md

> **Vision Wings Engineering Standards**
>
> These rules are mandatory for every contributor, AI agent, and developer working on this project.
> Every commit must follow these standards. Do not make exceptions unless explicitly approved.

---

# 1. Core Principles

- Write code for humans first, computers second.
- Optimize for readability before cleverness.
- Build scalable systems, not temporary fixes.
- Every file should have a single responsibility.
- Every component should solve one problem.
- Prefer composition over inheritance.
- Prefer simplicity over unnecessary abstraction.
- Never sacrifice maintainability for short-term speed.

---

# 2. Golden Rules

✅ Think before coding.

✅ Design before implementing.

✅ Refactor instead of patching.

✅ Fix the root cause.

❌ Never stack hacks.

❌ Never write temporary code that becomes permanent.

❌ Never duplicate logic.

❌ Never copy-paste components.

❌ Never ignore TypeScript errors.

---

# 3. Naming Conventions

Everything must be descriptive.

Never use:

```
data
item
obj
temp
test
newData
button2
card3
abc
xyz
foo
bar
```

Instead use:

```
marketingServices

selectedCaseStudy

activeNavigationItem

testimonialList

brandIdentitySection

serviceCard

heroAnimationState
```

---

## Components

PascalCase

```
HeroSection

NavigationBar

ServiceCard

CaseStudyGrid

Footer

BrandStory

LogoAnimation
```

---

## Hooks

```
useScrollProgress()

useActiveSection()

useMousePosition()

useViewport()

useAnimationTimeline()
```

---

## Variables

camelCase

```
currentSection

heroOpacity

animationDuration

isMenuOpen

selectedProject

activeService
```

---

## Constants

UPPER_SNAKE_CASE

```
MAX_MOBILE_WIDTH

DEFAULT_ANIMATION_DURATION

SECTION_PADDING

NAVBAR_HEIGHT
```

---

## Boolean Variables

Must start with

```
is

has

can

should
```

Example

```
isVisible

isLoading

hasScrolled

canAnimate

shouldReduceMotion
```

---

## Event Handlers

Always begin with

```
handle

on
```

Example

```
handleSubmit()

handleScroll()

handleMenuToggle()

handleMouseEnter()

onClick

onHover
```

---

# 4. File Structure

Never exceed responsibility.

Example

```
components/

Hero/

Hero.tsx

HeroContent.tsx

HeroAnimation.tsx

HeroButtons.tsx

HeroBackground.tsx

index.ts
```

Never create

```
Everything.tsx
```

---

# 5. Component Rules

Each component should:

- have one responsibility

- be reusable

- be composable

- avoid business logic

- receive data via props

- avoid hidden side effects

Maximum:

300 lines

Ideal:

100–150 lines

---

# 6. Functions

Functions should do ONE thing.

Bad

```
loadDataAndValidateAndSaveAndRender()
```

Good

```
fetchProjects()

validateForm()

saveContact()

renderTimeline()
```

Maximum

40 lines

---

# 7. Props

Never pass unnecessary props.

Bad

```
<Component
user={user}
theme={theme}
settings={settings}
navigation={navigation}
page={page}
/>
```

Good

```
<Component

title

description

image

isActive
/>
```

---

# 8. State Management

Keep state local whenever possible.

Don't create global state without reason.

Prefer

```
useState

↓

Context

↓

Zustand
```

Never use Context for rapidly changing UI.

---

# 9. No Magic Numbers

Bad

```
padding: 17px

margin: 53px

duration: 387ms
```

Good

```
const SPACING_LARGE = 24

const SECTION_GAP = 64

const FADE_DURATION = 300
```

---

# 10. Styling Rules

Use Tailwind consistently.

Never mix

Tailwind

Inline CSS

Random CSS files

Styled Components

Choose one approach.

Preferred

Tailwind + CSS Variables

---

# 11. Colors

Never hardcode colors.

Bad

```
text-[#0F172A]
```

Good

```
text-primary

bg-background

text-accent
```

Use design tokens.

---

# 12. Typography

Never hardcode font sizes.

Use tokens.

Example

```
text-display

text-heading

text-body

text-caption
```

---

# 13. Spacing

Use spacing scale.

Never random spacing.

Allowed

```
2

4

8

12

16

24

32

40

48

64

80

96

128
```

---

# 14. Animations

Animations must have purpose.

Avoid decorative movement.

Rules

✔ Smooth

✔ Consistent

✔ Hardware accelerated

✔ Subtle

Prefer

opacity

transform

scale

translate

Avoid

top

left

width animations

height animations

---

# 15. Performance

Lazy load

images

videos

case studies

blogs

Use

dynamic imports

memoization

image optimization

Never render hidden content.

---

# 16. Accessibility

Every image

must have alt text.

Every button

must have label.

Keyboard navigation required.

Visible focus state required.

WCAG AA minimum.

---

# 17. Error Handling

Never

```
catch {}
```

Always

```
catch(error){

logError(error)

showToast()

recoverGracefully()

}
```

---

# 18. API Calls

Never fetch directly inside components.

Bad

```
Hero.tsx

fetch(...)
```

Good

```
services/

cms.ts

api.ts

contact.ts
```

---

# 19. Imports

Order

1 Framework

2 Libraries

3 Components

4 Hooks

5 Utilities

6 Constants

7 Types

8 Styles

---

# 20. Comments

Don't explain WHAT.

Explain WHY.

Bad

```
// increment i
i++
```

Good

```
// Delay animation until hero assets are loaded to avoid layout shift.
```

---

# 21. Git

Commit names

```
feat:

fix:

refactor:

perf:

style:

docs:

test:
```

Never

```
update

changes

fix

done

latest
```

---

# 22. Folder Naming

lowercase

```
components

hooks

utils

services

animations

constants

types
```

Never

```
MyComponents

New Folder

Utils2
```

---

# 23. Types

Never use

```
any
```

Prefer

```
interface

type

generics

readonly

unions
```

---

# 24. Responsive Design

Design Desktop First.

Test

Desktop

Laptop

Tablet

Mobile

Never hide broken layouts.

---

# 25. Testing Checklist

Before every commit verify

- No console logs

- No unused imports

- No dead code

- No duplicate components

- No duplicated CSS

- No TypeScript errors

- No ESLint warnings

- Lighthouse > 90

- Mobile tested

- Accessibility checked

- Animations smooth

---

# 26. Code Review Checklist

Every Pull Request must answer

- Is this the simplest solution?

- Is there duplicated logic?

- Can this be reused?

- Is naming descriptive?

- Is performance acceptable?

- Is accessibility maintained?

- Does this follow the design system?

- Is the code production-ready?

---

# 27. AI Development Rules

When generating code:

- Never create placeholder implementations.
- Never leave TODOs unless explicitly requested.
- Never generate fake data for production features.
- Never duplicate existing functionality.
- Always search for an existing component before creating a new one.
- Refactor existing code instead of creating parallel implementations.
- Maintain visual and architectural consistency across the entire project.
- If a feature requires changing multiple files, update all affected files rather than patching one location.
- Every generated code block must be production-ready.

---

# 28. Final Standard

Every line of code should satisfy this question:

> **"Would this still be the approach we'd be proud to maintain two years from now?"**

If the answer is **no**, rewrite it.
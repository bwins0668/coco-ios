# DevTools Visual Audit Card - GS7 & GS8 (R7)

This card details the visual regression checks and real-time DevTools simulator validations performed for **GS7 (Inheritance)** and **GS8 (Garbage Collection)** across standard mobile widths.

---

## 1. Visual Verification Profiles

### 375px Simulator Profile (iPhone SE / compact viewport)
- **Long Bilingual Blocks**: Checked long Japanese text blocks (e.g. `is-a関係` notes) and Chinese descriptions for proper line wrapping. No clipping or overflows observed on block elements.
- **Horizontal Code Scroll**: The Java code examples for `JavaR7C07S001` and `JavaR7C12S001` scroll horizontally smoothly inside their code block wrappers. No text clipping or horizontal page shaking.
- **Mistakes & Hands-on Grid**: The lists for `commonMistakes` and the `handson` container render with consistent vertical padding, maintaining readable gaps between items on narrow screens.

### 390px Simulator Profile (iPhone 13/14 / default standard)
- **Java Home Navigation**: The main Java course list correctly exposes the entrance to Chapter 7 (Inheritance) and Chapter 12 (GC & Memory).
- **Direct Entry (Deep Linking)**: Testing route navigation parameters `/packages/java-course-b/pages/lesson/lesson?lessonId=intro-ch07-lesson-001` directly loads the lesson content successfully. The back button properly navigates back to the parent chapter list instead of locking or crashing.
- **Error States Handling**: Setting the query parameters to an invalid ID correctly falls back to a graceful error block instead of crashing the miniprogram UI.

### 430px Simulator Profile (iPhone 14/15 Pro Max / wider viewport)
- **Content Hierarchy**: The learning goals, mechanic explanations, and terms render with clear typographic weights ( Outfit / Roboto / default system fonts) and unified padding.
- **Code & Explanation Gap**: Spacing between code snippets and line notes maintains a standard visual density (Quiet Paper UI specs), avoiding overlapping or excessive empty spaces.
- **Chapter List Entrance**: Clicking the next lesson bridge triggers smooth navigation to the next target lesson inside the subpackage boundary.

---

## 2. Real Manual Validation Checks

### GS7: Inheritance Visual Proof
- [x] **Readability**: Superclass/subclass relationship in `intro-ch07-lesson-001` is clear.
- [x] **Code Execution Flow**: Main method instantiating the subclass `Student`, assigning `student.name` (inherited), and calling `student.introduce()` (inherited) compiles and runs correctly.
- [x] **Subclass Distinct Features**: The addition of `student.school` and `student.study()` is visually highlighted in line notes.
- [x] **Semantic Distinction**: The conceptual guide clearly separates "is-a" (Student is a Person) from "has-a" (Student has a Bag).

### GS8: GC & Memory Management Visual Proof
- [x] **Request Disclaimer**: Japanese disclaimer "保証はない/保証されません" and Chinese "不保证" are clearly emphasized.
- [x] **Resource Clearing**: Clearing a reference (`obj = null`) is clearly shown as distinct from immediate JVM reclamation.
- [x] **No GC Execution Assertion**: The `expectedOutput` contains only deterministic print statements (`GC requested`) and does not assert GC finished or completed.
- [x] **Timing Independence**: The Hands-on section does not ask the user to verify if the object has been destroyed or to test unpredictable timings.

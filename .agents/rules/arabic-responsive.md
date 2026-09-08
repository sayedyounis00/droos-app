---
trigger: always_on
---

### Arabic, RTL & Responsive Design Rule

The website must be designed and developed as a **fully Arabic-first website** with proper **RTL (Right-to-Left) support**.

Follow these rules strictly:

1. **Arabic Language**

   * All user-facing content, labels, buttons, navigation, headings, forms, messages, and UI text must be in **Arabic** unless explicitly requested otherwise.
   * Use clear, natural, professional Arabic.
   * Do not mix Arabic and English unnecessarily.

2. **RTL Layout**

   * The entire website must use `direction: rtl`.
   * Text should be right-aligned by default.
   * Navigation, menus, cards, forms, icons, breadcrumbs, and content layouts must follow RTL conventions.
   * Reverse directional icons when necessary, such as arrows, chevrons, and navigation indicators.
   * Use logical CSS properties such as `margin-inline`, `padding-inline`, `inset-inline`, `text-align: start`, and `flex`/`grid` layouts instead of hardcoded left/right positioning whenever possible.

3. **HTML & Accessibility**

   * Set the document language to Arabic:
     `<html lang="ar" dir="rtl">`
   * Ensure forms, inputs, placeholders, and validation messages properly support Arabic RTL text.
   * Maintain good accessibility and readable Arabic typography.

4. **Responsive Design**

   * The website must be **fully responsive on all common device sizes**:

     * Mobile phones
     * Tablets
     * Laptops
     * Desktop monitors
     * Large screens
   * Follow a **mobile-first** approach.
   * Never allow horizontal scrolling unless it is intentionally required.
   * Images, videos, cards, tables, buttons, and containers must adapt to the available screen width.
   * Navigation should transform appropriately on smaller screens.
   * Typography, spacing, grids, and component sizes should scale appropriately across breakpoints.

5. **Responsive Testing**

   * Before considering the website complete, verify the layout at minimum:

     * 320px mobile
     * 375px mobile
     * 768px tablet
     * 1024px laptop/tablet
     * 1440px desktop
     * 1920px large desktop
   * Fix any overflow, overlapping elements, clipped text, broken layouts, or unreadable content.

6. **Design Consistency**

   * Keep the Arabic RTL experience consistent across every page and component.
   * Do not create individual pages with different RTL behavior.
   * Reusable components must automatically respect RTL and responsive behavior.

7. **Quality Requirement**

   * Do not consider the website finished until it looks natural and professional in Arabic RTL on both mobile and desktop.
   * Never solve responsive problems by simply hiding content. Adapt the layout appropriately instead.

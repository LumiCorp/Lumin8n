# Lumiflow White-Labeling Documentation

This document outlines the white-labeling changes made to transform n8n into Lumiflow, and provides guidance for future customization.

## Overview of Changes

### 1. Brand Colors

We've defined Lumi brand colors in the CSS variables system:

- **Primary Color**: `#E27056` (coral)
- **Secondary Color**: `#519e81` (teal)
- **Accent Color**: `#669bbc` (blue)

### 2. Typography

Custom font families have been implemented:

- **Headings**: "Inter UI", sans-serif
- **Body**: "Lato", sans-serif 
- **Monospace/Code**: "Inconsolata", monospace

### 3. Modified Files

- `styles/lumiflow-variables.scss`: Core brand variables
- `styles/lumiflow-global.scss`: Global style overrides
- `components/lumiflow-sidebar.scss`: Sidebar customizations
- `components/MainHeader/lumiflow-header.scss`: Header customizations

### 4. Import Structure

The custom styles are integrated in this order:

1. `lumiflow-variables.scss` is imported first in `styles/index.scss`
2. Regular styles are then loaded after the variables
3. Component-specific styles are imported within each component file

## Customization Guide

### Adding New Brand Colors

To add or modify brand colors, edit `styles/lumiflow-variables.scss`:

```scss
:root {
  /* Brand Colors */
  --color-primary: #E27056; // Lumi primary coral
  --color-secondary: #519e81; // Lumi secondary teal
  --color-accent: #669bbc; // Lumi accent blue
  
  /* Add new colors here */
  --color-custom-new: #hexvalue;
}
```

### Changing Component Styles

Component-specific styles are in separate files to maintain clean organization:

- For sidebar changes: `components/lumiflow-sidebar.scss`
- For header changes: `components/MainHeader/lumiflow-header.scss`
- For global element changes: `styles/lumiflow-global.scss`

### Typography Changes

To update typography, modify the font imports and variables in `styles/lumiflow-variables.scss`:

```scss
@import url('https://fonts.googleapis.com/css2?family=YourNewFont:wght@400;700&display=swap');

:root {
  /* Typography */
  --font-family-headings: 'YourNewFont', sans-serif;
  /* Other font definitions */
}
```

### Common UI Elements

Key UI elements and their corresponding CSS variables:

- **Buttons**: Primary buttons use `--color-primary`, secondary buttons use `--color-secondary`
- **Links**: Use `--color-secondary` by default, with hover states in `--color-primary`
- **Notifications**: Success uses `--color-success`, warnings use `--color-warning`
- **Dialogs/Modals**: Headers use heading fonts, content uses body fonts

## Future Enhancements

Potential future improvements:

1. Create a more comprehensive component library with Lumiflow-specific designs
2. Add custom node styling for workflow canvas elements
3. Develop Lumiflow-specific templates and starter workflows
4. Create custom icons to fully align with the Lumi brand identity

## Reverting Changes

To revert to n8n styling:

1. Remove imports of Lumiflow files from the main style files
2. Remove or comment out the custom style files

## Technical Notes

- Spacing variables have been adjusted to create a tighter UI layout as requested
- !important is used in some cases to override deeply nested styles
- Browser compatibility has been maintained for all modern browsers

For additional customization assistance, refer to the n8n styling documentation and the Vue.js component styling guides.

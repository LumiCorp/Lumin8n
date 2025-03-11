// CSS Variables are defined in `@n8n/chat/src/css/_tokens.scss`
export const cssVariables = `
:root {
  /* Colors */
  --chat--color-primary: #e27056; /* Updated Primary Color */
  --chat--color-primary-shade-50: #d5644d;
  --chat--color-primary-shade-100: #c85a45;
  --chat--color-secondary: #519e81; /* Updated Secondary Color */
  --chat--color-secondary-alt: #1c7293; /* Deep Blue as a Secondary Alternative */
  --chat--color-white: #ffffff;
  --chat--color-light: #f7f7f7; /* Softer light color */
  --chat--color-medium: #dddddd; /* Adjusted for contrast */
  --chat--color-dark: #2c2c2c; /* Darkened for modern aesthetics */
  --chat--color-disabled: #999999;
  --chat--color-typing: #555555;

  /* Layout & Spacing */
  --chat--spacing: 1.2rem;
  --chat--border-radius: 0.5rem;
  --chat--transition-duration: 0.2s;
  --chat--font-family: (
    "Inter", "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, "Helvetica Neue", sans-serif
  );

  /* Window */
  --chat--window--width: 420px;
  --chat--window--height: 650px;
  --chat--window--background: var(--chat--color-light);
  --chat--window--border: 2px solid var(--chat--color-primary-shade-50);
  --chat--window--border-radius: var(--chat--border-radius);
  --chat--window--shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);

  /* Header */
  --chat--header--background: var(--chat--color-primary);
  --chat--header--color: var(--chat--color-white);
  --chat--header--border-bottom: 2px solid var(--chat--color-primary-shade-50);
  --chat--heading--font-size: 1.8rem;

  /* Messages */
  --chat--message--font-size: 1rem;
  --chat--message--padding: var(--chat--spacing);
  --chat--message--border-radius: var(--chat--border-radius);
  --chat--message--user--background: var(--chat--color-secondary);
  --chat--message--user--color: var(--chat--color-white);
  --chat--message--bot--background: var(--chat--color-white);
  --chat--message--bot--color: var(--chat--color-dark);
  --chat--message-line-height: 1.6;
  
  /* Toggle Button */
  --chat--toggle--size: 70px;
  --chat--toggle--background: var(--chat--color-primary);
  --chat--toggle--hover--background: var(--chat--color-primary-shade-50);
  --chat--toggle--active--background: var(--chat--color-primary-shade-100);

  /* Input */
  --chat--input--background: var(--chat--color-white);
  --chat--input--text-color: var(--chat--color-dark);
  --chat--input--border: 2px solid var(--chat--color-secondary);
  --chat--input--border-radius: var(--chat--border-radius);
  --chat--input--padding: 1rem;
  --chat--input--placeholder-color: var(--chat--color-medium);

  /* Buttons */
  --chat--button--background: var(--chat--color-secondary);
  --chat--button--color: var(--chat--color-white);
  --chat--button--hover--background: var(--chat--color-secondary-alt);
  --chat--button--padding: 0.6rem 1.2rem;
  --chat--button--border-radius: var(--chat--border-radius);

  /* Footer */
  --chat--footer--background: var(--chat--color-light);
  --chat--footer--color: var(--chat--color-dark);
}
`;

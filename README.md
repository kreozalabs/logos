# @kreozalabs/logos

Official React logo components and SVG assets for **Kreoza**.

[![npm version](https://img.shields.io/npm/v/@kreozalabs/logos.svg)](https://www.npmjs.com/package/@kreozalabs/logos)


---

## 📦 Installation

Install `@kreozalabs/logos` using your preferred package manager:

```bash
# pnpm
pnpm add @kreozalabs/logos

# npm
npm install @kreozalabs/logos

# yarn
yarn add @kreozalabs/logos
```

> **Note**: `@kreozalabs/logos` requires **React 18** or **React 19** as a peer dependency.

---

## 🚀 Usage

Import logo components directly into your React application:

```tsx
import {
  Logo,
  LogoLight,
  LogoWordmark,
  LogoWordmarkLight,
  GitHub,
} from "@kreozalabs/logos";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-zinc-900 text-white">
      {/* Wordmark logo for dark backgrounds */}
      <LogoWordmarkLight className="h-8 w-auto" />

      {/* GitHub icon link */}
      <a href="https://github.com/kreozalabs" target="_blank" rel="noreferrer">
        <GitHub className="w-6 h-6 hover:opacity-80 transition-opacity" />
      </a>
    </header>
  );
}
```

### Component Props & Customization

All logo components extend standard React SVG attributes (`React.SVGProps<SVGSVGElement>`), giving you full control over styling:

- **Sizing**: Use `className`, `width`, or `height`. By default, components scale to `1em`.
- **Colors**: Foreground colors utilize `currentColor` where appropriate, responding to text color changes (`text-zinc-900`, `text-white`, etc.).

---

## 🎨 Available Components

| Component               | Description                               | Default Theme                  |
| :---------------------- | :---------------------------------------- | :----------------------------- |
| `<Logo />`              | Kreoza emblem mark                        | Default / Dark theme           |
| `<LogoLight />`         | Kreoza emblem mark (Light variant)        | Light theme / Dark backgrounds |
| `<LogoWordmark />`      | Full Kreoza wordmark logo                 | Default / Dark theme           |
| `<LogoWordmarkLight />` | Full Kreoza wordmark logo (Light variant) | Light theme / Dark backgrounds |
| `<GitHub />`            | Official GitHub brand mark                | Neutral (`currentColor`)       |

---

## 📁 Raw SVG Assets & Release ZIP

If you need raw `.svg` files for design tools (Figma, Illustrator) or non-React environments:

1. Raw SVG sources are available in the repository under [`assets/`](./assets/).
2. Alternatively, download the bundled `logos.zip` attached to the latest [GitHub Release](https://github.com/kreozalabs/logos/releases).

---

## 🛠️ Local Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/kreozalabs/logos.git
cd logos
pnpm install
```

### Available Scripts

- **`pnpm build`**: Runs `tsup` to bundle TSX components into CJS and ESM distributions under `dist/`.
- **`pnpm generate`**: Converts raw SVG files in `assets/` to TSX React components in `src/components/`.
- **`pnpm dev`**: Generates components and starts `tsup` in watch mode.
- **`pnpm build:zip`**: Bundles all SVG assets in `assets/` into a downloadable `logos.zip` archive.
- **`pnpm typecheck`**: Runs TypeScript type verification without emitting files.

---

## 📄 License

See [LICENSE](./LICENSE) © Kreoza. All rights reserved. Logos and trademarks belong exclusively to Kreoza.


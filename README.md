# <lit-roulette>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

Hi, I am using the nitocode code as an example to learn about lit and web components.

Acknowledgements for the roulette code to @nitocode 👋

Fork from: [@nitocode/vue3-roulette](https://github.com/nitocode/vue3-roulette)


## Installation

```bash
npm i @nonodev96/lit-roulette
```

## Usage

```html
<script type="module">
  import '@nonodev96/lit-roulette/lit-roulette.js';
</script>

<lit-roulette></lit-roulette>
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`

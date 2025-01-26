import type { Preview } from "@storybook/react";
import "../src/style.css";
import "../src/storybook.css";

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from "path";
import { fileURLToPath } from "url";
import svgr from "vite-plugin-svgr";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {
      image: {
        excludeFiles: ["**/*.svg"],
      },
    },
  },
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    config.plugins = [
      svgr({
        include: "**/*.svg",
        svgrOptions: {
          exportType: "default",
        },
      }),
      ...(config.plugins || []),
    ];
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@": path.resolve(__dirname, ".."),
      },
    };
    return config;
  },
};
export default config;

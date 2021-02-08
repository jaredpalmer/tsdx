import { Parameters } from "@storybook/react";

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters: Parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
};

import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button.astro"; // AstroのButtonをラップしたコンポーネント

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"], // Storybook Docs機能を有効化
  argTypes: {
    variant: { control: "radio", options: ["primary", "secondary"] },
    label: { control: "text" },
    disabled: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

// 各種ストーリー定義
export const Primary: Story = {
  args: {
    label: "プライマリボタン",
    variant: "primary",
    disabled: false,
  },
};
export const Secondary: Story = {
  args: {
    label: "セカンダリボタン",
    variant: "secondary",
    disabled: false,
  },
};
export const Disabled: Story = {
  args: {
    label: "無効なボタン",
    variant: "primary",
    disabled: true,
  },
};

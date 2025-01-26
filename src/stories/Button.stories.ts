import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { Button } from "../components/ui/button";

// Storybook メタ情報
const meta = {
  title: "Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: [
          "default",
          "destructive",
          "outline",
          "secondary",
          "ghost",
          "link",
          "blur",
          "menu",
          "clipboard",
          "disabled",
          "fit",
        ],
      },
    },
    size: {
      control: {
        type: "select",
        options: [
          "default",
          "sm",
          "lg",
          "icon",
          "sideMenu",
          "clipboard",
          "fit",
        ],
      },
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary ボタン
export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "default",
    size: "default",
  },
};

// Secondary ボタン
export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    size: "default",
  },
};

// Large ボタン
export const Large: Story = {
  args: {
    size: "lg",
    children: "Large Button",
  },
};

// Small ボタン
export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  },
};

// Outline ボタン
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

// Destructive ボタン
export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive Button",
  },
};

// Ghost ボタン
export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

// Link ボタン
export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Button",
  },
};

// Disabled ボタン
export const Disabled: Story = {
  args: {
    variant: "disabled",
    children: "Disabled Button",
    disabled: true,
  },
};

// Icon ボタン
export const Icon: Story = {
  args: {
    size: "icon",
    children: "🔍", // アイコン
  },
};

// Clipboard ボタン
export const Clipboard: Story = {
  args: {
    variant: "clipboard",
    size: "clipboard",
    children: "📋",
  },
};

// Fit サイズボタン
export const Fit: Story = {
  args: {
    variant: "fit",
    size: "fit",
    children: "Fit Button",
  },
};

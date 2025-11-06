# Checkbox Component

A customizable checkbox component built on top of Radix UI's checkbox primitive, providing accessible and themeable checkbox inputs for forms and settings.

## Features

- **Accessible**: Built on Radix UI primitives with full keyboard navigation and screen reader support
- **Themeable**: Supports light and dark modes automatically
- **Variants**: Two visual styles (default and secondary)
- **States**: Supports checked, unchecked, indeterminate, and disabled states
- **Customizable**: Accepts all standard Radix UI checkbox props
- **Type-safe**: Full TypeScript support

## Installation

The Checkbox component is part of the `@fluffylabs/shared-ui` package. Make sure you have the package installed:

```bash
npm install @fluffylabs/shared-ui
```

## Usage

### Basic Example

```tsx
import { Checkbox } from "@fluffylabs/shared-ui";

function MyComponent() {
  return <Checkbox />;
}
```

### With Label

```tsx
import { Checkbox } from "@fluffylabs/shared-ui";
import { useState } from "react";

function MyComponent() {
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        checked={isAccepted}
        onCheckedChange={(checked) => setIsAccepted(checked === true)}
      />
      <label htmlFor="terms" className="text-sm cursor-pointer">
        Accept terms and conditions
      </label>
    </div>
  );
}
```

### With Description

```tsx
import { Checkbox } from "@fluffylabs/shared-ui";
import { useState } from "react";

function MyComponent() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id="notifications"
        checked={isEnabled}
        onCheckedChange={(checked) => setIsEnabled(checked === true)}
      />
      <div className="grid gap-1.5 leading-none">
        <label htmlFor="notifications" className="text-sm font-medium cursor-pointer">
          Enable notifications
        </label>
        <p className="text-sm text-neutral-medium">
          Receive email notifications about your account activity.
        </p>
      </div>
    </div>
  );
}
```

### Secondary Variant

```tsx
import { Checkbox } from "@fluffylabs/shared-ui";

function MyComponent() {
  return <Checkbox variant="secondary" />;
}
```

### Disabled State

```tsx
import { Checkbox } from "@fluffylabs/shared-ui";

function MyComponent() {
  return <Checkbox disabled checked />;
}
```

### Indeterminate State

The checkbox supports an indeterminate state, useful for "select all" patterns:

```tsx
import { Checkbox } from "@fluffylabs/shared-ui";
import { useState } from "react";

function SelectAllExample() {
  const [items, setItems] = useState({
    item1: false,
    item2: false,
    item3: false,
  });

  const allChecked = Object.values(items).every(Boolean);
  const someChecked = Object.values(items).some(Boolean);
  const selectAllState = allChecked ? true : someChecked ? "indeterminate" : false;

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    const newValue = checked === true;
    setItems({
      item1: newValue,
      item2: newValue,
      item3: newValue,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="select-all"
          checked={selectAllState}
          onCheckedChange={handleSelectAll}
        />
        <label htmlFor="select-all" className="text-sm font-semibold cursor-pointer">
          Select all items
        </label>
      </div>

      <div className="pl-6 space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="item1"
            checked={items.item1}
            onCheckedChange={(checked) =>
              setItems((prev) => ({ ...prev, item1: checked === true }))
            }
          />
          <label htmlFor="item1" className="text-sm cursor-pointer">
            Item 1
          </label>
        </div>
        {/* More items... */}
      </div>
    </div>
  );
}
```

## Props

The Checkbox component accepts all props from Radix UI's Checkbox component, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "secondary"` | `"default"` | Visual style variant |
| `checked` | `boolean \| "indeterminate"` | `undefined` | Controlled checked state |
| `defaultChecked` | `boolean` | `undefined` | Uncontrolled default checked state |
| `onCheckedChange` | `(checked: boolean \| "indeterminate") => void` | `undefined` | Callback when checked state changes |
| `disabled` | `boolean` | `false` | Whether the checkbox is disabled |
| `required` | `boolean` | `false` | Whether the checkbox is required |
| `name` | `string` | `undefined` | Name attribute for form submission |
| `value` | `string` | `"on"` | Value attribute for form submission |
| `id` | `string` | `undefined` | ID for label association |
| `className` | `string` | `undefined` | Additional CSS classes |

## Variants

### Default
The default variant uses the brand primary color when checked, with a strong border in the unchecked state.

```tsx
<Checkbox variant="default" />
```

### Secondary
The secondary variant uses neutral colors, providing a more subtle appearance.

```tsx
<Checkbox variant="secondary" />
```

## Accessibility

The Checkbox component is built on Radix UI primitives and includes:

- Full keyboard navigation support (Space to toggle)
- Proper ARIA attributes for screen readers
- Focus visible indicators
- Disabled state handling
- Label association via `id` and `htmlFor`

### Keyboard Interactions

| Key | Action |
|-----|--------|
| `Space` | Toggles the checkbox |
| `Tab` | Moves focus to/from the checkbox |

## Styling

The component uses Tailwind CSS classes and CSS variables from the shared-ui theme system. It automatically adapts to light and dark modes.

### Custom Styling

You can customize the appearance using the `className` prop:

```tsx
<Checkbox className="border-blue-500 data-[state=checked]:bg-blue-500" />
```

## Form Integration

The checkbox works seamlessly with form libraries:

### With React Hook Form

```tsx
import { Checkbox } from "@fluffylabs/shared-ui";
import { useForm, Controller } from "react-hook-form";

function MyForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name="acceptTerms"
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor="terms">Accept terms</label>
          </div>
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Examples

See the Storybook documentation for interactive examples:
- All variants and states
- With labels and descriptions
- Multiple checkboxes
- Select all pattern
- Form integration

## Related Components

- **Switch**: For on/off toggles
- **Button**: For action triggers
- **Input**: For text input fields

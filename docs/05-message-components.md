# Message Components

Discord Message Components are interactable elements that appear in a message. Currently, there are two types of components: Buttons and Select Menus.

Purplet Message Component definitions define three things at once:

- The type definition of a "context" object, which allows you to pass a small amount of state between messages.
- A function that converts that context object into a message component object.
- A function that handles incoming interactions with the component.

A basic example defining a button that is used with two different contexts, handled by the same function:

```ts title='src/features/message-component.ts'
// An interface describing the context object, which must be JSON-serializable.
export interface SampleContext {
  name: string;
}

export const myButton = $buttonComponent({
  // A function converting context -> component.
  create(ctx: SampleContext) {
    return new ButtonBuilder() //
      .setLabel(`Button for ${ctx.name}`)
      .setStyle(ButtonStyle.Secondary);
  },
  // A function handling interactions with the component, receiving the context object.
  handle(ctx: SampleContext) {
    this.showMessage(`You clicked the button for ${ctx.name}`);
  },
});

export const testCommand = $slashCommand({
  name: 'test',
  description: 'Test command',
  handle() {
    // `myButton.create` is a function that takes the context object, and returns a component.
    // We use `MessageComponentBuilder` to quickly build the UI layout.
    this.showMessage({
      components: new MessageComponentBuilder()
        .addInline(myButton.create({ name: 'Dave' }))
        .addInline(myButton.create({ name: 'Alice' }))
        .toJSON(),
    });
  },
});
```

:::note

The way Component Context is implemented is by cramming the data into the component's `custom_id` field. With other data that purplet uses to store, you can store around 75 bytes of your own data, which is serialized as compactly as possible using [@purplet/serialize](https://github.com/CRBT-Team/Purplet/tree/main/packages/serialize).

:::

## Render Props

Since the size of the context object is limited, you can use the `renderProps` property to pass additional data to the component that is only used for rendering. It is simply a second argument to the `create` function.

```ts
export const myButton = $buttonComponent({
  create(ctx: SampleContext, renderProps: { style: ButtonStyle }) {
    return new ButtonBuilder() //
      .setLabel(`Button for ${ctx.name}`)
      .setStyle(renderProps.style);
  },
  handle(ctx: SampleContext) {
    this.showMessage(`You clicked the button for ${ctx.name}`);
  },
});

// In a command
myButton.create({ name: 'Clement' }, { style: ButtonStyle.Primary });
```

## Contextless Components

While useful, the context system may not always be needed (eg. a static button). In this case, you can use the `component` property of the message to define a component without using a function.

```ts
export const myButton = $buttonComponent({
  component: new ButtonBuilder() //
    .setLabel('Button')
    .setStyle(ButtonStyle.Secondary),

  handle() {
    this.showMessage('You clicked the button');
  },
});

// `myButton.create()` will return the component passed in, but with `custom_id` set properly.
```

## Other Components

Buttons were used to illustrate the basics of the component system. Other components are also available, and their differences are shown below:

### Select Menus

Select Menus function exactly the same as Buttons, except they pass a `values` property to the context with the selected values.

```ts
export const mySelect = $selectMenuComponent({
  create(ctx: SampleContext) {
    return new SelectMenuBuilder() //
      .setPlaceholder(`Select for ${ctx.name}`)
      .setOptions([
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' },
      ]);
  },
  handle(context) {
    this.showMessage(
      `You selected ${context.values.join(' and ')} on the menu for ${context.name}`
    );
  },
});
```

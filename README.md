# With Arrow Controls

Small utility library to enable arrow controls for focussable elements inside a container.

## Usage

Simple: 
Looks for elements with [data-with-arrowcontrols] and enables arrow controls for all focussable elements within.

```js
withArrowControls()
```

You can customise the selector with the first argument, e.g.:

```js
withArrowControls(".your-controlled-containers")
```

## Config

You can also pass a config to customise the behaviour even further. These are the options:

```ts
export type TConfig = {
    /**
     * If set to true, the arrows will wrap from last to first and vice versa.
     * @default: true
     */
    wrapControls: boolean;
    /**
     * If set to true, elements that can't be tabbed will be ignored.
     * @default: true
     */
    ignoreUntabbable: boolean;
    /**
     * If set to true, prevent default events. Usually used to give more flexibility, so radio groups dont prevent function.
     * If you only have a group of radio inputs, set it to false to check them.
     * @default: true
     */
    preventDefault: boolean;
    /**
     * Customise the child selector. This is for more advanced usecases, probably.
     * Will be used inside rootElement.querySelectorAll(yourSelector)
     * @default: undefined
     */
    customSelector?: string;
};
```


## Cleanup 

If you need / want to cleanup the listeners, `withArrowControls` returns an Array of `{ unsubscribe: () = void } ` objects, that you can use to unsubscribe.

```js
const subscriptions = withArrowControls();
subscriptions.forEach(s => s.unsubscribe());
```

### Caveats

- If the elements inside your container change, by either adding an element or enabling an element for example,
the function needs to be called again.


### Outlook

Might look into adding a mutation observer to handle DOM updates.
Also maybe add tests.

### Inspirations

https://github.com/argyleink/roving-ux

Adam's library. Does the same, probably better. ¯\_(ツ)_/¯

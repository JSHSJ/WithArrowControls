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

export const defaultConfig: TConfig = {
  wrapControls: true,
  ignoreUntabbable: true,
  preventDefault: true,
  customSelector: undefined,
};

const isRtl =
  window.getComputedStyle(document.documentElement).direction === "rtl";
const usedKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
const prevKeys = isRtl
  ? new Set(["ArrowRight", "ArrowUp"])
  : new Set(["ArrowLeft", "ArrowUp"]);
const nextKeys = isRtl
  ? new Set(["ArrowLeft", "ArrowDown"])
  : new Set(["ArrowRight", "ArrowDown"]);

const focussableElementSelector =
  'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])';

export const getKeyboardFocusableElements = (
  root: HTMLElement,
  selector = focussableElementSelector
) => {
  return Array.from(root.querySelectorAll(selector)).filter(
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
  );
};

export const activateElement = (element: Element) => {
  if (typeof (element as HTMLElement).focus === "function") {
    (element as HTMLElement).focus();
  }
};

const handleIndex = (
  key: string,
  currentIdx: number,
  childrenLength: number,
  shouldWrap: boolean
) => {
  if (prevKeys.has(key)) {
    if (currentIdx > 0) {
      return currentIdx - 1;
    }

    if (shouldWrap && currentIdx === 0) {
      return childrenLength - 1;
    }
  }

  if (nextKeys.has(key)) {
    if (currentIdx < childrenLength - 1) {
      return currentIdx + 1;
    }

    if (shouldWrap && currentIdx === childrenLength - 1) {
      return 0;
    }
  }

  return currentIdx;
};

export const registerArrowControls = (root: Element, config: TConfig) => {
  const children = getKeyboardFocusableElements(
    root as HTMLElement,
    config.customSelector
  );

  // Prevent default tabbing, so tab will jump to the next element outside of this group.
  let currentIdx = 0;
  (root as HTMLElement).tabIndex = 0;
  children.forEach((el) => ((el as HTMLElement).tabIndex = -1));

  const onFocusIn = () => {
    activateElement(children[currentIdx]);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!root.contains(document.activeElement)) {
      return;
    }

    if (usedKeys.has(event.key) && config.preventDefault) {
      event.preventDefault();
    }

    currentIdx = handleIndex(
      event.key,
      currentIdx,
      children.length,
      config.wrapControls
    );
    activateElement(children[currentIdx]);
  };

  root.addEventListener("focusin", onFocusIn);
  root.addEventListener("keydown", onKeyDown);

  const unsubscribe = () => {
    root.removeEventListener("focusin", onFocusIn);
    root.removeEventListener("keydown", onKeyDown);
  };

  return {
    unsubscribe,
  };
};

export const withArrowControls = (
  rootSelector: string = "[data-with-arrowcontrols]",
  options?: Partial<TConfig>
) => {
  const config = Object.assign({}, defaultConfig, options);

  const rootElements = Array.from(document.querySelectorAll(rootSelector));
  if (rootElements.length === 0) {
    throw new Error(
      `Unable to find root elements with selector ${rootSelector}`
    );
  }

  const subscriptions = rootElements.map((el) =>
    registerArrowControls(el, config)
  );

  return subscriptions;
};

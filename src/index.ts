export type TConfig = {
  /**
   * If set to true, the arrows will wrap from last to first and vice versa.
   */
  wrapControls: boolean;
  /**
   * If set to true, elements that can't be tabbed will be ignored.
   */
  ignoreUntabbable: boolean;
};

/**
 * Check if the given element is tabbable.
 */
export const isTabbable = (element: HTMLElement) => {
  if (
    element.tabIndex > 0 ||
    (element.tabIndex === 0 && element.getAttribute("tabIndex") !== null)
  ) {
    return true;
  }
  if (element.hasAttribute("disabled")) {
    return false;
  }

  switch (element.nodeName) {
    case "A":
      return (
        !!(element as HTMLAnchorElement).href &&
        (element as HTMLAnchorElement).rel !== "ignore"
      );
    case "INPUT":
      return (
        (element as HTMLInputElement).type !== "hidden" &&
        (element as HTMLInputElement).type !== "file"
      );
    case "BUTTON":
    case "SELECT":
    case "TEXTAREA":
      return true;
    default:
      return false;
  }
};

export const withArrowControls = (
  rootSelector: string = "[data-with-arrowcontrols]"
) => {
  const root = document.querySelector(rootSelector);
  if (!root) {
    throw new Error(
      `Unable to find root element with selector ${rootSelector}`
    );
  }

  const children = Array.from(root.children);
  console.log(children);
};

withArrowControls();

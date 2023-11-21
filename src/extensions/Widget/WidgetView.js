export let widgetIcon = null;

export class WidgetView {

  constructor({ view, widgetIconDOM }) {
    widgetIcon = widgetIconDOM(view);
  }

  removeNode(node) {
    node.parentNode.removeChild(node);
  }

  destroy() {
    this.removeNode(widgetIcon);
    widgetIcon = null;
  }
}

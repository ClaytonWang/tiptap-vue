import { Plugin, PluginKey } from '@tiptap/pm/state';
import { uid } from 'uid';

class TOCView {
  constructor({ editor,onUpdate }) {
    this.editor = editor;
    this.setHeadings = onUpdate;
    this.onUpdate();
  }

  onUpdate() {
    setTimeout(() => this.update(this.editor.view));
  }

  update(view, oldState) {
    const { state } = view;
    const { doc } = state;

    const isSame = oldState && oldState.doc.eq(doc) || (view && view.composing);

    if (isSame) {
      return;
    }

    const headings = [];
    const transaction = state.tr;

    let index = 0;
    doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        let id = node.attrs.id;
        if (!id) {
          id = 'h'+uid(16);
        }

        headings.push({
          ...node.attrs,
          index:index++,
          level: node.attrs.level,
          text: node.textContent,
          id,
          from: pos,
          to: pos + node.nodeSize
        });
      }
    });
    calcSerialNumber(headings);

    headings.forEach((heading) => {
      transaction.setNodeMarkup(heading.from, undefined, {
        ...heading
      });
    });

    transaction.setMeta('addToHistory', false);
    transaction.setMeta('preventUpdate', true);

    // view.dispatch(transaction);
    view.updateState(view.state.apply(transaction))

    this.setHeadings(headings);
  }

  destroy() {

  }
}

export const TOCPlugin = (options) => {
  return new Plugin({
    key: typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: (view) => new TOCView({ view, ...options }),
  });
};


function calcSerialNumber(headings = [], maxLevel = 6) {

  const currentNumbers = Array(maxLevel).fill(0);

  if (!headings || headings.length === 0) {
    return headings
  }

  let topLevel = Math.min(...headings.map((heading) => { return parseInt(heading.level) }));

  if (topLevel === 0) topLevel = 1;

  headings.forEach((heading) => {
    const level = parseInt(heading.level) - topLevel + 1;
    currentNumbers[level - 1]++;

    for (let i = level; i < maxLevel; i++) {
      currentNumbers[i] = 0;
    }

    const headingNumber = currentNumbers.slice(0, level).join(".");

    heading.sn = headingNumber;
    heading.text = heading.sn + ' ' + heading.text;

  });
  return headings;
}

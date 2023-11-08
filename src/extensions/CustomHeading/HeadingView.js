import { getNextHeadBySN } from "../../utils/helpers";

export class HeadingView {
  constructor({ editor,onUpdate,storage,plugin }) {
    this.editor = editor;
    this.setHeadings = onUpdate;
    this.storage = storage;
    this.plugin = plugin;
    this.onUpdate();
  }

  onUpdate() {
    // setTimeout(() => this.update(this.editor.view));
    this.update(this.editor.view);
  }

  update(view, oldState) {
    const { state } = view;
    const { doc } = state;

    const isSame = oldState && oldState.doc.eq(doc) || (view && view.composing);

    if (isSame) {
      return;
    }

    const transaction = state.tr;
    const headings = this.storage.headings;

    headings.forEach((heading) => {

      const nextHeading = getNextHeadBySN(heading.sn, headings);
      const rangeHead = nextHeading ? nextHeading.from : view.state.doc.nodeSize - 2;

      //折叠区间位置
      heading.rfrom = heading.from;
      heading.rto = rangeHead;

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
}


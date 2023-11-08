import { Plugin, PluginKey, TextSelection, NodeSelection } from '@tiptap/pm/state';
import _ from 'lodash';

let dragElement = null;
const WIDTH = 28;
let index = 0;
class DragableView {
  constructor({ view, options }) {
    this.storage = options.storage;
    this.init(view, options);
  }
  init(view, options) {
    dragElement = document.createElement('div');
    dragElement.draggable = 'true';
    dragElement.classList.add(options.dragClass);
    dragElement.addEventListener('dragstart', e => this.dragStart(e, view));
    dragElement.addEventListener('mousedown', e => this.mouseDown(e));
    dragElement.addEventListener('mouseup', e => this.mouseUp(e));
    document.body.appendChild(dragElement);
  }

  removeNode(node) {
    node.parentNode.removeChild(node);
  }

  blockPosAtCoords(coords, view) {
    const pos = view.posAtCoords(coords)
    // let node = view.domAtPos(pos.pos)
    let node = view.nodeDOM(pos.pos)

    // node = node.node

    while (node && node.parentNode) {
      if (node.parentNode?.classList?.contains('ProseMirror')) {
        // todo
        break
      }
      node = node.parentNode
    }

    if (node && node.nodeType === 1) {
      const desc = view.docView.nearestDesc(node, true)

      if (!(!desc || desc === view.docView)) {
        return desc.posBefore
      }
    }
    return null
  }

  dragStart(e, view) {
    if (!e.dataTransfer) {
      return;
    }

    const coords = { left: e.clientX, top: e.clientY };
    // const coords = { left: e.clientX, top: e.clientY };
    const pos = this.blockPosAtCoords(coords, view);

    if (pos != null) {
      let selection = null, dragElement = null;
      const dragNode = view.state.doc.nodeAt(pos);

      //如果拖拽的是heading并且heading是折叠的,那么折叠的部分作为一个Slice被拖动
      if (dragNode?.type.name === "CustomHeading" && dragNode?.attrs.fold) {
        const { rfrom, rto, id } = dragNode.attrs;
        selection = TextSelection.create(view.state.doc, rfrom, rto);

        // 如果区间是被折叠上的，那么只拖动折叠的内容和折叠末尾的空行。
        // 计算出折叠区间的末尾pos。
        let _pos = rfrom + dragNode.nodeSize;
        selection.content().content.forEach((node) => {
          if (node.attrs.class === "force-fold" ||  node.attrs.type==="empty") {
            _pos += node.nodeSize;
          }
        });

        //获取到折叠的selection
        selection = TextSelection.create(view.state.doc, rfrom, _pos);
        dragElement = document.querySelector(`#${id}`);
      } else {
        selection = NodeSelection.create(view.state.doc, pos);
      }

      view.dispatch(view.state.tr.setSelection(selection));
      const slice = view.state.selection.content();

      if (!dragElement) {
        dragElement = document.querySelector('.ProseMirror-selectednode');
      }
      e.dataTransfer?.setDragImage(dragElement, 0, 0)
      view.dragging = { slice, move: true }
    }
  }

  mouseDown(e) {
    e.target.classList.add("dragging");
  }

  mouseUp(e) {
    e.target.classList.remove("dragging");
  }

  destroy() {
    this.removeNode(dragElement);
    dragElement = null;
  }
}

class DragablePros {
  constructor() {
    this.handleDOMEvents = this._handleDOMEvents();
    this.handleDrop = this._handleDrop;
  }

  _handleDrop(view, event, slice, moved) {
    if (moved) {
      setTimeout(() => {
        dragElement.classList.remove("dragging");
      }, 50);
    }
  }

  _handleDOMEvents() {
    function absoluteRect(node) {
      const data = node.getBoundingClientRect();

      return {
        top: data.top,
        left: data.left,
        width: data.width,
      }
    }
    const fn = _.debounce((view, event) => {
      const coords = {
        left: event.clientX + WIDTH + 50,
        // left: event.clientX,
        top: event.clientY - 15,
      };
      const pos = view.posAtCoords(coords);
      if (pos) {
        // let node = view.domAtPos(pos?.pos)
        let node = view.nodeDOM(pos?.pos);

        if (node) {
          // node = node.node
          while (node && node.parentNode) {
            if (node.parentNode?.classList?.contains('ProseMirror')) {
              break
            }
            node = node.parentNode;
          }

          if (node instanceof Element) {
            const cstyle = window.getComputedStyle(node);
            const lineHeight = parseInt(cstyle.lineHeight, 10);
            // const top = parseInt(cstyle.marginTop, 10) + parseInt(cstyle.paddingTop, 10)
            const top = 5;
            const rect = absoluteRect(node);
            const win = node.ownerDocument.defaultView;

            rect.top += win.scrollY + (lineHeight - 24) / 2 + top;
            rect.left += win.scrollX;
            // rect.width = `${WIDTH}px`

            dragElement.style.left = `${-WIDTH + rect.left}px`;
            dragElement.style.top = `${rect.top}px`;
            dragElement.style.visibility = 'visible';
          }
        }
      } else {
        dragElement.style.visibility = 'hidden';
      }
    }, 5);
    return {
      mousemove(view, event) {
        fn(view, event);
      },
    }
  }
}

export const DraggablePlugin = (options) => {
  return new Plugin({
    key: typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: view => new DragableView({ view, options }),
    props: new DragablePros()
  });
};


import { Plugin, PluginKey, TextSelection, NodeSelection } from '@tiptap/pm/state';

let dragElement = null;
const DRAG_WIDTH = 28,DRAGE_ELE_HEIGHT=16,HOVER_WIDTH=5;
class DragableView {
  constructor({ view, dragClass }) {
    this.init(view, dragClass);
  }
  init(view, dragClass) {
    dragElement = document.createElement('div');
    dragElement.draggable = 'true';
    dragElement.classList.add(dragClass);
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
    let node = view.nodeDOM(pos.pos)

    while (node && node.parentNode) {
      if (node.parentNode?.classList?.contains('ProseMirror')) {
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
    const pos = this.blockPosAtCoords(coords, view);

    if (pos != null) {
      let selection = null, dragElement = null;
      const dragNode = view.state.doc.nodeAt(pos);

      //如果拖拽的是heading并且heading是折叠的,那么折叠的部分作为一个Slice被拖动
      if (dragNode?.type.name === "nHeading" && dragNode?.attrs.fold) {
        const { rfrom, rto, id } = dragNode.attrs;
        selection = TextSelection.create(view.state.doc, rfrom, rto);

        const { content } = selection.content();

        // 如果区间是被折叠上的，那么只拖动折叠的内容和折叠末尾的空行。
        // 计算出折叠区间的末尾pos。
        let _pos = rfrom + dragNode.nodeSize;
        content.forEach((node) => {
          if (node.attrs.class === "force-fold" || node.attrs.type === "empty") {
            _pos += node.nodeSize;
          }
        });

        //重新获取到折叠的selection
        selection = TextSelection.create(view.state.doc, rfrom, _pos);
        // drag hint
        dragElement = document.querySelector(`#${id}`);
      } else {
        //如果是非 折叠 的块，那么只拖动这个 node。
        selection = NodeSelection.create(view.state.doc, pos);
      }

      selection.visible = false;
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
  constructor({ allowDrageNode }) {
    this.handleDOMEvents = this._handleDOMEvents(allowDrageNode);
    this.handleDrop = this._handleDrop;
  }

  _handleDrop(view, event, slice, moved) {
    if (moved) {
      setTimeout(() => {
        dragElement.classList.remove("dragging");
      }, 50);
    }
  }

  _handleDOMEvents(allowDrageNode) {
    return {
      //显示drag hander
      mouseover(_, event) {
        let targetElem = event.target;

        while (targetElem && targetElem.parentNode) {
          if (targetElem.parentNode?.classList?.contains('ProseMirror')) {
            break
          }
          targetElem = targetElem.parentNode;
        }

        const isAllow = allowDrageNode(targetElem);
        if (!isAllow) return;

        if (targetElem instanceof Element) {
          const cstyle = window.getComputedStyle(targetElem);
          const lineHeight = parseInt(cstyle.lineHeight, 10);

          const rect = absoluteRect(targetElem);
          const win = targetElem.ownerDocument.defaultView;

          //居中
          rect.top += win.scrollY + (lineHeight - DRAGE_ELE_HEIGHT) / 2;
          rect.left += win.scrollX - DRAG_WIDTH;

          dragElement.style.left = `${rect.left}px`;
          dragElement.style.top = `${rect.top}px`;
          dragElement.style.visibility = 'visible';
        }
      },

      mousemove(_,event) {
        //  鼠标移出编辑区，隐藏drag hander
        if (!mouseInEditor(event)) {
          dragElement.style.visibility = 'hidden';
          return;
        }
      }
    }

    function absoluteRect(node) {
      const data = node.getBoundingClientRect();

      return {
        top: data.top,
        left: data.left,
        width: data.width,
      }
    }

    function mouseInEditor(event) {
      const x = event.clientX, y = event.clientY;
      const domEditor = document.querySelector(".ProseMirror");
      const { left, right, top, bottom } = domEditor.getBoundingClientRect();

      return (
        x > left + HOVER_WIDTH
        && x < right - HOVER_WIDTH
        && y > top + HOVER_WIDTH
        && y < bottom - HOVER_WIDTH
      );
    }
  }
}

export const DraggablePlugin = (options) => {
  return new Plugin({
    key: typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: view => new DragableView({ view, ...options }),
    props: new DragablePros({...options})
  });
};


import { dragHander } from './DragableView';

const DRAG_WIDTH = 28, DRAGE_ELE_HEIGHT = 16, HOVER_WIDTH = 5;

export class DragablePros {
  constructor({ allowDrageNode }) {
    this.handleDOMEvents = this._handleDOMEvents(allowDrageNode);
    this.handleDrop = this._handleDrop;
  }

  _handleDrop(view, event, slice, moved) {
    if (moved) {
      setTimeout(() => {
        dragHander.classList.remove("dragging");
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

          dragHander.style.left = `${rect.left}px`;
          dragHander.style.top = `${rect.top}px`;
          dragHander.style.visibility = 'visible';
        }
      },

      mousemove(_,event) {
        //  鼠标移出编辑区，隐藏drag hander
        if (!mouseInEditor(event)) {
          dragHander.style.visibility = 'hidden';
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

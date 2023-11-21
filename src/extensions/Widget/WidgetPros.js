import { TextSelection } from '@tiptap/pm/state';
import { widgetIcon } from './WidgetView';

const WIDTH = 35, ELE_HEIGHT = 16, HOVER_WIDTH = 5;

export class WidgetPros {
  constructor({ pluginKey,allowComment }) {
    this.pluginKey = pluginKey;
    this.handleDOMEvents = this._handleDOMEvents(allowComment);
    this.handleClick = this._handleClick;
    this.decorations = this._decorations;
  }

  _decorations(state) {
    return this.getState(state)
  }

  _handleDOMEvents(allowComment) {
    return {

      mouseover(_, event) {
        let targetElem = event.target;

        while (targetElem && targetElem.parentNode) {
          if (targetElem.parentNode?.classList?.contains('ProseMirror')) {
            break
          }
          targetElem = targetElem.parentNode;
        }

        const isAllow = allowComment(targetElem);

        if (!isAllow) return;

        if (targetElem instanceof Element) {
          const cstyle = window.getComputedStyle(targetElem);
          const lineHeight = parseInt(cstyle.lineHeight, 10);

          const rect = absoluteRect(targetElem);
          const win = targetElem.ownerDocument.defaultView;

          //居中
          rect.top += win.scrollY + (lineHeight - ELE_HEIGHT) / 2;
          rect.left += win.scrollX  +  rect.width;
          widgetIcon.style.left = `${rect.left}px`;
          widgetIcon.style.top = `${rect.top}px`;
          widgetIcon.style.visibility = 'visible';
        }
      },

      mousemove(_,event) {
        //  鼠标移出编辑区，隐藏
        if (!mouseInEditor(event)) {
          widgetIcon.style.visibility = 'hidden';
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

  // _handleClick(view, _, event) {
  //   const target = event.target;

  //   if (/comment-icon/.test(target.className) && target.comment) {
  //     const { from, to } = target.comment;

  //     view.dispatch(
  //       view.state.tr
  //         .setSelection(TextSelection.create(view.state.doc, from, to))
  //         .scrollIntoView()
  //     )

  //     return true
  //   }

  //   return false
  // }
}

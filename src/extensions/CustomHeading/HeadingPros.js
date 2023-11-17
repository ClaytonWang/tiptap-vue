import { TextSelection } from '@tiptap/pm/state';
import { getNextHeadBySN } from "../../utils/helpers";

export class HeadingPros {
  constructor({ pluginKey }) {
    this.pluginKey = pluginKey;
    this.handleDOMEvents = this._handleDOMEvents();
    this.handleDrop = this._handleDrop;
    this.handleClick = this._handleClick;
  }

  _handleDOMEvents() {
    return {
      mouseover(view, event) {

        let targetElem = event.target, tr = view.state.tr;

        // 鼠标hover到heading上才显示箭头，否则去掉箭头
        if (!(/n-h\d/i.test(targetElem.tagName))
          && !(/n-heading-ext/i.test(targetElem.tagName))
          && !(/n-fold/i.test(targetElem.tagName))
          && !(/n-sn/i.test(targetElem.tagName))
          && !(/n-heading-content/i.test(targetElem.tagName))) {

          const elem = document.querySelector('.hovered');
          if (!elem) return;

          const pos = view.posAtDOM(elem, 0);
          if (pos < 0) return;
          view.dispatch(tr.setNodeAttribute(pos - 1, 'class', ''));

          return;
        };

        // 有可能hover到heading的里面元素，找到最外层的n-h元素
        while (targetElem && targetElem.parentNode) {
          if (targetElem.parentNode?.classList?.contains('ProseMirror')) {
            break
          }
          targetElem = targetElem.parentNode;
        }

        if (/n-h\d/i.test(targetElem.tagName)) {
          const pos = view.posAtDOM(targetElem, 0);
          if (pos < 0) return;
          view.dispatch(tr.setNodeAttribute(pos - 1, 'class', 'hovered'));
        }
      }

    }
  }

  _handleDrop(view, _, slice, moved) {
    //拖动标题后把光标设置在标题头部
    if (moved) {
      setTimeout(() => {
        const node = slice.content.firstChild;
        const { id,sn } = node.attrs;
        if (!id || !sn) return;

        let selection = null;
        try {
          view.state.doc.descendants((_node, pos) => {
            if (_node.attrs.id === id) {
              // selection = TextSelection.create(view.state.doc, pos + _node.nodeSize - 1);
              selection = TextSelection.create(view.state.doc, pos + 1);
              throw 'break';
            }
          });
        } catch (e) { /* empty */ };

        view.dispatch(view.state.tr.setSelection(selection));
      });
    }
  }

  // 折叠功能
  _handleClick(view, _, event) {
    if (/caret/.test(event.target.className)) {
      const refId = event.target.getAttribute('ref');
      const isOpened = /open/.test(event.target.className);
      const tr = view.state.tr;

      const [headings] = this.getState(view.state);

      const currentHeading = headings.filter((v) => v.id === refId).pop();

      // 设置光标位置
      // tr.setSelection(TextSelection.create(view.state.doc, currentHeading.to - 1));

      // 折叠开始
      const rangeAnchor = currentHeading.to;

      //折叠末尾
      const rangeHead = currentHeading.rto;

      // 要折叠的区间
      const selection = new TextSelection(tr.doc.resolve(rangeAnchor), tr.doc.resolve(rangeHead));

      const { content } = selection.content();
      //折叠区间内的heading
      let _heading = null, _nextHeading = null;
      content.forEach((node, offset) => {

        let currentOffset = rangeAnchor + offset;


        if (node.type.name === this.pluginKey) {

          _heading = headings.filter((v) => v.id === node.attrs.id).pop();
          if (_heading.fold) return;

          _nextHeading = getNextHeadBySN(node.attrs.sn, headings);
        }

        // heading区间的node，如果被折叠了，那么不用再次折叠.如果是折叠的，父级的折叠操作不应该影响它。

        if (node.type.name !== this.pluginKey
          && _heading?.to <= currentOffset
          && currentOffset < _nextHeading?.from
          && _heading.fold) {
          return;
        }

        tr.setNodeMarkup(currentOffset, undefined, {
          ...node.attrs,
          class: isOpened ? 'force-fold' : ''
        });
      });

      //被点击的heading
      tr.setNodeMarkup(currentHeading.from, undefined, {
        ...currentHeading,
        fold: isOpened,
      });

      if (isOpened) {
        // 折叠末尾插入空行,文章结尾插入1px高的空行
        const eAttr = { ref: currentHeading.id };
        if (rangeHead === (view.state.doc.nodeSize - 2)) {
          eAttr.style =  'height:1px'
        }
        tr.insert(rangeHead, view.state.schema.nodes.emptyLine.create(eAttr));
      } else {
        //删除折叠末尾的空行
        const ele = document.querySelector(`n-line[ref=${currentHeading.id}]`);
        const delPos = view.posAtDOM(ele, rangeAnchor);

        tr.delete(delPos, delPos+1);
      }

      view.dispatch(tr);

      return true;
    }
  }
}

import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';
import { HeadingView } from './HeadingView';
import { HeadingState } from './HeadingState';
import { getNextHeadBySN } from "../../utils/helpers";
import _ from 'lodash';

export const HeadingPlugin = (options) => {
  const key = typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey;
  const WIDTH = 20;
  return new Plugin({
    key,
    state: HeadingState({ ...options }),
    view: (view) => new HeadingView({ view, ...options }),
    props: {
      decorations(state) {
        const [, decos] = this.getState(state);
        return decos;
      },
      handleDOMEvents: {
        mouseover(view, event) {
          setTimeout(() => {
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

            // 有可能hover到heading的 里面元素，找到最外层的n-h元素
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
          })
        }
      },
      handleDrop(view, _, slice, moved) {
        //拖动标题后把光标设置在标题尾部
        if (moved) {
          setTimeout(() => {
            const node = slice.content.firstChild;
            const { id } = node.attrs;
            let selection = null;
            try {
              view.state.doc.descendants((_node, pos) => {
                if (_node.attrs.id === id) {
                  selection = TextSelection.create(view.state.doc, pos + _node.nodeSize - 1);
                  throw 'break';
                }
              });
            } catch (e) { };

            view.dispatch(view.state.tr.setSelection(selection));
          }, 10);
        }
      },
      handleClick(view, _, event) {
        if (/collapse-icon/.test(event.target.className)) {
          const currentHeading = event.target.heading;
          const isOpened = /open/.test(event.target.className);
          const tr = view.state.tr;
          // 设置光标位置
          tr.setSelection(TextSelection.create(view.state.doc, currentHeading.to - 1));

          const [headings] = this.getState(view.state);

          // 折叠开始
          const rangeAnchor = currentHeading.to;

          //折叠末尾
          const rangeHead = currentHeading.rto;

          // 要折叠的区间
          const selection = TextSelection.create(view.state.doc, rangeAnchor, rangeHead).content();

          //折叠区间内的heading
          let _heading = null, _nextHeading = null;
          selection.content.forEach((node, offset) => {

            let currentOffset = rangeAnchor + offset;

            if (node.type.name === options.pluginKey) {
              _heading = headings.filter((v) => v.sn === node.attrs.sn).pop();
              _nextHeading = getNextHeadBySN(node.attrs.sn, headings);
            }

            // heading区间的node，如果被折叠了，那么不用再次折叠.如果是折叠的，父级的折叠操作不应该影响它。
            if (node.type.name !== options.pluginKey
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
            fold: isOpened
          });

          if (isOpened) {
            // 折叠末尾插入空行,文章结尾插入空paragraph
            if (rangeHead === (view.state.doc.nodeSize - 2)) {
              tr.insert(rangeHead, view.state.schema.nodes.paragraph.create());
            }
            tr.insert(rangeHead, view.state.schema.nodes.emptyLine.create({ ref: currentHeading.id }));
          } else {
            //删除折叠末尾的空行
            const ele = document.querySelector(`div[ref=${currentHeading.id}]`);
            const del = view.posAtDOM(ele, rangeAnchor);
            tr.delete(del - 2, del);
          }

          view.dispatch(tr);

          return true;
        }
      },
    }
  });
};


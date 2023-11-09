import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';
import { HeadingView } from './HeadingView';
import { HeadingState } from './HeadingState';
import { getNextHeadBySN } from "../../utils/helpers";

export const HeadingPlugin = (options) => {
  const key = typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey;
  return new Plugin({
    key,
    state: HeadingState({ ...options }),
    view: (view) => new HeadingView({ view, ...options }),
    props: {
      decorations(state) {
        const [, decos] = this.getState(state);
        return decos;
      },
      handleDrop(view, _, slice, moved) {
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
            //设置光标在标题尾部
            view.dispatch(view.state.tr.setSelection(selection));
          },1);
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
          // 要折叠的区间

          // 折叠开始
          const rangeAnchor = currentHeading.to;
          //折叠末尾
          const rangeHead = currentHeading.rto;
          const selection = TextSelection.create(view.state.doc, rangeAnchor, rangeHead).content();

          //折叠区间内的heading
          let _heading = null, _nextHeading = null ;
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
            tr.insert(rangeHead, view.state.schema.nodes.emptyLine.create({ref:currentHeading.id}));
          } else {
            //删除折叠末尾的空行
            const ele = document.querySelector(`div[ref=${currentHeading.id}]`);
            const del = view.posAtDOM(ele, rangeAnchor);
            tr.delete(del-2, del);
          }

          view.dispatch(tr);

          return true;
        }
      },
    }
  });
};


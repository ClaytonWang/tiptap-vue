import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { DOMSerializer } from '@tiptap/pm/model';
import { getSchema } from '@tiptap/core';
import Heading from '@tiptap/extension-heading';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';

import _ from 'lodash';

const WIDTH = 28;

function collapesDeco(doc) {
  let decos = [];
  headings(doc).forEach(heading => {
    decos.push(Decoration.widget(heading.to, (view) => {
      return collapesIcon(view, heading)
    }))
  });
  return DecorationSet.create(doc, decos);
}

function collapesIcon(view, heading) {
  const domHeading = view.nodeDOM(heading.from);
  const cstyle = domHeading.getBoundingClientRect();
  let title = "收起";
  let icon = document.createElement("i");
  icon.className = "collapse-icon open";
  icon.title = title;
  icon.heading = heading;
  icon.setAttribute('ref-id', heading.id);
  icon.style.top = (cstyle.top - cstyle.height) + 'px';
  return icon;
}

function headings(doc) {
  let result = [];

  // 遍历在文档中的每个节点
  doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      result.push({
        ...node.attrs,
        from: pos,
        to: pos + node.nodeSize,
        isOpen: true,
      });
    }
  });

  if (result.length === 0) return [];

  for (let i = 0; i < result.length; i++) {
    let j = i + 1;
    if (j > result.length) {
      result[i].next = null;
    } else {
      result[i].next = { ...result[j] };
    }
  }
  return result;
}

function absoluteRect(node) {
  const data = node.getBoundingClientRect();

  return {
    top: data.top,
    left: data.left,
    width: data.width,
    height: data.height
  }
}

const _debounceFn = _.debounce((view, event) => {
  const targetDom = event.target;
  const tagName = targetDom.tagName.toLowerCase();
  if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
    return;
  }

  const coords = {
    left: event.clientX + 50,
    // left: event.clientX,
    top: event.clientY - 10,
  };

  const pos = view.posAtCoords(coords);
  if (pos) {
    // let node = view.domAtPos(pos?.pos)
    let node = view.nodeDOM(pos?.pos);

    if (node) {
      // node = node.node
      while (node && node.parentNode) {
        if (node.parentNode?.classList?.contains('ProseMirror')) {
          // todo
          break
        }
        node = node.parentNode;
      }

      if (node instanceof Element) {
        const rect = absoluteRect(node);
        const win = node.ownerDocument.defaultView;
        rect.top += win.scrollY;
        const targetId = targetDom.id;
        let collapesIcon = document.querySelector(`i[ref-id="${targetId}"]`);
        collapesIcon.style.top = `${rect.top - rect.height}px`;
      }
    }
  }
}, 5);

function getHTMLFromNode(node, schema) {
  const documentFragment = DOMSerializer.fromSchema(schema).serializeNode(node)

  const temporaryDocument = document.implementation.createHTMLDocument()
  const container = temporaryDocument.createElement('div')

  container.appendChild(documentFragment)

  return container.childNodes[0];
}

export const CollapseHeadingPlugin = (options) => {
  return new Plugin({
    key: typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
    state: {
      init(_, { doc }) {
        return collapesDeco(doc);
      },
      apply(tr, old) {
        return tr.docChanged ? collapesDeco(tr.doc) : old;
      }
    },
    props: {
      decorations(state) { return this.getState(state) },
      handleClick(view, _, event) {
        if (/collapse-icon/.test(event.target.className)) {
          let { to, isOpen, next } = event.target.heading;
          console.log(next);
          if (isOpen) {
            event.target.classList.remove("open");
            event.target.classList.add("close");
            event.target.heading.isOpen = false;
            event.target.title = '展开';
          } else {
            event.target.classList.remove("close");
            event.target.classList.add("open");
            event.target.heading.isOpen = true;
            event.target.title = '收起';
          }

          view.dispatch(
            view.state.tr
              .setSelection(TextSelection.create(view.state.doc, to, next.from))
              .scrollIntoView())
          return true;
        }
      },
      nodeViews: {
        heading(node, view) {
          const schema = getSchema([Document,Heading,Text]);
          const content = getHTMLFromNode(node,schema);
          const dom = document.createElement('div');
          dom.append(content);
          return {
            dom,
            contentDOM:content
          }
        }
      },
      handleDOMEvents: {
        mousemove(view, event) {
          _debounceFn(view, event);
        }
      }
    }
  });
};

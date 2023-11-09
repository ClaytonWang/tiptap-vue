import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { uid } from 'uid';

export const HeadingState = ({ pluginKey, storage, hasColapes }) => {

  return {
    init(_, { doc }) {
      return performHeading(doc, storage, pluginKey, hasColapes);
    },

    apply(tr, old) {
      if (!tr.docChanged || tr.getMeta('preventUpdate')) {
        return old;
      }
      return performHeading(tr.doc, storage, pluginKey, hasColapes);
    }
  }
}

function performHeading(doc, storage, pluginKey, hasColapes) {

  let headings = getHeadings(doc, pluginKey);
  headings = calcSerialNumber(headings);

  let decos = null;
  if (hasColapes) {
    decos = collapesDeco(doc, headings);
  }

  storage.headings = headings;
  return [headings, decos];
}

function collapesDeco(doc, headings) {

  let decos = [];
  headings.forEach(heading => {
    decos.push(Decoration.widget(heading.from + 1, collapesIcon(heading)));
  });

  return DecorationSet.create(doc, decos);
}

function collapesIcon(heading) {

  let className = '', title = "";

  className = heading.fold ? 'collapse-icon close' : 'collapse-icon open';
  title = /open/.test(className) ? '收起' : '展开';

  let icon = document.createElement("i");
  icon.className = className;
  icon.title = title;
  icon.heading = heading;
  icon.setAttribute('ref-id', heading.id);
  return icon;
}

function getHeadings(doc, pluginKey) {
  let result = [];

  // 遍历在文档中的每个节点,给heading节点加上属性
  doc.descendants((node, pos) => {
    if (node.type.name === pluginKey) {
      let id = node.attrs.id;
      if (!id) {
        id = 'h' + uid(16);
      };

      result.push({
        ...node.attrs,
        id,
        from: pos,
        to: pos + node.nodeSize,
        text: node.textContent,
      });
    }
  });

  if (result.length === 0) return [];

  return result;
}


function calcSerialNumber(headings = [], maxLevel = 6) {

  const currentNumbers = Array(maxLevel).fill(0);

  if (!headings || headings.length === 0) {
    return headings
  }

  let topLevel = Math.min(...headings.map((heading) => { return parseInt(heading.level) }));

  if (topLevel === 0) topLevel = 1;

  headings.forEach((heading) => {
    const level = parseInt(heading.level) - topLevel + 1;
    // 序列号
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

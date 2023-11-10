import { uid } from 'uid';

export const HeadingState = ({ pluginKey, storage, calcSerialNumber }) => {

  return {
    init(_, { doc }) {
      return performHeading(doc, storage, pluginKey, calcSerialNumber);
    },

    apply(tr, old) {
      if (!tr.docChanged || tr.getMeta('preventUpdate')) {
        return old;
      }
      return performHeading(tr.doc, storage, pluginKey, calcSerialNumber);
    }
  }
}

function performHeading(doc, storage, pluginKey, calcSerialNumber) {

  let headings = getHeadings(doc, pluginKey);
  headings = calcSerialNumber(headings);

  storage.headings = headings;
  return [headings];
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

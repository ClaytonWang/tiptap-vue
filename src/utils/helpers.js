import { createNodeFromContent } from '@tiptap/core';

export function insertContentAt(editor, pos, html) {
  let tr = editor.state.tr;

  const content = createNodeFromContent(html, editor.schema, {
    parseOptions: {
      preserveWhitespace: 'full'
    },
  });

  // don’t dispatch an empty fragment because this can lead to strange errors
  if (content.toString() === '<>') {
    return true
  }

  tr.insert(pos, content);

  editor.view.dispatch(tr);
}

export function deleteContent(editor, from, to) {
  let tr = editor.state.tr;
  tr.delete(from, to);
  editor.view.dispatch(tr);
}

export function getNextHeadBySN(sn, headings = []) {
  if (!sn) return null;
  if (headings.length === 0) return null;

  let arrSn = sn.split('.');

  let nextHeading = null;
  //反向寻找，没找到就找父级
  for (let i = arrSn.length; i > 0; i--) {
    let lastOrderSn = arrSn[i - 1];
    let nextOrderSn = parseInt(lastOrderSn) + 1;
    arrSn[i - 1] = nextOrderSn;
    let newSn = arrSn.slice(0, i).join('.');
    let rslt = headings.filter((heading) => heading.sn === newSn);

    if (rslt.length) {
      nextHeading = rslt[0];
      break;
    }
  }
  return nextHeading;
}

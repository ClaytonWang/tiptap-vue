import { TextSelection, NodeSelection } from '@tiptap/pm/state';

export class Comments {

  constructor(doc) {
    this.doc = doc;
    this.results = [];
  }

  action() {
    return ({ state, dispatch }, comment) => { };
  }

  scan() {
    this.doc.descendants((node, position) => {

      const hasComments = node.attrs['id'] && node.attrs['type'] === 'comments';

      if (hasComments) {
        this.record(node.attrs['id'], position, position + node.nodeSize, this.action);
      }

    });

    return this;
  }

  record(id, from, to, actionFn) {
    this.results.push({
      id,
      from,
      to,
      actionFn,
    });
  }

  getResults() {
    return this.results;
  }
}

let hoverDOM = null;

export const commentIconDOM = (view) => {
  const commentIcon = document.createElement('div');
  commentIcon.contenteditable = 'false';
  commentIcon.classList.add('comment');
  commentIcon.addEventListener('click', e => addComment(e,view));
  commentIcon.addEventListener('mouseover', e => highlight(e, view));
  commentIcon.addEventListener('mouseout', e => removeHighlight(e, view));
  document.body.appendChild(commentIcon);
  return commentIcon;

}
function addComment(e, view) {
  if (!hoverDOM) return;
  alert('添加comment')
  let tr = view.state.tr;
  const type = view.state.schema.marks['underline'];
  tr.addMark(hoverDOM.from, hoverDOM.to, type.create({ class: 'abc' }));
  view.dispatch(tr);
}
function highlight(e, view) {
  const ele = e.target.getBoundingClientRect();
  const coords = { left: ele.left - 20, top: ele.top + 5 };
  const pos = blockPosAtCoords(coords, view);

  if (pos != null) {
    let tr = view.state.tr;
    const hoverNode = view.state.doc.nodeAt(pos);
    const type = view.state.schema.marks['highlight'];

    tr.addMark(pos, pos + hoverNode.nodeSize, type.create({ id: 'abc' }))
    view.dispatch(tr);
    hoverDOM = {from:pos,to:pos + hoverNode.nodeSize,type}
  }
}

function removeHighlight(e, view) {
  if (!hoverDOM) return;

  let tr = view.state.tr;
  tr.removeMark(hoverDOM.from, hoverDOM.to, hoverDOM.type);
  view.dispatch(tr);
}

function blockPosAtCoords(coords, view) {
  const { pos } = view.posAtCoords(coords);
  let { node } = view.domAtPos(pos);

  while (node && node.parentNode) {
    if (node.parentNode?.classList?.contains('ProseMirror')) {
      break;
    }
    node = node.parentNode;
  }

  if (node && node.nodeType === 1) {
    const desc = view.docView.nearestDesc(node, true);

    if (!(!desc || desc === view.docView)) {
      return desc.posBefore;
    }
  }
  return null;
}

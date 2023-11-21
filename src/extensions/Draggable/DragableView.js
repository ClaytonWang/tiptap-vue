import { TextSelection, NodeSelection } from '@tiptap/pm/state';

export let dragHander = null;

export class DragableView {
  constructor({ view, dragClass }) {
    this.init(view, dragClass);
  }
  init(view, dragClass) {
    dragHander = document.createElement('div');
    dragHander.draggable = 'true';
    dragHander.classList.add(dragClass);
    dragHander.addEventListener('dragstart', e => this.dragStart(e, view));
    dragHander.addEventListener('mousedown', e => this.mouseDown(e));
    dragHander.addEventListener('mouseup', e => this.mouseUp(e));
    document.body.appendChild(dragHander);
  }

  blockPosAtCoords(coords, view) {
    // const pos = view.posAtCoords(coords)
    // let node = view.nodeDOM(pos.pos)

    const { pos } = view.posAtCoords(coords);
    let { node } = view.domAtPos(pos);

    while (node && node.parentNode) {
      if (node.parentNode?.classList?.contains('ProseMirror')) {
        break
      }
      node = node.parentNode
    }

    if (node && node.nodeType === 1) {
      const desc = view.docView.nearestDesc(node, true)

      if (!(!desc || desc === view.docView)) {
        return desc.posBefore
      }
    }
    return null
  }

  dragStart(e, view) {
    if (!e.dataTransfer) {
      return;
    }

    const coords = { left: e.clientX+50, top: e.clientY };
    const pos = this.blockPosAtCoords(coords, view);

    if (pos != null) {
      let selection = null, dragElement = null;
      const dragNode = view.state.doc.nodeAt(pos);

      //如果拖拽的是heading并且heading是折叠的,那么折叠的部分作为一个Slice被拖动
      if (dragNode?.type.name === "nHeading" && dragNode?.attrs.fold) {
        const { rfrom, rto, id } = dragNode.attrs;
        selection = TextSelection.create(view.state.doc, rfrom, rto);

        const { content } = selection.content();

        // 如果区间是被折叠上的，那么只拖动折叠的内容和折叠末尾的空行。
        // 计算出折叠区间的末尾pos。
        let _pos = rfrom + dragNode.nodeSize;
        content.forEach((node) => {
          if (node.attrs.class === "force-fold" || node.attrs.type === "empty") {
            _pos += node.nodeSize;
          }
        });

        //重新获取到折叠的selection
        selection = TextSelection.create(view.state.doc, rfrom, _pos);
        // drag hint
        dragElement = document.querySelector(`#${id}`);
      } else {
        //如果是非 折叠 的块，那么只拖动这个 node。
        selection = NodeSelection.create(view.state.doc, pos);
      }

      selection.visible = false;
      view.dispatch(view.state.tr.setSelection(selection));
      const slice = view.state.selection.content();

      if (!dragElement) {
        dragElement = document.querySelector('.ProseMirror-selectednode');
      }
      e.dataTransfer?.setDragImage(dragElement, 0, 0)
      view.dragging = { slice, move: true }
    }
  }

  mouseDown(e) {
    e.target.classList.add("dragging");
  }

  mouseUp(e) {
    e.target.classList.remove("dragging");
  }

  removeNode(node) {
    node.parentNode.removeChild(node);
  }

  destroy() {
    this.removeNode(dragHander);
    dragHander = null;
  }
}

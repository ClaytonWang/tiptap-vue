import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';

import Widget from './widget.vue';

export default Node.create({
  name: 'custom',

  group: 'block',

  draggable: true,

  selectable: true,

  // code: true,

  // allowGapCursor: false,

  atom: true,

  parseHTML() {
    return [
      {
        tag: 'custom',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    console.log(HTMLAttributes);
    return ['custom', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(Widget);
  },

  addAttributes() {
    return {
      class:{
        default: 'abc',
      },
    }
  }

  // addGlobalAttributes() {
  //   return [
  //     {
  //       types: ['heading'],
  //       attributes: {
  //         id: {
  //           default: null,
  //         },
  //       },
  //     },
  //   ];
  // },
});

import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';

import Widget from './widget.vue';

export default Node.create({
  name: 'custom',

  group: 'block list',

  draggable: true,

  selectable: true,

  code: true,

  allowGapCursor: false,
  
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
    const a = VueNodeViewRenderer(Widget);
    console.log(a);
    return a;
  },

  addAttributes() { 
    return {
      color:{
        default: 'pink',
        renderHTML: attributes => {
          return {
            'data-color': attributes.color,
            style: `color: ${attributes.color}`,
          }
        },
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

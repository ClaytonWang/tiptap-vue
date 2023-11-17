import { Extension } from '@tiptap/core';

const EmptyLine = Extension.create({
  name: 'emptyLine',

  draggable: false,

  group: 'block',

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      type: {
        default: 'empty',
      },
      ref: {
        default:null,
      },
      style: {
        default:null,
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'n-line',
      },
    ];
  },

  renderHTML({HTMLAttributes}) {
      return ['n-line',HTMLAttributes];
  },

});

EmptyLine.type = 'node';

export default EmptyLine;


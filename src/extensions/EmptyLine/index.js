import Paragraph from '@tiptap/extension-paragraph'

const EmptyLine = Paragraph.extend({
  name: 'emptyLine',
  draggable: false,

  addAttributes() {
    return {
      type: {
        default: 'empty',
      },
      ref: {
        default:null,
      }
    }
  },

  renderHTML({HTMLAttributes}) {
      return ['div',HTMLAttributes];
  }

});
export default EmptyLine;


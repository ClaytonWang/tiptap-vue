import Paragraph from '@tiptap/extension-paragraph'
import { mergeAttributes } from '@tiptap/core'
import { getSplittedAttributes,defaultBlockAt } from '@tiptap/core'
import { NodeSelection, TextSelection } from '@tiptap/pm/state'
import { canSplit } from '@tiptap/pm/transform'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import Component from './Component.vue'
import {
  callOrReturn,
  getExtensionField,
} from '@tiptap/core'

// const splitBlock = ({
//   tr, dispatch, editor
// }) => {
//   const { selection, doc } = tr
//   const { $from, $to } = selection
//   const extensionAttributes = editor.extensionManager.attributes
//   const newAttributes = getSplittedAttributes(
//     extensionAttributes,
//     $from.node().type.name,
//     {}
//   )

//   if (selection instanceof NodeSelection && selection.node.isBlock) {
//     if (!$from.parentOffset || !canSplit(doc, $from.pos)) {
//       return false
//     }

//     if (dispatch) {
//       tr.split($from.pos).scrollIntoView()
//     }

//     return true
//   }

//   if (!$from.parent.isBlock) {
//     return false
//   }

//   if (dispatch) {
//     const atEnd = $to.parentOffset === $to.parent.content.size

//     if (!atEnd) {
//       $to.node().attrs = $to.node().type?.defaultAttrs
//       $from.node().attrs = $to.node().type?.defaultAttrs
//     }
//     if (selection instanceof TextSelection) {
//       tr.deleteSelection()
//     }

//     const deflt = $from.depth === 0
//       ? undefined
//       : defaultBlockAt($from.node(-1).contentMatchAt($from.indexAfter(-1)))

//     let types = atEnd && deflt
//       ? [
//         {
//           type: deflt,
//           attrs: newAttributes,
//         },
//       ]
//       : undefined

//     let can = canSplit(tr.doc, tr.mapping.map($from.pos), 1, types)

//     if (
//       !types
//         && !can
//         && canSplit(tr.doc, tr.mapping.map($from.pos), 1, deflt ? [{ type: deflt }] : undefined)
//     ) {
//       can = true
//       types = deflt
//         ? [
//           {
//             type: deflt,
//             attrs: newAttributes,
//           },
//         ]
//         : undefined
//     }

//     if (can) {
//       tr.split(tr.mapping.map($from.pos), 1, types)

//       if (deflt && !atEnd && !$from.parentOffset && $from.parent.type !== deflt) {
//         const first = tr.mapping.map($from.before())
//         const $first = tr.doc.resolve(first)

//         if ($from.node(-1).canReplaceWith($first.index(), $first.index() + 1, deflt)) {
//           tr.setNodeMarkup(tr.mapping.map($from.before()), deflt)
//         }
//       }
//     }

//     tr.scrollIntoView()
//   }

//   return true
// }


const CustomParagraph = Paragraph.extend({
  draggable: true,

  // toDebugString() {

  // },

  addAttributes() {
    return {
      color: {
        default: null,
        keepOnSplit: false,
        // parseHTML: (element) => element.getAttribute('data-color'),
        // renderHTML: (attributes) => {
        //   return {
        //     'data-color': attributes.color,
        //     style: `color: ${attributes.color}`
        //   }
        // }
      },
      id: {
        default: null,
        keepOnSplit:false,
      }
    }
  },

  // addNodeView() {
  //   // return VueNodeViewRenderer(Component);
  //   // return (param) => {
  //   //   console.log(param);
  //   //   const dom = document.createElement('div')

  //   //   dom.classList.add('draggable-item')

  //   //   const handle = document.createElement('div')
  //   //   handle.classList.add('drag-handle')
  //   //   handle.contenteditable = false;
  //   //   handle.draggable = true
  //   //   handle['data-drag-handle'] = ''

  //   //   const content = document.createElement('p')

  //   //   content.classList.add('content')
  //   //   dom.append( handle,content)

  //   //   return {
  //   //     dom,
  //   //     contentDOM:content
  //   //   }
  //   // }


  // },

  // addCommands() {
  //   return {
  //     setParagraph: () => (params) => {
  //       console.log(params);
  //       return splitBlock(params);
  //     },
  //   }
  // },
  // addKeyboardShortcuts() {
  //   return {
  //     Enter: () => {
  //       return this.editor.commands.setParagraph()
  //     }
  //   }
  // },

  // testPara: 'testPara',

  renderHTML({ node, HTMLAttributes }) {
    // console.log(node);
    // return [
    //   'div',
    //   {class:'draggable-item'},
    //   [
    //     'div',
    //     { class: 'drag-handle', draggable: 'true', 'data-drag-handle': '' },
    //     ['p', mergeAttributes(HTMLAttributes, { rel: this.options.rel }), 0]
    //   ]
    // ]
    return ['p', mergeAttributes(HTMLAttributes, { class:'di'}), 0]
  },
  onSelectionUpdate({ editor }) {
    // The selection has changed.
    // const { content } = editor.getJSON();
    // console.log('JSON', content);
  },

  onTransaction(tr) {
    // console.log(this.getPos());
  },
  onUpdate({ editor}) {
    // const { content } = editor.getJSON();
    // console.log('JSON', content);
  },
  onDestroy() {
    // The editor is being destroyed.
    // const item = document.querySelector('.draggable-item');
    // item.removeEventListener('click');
  },

  toDebugString(node) {
    return () => {
      console.log(node);
    }
  },
  extendNodeSchema(extension) {
    const context = {
      name: extension.name,
      options: extension.options,
      storage: extension.storage,
    }

    return {
      toDebugString: callOrReturn(getExtensionField(extension, 'toDebugString', context)) ?? null,
    }
  },

})
export default CustomParagraph

// Result:
// <p data-color="pink" style="color: pink">Example Text</p>

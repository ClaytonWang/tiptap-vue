import { Extension, getSplittedAttributes,defaultBlockAt } from '@tiptap/core'
import { NodeSelection, TextSelection } from '@tiptap/pm/state'
import { canSplit } from '@tiptap/pm/transform'

import splitBlock from './paragraph.split';

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


export default Extension.create({
  name: 'customReturn',

  addCommands() {
    return {
      mySplitBlock: () => (params) => {
        // console.log(params);

        return splitBlock(params);
        // const { commands, state, dispatch,tr,view } = params;
        // const { selection, doc } = tr
        // const { $from, $to,to } = selection
        // const atEnd = $to.parentOffset === $to.parent.content.size

        // // console.log(view.domAtPos($to.pos));
        // if (atEnd) {
        //   $to.node().attrs = $to.node().type?.defaultAttrs
        //   // console.log('1',$to.node());
        // } else {
        //   $to.node().attrs = $to.node().type?.defaultAttrs
        //   // $from.node().attrs = $to.node().type?.defaultAttrs
        //   // console.log('2',$to.node(),$from.node());
        // }
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        this.editor.commands.mySplitBlock()
      },
    }
  }
})

import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

const CustomImage = Image.extend({
//   draggable: true,

  // addAttributes() {
  //   return {
  //     ...this.parent?.(),
  //     // class: {
  //     //   default: null,
  //     //   keepOnSplit: false,
  //     //   // parseHTML: (element) => element.getAttribute('data-color'),
  //     //   // renderHTML: (attributes) => {
  //     //   //   return {
  //     //   //     'data-color': attributes.color,
  //     //   //     style: `color: ${attributes.color}`
  //     //   //   }
  //     //   // }
  //     // }
  //   }
  // },

  renderHTML({ HTMLAttributes }) {
    return [
        'cst-img',
      {...HTMLAttributes},
        ['img', mergeAttributes(HTMLAttributes, { rel: this.options.rel })],
      ]
  },
  onSelectionUpdate({ editor }) {
    // The selection has changed.
    // console.log(this)
  },
  onBlur({ event }) {
    // The editor isn’t focused anymore.
  },
  onCreate() {
  //   const item = document.querySelector('.draggable-item');
  //   item.addEventListener('click', function (event) {
  //     const ditem = event.target;
  //   const rect = ditem.getBoundingClientRect();
  //   const x = event.clientX - rect.left;
  //   if (x < 20) {
  //     alert("You clicked the ::before pseudo-element!");
  //   }

  // })
  },
  onUpdate() {
    // The content has changed.
  //   const item = document.querySelector('.draggable-item');
  //   item.addEventListener('click', function (event) {
  //     const ditem = event.target;
  //   const rect = ditem.getBoundingClientRect();
  //   const x = event.clientX - rect.left;
  //   if (x < 20) {
  //     alert("You clicked the ::before pseudo-element!");
  //   }

  // })
  },
  onDestroy() {
    // The editor is being destroyed.
    // const item = document.querySelector('.draggable-item');
    // item.removeEventListener('click');
  },
})
export default CustomImage

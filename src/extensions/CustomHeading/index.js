import Heading from '@tiptap/extension-heading';
import { mergeAttributes } from '@tiptap/core';
import { HeadingPlugin } from './HeadingPlugin';

const CustomHeading = Heading.extend({
  name: 'CustomHeading',

  addOptions() {
    return {
      ...this.parent?.(),
      pluginKey: this.name,
      onUpdate: () => { },
      attrs: {}
    };
  },

  addAttributes() {
    return {
      level: {
        default: 1,
        keepOnSplit:false,
      },
      id: {
        default: null,
        keepOnSplit:false,
      },
      sn: {
        default: null,
        keepOnSplit:false,
      },
      fold: {
        default: false,
        keepOnSplit:false,
      },
      class: {
        default: null,
        keepOnSplit:false,
      },
      //折叠区间 from
      rfrom: {
        default: null,
        keepOnSplit:false,
      },
      //折叠区间 to
      rto: {
        default: null,
        keepOnSplit:false,
      }
    }
  },

  // renderHTML({ node, HTMLAttributes }) {
  //   console.log(HTMLAttributes);
  //   const hasLevel = this.options.levels.includes(node.attrs.level)
  //   const level = hasLevel
  //     ? node.attrs.level
  //     : this.options.levels[0]

  //   return [
  //     'c-h',
  //     mergeAttributes(HTMLAttributes, { ...this.options.attrs }),
  //     ['i', {class:'collapse-icon open'}],
  //     [`h${level}`, 0],
  //   ]
  //   // return [`h${level}`, mergeAttributes(HTMLAttributes, { ...this.options.attrs }),0]
  // },

  addStorage() {
    return {
      headings: [],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph','table','bulletList','orderedList','image'],
        attributes: {
          class: {
            default: null,
          },
        },
      },
    ]
  },

  addProseMirrorPlugins() {
    return [
      HeadingPlugin({
        pluginKey: this.options.pluginKey,
        onUpdate: this.options.onUpdate,
        storage: this.storage,
        editor: this.editor,
      }),
    ];
  },

  onSelectionUpdate({ editor }) {
    // The selection has changed.
    // const { content } = editor.getJSON();
    // console.log('JSON', content);
  },


});

export default CustomHeading;

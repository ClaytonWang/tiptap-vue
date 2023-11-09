import Heading from '@tiptap/extension-heading';
import { mergeAttributes } from '@tiptap/core';
import { HeadingPlugin } from './HeadingPlugin';

const CustomHeading = Heading.extend({
  name: 'nHeading',
  atom:true,
  addOptions() {
    return {
      ...this.parent?.(),
      pluginKey: this.name,
      onUpdate: () => { },
      hasColapes: false,
      // attrs:{class:'hovered'}
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

  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level)
    const level = hasLevel
      ? node.attrs.level
      : this.options.levels[0]
    const fold = node.attrs.fold;

    return [
      `n-h${level}`,
      mergeAttributes(HTMLAttributes, { ...this.options.attrs }),
      ['n-heading-ext', {},
        ['n-fold', { class: `caret ${fold ? 'close' : 'open'}`}]
      ],
      ['n-sn', {}, `${node.attrs.sn}`],
      ['n-heading-content',0]
    ]
    // return [`h${level}`, mergeAttributes(HTMLAttributes, { ...this.options.attrs }),0]
  },

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
        hasColapes:this.options.hasColapes,
        storage: this.storage,
        editor: this.editor,
      }),
    ];
  },

});

export default CustomHeading;

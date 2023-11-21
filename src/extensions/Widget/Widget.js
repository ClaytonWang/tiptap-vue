import { Extension } from '@tiptap/core';
import { WidgetPlugin } from './WidgetPlugin';
import { mergeAttributes } from '@tiptap/core';

export const Widget = Extension.create({
  name: "widget",

  addOptions() {
    return {
      pluginKey: this.name,
      plugins: [],
      attrs: {},
      allowComment:(dom)=>true,
      widgetIconDOM: (view) => {}
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
        keepOnSplit:false,
      },
      type: {
        default: null,
        keepOnSplit:false,
      },
    }
  },

  // parseHTML() {
  //   return [
  //     {
  //       tag: 'n-wdg',
  //     }
  //   ]
  // },

  // renderHTML({ HTMLAttributes }) {
  //   return [`n-wdg`, mergeAttributes(HTMLAttributes, { ...this.options.attrs }), 0];
  // },

  addProseMirrorPlugins() {
    // if (!this.editor.view.editable) return [];

    return [
      WidgetPlugin({...this.options}),
    ];
  },
});

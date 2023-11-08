import { Extension } from '@tiptap/core';
import { TOCPlugin } from './TOCPlugin';

export const TOCExt = Extension.create({
  name: "TOCExt",
  addOptions() {
    return {
      pluginKey: 'TOCExt',
      onUpdate: () => []
    };
  },
  // addGlobalAttributes() {
  //   return [
  //     {
  //       types: ['heading'],
  //       attributes: {
  //         id: {
  //           default: null,
  //         },
  //         sn: {
  //           default:null,
  //         }
  //       },
  //     },
  //   ]
  // },
  addProseMirrorPlugins() {
    return [
      TOCPlugin({
        pluginKey: this.options.pluginKey,
        onUpdate: this.options.onUpdate,
        editor: this.editor,
      }),
    ];
  },
});

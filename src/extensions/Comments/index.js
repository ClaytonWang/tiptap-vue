import { Extension } from '@tiptap/core';
import { CommentsPlugin } from './CommentsPlugin';

export const Comments = Extension.create({
  name: "comments",

  addOptions() {
    return {
      pluginKey: this.name,

    };
  },

  addProseMirrorPlugins() {
    return [
      CommentsPlugin({...this.options}),
    ];
  },
});

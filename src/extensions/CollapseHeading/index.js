import { Extension } from '@tiptap/core';
import { CollapseHeadingPlugin } from './CollapseHeadingPlugin';

export const CollapseHeading = Extension.create({
  name: "CollapseHeading",
  addOptions() {
    return {
      pluginKey: 'CollapseHeading'
    };
  },

  addProseMirrorPlugins() {
    return [
      CollapseHeadingPlugin({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
      }),
    ];
  },
});

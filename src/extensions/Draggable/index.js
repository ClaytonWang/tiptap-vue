import { Extension } from '@tiptap/core';
import { DraggablePlugin } from './DraggablePlugin';

export const Draggable = Extension.create({
  name: "draggable",

  addOptions() {
    return {
      pluginKey: this.name,
      dragClass: 'drag-handle',
      //允许可以拖拽的dom node
      allowDrageNode: (dom) => true,
    };
  },

  addProseMirrorPlugins() {
    return [
      DraggablePlugin({...this.options}),
    ];
  },
});

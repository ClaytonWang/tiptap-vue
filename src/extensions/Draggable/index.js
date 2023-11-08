import { Extension } from '@tiptap/core';
import { DraggablePlugin } from './DraggablePlugin';

export const Draggable = Extension.create({
  name: "Draggable",
  addOptions() {
    return {
      pluginKey: 'Draggable',
      dragClass: 'drag-handle'
    };
  },

  addStorage() {
    return {
      selections: {},
    }
  },

  addProseMirrorPlugins() {
    return [
      DraggablePlugin({
        pluginKey: this.options.pluginKey,
        dragClass: this.options.dragClass,
        storage:this.storage
      }),
    ];
  },
});

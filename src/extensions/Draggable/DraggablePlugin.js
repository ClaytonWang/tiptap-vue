import { Plugin, PluginKey} from '@tiptap/pm/state';
import { DragableView } from './DragableView';
import { DragablePros } from './DragablePros';

export const DraggablePlugin = (options) => {
  return new Plugin({
    key: typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: view => new DragableView({ view, ...options }),
    props: new DragablePros({...options})
  });
};


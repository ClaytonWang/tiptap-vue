import { Plugin, PluginKey } from '@tiptap/pm/state';
import { WidgetView } from './WidgetView';
import { WidgetState } from './WidgetState';
import { WidgetPros } from './WidgetPros';

export const WidgetPlugin = (options) => {
  const key = typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey;

  return new Plugin({
    key,
    state: WidgetState({ ...options }),
    view: (view) => new WidgetView({ view, ...options }),
    props: new WidgetPros({...options}),
  });
};


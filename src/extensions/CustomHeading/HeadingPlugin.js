import { Plugin, PluginKey } from '@tiptap/pm/state';
import { HeadingView } from './HeadingView';
import { HeadingState } from './HeadingState';
import { HeadingPros } from './HeadingPros';

export const HeadingPlugin = (options) => {
  const key = typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey;

  return new Plugin({
    key,
    state: HeadingState({ ...options }),
    view: (view) => new HeadingView({ view, ...options }),
    props: new  HeadingPros({...options})
  });
};


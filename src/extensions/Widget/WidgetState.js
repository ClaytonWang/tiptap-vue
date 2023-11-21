import { Decoration, DecorationSet } from '@tiptap/pm/view'

export const WidgetState = ({ plugins }) => {

  return {
    init(_, { doc }) {
      return runAllWidgetPlugins(doc, plugins);
    },

    apply(tr, old) {
      if (!tr.docChanged || tr.getMeta('preventUpdate')) {
        return old;
      }
      return runAllWidgetPlugins(tr.doc, plugins);
    }
  }
}

function renderWidget(comment) {
  const icon = document.createElement('div');

  icon.className = 'comment-icon';
  icon.title = comment.title?comment.title:'';
  icon.comment = comment;

  return icon
}

function runAllWidgetPlugins(doc, plugins) {
  const decorations = []

  const results = plugins.map(RegisteredWidgetPlugin => {
      return new RegisteredWidgetPlugin(doc).scan().getResults()
    })
    .flat();

  results.forEach(widget => {
    decorations.push(
      Decoration.inline(widget.from, widget.to, {
        class: 'widget',
      }),
      Decoration.widget(widget.from, renderWidget(widget)),
    )
  });

  return DecorationSet.create(doc, decorations);
}

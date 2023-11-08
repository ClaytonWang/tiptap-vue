import { Extension } from '@tiptap/core'
import { MagicMenuPlugin } from './MagicMenuPlugin';
import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'


export const MagicMenuExt = Extension.create({
  name: "magicMenu",
  addOptions() {
    return {
      element: null,
      tippyOptions: {},
      pluginKey: "magicMenu",
      shouldShow: null,
    };
  },
  addNodeView() {

  },
  addProseMirrorPlugins() {
    return [
      MagicMenuPlugin({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        tippyOptions: this.options.tippyOptions,
        shouldShow: this.options.shouldShow,
      }),
    ];
  },
});

export const MagicMenu = defineComponent({
  name: 'MagicMenu',

  props: {
    pluginKey: {
      type: null,
      default: 'MagicMenu',
    },

    editor: {
      type: Object,
      required: true,
    },

    tippyOptions: {
      type: Object,
      default: () => ({}),
    },

    shouldShow: {
      type: Function,
      default: null,
    },
  },

  setup(props, { slots }) {
    const root = ref(null)

    onMounted(() => {
      const {
        pluginKey,
        editor,
        tippyOptions,
        shouldShow,
      } = props

      editor.registerPlugin(MagicMenuPlugin({
        pluginKey,
        editor,
        element: root.value,
        tippyOptions,
        shouldShow,
      }))
    })

    onBeforeUnmount(() => {
      const { pluginKey, editor } = props

      editor.unregisterPlugin(pluginKey)
    })

    return () => h('div', { ref: root }, slots.default?.())
  },
})

import Heading from '@tiptap/extension-heading';
import { mergeAttributes } from '@tiptap/core';
import { HeadingPlugin } from './HeadingPlugin';

const CustomHeading = Heading.extend({
  name: 'nHeading',

  addOptions() {
    return {
      ...this.parent?.(),
      pluginKey: this.name,

      // 文章更新后拿到最新的title list
      // eslint-disable-next-line no-unused-vars
      onUpdate: (headings) => { },

      //title是否有折叠功能
      hasColapes: true,

      //自定义序号算法，接受title数组，返回算好的序列号的title数组
      //序列号存储在对象的sn字段中
      calcSerialNumber,

      //自定义其他属
      attrs:{}
    };
  },

  addAttributes() {
    return {
      level: {
        default: 1,
        keepOnSplit:false,
      },
      id: {
        default: null,
        keepOnSplit:false,
      },

      //标题序号
      sn: {
        default: null,
        keepOnSplit:false,
      },

      //标题是否被折叠
      fold: {
        default: false,
        keepOnSplit:false,
      },

      class: {
        default: null,
        keepOnSplit:false,
      },

      //折叠区间 from
      rfrom: {
        default: null,
        keepOnSplit:false,
      },

      //折叠区间 to
      rto: {
        default: null,
        keepOnSplit:false,
      }
    }
  },

  renderHTML({ node, HTMLAttributes }) {

    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel
      ? node.attrs.level
      : this.options.levels[0];

    const hasColapes = this.options.hasColapes;
    if (!hasColapes) return [`h${level}`, mergeAttributes(HTMLAttributes, { ...this.options.attrs }), 0];

    const id = node.attrs.id;
    const fold = node.attrs.fold;

    return [
      `n-h${level}`,
      mergeAttributes(HTMLAttributes, { ...this.options.attrs }),
      ['n-heading-ext', {},
        ['n-fold', { class: `caret ${fold ? 'close' : 'open'}`, ref: id }]
      ],
      ['n-sn', {}, `${node.attrs.sn}`],
      ['n-heading-content', 0]
    ];
  },

  addStorage() {
    return {
      headings: [],
    }
  },

  //被折叠的node必须要加上class属性
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph','table','bulletList','orderedList','image','underline'],
        attributes: {
          class: {
            default: null,
          },
        },
      },
    ]
  },

  addProseMirrorPlugins() {
    return [
      HeadingPlugin({
        storage: this.storage,
        editor: this.editor,
        ...this.options
      }),
    ];
  },

});


function calcSerialNumber(headings = [], maxLevel = 6) {

  let currentNumbers = Array(maxLevel).fill(0);

  if (!headings || headings.length === 0) {
    return headings
  }

  // let topLevel = Math.min(...headings.map((heading) => { return parseInt(heading.level) }));

  // if (topLevel === 0) topLevel = 1;

  // let topLevel = 1;
  currentNumbers[0] = 1;

  let lastLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.level);

    // 序列号
    currentNumbers[level - 1]++;
    if (lastLevel === level) {
      currentNumbers[level - 2]++;
    }

    for (let i = level; i < maxLevel; i++) {
      currentNumbers[i] = 0;
    }

    const headingNumber = currentNumbers.slice(0, level).join(".");

    heading.sn = headingNumber;
    heading.text = heading.sn + '. ' + heading.text;

    lastLevel =  level
  });

  return headings;
}


export default CustomHeading;

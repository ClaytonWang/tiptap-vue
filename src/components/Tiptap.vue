<template>
  <!-- <div class="menu">
    <img src="../assets/drag.svg" />
  </div> -->
  <div class="main">
    <TOC :editor="editor" :headings="headings" v-if="editor" />

    <div class="editor" v-if="editor">
      <editor-content :editor="editor" />
    </div>
  </div>

  <!-- <button @click="clickHandle">test</button> -->
</template>

<script setup>
import { onBeforeUnmount, onMounted,ref } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Document from '@tiptap/extension-document'
import ListItem from '@tiptap/extension-list-item'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading';
import Commands from '../extensions/commands.js';
import suggestion from '../extensions/suggestion';
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';
// import StorageTest from '../extensions/storageTest';
import DraggableItem from '../extensions/DraggableItem';
// import TableOfContents from '../extensions/tableOfContents';
// import { TableOfContent } from '@tiptap-pro/extension-table-of-content'
// import { Markdown } from 'tiptap-markdown';
import Custom from '../extensions/custom';
import CustomParagraph from '../extensions/CustomParagraph';
import EmptyLine from '../extensions/EmptyLine';
import CustomImage from '../extensions/CustomImage';
import CustomReturn from '../extensions/CustomReturn';

import { MagicMenuExt } from '../extensions/MagicMenu';
import { TrailingNode } from '../extensions/TrailingNode/trailing-node.ts';

import TOC from '../extensions/TableOfContent/TOC.vue';
import { TOCExt } from '../extensions/TableOfContent';
import {Draggable} from '../extensions/Draggable';
import CustomHeading from '../extensions/CustomHeading';
import Widget,{Comments,commentIconDOM} from '../extensions/Widget';
// import DragHandle from '../extensions/Draggable/DragHandle.js';

// import { Editor } from '@tiptap/core';
// import Document from '@tiptap/extension-document';
// import Paragraph from '@tiptap/extension-paragraph';
// import Text from '@tiptap/extension-text';

// onMounted(() => {
//   new Editor({
//     editorProps: {
//       attributes: {
//         class: 'focus:outline-none',
//       },
//     },
//     extensions: [
//       StarterKit,
//       DraggableItem,
//       // MagicMenuExt.configure({
//       //   element: document.querySelector('.menu'),
//       //   tippyOptions: {
//       //     // allowHTML:true,
//       //     // content: () => { return 'a'}
//       //   }
//       // })
//     ],
//     content: `<p>This is a boring paragraph.</p>
//         <div data-type="draggable-item">
//           <p>Followed by a fancy draggable item.</p>
//         </div>`,
//   });
// });

const data1 = `<h2>heading</h2>
        <p color="red">paragraph</p>
        <p>paragraph</p>
        <p>paragraph</p>
        <p>paragraph</p>
        <h1>abc</h1>
        <ol>
          <li>sfsfsfsf</li>
          <li>fdfssss</li>
          <li>fffffff</li>
        </ol>
        <h3>heading</h3>
        <p>paragraph</p>
        <h3>heading</h3>
        <p>paragraph</p>
        <table>
          <tr><td>1111</td></tr>
          <tr><td>222</td></tr>
        </table>
        <p>paragraph</p>
        <p>还有一对用于异步迭代的协议，命名为异步迭代器和异步可迭代协议。它们与可迭代和迭代器协议有着非常类似的接口</p>
        <p>paragraph</p>
        <h2>heading</h2>
        <p>paragraph</p>
        <p>paragraph</p>
        <img src="https://source.unsplash.com/8xznAGy4HcY/800x400" />
        <img src="https://source.unsplash.com/K9QHL52rE2k/800x400" />
        <p>paragraph</p>
        <p>paragraph</p>
        <h3>heading</h3>
        <p>paragraph</p>
        <p>paragraph</p>
        <p>paragraph</p>
        <p>paragraph</p>
        <p>Example text</p>
        <pre><code>console.log('foo')</code></pre>`

const headings = ref([]);

const editor = useEditor({
  content: data1,
  // onCreate: () => {
  //   console.log(editor.value.storage);
  //   headings.value = editor.value.storage.nHeading.headings;
  // },
  extensions: [
    // Heading,
    CustomHeading.configure({
      // onUpdate: (menu) => {
      //   headings.value = menu;
      //  }
    }),
    Document,
    Paragraph,
    Text,
    BulletList,
    ListItem,
    OrderedList,
    Dropcursor.configure({
      width: 2,
      color: 'blue',
      // class:'drop'
    }),
    Gapcursor,
    Table.configure({
      allowTableNodeSelection:true
    }),
    TableRow,
    TableHeader,
    TableCell,
    // Image,
    CustomImage,
    Commands.configure({
      suggestion
    }),
    Custom,
    EmptyLine,
    // CustomParagraph,
    // DraggableItem,
    // CustomReturn,
    // DragHandle,
    Draggable,
    Highlight,
    Underline,
    Widget.configure({
      plugins: [Comments],
      widgetIconDOM:commentIconDOM
    })
    // TOCExt.configure({
    //   onUpdate: (menu) => {
    //     headings.value = menu;
    //    }
    // }),

    // CollapseHeading
    // TableOfContents
    // TrailingNode
  ]
});

onMounted(() => {
  console.log(editor);
  headings.value = editor.value.storage.nHeading.headings;
})

// const clickHandle = () => {
//   // 动态赋值
//   editor.value.commands.setContent(data1)

//   console.log(editor.value);
//   // 获取文档数据
//   console.log(editor.value.getJSON())

//   // extension storage
//   const count = editor.value.storage.storageTestExtension.count
//   console.log(count)

//     const markdownOutput = editor.value.storage.markdown.getMarkdown();
//   console.log(markdownOutput);
// }


</script>
<style lang="scss">
.tiptap {
  min-height: 200px;
  margin: 30px;
  border: 1px solid #ccc;
  padding: 40px;

  outline: 2px solid transparent;
  outline-offset: 2px;

  white-space: break-spaces;
  word-break: break-word;
  word-wrap: break-word;
}
.di {
  outline: 0;
}
c-text {
  display: block;
  width: auto;
}
img {
  width: 150px;
  height: 150px;
}
cst-img {
  // display: block;
  width: auto;
}
.menu img {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  cursor: pointer;
}
.menu img:hover  {
  background-color: #eee;
}

.draggable-item {
  display: flex;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 0.5rem;
  background: white;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.05),
    0px 10px 20px rgba(0, 0, 0, 0.1),
  ;
}
// .drag-handle {
//     flex: 0 0 auto;
//     position: relative;
//     width: 1rem;
//     height: 1rem;
//     top: 0.3rem;
//     margin-right: 0.5rem;
//     cursor: grab;
//     background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16"><path fill-opacity="0.2" d="M4 14c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM2 6C.9 6 0 6.9 0 8s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6C.9 0 0 .9 0 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>');
//     background-repeat: no-repeat;
//     background-size: contain;
//     background-position: center;
//   }

  .content {
    flex: 1 1 auto;
  }
  .main {
    display: flex;
  }
  .editor {
    width: 100%;
  }

.drag-handle {
  position: absolute;
  transition: all 0.2s ease-in;
  flex: 0 0 auto;
  width: 1rem;
  height: 1rem;
  cursor: grab;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16"><path fill-opacity="0.2" d="M4 14c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM2 6C.9 6 0 6.9 0 8s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6C.9 0 0 .9 0 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.dragging {
  cursor: grabbing !important;
}

n-line {
  display: block;
  margin:0;
}
n-h1 {
  font-size: 28px;
}
n-h2{
  font-size: 24px;
}
n-h3{
  font-size: 20px;
}
n-h4{
  font-size: 16px;
}
n-h5{
  font-size: 12px;
}
n-h8{
  font-size: 8px;
}
n-h1,
n-h2,
n-h3,
n-h4,
n-h5,
n-h6{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.hovered .caret{
  visibility: visible;
}

*[fold='true'] .caret{
  visibility: visible !important;
}
n-heading-ext  {
  display: flex;
  position: absolute;
  left: 20px;
  width: fit-content;
  user-select: none;
}
n-sn {
  display: inline-flex;
  padding-right: 6px;
  font-weight: 700;
  user-select: none;
}
n-sn::after{
  content: ".";
}
n-heading-content {
  display: block;
  flex: 1;
  font-weight: 700;
}

.caret {
  visibility: hidden;
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transform: rotate(90deg);
  background:no-repeat center url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMC43NWVtIiB2aWV3Qm94PSIwIDAgMjU2IDUxMiI+PHBhdGggZD0iTTI0Ni42IDI3OC42YzEyLjUtMTIuNSAxMi41LTMyLjggMC00NS4zbC0xMjgtMTI4Yy05LjItOS4yLTIyLjktMTEuOS0zNC45LTYuOXMtMTkuOCAxNi42LTE5LjggMjkuNmwwIDI1NmMwIDEyLjkgNy44IDI0LjYgMTkuOCAyOS42czI1LjcgMi4yIDM0LjktNi45bDEyOC0xMjh6Ii8+PC9zdmc+');
}

.caret:hover {
  background-color: #F4F5F5;
}

.close{
  transform: rotate(0deg);
}

.force-fold{
  display: none !important;
}


//-----
.comment{
  position: absolute;
  transition: all 0.2s ease-in;
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  cursor: pointer;
  user-select: none;
  background:no-repeat center url('data:image/svg+xml;base64,PHN2ZyB0PSIxNzAwNDU5ODA4Mjc0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjUgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMwNzAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTUxMi4wMDEwMjQgODk1Ljk5NTY0OGMtMzIuNzQzNDg5IDAtNjQuNjYzNjgxLTIuOTU1MjctOTUuNjk5MTM1LTguMDkzNzEyTDE5MS45OTgzMzYgMTAyNCAxOTEuOTk4MzM2IDc5Ny40MjExMTVDNzUuMDUxMTU4IDcxNS4zMTA0ODcgMCA1ODkuNDAzMjkxIDAgNDQ4LjAwMjk0NCAwIDIwMC41NzUzNzcgMjI5LjIzMzA5OCAwIDUxMi4wMDEwMjQgMGMyODIuNzY5OTc0IDAgNTEyLjAwMTAyNCAyMDAuNTc1Mzc3IDUxMi4wMDEwMjQgNDQ4LjAwMjk0NEMxMDI0LjAwMjA0OCA2OTUuNDI0MzY3IDc5NC43NzMwNDYgODk1Ljk5NTY0OCA1MTIuMDAxMDI0IDg5NS45OTU2NDh6TTUxMi4wMDEwMjQgNjQuMDA0MjI0Yy0yNDcuNDIzNDcxIDAtNDQ4LjAwMDg5NiAxNzEuOTIxNzUyLTQ0OC4wMDA4OTYgMzgzLjk5ODcyIDAgMTMwLjExNTg0NCA3NS42OTYyNzkgMjQ0LjkyMDgxIDE5MS4yMDU3NTggMzE0LjM2ODYyOWwtMi4wMTkzMzIgMTQ4LjQzMzE5MyAxNTAuNjM4ODkzLTkwLjU0NjM1N2MzNC43MDM0MjkgNy4zODcxNTEgNzAuODAzNTk4IDExLjc0MzI1NSAxMDguMTczNTI4IDExLjc0MzI1NSAyNDcuNDI1NTE5IDAgNDQ4LjAwMDg5Ni0xNzEuOTIxNzUyIDQ0OC4wMDA4OTYtMzgzLjk5ODcyUzc1OS40MjY1NDMgNjQuMDA0MjI0IDUxMi4wMDEwMjQgNjQuMDA0MjI0ek03MzYuMDAxNDcyIDQxNi4wMDA4MzJsLTQ0OC4wMDA4OTYgMGMtMTcuNjcyMjI3IDAtMzIuMDAwMDY0LTE0LjMyNTc4OS0zMi4wMDAwNjQtMzEuOTk4MDE2czE0LjMyNzgzNy0zMi4wMDIxMTIgMzIuMDAwMDY0LTMyLjAwMjExMmw0NDguMDAwODk2IDBjMTcuNjcyMjI3IDAgMzIuMDAyMTEyIDE0LjMyOTg4NSAzMi4wMDIxMTIgMzIuMDAyMTEyUzc1My42NzM2OTkgNDE2LjAwMDgzMiA3MzYuMDAxNDcyIDQxNi4wMDA4MzJ6TTM1Mi4wMDA3MDQgNTQ0LjAwNTE4NGwzMjAuMDAwNjQgMGMxNy42NzIyMjcgMCAzMi4wMDAwNjQgMTQuMzE5NjQ1IDMyLjAwMDA2NCAzMS45OTgwMTYgMCAxNy42NjgxMzEtMTQuMzI3ODM3IDMxLjk5MTg3Mi0zMi4wMDAwNjQgMzEuOTkxODcybC0zMjAuMDAwNjQgMGMtMTcuNjc0Mjc1IDAtMzIuMDAwMDY0LTE0LjMyMzc0MS0zMi4wMDAwNjQtMzEuOTkxODcyQzMyMC4wMDA2NCA1NTguMzI0ODI5IDMzNC4zMjY0MjkgNTQ0LjAwNTE4NCAzNTIuMDAwNzA0IDU0NC4wMDUxODR6IiBwLWlkPSIzMDcxIiBmaWxsPSIjMmMyYzJjIj48L3BhdGg+PC9zdmc+')
}
</style>

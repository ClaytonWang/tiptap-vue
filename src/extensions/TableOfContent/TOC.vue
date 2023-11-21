<template>
  <div class="toc">
    <ul class="toc__list">
      <li class="toc__item" :class="`toc__item--${heading.level}`" v-for="(heading, index) in headings" :key="index">
        <a
          :href="`#${heading.id}`"
          @click="
            (e) => {
              itemClick(e, heading);
            }
          "
        >
          {{ heading.text }}
        </a>
      </li>
    </ul>
    <button @click="addHeading">add heading</button>
    <button @click="deleteHeading">delete heading</button>
    <button @click="getJSON">getJSON</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { TextSelection } from '@tiptap/pm/state';
import { insertContentAt,deleteContent } from '../../utils/helpers';

const props = defineProps(['editor','headings']);

function addHeading() {
  //文档指定位置添加标题
  insertContentAt(props.editor, 35, '<h2>abc</h2>');

  //文档末尾添加标题
  // let tr = props.editor.state.tr;
  // insertContentAt(props.editor, tr.doc.content.size, '<h2>abc</h2>');
}

function deleteHeading() {
  deleteContent(props.editor, 0, 9);
}

function getJSON() {
  console.log(props.editor.getJSON());
}

function itemClick(e, heading) {
  e.preventDefault();
  const editor = props.editor;
  if (editor) {
    const element = editor.view.dom.querySelector(`#${heading.id}`);
    if (!element) {
      throw new Error('element shold not be null.')
    }
    const pos = editor.view.posAtDOM(element, 0);

    // set focus
    const tr = editor.view.state.tr;

    tr.setSelection(new TextSelection(tr.doc.resolve(pos)));

    editor.view.dispatch(tr);

    editor.view.focus();

    // if (history.pushState) {
    //   // eslint-disable-line
    //   history.pushState(null, null, `#${heading.id}`); // eslint-disable-line
    // }

    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY,
      behavior: 'smooth',
    });
  }
}
function toggle() {

}

onMounted(() => {
  console.log(props.headings);
});
</script>

<style lang="scss">
.toc {
  opacity: 0.75;
  border-radius: 0.5rem;
  padding: 0.75rem;
  background: rgba(black, 0.1);

  &__list {
    list-style: none;
    padding: 0;

    &::before {
      display: block;
      content: 'Table of Contents';
      font-weight: 700;
      letter-spacing: 0.025rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      opacity: 0.5;
    }
  }

  &__item {
    a:hover {
      opacity: 0.5;
    }

    &--3 {
      padding-left: 1rem;
    }

    &--4 {
      padding-left: 2rem;
    }

    &--5 {
      padding-left: 3rem;
    }

    &--6 {
      padding-left: 4rem;
    }
  }

  button {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px;
    background-color: #fff;
  }
}
h1,h2,h3,h4 {
  // display: inline-block;
  font-size: large;
  font-weight: bold;
}
c-h{
  display: block;
}
h1::before,
h2::before,
h3::before,
h4::before,
c-h::before {
  content:attr(sn);
  display: inline-block;
  margin-right: 10px;
  font-size: large;
  font-weight: bold;
  // width: 20px;
  // height: 20px;
}
</style>

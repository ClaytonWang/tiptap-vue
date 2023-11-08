<template>
  <node-view-wrapper as="test">
    <span>abc</span>
    function a(){}
    a()
  </node-view-wrapper>
</template>

<script>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';

export default {
  name: 'custom',

  props: nodeViewProps,

  components: {
    NodeViewWrapper,
    NodeViewContent,
  },
};
</script>

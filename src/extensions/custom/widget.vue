<template>
  <node-view-wrapper :class="node?.attrs?.class">
    <span>abc</span>
    function a(){}
    a()
    <NodeViewContent />
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
  mounted() {
    console.log(nodeViewProps);
    console.log(this.node);
  }
};
</script>

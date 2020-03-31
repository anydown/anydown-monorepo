<template>
  <div>
    <textarea v-model="input" cols="30" rows="10"></textarea>
    <anydown :blocks="splited" @change="updateBlock($event)"></anydown>
  </div>
</template>
<script>
import Anydown from "./components/Anydown.vue";
import { compile } from "./util/document-compiler";

const example = `
# anydown

\`\`\`gantt
New Task,2020-03-31,2020-03-31
New Task,2020-03-31,2020-03-31
\`\`\`

This is Example


\`\`\`kanban
# backlog
- test

# todo
- Hi

# done
- test
\`\`\`

\`\`\`block
- item 210 100 200 100
\`\`\`
`;

export default {
  data() {
    return {
      input: example,
      splited: []
    };
  },
  watch: {
    input(val) {
      this.splited = compile(val);
    }
  },
  methods: {
    updateBlock(payload) {
      this.splited[payload.id].text = payload.type + "\n" + payload.body;
      this.input = this.splited.map(i => i.text).join("```");
    }
  },
  components: {
    Anydown
  }
};
</script>
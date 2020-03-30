<template>
  <div>
    <textarea v-model="input" cols="30" rows="10"></textarea>
    <anydown :blocks="splited" @change="updateBlock($event)"></anydown>
  </div>
</template>
<script>
import Anydown from "./components/Anydown.vue";

const example = `
# anydown

\`\`\`gantt
123 2020-04-04 2020-04-04
tersdt 2020-04-06 2020-04-06
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
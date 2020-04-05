<template>
  <div class="wrapper">
    <div class="contents">
      <anydown v-if="mode==='wysiwyg'" :blocks="splited" @change="updateBlock($event)"></anydown>
      <textarea class="contents__input" v-if="mode==='code'" v-model="input" cols="30" rows="10"></textarea>
    </div>
    <div class="nav">
      <label>
        <input type="radio" v-model="mode" value="wysiwyg" />WYSIWYG
      </label>
      <label>
        <input type="radio" v-model="mode" value="code" /> Code
      </label>
    </div>
  </div>
</template>
<script>
import Anydown from "./components/Anydown.vue";
import { compile } from "./util/document-compiler";

const example = `# anydown

\`\`\`gantt
New Task,2020-03-31,2020-03-31
New Task,2020-03-31,2020-03-31
\`\`\`

\`\`\`kanban
# backlog
- test

# todo
- Hi

# done
- test
\`\`\`

\`\`\`block
item,box,60,40,200,100
item,box,340,40,200,100
,arrow,260,90,340,90
,arrow,450,270,400,130
item,box,340,260,200,100
\`\`\`
`;

export default {
  data() {
    return {
      input: example,
      mode: "code"
    };
  },
  computed: {
    splited() {
      return compile(this.input);
    }
  },
  methods: {
    updateBlock(payload) {
      this.splited[payload.id].text = payload.type + "\n" + payload.body;
      this.input = this.splited.map(i => i.text).join("```");
    }
  },
  watch: {
    input() {
      history.replaceState("", "", "?data=" + encodeURIComponent(this.input));
    }
  },
  components: {
    Anydown
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    console.log(params);
    if (params && params.get("data")) {
      this.input = decodeURIComponent(params.get("data"));
    }
  }
};
</script>
<style>
.wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
}
.contents {
  flex: 1;
  display: flex;
}
.nav {
}
.contents__input {
  background: #333;
  color: white;
  flex: 1;
}

body {
  margin: 0;
  height: 100%;
}
</style>
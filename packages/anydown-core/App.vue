<template>
  <div class="wrapper">
    <div class="contents">
      <anydown v-if="mode==='wysiwyg'" :blocks="splited" @change="updateBlock($event)"></anydown>
      <textarea class="contents__input" v-if="mode==='code'" v-model="input" cols="30" rows="10"></textarea>
    </div>
    <div class="nav">
      <label class="nav__item">
        <input class="nav__item__radio" type="radio" v-model="mode" value="wysiwyg" />
        <div class="nav__item__label">WYSIWYG</div>
      </label>
      <label class="nav__item">
        <input class="nav__item__radio" type="radio" v-model="mode" value="code" />
        <div class="nav__item__label">Code</div>
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
      mode: "wysiwyg"
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
  overflow-y: scroll;
  justify-content: center;
}
.nav {
}
.contents__input {
  background: #333;
  color: white;
  flex: 1;
  padding: 0.5em;
}

.nav {
  background: #333;
  display: flex;
}
input[type="radio"] {
  display: none;
}
input[type="radio"] + .nav__item__label {
  transition: all 0.2s ease;
  background: #ccc;
  padding: 0.5em 1em;
  box-sizing: border-box;
  border-top: 0px solid white;
  cursor: pointer;
}

input[type="radio"]:checked + .nav__item__label {
  background: white;
  border-top: 2px solid rgb(109, 189, 255);
}

body {
  margin: 0;
  height: 100%;
}
</style>
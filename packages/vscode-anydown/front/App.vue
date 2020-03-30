<template>
  <anydown :blocks="splited" @change="updateBlock($event)"></anydown>
</template>
<style>
body{
  background: white;
  color: black;
  font-size: 16px;
}
</style>
<script>
import Anydown from "@anydown/anydown-core"
import { compile } from "./document-compiler";

const vscode = acquireVsCodeApi();
export default {
  components: {
    Anydown
  },  
  data() {
    return {
      input: "",
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
      this.apply();
    },
    update(text){
      vscode.postMessage({
        command: "text",
        text: text
      });

    },
    apply() {
      vscode.postMessage({
        command: "text",
        text: this.input
      });
    }
  },
  mounted() {
    window.addEventListener("message", event => {
      const message = event.data;
      switch (message.command) {
        case "text":
          this.input = message.text;
          break;
      }
    });
  }
};
</script>
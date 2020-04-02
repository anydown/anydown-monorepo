<template>
  <div>
    <anydown :blocks="splited" @change="updateBlock($event)"></anydown>
    <div class="add-nav">
      <button class="add" @click="addKanban">Kanban</button>
      <button class="add" @click="addGantt">Gantt</button>
      <button class="add" @click="addBlock">BlockDiag</button>
      <button class="add" @click="addCsv">SpreadSheet</button>
    </div>
  </div>
</template>
<style>
body{
  background: white;
  color: black;
  font-size: 16px;
}
button.add {
  border: 1px solid #71bdff;
  padding: 0.4rem 0.5rem;
  border-radius: 0.2rem;
  background: white;
  cursor: pointer;
}
button.add:hover {
  background: #eee;
}
.add-nav {
  margin: 1rem 0;
  text-align: center;
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
    addKanban(){
      this.input += "\n```kanban\n# TODO\n# DONE\n```\n" 
      this.apply();
    },
    addGantt(){
      this.input += "\n```gantt\n```\n" 
      this.apply();
    },
    addBlock(){
      this.input += "\n```block\n\n```\n" 
      this.apply();
    },
    addCsv(){
      this.input += "\n```csv\n,,,\n,,,\n,,,\n```\n" 
      this.apply();
    },
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
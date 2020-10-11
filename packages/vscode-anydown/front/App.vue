<template>
  <div>
    <anydown :blocks="splited" @change="updateBlock($event)"></anydown>
    <div class="add-nav">
      <button class="add" @click="addKanban">
        <div>
          <IconKanban />
        </div>
        <div class="add__label">Kanban</div>
      </button>
      <button class="add" @click="addGantt">
        <div>
          <IconGantt />
        </div>

        <div class="add__label">Gantt</div>
      </button>
      <button class="add" @click="addBlock">
        <div>
          <IconBlock />
        </div>

        <div class="add__label">Block</div>
      </button>
      <button class="add" @click="addCsv">
        <div>
          <IconCsv />
        </div>

        <div class="add__label">CSV</div>
      </button>
    </div>
  </div>
</template>
<style>
body {
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 1em;
}
.add__label {
  text-align: center;
}
button.add:hover {
  background: #eee;
}
.add-nav {
  margin: 1rem 0;
  text-align: center;
  display: flex;
  justify-content: center;
}
</style>
<script>
import Anydown from "@anydown/anydown-core";
import "@anydown/anydown-core/dist/anydown-core.es.css"

import { compile } from "./document-compiler";
import { debounce } from "./util";
import IconKanban from "./IconKanban.vue"
import IconGantt from "./IconGantt.vue"
import IconBlock from "./IconBlock.vue"
import IconCsv from "./IconCsv.vue"

const vscode = acquireVsCodeApi();
export default {
  components: {
    Anydown,
    IconKanban,
    IconGantt,
    IconBlock,
    IconCsv
  },
  data() {
    return {
      input: "",
      splited: [],
    };
  },
  watch: {
    input(val) {
      this.splited = compile(val);
    }
  },
  methods: {
    addKanban() {
      this.input += "\n```kanban\n# TODO\n# DONE\n```\n";
      this.apply();
    },
    addGantt() {
      this.input += "\n```gantt\n```\n";
      this.apply();
    },
    addBlock() {
      this.input += "\n```block\n\n```\n";
      this.apply();
    },
    addCsv() {
      this.input += "\n```csv\n,,,\n,,,\n,,,\n```\n";
      this.apply();
    },
    updateBlock(payload) {
      this.splited[payload.id].text = payload.type + "\n" + payload.body;
      this.input = this.splited.map(i => i.text).join("```");
      this.apply();
    },
    apply: debounce(function apply() {
      vscode.postMessage({
        command: "text",
        text: this.input
      });
    }, 50)
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
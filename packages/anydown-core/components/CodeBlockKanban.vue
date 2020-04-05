<template>
  <div
    class="kanban"
    @blur="onBlur"
    tabindex="0"
    @keydown.exact="globalKeydown"
    @keydown.ctrl.67="onCopy"
    @keydown.ctrl.86="onPaste"
    @keydown.ctrl.88="onCut"
  >
    <div v-if="compiled.length === 0" class="kanban__col">
      <button @click="addColumn">New Column</button>
    </div>
    <div
      class="kanban__col"
      v-for="(col, colIndex) in compiled"
      :key="colIndex"
      @click.exact="addSelectionCol(colIndex, false)"
      @click.ctrl="addSelectionCol(colIndex, true)"
      :class="{selected: isSelectedCol(colIndex)}"
    >
      <div class="kanban__col__add" @click="addTask(colIndex)">
        <svg style="cursor: pointer;" width="20" height="20">
          <g transform="translate(0.5, 0.5)">
            <line x1="10" x2="10" y1="5" y2="15" stroke="ForestGreen" />
            <line x1="5" x2="15" y1="10" y2="10" stroke="ForestGreen" />
          </g>
        </svg>
      </div>
      <div class="kanban__col-title" @dblclick="editTitle(colIndex)">
        <span v-if="editingTitleCol !== colIndex">{{col.name}}</span>
        <form
          v-if="editingTitleCol === colIndex"
          @submit.prevent="endEditingTitle(colIndex)"
          style="margin: 0;"
        >
          <input
            class="kanban__col__input"
            v-model="editingTitleColText"
            @blur="endEditingTitle(colIndex)"
          />
        </form>
      </div>
      <div class="kanban__wrapper">
        <draggable
          v-model="col.cards"
          group="everykanban"
          class="draggable--max"
          @change="onEnd"
        >
          <div
            class="kanban__row"
            v-for="(card, index) in col.cards"
            track-by="index"
            :key="index"
            @dblclick="startEditing(colIndex, index)"
            @click.exact.stop="addSelectionCard(colIndex,index, false)"
            @click.ctrl.stop="addSelectionCard(colIndex, index,true)"
            :class="{selected: isSelectedCard(colIndex, index)}"
          >
            <div class="kanban__row__remove" @click="removeTask(colIndex, index)">×</div>
            <div
              class="kanban__row__label"
              v-if="!(editingCol === colIndex && editingIndex === index)"
              v-text="card"
            ></div>
            <form
              v-if="editingCol === colIndex && editingIndex === index"
              @submit.prevent="endEditingAndNew(colIndex, index)"
              style="margin: 0;"
            >
              <input
                class="kanban__row__input"
                v-model="editingText"
                @blur="endEditing(colIndex, index)"
              />
            </form>
          </div>
        </draggable>
      </div>
    </div>
    <div class="addColumnHit">
      <div class="addColumn" @click="addColumn">
        <div>+</div>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import MarkdownIt from "markdown-it";
import * as compiler from "./kanban-compiler";
const md = new MarkdownIt();

export default {
  props: {
    input: String
  },
  data() {
    return {
      compiled: [],
      editingText: "",
      editingTitleColText: "",
      editingTitleCol: -1,
      editingCol: -1,
      editingIndex: -1,
      selectedCol: [],
      selectedCards: { col: -1, cards: [] },
      copied: null
    };
  },
  watch: {
    input() {
      this.compiled = compiler.compileKanban(this.input);
    }
  },
  computed: {
    output() {
      this.compiled.join();
    },
    editing() {
      return (
        this.editingTitleCol >= 0 ||
        this.editingCol >= 0 ||
        this.editingIndex >= 0
      );
    }
  },
  components: {
    draggable
  },
  mounted() {
    this.compiled = compiler.compileKanban(this.input);
  },
  methods: {
    globalKeydown(ev) {
      if (ev.key === "Delete") {
        this.onRemove();
      }
    },
    onBlur() {
      this.selectedCol = [];
    },
    onRemove() {
      for (var i = this.selectedCol.length; i > 0; i--) {
        this.removeColumn(this.selectedCol[i - 1]);
      }
      if (this.selectedCards.col >= 0) {
        for (var i = this.selectedCards.cards.length; i > 0; i--) {
          this.removeTask(
            this.selectedCards.col,
            this.selectedCards.cards[i - 1]
          );
        }
      }
      this.selectedCol = [];
      this.selectedCards = { col: -1, cards: [] };
    },
    onCut() {
      if (this.editing) {
        return;
      }
      this.onCopy();
      this.onRemove();
    },
    onCopy() {
      if (this.editing) {
        return;
      }
      if (this.selectedCol.length > 0) {
        const copied = this.compiled.filter((i, idx) => {
          return this.selectedCol.indexOf(idx) >= 0;
        });
        this.copied = {
          type: "column",
          data: JSON.parse(JSON.stringify(copied))
        };
      }
      if (this.selectedCards.col >= 0) {
        const copied = this.compiled[this.selectedCards.col].cards.filter(
          (i, idx) => {
            return this.selectedCards.cards.indexOf(idx) >= 0;
          }
        );
        this.copied = {
          type: "cards",
          data: JSON.parse(JSON.stringify(copied))
        };
      }
    },
    onPaste() {
      if (this.editing) {
        return;
      }

      //カラム選択中
      if (this.selectedCol.length > 0 && this.copied) {
        const lastIndex = this.selectedCol[this.selectedCol.length - 1];
        if (this.copied.type === "column") {
          this.compiled.splice(lastIndex + 1, 0, ...this.copied.data);
        }
        if (this.copied.type === "cards") {
          const selectedColumnChildren = this.compiled[lastIndex].cards;
          selectedColumnChildren.splice(
            selectedColumnChildren.length,
            0,
            ...this.copied.data
          );
        }

        this.$emit("change", compiler.serializeKanban(this.compiled));
      }

      //カード選択中
      if (
        this.selectedCards.col >= 0 &&
        this.copied &&
        this.copied.type === "cards"
      ) {
        const lastIndex = this.selectedCards.cards[
          this.selectedCards.cards.length - 1
        ];
        this.compiled[this.selectedCards.col].cards.splice(
          lastIndex + 1,
          0,
          ...this.copied.data
        );
        this.$emit("change", compiler.serializeKanban(this.compiled));
      }
    },
    addSelectionCol(col, multiple) {
      this.selectedCards = {
        col: -1,
        cards: []
      };
      if (!multiple) {
        this.selectedCol = [];
      }
      this.selectedCol.push(col);
      this.selectedCol.sort();
    },
    isSelectedCol(selectedCol) {
      return this.selectedCol.indexOf(selectedCol) >= 0;
    },
    isSelectedCard(selectedCol, cardIndex) {
      return (
        this.selectedCards.col === selectedCol &&
        this.selectedCards.cards.indexOf(cardIndex) >= 0
      );
    },
    addSelectionCard(col, card, multiple) {
      this.selectedCol = [];
      if (!multiple) {
        this.selectedCards.cards = [];
      }
      this.selectedCards.col = col;
      this.selectedCards.cards.push(card);
      this.selectedCards.cards.sort();
    },
    addColumn() {
      this.compiled.push({
        name: "New Column",
        cards: []
      });
      this.$emit("change", compiler.serializeKanban(this.compiled));
    },
    removeColumn(idx) {
      this.compiled.splice(idx, 1);
      this.$emit("change", compiler.serializeKanban(this.compiled));
    },
    onEnd() {
      this.$emit("change", compiler.serializeKanban(this.compiled));
    },
    startEditing(col, row) {
      const oldData = this.compiled[col].cards[row];
      this.editingCol = col;
      this.editingIndex = row;
      this.editingText = oldData;
      this.$nextTick(() => {
        const el = this.$el.querySelector(".kanban__row__input");
        if (el) {
          el.focus();
        }
      });
    },
    endEditing(col, row) {
      if (this.editingText === "") {
        this.removeTask(col, row);
      } else {
        this.$set(this.compiled[col].cards, row, this.editingText);
        this.$emit("change", compiler.serializeKanban(this.compiled));
      }
      this.editingCol = -1;
      this.editingIndex = -1;
    },
    endEditingAndNew(col, row) {
      this.endEditing(col, row);
      this.$nextTick(() => {
        this.addTask(col);
      });
    },
    addTask(col) {
      this.compiled[col].cards.push("");
      this.startEditing(col, this.compiled[col].cards.length - 1);
    },
    removeTask(col, row) {
      const oldData = this.compiled[col].cards[row];
      this.$delete(this.compiled[col].cards, row);
      this.$emit("change", compiler.serializeKanban(this.compiled));
    },
    editTitle(col) {
      this.editingTitleCol = col;
      const oldData = this.compiled[col].name;
      this.editingTitleColText = oldData;
      this.$nextTick(() => {
        const el = this.$el.querySelector(".kanban__col__input");
        if (el) {
          el.focus();
          el.setSelectionRange(0, el.value.length);
        }
      });
    },
    endEditingTitle(col) {
      if (this.editingTitleColText === "") {
        this.editingTitleCol = -1;
      } else {
        this.compiled[col].name = this.editingTitleColText;
        this.$emit("change", compiler.serializeKanban(this.compiled));
        this.editingTitleCol = -1;
      }
    }
  }
};
</script>
<style>
.draggable--max {
  flex: 1;
}

.kanban {
  display: flex;
  margin: 0 -0.5rem;
  overflow-x: hidden;
  outline: none;
  user-select: none;
}

.kanban__col {
  flex: 1;
  margin: 0.5rem;
  padding: 0.5rem;
  background: #f5f5f5;
  text-align: center;
  position: relative;
  border: 1px solid #f5f5f5;
}
.kanban__col.selected {
  box-sizing: border-box;
  border: 1px solid #666;
}

.kanban__col-title {
  font-size: 0.8rem;
  font-weight: 900;
  color: #888888;
  cursor: pointer;
}

.kanban__row:hover > .kanban__row__remove {
  display: block;
}

.kanban__col__add {
  position: absolute;
  top: 6px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 4px;
  border: 1px solid #999;
  color: forestgreen;
  cursor: pointer;
}

.kanban__row__remove {
  display: none;
  position: absolute;
  top: 8px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 2px;
  color: #888888;
  cursor: pointer;
  text-align: center;
  line-height: 20px;
}

.kanban__row {
  margin: 0.5rem 0;
  padding: 0.5rem;
  text-align: left;
  background: white;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  cursor: pointer;
  border-radius: 2px;
  line-height: 1.6rem;
  word-break: break-all;
  position: relative;
  border: 1px solid white;
  box-sizing: border-box;
}
.kanban__row.selected {
  border: 1px solid #666;
}

.kanban__row__input {
  font-size: 1rem;
  font-family: inherit;
  width: 100%;
}

.kanban__row__label {
  min-height: 1.5rem;
}

.kanban__wrapper {
  min-height: 10rem;
  display: flex;
  flex-direction: column;
}

.addColumnHit {
  position: relative;
  width: 10px;
}
.addColumn {
  transition: all ease 0.2s;
  color: white;
  height: 100%;
  width: 32px;
  text-align: center;
  position: absolute;
  top: 0;
  right: -24px;
  opacity: 0.2;
  background: gray;
  border-radius: 20px 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.addColumnHit:hover .addColumn {
  right: -4px;
  opacity: 1;
}
</style>
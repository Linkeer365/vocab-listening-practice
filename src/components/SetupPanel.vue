<template>
    <div class="setup-panel">
      <h2>听力听写练习设置</h2>

      <div class="form-group">
        <label>选择等级：</label>
        <div class="checkbox-group">
          <label v-for="level in levels" :key="level">
            <input type="checkbox" v-model="selectedLevels" :value="level" />
            {{ level }}
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="count">抽取数量：</label>
        <input id="count" type="number" v-model.number="count" min="1" :max="maxCount" />
        <span class="tip">当前共 {{ maxCount }} 条可用词汇</span>
      </div>

      <button @click="startPractice" :disabled="!canStart" class="btn-primary">
        开始练习
      </button>
    </div>
  </template>

  <script>
  export default {
    props: {
      allWords: Array
    },
    emits: ['start'],
    data() {
      return {
        levels: ['N5', 'N4', 'N3', 'N2', 'N1'],
        selectedLevels: ['N5', 'N4'],
        count: 10
      }
    },
    computed: {
      filteredCount() {
        return this.allWords.filter(w => this.selectedLevels.includes(w.cata)).length
      },
      maxCount() {
        return Math.min(1000, this.filteredCount) // 最多取 1000 条避免卡顿
      },
      canStart() {
        return this.selectedLevels.length > 0 && this.count >= 1 && this.filteredCount > 0
      }
    },
    methods: {
      startPractice() {
        if (!this.canStart) return
        const filtered = this.allWords.filter(w => this.selectedLevels.includes(w.cata))
        const shuffled = [...filtered].sort(() => Math.random() - 0.5)
        const list = shuffled.slice(0, Math.min(this.count, this.filteredCount))
        this.$emit('start', list)
      }
    }
  }
  </script>

  <style scoped>
  .setup-panel {
    max-width: 500px;
    margin: 40px auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }

  .checkbox-group {
    display: flex;
    gap: 15px;
  }

  input[type="number"] {
    width: 100px;
    padding: 8px;
    font-size: 16px;
  }

  .tip {
    font-size: 12px;
    color: #666;
    margin-left: 10px;
  }

  .btn-primary {
    background: #007bff;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
  }

  .btn-primary:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  </style>

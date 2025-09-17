<template>
    <div class="result-panel">
      <h2>练习完成！</h2>
      <p>答对：<strong>{{ correctCount }}</strong> / {{ total }}</p>

      <div v-if="wrongWords.length > 0">
        <h3>错词回顾</h3>
        <ul class="wrong-list">
          <li v-for="(item, index) in wrongWords" :key="index">
            <strong>{{ item.word.kanji }}</strong>
            [{{ item.word.furigana }}]
            (你写了: "{{ item.userAnswer }}")
          </li>
        </ul>
        <div class="actions">
          <button @click="exportWrong" class="btn-export">导出错词本 (.txt)</button>
          <button @click="restartWithWrong" class="btn-review">只复习错词</button>
        </div>
      </div>

      <div v-else>
        <p style="color: green; font-size: 1.2em;">🎉 全部答对！太棒了！</p>
      </div>

      <button @click="$emit('reset')" class="btn-reset">重新开始</button>
    </div>
  </template>

  <script>
  import { exportToTxt } from '@/utils/exportToTxt'

  export default {
    props: {
      results: Array
    },
    emits: ['reset', 'review-wrong'],
    computed: {
      correctCount() {
        return this.results.filter(r => r.correct).length
      },
      total() {
        return this.results.length
      },
      wrongWords() {
        return this.results.filter(r => !r.correct)
      }
    },
    methods: {
      exportWrong() {
        exportToTxt(this.wrongWords.map(r => r.word), '日语错词本.txt')
      },
      restartWithWrong() {
        const wrongList = this.wrongWords.map(r => r.word)
        this.$emit('review-wrong', wrongList)
      }
    },
    mounted() {
      // 保存错词到 localStorage
      const wrongList = this.wrongWords.map(r => r.word)
      localStorage.setItem('lastWrongWords', JSON.stringify(wrongList))
    }
  }
  </script>

  <style scoped>
  .result-panel {
    max-width: 600px;
    margin: 40px auto;
    padding: 30px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 15px rgba(0,0,0,0.1);
    text-align: center;
  }

  .wrong-list {
    text-align: left;
    margin: 20px 0;
    padding-left: 20px;
    line-height: 1.8;
  }

  .actions {
    margin: 30px 0;
  }

  .btn-export, .btn-review {
    padding: 10px 15px;
    margin: 0 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .btn-export { background: #6f42c1; color: white; }
  .btn-review { background: #fd7e14; color: white; }

  .btn-reset {
    margin-top: 20px;
    padding: 10px 20px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  </style>

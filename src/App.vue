<template>
    <div class="app">
      <header>
        <h1>🎧 日语听力听写练习</h1>
      </header>

      <main>
        <!-- 步骤 1: 设置 -->
        <SetupPanel
          v-if="step === 'setup'"
          :allWords="allWords"
          @start="startPractice"
        />

        <!-- 步骤 2: 听力答题 -->
        <ListeningPanel
          v-else-if="step === 'listening'"
          :wordList="currentWordList"
          @submit-word="onSubmitWord"
          @complete="onComplete"
        />

        <!-- 步骤 3: 结果展示 -->
        <ResultPanel
          v-else-if="step === 'result'"
          :results="results"
          @reset="reset"
          @review-wrong="reviewWrong"
        />
      </main>
    </div>
  </template>

  <script>
  import SetupPanel from './components/SetupPanel.vue'
  import ListeningPanel from './components/ListeningPanel.vue'
  import ResultPanel from './components/ResultPanel.vue'

  // 异步加载词汇数据
  const loadVocabData = async () => {
    const response = await fetch('/src/data/vocab.json')
    return await response.json()
  }

  export default {
    components: {
      SetupPanel,
      ListeningPanel,
      ResultPanel
    },
    data() {
      return {
        allWords: [],
        step: 'setup',
        currentWordList: [],
        results: []
      }
    },
    async created() {
      try {
        this.allWords = await loadVocabData()
      } catch (e) {
        alert('加载词汇数据失败，请检查 data/vocab.json 是否存在')
        console.error(e)
      }
    },
    methods: {
      startPractice(wordList) {
        this.currentWordList = wordList
        this.results = []
        this.step = 'listening'
      },
      onSubmitWord(result) {
        this.results.push(result)
      },
      onComplete() {
        this.step = 'result'
      },
      reset() {
        this.step = 'setup'
      },
      reviewWrong(wrongList) {
        this.currentWordList = wrongList
        this.results = []
        this.step = 'listening'
      }
    }
  }
  </script>

  <style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #f0f2f5;
    color: #333;
  }

  .app {
    min-height: 100vh;
  }

  header {
    background: #007bff;
    color: white;
    text-align: center;
    padding: 20px;
  }

  header h1 {
    font-size: 1.8em;
  }

  main {
    padding: 20px;
  }
  </style>

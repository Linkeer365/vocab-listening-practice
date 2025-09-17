<template>
    <div class="listening-panel">
      <h2>第 {{ currentIndex + 1 }} / {{ wordList.length }}</h2>

      <div class="word-display" v-if="currentWord">
        <p><strong>等级：</strong>{{ currentWord.cata }}</p>
        <!-- <p><strong>假名：</strong><span class="furigana">{{ currentWord.furigana }}</span></p> -->
      </div>

      <audio ref="audioPlayer" :src="audioSrc" @ended="onAudioEnd" />

      <div class="controls">
        <button @click="playAudio" class="btn-play">▶ 播放音频</button>
        <button @click="skip" class="btn-skip">跳过</button>
      </div>

      <div class="answer-section">
        <textarea
          v-model="userAnswer"
          placeholder="请输入汉字..."
          rows="2"
          @keydown.enter.prevent="() => submitAnswer(false)"
        ></textarea>
        <button @click="() => submitAnswer(false)" class="btn-submit">提交</button>
      </div>
    </div>
  </template>

  <script>
  export default {
    props: {
      wordList: Array
    },
    emits: ['complete'],
    data() {
      return {
        currentIndex: 0,
        userAnswer: '',
        hasPlayed: false
      }
    },
    computed: {
      currentWord() {
        return this.wordList[this.currentIndex]
      },
      audioSrc() {
        return `/audios/${this.currentWord.audio_filename}`
      }
    },
    methods: {
      playAudio() {
        this.hasPlayed = true
        this.$refs.audioPlayer.play().catch(e => {
          alert('播放失败，请检查音频路径或浏览器权限')
        })
      },
      onAudioEnd() {
        // 可自动进入答题状态
      },
      skip() {
        this.submitAnswer(true)
      },
      submitAnswer(isSkip = false) {
        const answer = isSkip ? '' : this.userAnswer.trim()

        const result = {
          word: this.currentWord,
          userAnswer: answer,
          correct: isSkip ? false : this.matchKanjiorfurigana(answer)
        }

        this.$emit('submit-word', result)

        // 下一题
        this.currentIndex++
        this.userAnswer = ''
        this.hasPlayed = false

        if (this.currentIndex >= this.wordList.length) {
          this.$emit('complete')
        }
      },
      matchKanjiorfurigana(input) {
        const kanji = this.currentWord.kanji || ''
        const furigana = this.currentWord.furigana || ''
        return input === kanji || input === furigana
      }
    },
    mounted() {
      this.playAudio() // 自动播放第一题
    }
  }
  </script>

  <style scoped>
  .listening-panel {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  }

  .furigana {
    font-size: 1.4em;
    letter-spacing: 1px;
  }

  .controls {
    margin: 30px 0;
    text-align: center;
  }

  .btn-play, .btn-skip {
    padding: 10px 20px;
    margin: 0 10px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .btn-play { background: #28a745; color: white; }
  .btn-skip { background: #ffc107; color: black; }

  .answer-section {
    margin-top: 20px;
  }

  textarea {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    resize: none;
  }

  .btn-submit {
    margin-top: 10px;
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>

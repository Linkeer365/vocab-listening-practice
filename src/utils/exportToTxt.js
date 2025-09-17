export function exportToTxt(words, filename = '错词本.txt') {
    const content = words.map(w => `${w.kanji} [${w.furigana}] (${w.cata})`).join('\n')
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

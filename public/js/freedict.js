const FreeDict = {
  file: '/data/deu-eng.dict.txt',
  words: [],
  index: {},
  cache: {},
  tables: [],
  loadWords() {
    return new Promise(resolve => {
      console.log('FreeDict: Loading words')
      let xhttp = new XMLHttpRequest()
      let that = this
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          that.words = that.parseDictionary(this.responseText)
          resolve()
        }
      }
      xhttp.open('GET', this.file, true)
      xhttp.setRequestHeader('Cache-Control', 'max-age=3600')
      xhttp.send()
    })
  },
  parseDictionary(text) {
    text = text.replace(/(.|\n)*German-English FreeDict Dictionary .*\n/m, '')
    let words = []
    console.log('Parsing "German-English FreeDict Dictionary"...')
    let lines = text.split('\n')
    for (let index in lines) {
      index = parseInt(index)
      if (index % 2 == 0) {
        let german = lines[index]
        let matches = german.match(/(.*) \/(.*)\//)
        let matches2 = german.match(/<(.*)>/)
        let word = {
          bare: matches ? matches[1] : undefined,
          pronunciation: matches ? matches[1] : undefined,
          definitions: lines[index + 1],
          pos: matches2 && matches2.length > 1 ? matches2[1] : undefined
        }
        word.accented = word.bare
        words.push(word)
      }
    }
    return words
  },
  loadTable(table) {
    return new Promise(resolve => {
      console.log(`FreeDict: Loading table "${table}"`)
      Papa.parse(`/data/${table}.csv.txt`, {
        download: true,
        header: true,
        complete: results => {
          this[table] = []
          for (let row of results.data) {
            let word = this.words[row.word_id]
            if (word) {
              word[table] = row
            }
          }
          resolve(this)
        }
      })
    })
  },
  load() {
    return new Promise(async resolve => {
      let promises = [this.loadWords()]
      for (let table of this.tables) {
        promises.push(this.loadTable(table.name))
      }
      await Promise.all(promises)
      this.createIndex()
      resolve(this)
    })
  },
  lookup(text) {
    console.log('looking up', text)
    let word = this.words.find(word => word && word.bare === text)
    return word
  },
  createIndex() {
    console.log('Indexing...')
  },
  formTable() {
    return this.tables
  },
  wordForms(word) {
    let forms = []
    if (word) {
      for (let table of this.formTable()) {
        for (let field of table.fields) {
          if (word[table.name] && word[table.name][field]) {
            for (let form of word[table.name][field].split(',')) {
              forms.push({
                table: table.name,
                field: field,
                form: form.trim()
              })
            }
          }
        }
      }
    }
    return forms
  },
  matchFormsIndexed(text) {
    text = text.toLowerCase()
    if (this.cache[text]) {
      return this.cache[text]
    }
    this.cache[text] = []
    /*
    We have:
    this.indexed['систем'] = {
      form: "систе'м"
      matches: [
        {
          field: "gen"
          table: "decl_pl"
          word_id: "341"
        }
      ]
    }

    We want:
    foundWords = [
      {
        id: 341
        bare: систем
        matches: [
          {
            field: "gen"
            table: "decl_pl",
            form: "систе'м"
          },
          {...}, ...
        ]
        // augmented word data
      }
    ]
    */
    // First get matched head word (lemma) if there is one
    let foundWords = this.words
      .filter(word => word && word.bare.toLowerCase() === text)
      .map(word => Object.assign({}, word))
    let indexed = this.index[text]
    if (indexed && indexed.matches) {
      for (let match of indexed.matches) {
        let foundWord = foundWords.find(w => w.id === match.word_id)
        let word = undefined
        if (!foundWord) {
          word = Object.assign({}, this.get(match.word_id))
          foundWords.push(word)
        } else {
          word = foundWord
        }
        word.matches = word.matches || []
        word.matches.push(match)
      }
    }
    this.cache[text] = foundWords
    return foundWords
  },
  lookupFuzzy(text) {
    return this.lookup(text)
  },
  randomArrayItem(array, start = 0, length = false) {
    length = length || array.length
    array = array.slice(start, length)
    let index = Math.floor(Math.random() * array.length)
    return array[index]
  },
  //https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
  randomProperty(obj) {
    var keys = Object.keys(obj)
    return obj[keys[(keys.length * Math.random()) << 0]]
  },
  random() {
    return this.randomProperty(this.words)
  },
  accent(text) {
    return text.replace(/'/g, '́')
  },
  stylize(name) {
    const stylize = {
      adjectives: 'adjective',
      incomparable: 'incomparable',
      short_f: 'short (fem.)',
      short_m: 'short (masc.)',
      short_n: 'short (neut.)',
      short_pl: 'short plural',
      superlative: 'superlative',
      conjugations: 'conjugation',
      pl1: 'мы',
      pl2: 'вы',
      pl3: 'они',
      sg1: 'я',
      sg2: 'ты',
      sg3: 'он/она',
      declensions: 'declension',
      decl_sg: 'singular',
      decl_pl: 'plural',
      decl_f: 'feminine',
      decl_m: 'masculine',
      decl_n: 'neuter',
      acc: 'accusative',
      dat: 'dative',
      gen: 'genitive',
      inst: 'instrumental',
      nom: 'nominative',
      prep: 'prepositional',
      verbs: '',
      aspect: 'aspect',
      imperative_pl: 'imperative plural',
      imperative_sg: 'imperative singular',
      partner: 'partner',
      past_f: 'past tense (feminine)',
      past_m: 'past tense (masculine)',
      past_n: 'past tense (neuter)',
      past_pl: 'past tense (plural)'
    }
    return stylize[name]
  }
}

import Helper from './helper'
import Config from './config'
import SketchEngine from './sketch-engine'

export default {
  corpra: [
    {
      language: 'German',
      name: 'German Web 2013 (deTenTen13)',
      words: 16526335416,
      code: 'detenten13_rft3',
      note: 'Featured.'
    },
    {
      language: 'German',
      name: 'Araneum Germanicum Maius [2013]',
      words: 875465845,
      code: 'de_araneum_maius',
      note: ''
    },
    {
      language: 'German',
      name: 'CHILDES German Corpus',
      words: 5941266,
      code: 'childes_deu',
      note: 'Spoken.'
    },
    {
      language: 'German',
      name: 'DGT, German',
      words: 45380666,
      code: 'dgt__german',
      note: 'Parallel. That means English translation is available.'
    },
    {
      language: 'German',
      name: 'EUR-Lex German 2/2016',
      words: 528617843,
      code: 'eurlex_deu_1',
      note: 'Parallel. That means English translation is available.'
    },
    {
      language: 'German',
      name: 'EUR-Lex judgments German 12/2016',
      words: 35297517,
      code: 'judgments_eurlex_deu',
      note: 'Parallel. That means English translation is available.'
    },
    {
      language: 'German',
      name: 'EUROPARL7, German',
      words: 47805055,
      code: 'europarl7_de_1',
      note: 'Parallel. That means English translation is available.'
    },
    {
      language: 'German',
      name: 'German Corpus for SkELL 1.0',
      words: 769810745,
      code: 'deskell_1_0',
      note: 'Web.'
    },
    {
      language: 'German',
      name: 'German Web (deWaC)',
      words: 1348188416,
      code: 'dewac',
      note: 'Web.'
    },
    {
      language: 'German',
      name: 'German Web 2010',
      words: 2338036362,
      code: 'detenten2',
      note: 'Web.'
    },
    {
      language: 'German',
      name: 'German Web 2013 sample',
      words: 193838751,
      code: 'detenten13_rft3_term_ref',
      note: 'Web.'
    },
    {
      language: 'German',
      name: 'GerManC (German Newspapers 1650-1800)',
      words: 667310,
      code: 'germanc',
      note: 'Non-Web.'
    },
    {
      language: 'German',
      name: 'OPUS2 German',
      words: 125229773,
      code: 'opus2_de',
      note: 'Parallel. That means English translation is available.'
    },
    {
      language: 'German',
      name: 'Parsed German Web (sDeWaC)',
      words: 755165551,
      code: 'sdewac2',
      note: 'Web.'
    },
    {
      language: 'German',
      name: 'Timestamped JSI web corpus 2014-2016 German',
      words: 1987759563,
      code: 'deu_jsi_newsfeed_1',
      note:
        'Diachronic. That means time information is available that allows you to see how the language changed over time.'
    },
    {
      language: 'German',
      name: 'Timestamped JSI web corpus 2014-2019 German',
      words: 4617996199,
      code: 'deu_jsi_newsfeed_virt',
      note:
        'Diachronic. That means time information is available that allows you to see how the language changed over time.'
    },
    {
      language: 'German',
      name: 'Timestamped JSI web corpus 2019-07 German',
      words: 103194896,
      code: 'deu_jsi_newsfeed_lastmonth',
      note:
        'Diachronic. That means time information is available that allows you to see how the language changed over time.'
    },
    {
      language: 'German',
      name: 'Timestamped JSI web corpus 2019-08 German',
      words: 34236368,
      code: 'deu_jsi_newsfeed_curmonth',
      note:
        'Diachronic. That means time information is available that allows you to see how the language changed over time.'
    }
  ],
  corpname() {
    return localStorage.getItem('gzhCorpname') || 'detenten13_rft3'
  },
  collocationDescription(word) {
    return {
      'modifiers of "%w"': `Modifiers of “${word}”`,
      'nouns modified by "%w"': `Nouns modified by “${word}”`,
      'genitive objects of "%w"': `Genitive objects of “${word}”`,
      'subjects of "%w"': `Subjects of “${word}”`,
      'nouns with "%w" as genitive object': `Nouns with “${word}” as genitive object`,
      'nouns with "%w" as dative object': `Nouns with “${word}” as dative object`,
      'dative objects of "%w"': `Dative objects of “${word}”`,
      'accusative objects of "%w"': `Accusative objects of “${word}”`,
      'nouns with "%w" as accusative object': `Nouns with "%w" “${word}” as accusative object`,
      'verbs with "%w" as accusative object': `Verbs with “${word}”  as accusative object`,
      '"%w" and/or ...': `“${word}” and/or ...`,
      'noun + in "%w"': `Noun + in “${word}”`,
      'prepositions of "%w"': `prepositions of “${word}”`,
      'modal verbs with "%w"': `Modal verbs with “${word}”`,
      'prepositional objects in dative': `Prepositional objects in dative`,
      'prepositional objects in accusative': `Prepositional objects in accusative`,
      'prepositional objects in genitive': `Prepositional objects in genitive`
    }
  },
  wsketch(term, callback) {
    $.getJSON(
      `${
        Config.sketchEngineProxy
      }?https://api.sketchengine.eu/bonito/run.cgi/wsketch?corpname=preloaded/${this.corpname()}&lemma=${term}`,
      function(response) {
        if (response.data.Gramrels && response.data.Gramrels.length > 0) {
          response.data.Gramrels.forEach(function(Gramrel) {
            Gramrel.Words = Gramrel.Words.filter(function(Word) {
              return Word.cm !== ''
            })
            for (let Word of Gramrel.Words) {
              if (Word.cm) {
                Word.cm = Word.cm.replace(/-\w( ?)/gi, '')
              }
            }
          })
        }
        callback(response.data)
      }
    )
  },
  concordance(term, callback) {
    let parallel = this.corpname().startsWith('opus')
    let requestJSON = parallel
      ? `{"attrs":"word","structs":"s,g","refs":"=doc.subcorpus","ctxattrs":"word","viewmode":"align","usesubcorp":"","freqml":[{"attr":"word","ctx":"0","base":"kwic"}],"fromp":1,"pagesize":1000,"concordance_query":[{"queryselector":"iqueryrow","sel_aligned":["opus2_en"],"cql":"","iquery":"${term}","queryselector_opus2_en":"iqueryrow","iquery_opus2_en":"","pcq_pos_neg_opus2_en":"pos","filter_nonempty_opus2_en":"on"}]}`
      : `{"lpos":"","wpos":"","default_attr":"word","attrs":"word","refs":"=doc.website","ctxattrs":"word","attr_allpos":"all","usesubcorp":"","viewmode":"kwic","cup_hl":"q","cup_err":"true","cup_corr":"","cup_err_code":"true","structs":"s,g","gdex_enabled":0,"fromp":1,"pagesize":50,"concordance_query":[{"queryselector":"iqueryrow","iquery":"${term}"}],"kwicleftctx":"100#","kwicrightctx":"100#"}`
    $.post(
      `${
        Config.sketchEngineProxy
      }?https://app.sketchengine.eu/bonito/run.cgi/concordance?corpname=preloaded/${this.corpname()}`,
      {
        json: requestJSON
      },
      function(response) {
        try {
          const data = JSON.parse(response).data
          var result = []
          for (let Line of data.Lines.slice(0, 500)) {
            let line =
              Line.Left.map(item => (item ? item.str : '')).join(' ') +
              ' ' +
              Line.Kwic[0].str +
              ' ' +
              Line.Right.map(item => (item ? item.str : '')).join(' ')
            line = line.replace(/ ([,.])/g, '$1')
            if (line.length > term.length + 4) {
              let parallelLine = {
                german: line
              }
              if (Line.Align && Line.Align[0].Kwic) {
                parallelLine.english = Line.Align[0].Kwic.map(
                  kwic => kwic.str
                ).reduce((english, kwic) => english + ' ' + kwic)
              }
              result.push(parallelLine)
            }
          }
          result = result.sort(function(a, b) {
            return a.german.length - b.german.length
          })
          callback(Helper.unique(result))
        } catch (err) {
          throw 'Concordance did not return any data.'
        }
      }
    )
  },
  thesaurus(term, callback) {
    $.post(
      `${
        Config.sketchEngineProxy
      }?https://app.sketchengine.eu/bonito/run.cgi/thes?corpname=preloaded/${this.corpname()}`,
      {
        lemma: term,
        lpos: '',
        clusteritems: 0,
        maxthesitems: 100,
        minthesscore: 0,
        minsim: 0.3
      },
      function(response) {
        let data = {}
        try {
          data = JSON.parse(response).data
        } catch (err) {
          throw 'Error in thesaurus'
        }
        callback(data)
      }
    )
  },
  mistakes(term, callback) {
    $.post(
      `${Config.sketchEngineProxy}?https://app.sketchengine.eu/bonito/run.cgi/concordance?corpname=preloaded/guangwai`,
      {
        json: JSON.stringify({
          lpos: '',
          wpos: '',
          default_attr: 'word',
          attrs: 'word',
          refs: SketchEngine.mistakeRefKeys.join(','),
          ctxattrs: 'word',
          attr_allpos: 'all',
          usesubcorp: '',
          viewmode: 'kwic',
          cup_hl: 'q',
          cup_err: '',
          cup_corr: '',
          cup_err_code: '',
          structs: 's,g',
          gdex_enabled: 0,
          fromp: 1,
          pagesize: 50,
          concordance_query: [
            {
              queryselector: 'iqueryrow',
              iquery: term,
              'sca_err.level': ['col', 'form', 'mean', 'orth', 'punct'],
              'sca_err.type': ['anom', 'incl', 'omit', 'wo']
            }
          ],
          kwicleftctx: '100#',
          kwicrightctx: '100#'
        })
      },
      function(response) {
        const data = JSON.parse(response).data
        let results = []
        for (let Line of data.Lines) {
          try {
            const ml = Line.Left.map(function(item) {
              return item.str || item.strc
            })
              .join('')
              .match(/(.*)<s>([^<s>]*?)$/)
            const left = ml[2]
            const leftContext = ml[1].replace(/<s>/g, '').replace(/<\/s>/g, '')
            let mr = Line.Right.map(function(item) {
              return item.str || item.strc
            })
              .join('')
              .match(/^([^</s>]*)<\/s>(.*)/)
            const right = mr[1]
            const rightContext = mr[2].replace(/<s>/g, '').replace(/<\/s>/g, '')
            var refs = {}
            for (let i in Line.Refs) {
              refs[SketchEngine.mistakeRefKeys[i]] = Line.Refs[i]
            }
            const country = refs['=text.id'].replace(
              /^[^_]*_[^_]*_[^_]*_[^_]*_([^_]*).*/g,
              '$1'
            )
            results.push({
              left: left,
              right: right,
              leftContext: leftContext,
              rightContext: rightContext,
              text: left + term + right,
              country: Helper.country(country),
              refs: refs,
              proficiency: SketchEngine.proficiency[refs['=u.proficiency']],
              errorType: SketchEngine.errors[refs['=err.type']],
              errorLevel: SketchEngine.errors[refs['=err.level']],
              l1: refs['=u.l1']
            })
          } catch (err) {
            console.log(err)
          }
        }
        results = results.sort(function(a, b) {
          return a.text.length - b.text.length
        })
        callback(results)
      }
    )
  }
}

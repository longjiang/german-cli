import Helper from '@/lib/helper'

export default {
  host: 'gedichte.xbib.de',
  name: 'Die Deutsche Gedichte-Bibliothek',
  logo: 'https://gedichte.xbib.de/Gedichte.gif',
  example:
    'https://gedichte.xbib.de/Dauthendey_gedicht_023.+Tal+und+Berge+sehen+hell.htm',
  async getChapter(url) {
    // url like https://gedichte.xbib.de/Dauthendey_gedicht_001.+Sommerelegie.htm
    let $chapterHTML = await Helper.scrape2(url)
    let title = $chapterHTML
      .find('.stext h1')
      .text()
      .trim()
    $chapterHTML.find('.stext h1').remove()
    let chapter = {
      url: url,
      content: $chapterHTML.find('.stext').html(),
      title: title
    }
    let href = $chapterHTML.find('.sg8 a:last-of-type').attr('href')
    if (href) {
      let bookURL = `https://${this.host}${href}`
      chapter.book = await this.getBook(bookURL)
    }
    return chapter
  },
  async getBook(url) {
    // url like https://gedichte.xbib.de/gedicht_Dauthendey.htm
    let $bookHTML = await Helper.scrape2(url, 0)
    let book = {
      url: url,
      title: $bookHTML
        .find('h1.s12')
        .text()
        .trim(),
      thumbnail: $bookHTML.find('p.s7 img').attr('src'),
      chapters: []
    }
    for (let a of $bookHTML.find('td.sg9 a')) {
      book.chapters.push({
        title: $(a)
          .text()
          .trim(),
        description: $(a).attr('alt'),
        url: `https://${this.host}/${$(a).attr('href')}`
      })
    }
    return book
  },
  async getBooklist(url) {
    // url like https://gedichte.xbib.de/
    let $html = await Helper.scrape2(url)
    let list = []
    for (let a of $html.find('td.sg9 a')) {
      list.push({
        url: `https://${this.host}/${$(a).attr('href')}`,
        description: $(a).attr('alt'),
        title: $(a)
          .text()
          .trim()
      })
    }

    return list
  }
}

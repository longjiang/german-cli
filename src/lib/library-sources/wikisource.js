import Helper from '@/lib/helper'

export default {
  host: 'de.wikisource.org',
  name: 'Wikisource',
  example:
    'https://de.wikisource.org/wiki/Hans_Warsch,_der_Hirt_von_Oggersheim',
  logo:
    'https://de.wikisource.org/static/images/project-logos/dewikisource.png',
  async getChapter(url) {
    let $chapterHTML = await Helper.scrape2(url)
    let a = $chapterHTML.find('#ws-author a')
    let bookPath = $(a).attr('href')
    let book = {
      url: bookPath ? `https://${this.host}${bookPath}` : undefined,
      title: $chapterHTML.find('.subpages a').text(),
      author: $(a).text(),
      thumbnail: '',
      chapters: []
    }
    if (book.url) {
      book = await this.getBook(book.url)
    }
    $chapterHTML
      .find('*')
      .contents()
      .each(function() {
        if (this.nodeType === Node.COMMENT_NODE) {
          $(this).remove()
        }
      })
    for (let a of $chapterHTML.find('.mw-parser-output a')) {
      $(a).attr(
        'href',
        Helper.absoluteURL(url, decodeURIComponent($(a).attr('href')))
      )
    }
    let chapter = {
      title: $chapterHTML
        .find('#firstHeading')
        .text()
        .trim(),
      content: $chapterHTML.find('.mw-parser-output').html(),
      book: book
    }
    console.log(chapter)
    return chapter
  },
  async getBook(url) {
    let $bookHTML = await Helper.scrape2(url)
    let chapters = []
    for (let a of $bookHTML.find('.mw-parser-output b a')) {
      chapters.push({
        title: $(a).text(),
        url: Helper.absoluteURL(url, decodeURIComponent($(a).attr('href')))
      })
    }
    return {
      url: url,
      title: $bookHTML.find('#firstHeading').text(),
      thumbnail: 'https:' + $bookHTML.find('table img').attr('src'),
      chapters
    }
  },
  async getBooklist(url) {
    let $html = await Helper.scrape2(url)
    $html
      .find('.mw-parser-output > p:first-child, #toc, .mw-editsection')
      .remove()
    let list = []
    for (let a of $html.find('.mw-parser-output td:first-child a')) {
      list.push({
        url: `https://${this.host}${$(a).attr('href')}`,
        title: $(a)
          .text()
          .trim()
      })
    }
    return list.filter(item => !item.title.includes('Категория:'))
  }
}

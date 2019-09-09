<template>
  <div class="youtube-browse container mt-5 mb-5 main">
    <div class="row">
      <div class="col-sm-12">
        <h1 class="mb-5 text-center">Study YouTube Subtitles</h1>
        <h4 class="mt-5 mb-5 text-center">Search YouTube</h4>
        <SimpleSearch
          placeholder="Enter a search term in German..."
          :action="
            url => {
              location.hash = '#/youtube/search/' + encodeURIComponent(url)
            }
          "
          ref="search"
          class="mb-5"
        />
        <h4 class="mt-5 mb-5 text-center">
          Recommended Channels
        </h4>
        <ul class="list-unstyled p-0 mb-5 cards">
          <li v-for="channel in channels" class="p-4 mb-4 card">
            <YouTubeChannelCard :channel="channel" />
          </li>
        </ul>

        <h4 class="mt-5 mb-5">
          Study
          <em>any</em> YouTube video that has German closed captions
        </h4>

        <div class="jumbotron bg-light pt-4 pb-3 mt-3 mb-3">
          <YouTubeNav class="mb-4" />
          <ol>
            <li>
              Go to YouTube, search a German word. For example
              <b>纪录片</b>.
            </li>
            <li>
              Click on
              <b>Filter</b>, and choose
              <b>Subtitls/CC.</b>
            </li>
            <li>
              Open a video that interests you. <br /><small
                ><b>Note:</b> Many have closed captions, but they are in
                <em>English.</em> You need to look for <em>German</em> closed
                captions. These are hard to find. If you cannot find any, look
                in the suggested channels listed on this page.</small
              >
            </li>
            <li>
              Copy the video's URL, paste it into the box above, and press
              <b>Enter</b>
              or click
              <b>Study.</b>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import YouTubeNav from '@/components/YouTubeNav'
import YouTubeChannelCard from '@/components/YouTubeChannelCard'
import SimpleSearch from '@/components/SimpleSearch'

export default {
  components: {
    YouTubeNav,
    YouTubeChannelCard,
    SimpleSearch
  },
  props: {
    args: {
      type: String
    }
  },
  data() {
    return {
      location,
      channels: [
        {
          id: 'UC5sgxwQGzW8BFTqLSMrklJw',
          title: 'Die Frage',
          description:
            'Es gibt diese großen, kniffligen Fragen, auf die es keine einfachen Antworten gibt. Wie komme ich mit dem Tod klar? Was ist so geil an einem Fetisch? Muss ich Angst vor der Psychiatrie haben? Ich suche Antworten auf diese Fragen, Woche für Woche, für euch.',
          avatar:
            'https://yt3.ggpht.com/a/AGF-l7-2w18fZ_BkhZpgnCbYRGoawuAE_ibu-kDhtw=s48-c-k-c0xffffffff-no-rj-mo'
        },
        {
          id: 'UCZuFrqyZWfw_Zf0OnXWUXyQ',
          title: 'Bayerischer Rundfunk',
          description:
            'Tausende besuchen jährlich den Bayerischen Rundfunk, sind Zuschauer bei Live-Sendungen, lernen die Standorte bei Führungen kennen. Hier erfahren Sie alles über die zwei Fernsehprogramme, die fünf Hörfunkwellen, die digitalen Radiostationen, das interaktive Jugendprogramm, die zwei Orchester, den Chor sowie den multimedialen Online-Auftritt des Bayerischen Rundfunks.',
          avatar:
            'https://yt3.ggpht.com/a/AGF-l7-2gdA3vOSM_9oKL8I1DYTZysqqbgnXOT8rqA=s288-c-k-c0xffffffff-no-rj-mo'
        },
        {
          id: 'UCjtoaUzcsmGg4XKEfjlIlBQ',
          title: 'PilotsEYE.tv',
          description: `PilotsEYE.tv zeigt die „Faszination Fliegen“ aus der Sicht der Piloten seit 2007 – authentisch, informativ und in noch nie dagewesener Bildqualität.`,
          avatar:
            'https://yt3.ggpht.com/a/AGF-l79dcu5JM1uf15BqRAkt9d2Nu2piwXd_PZ2Sjw=s288-c-k-c0xffffffff-no-rj-mo'
        },
        {
          id: 'UCg1UFTB4qlE2w1SlZbz8fag',
          title: 'FreistaatSachsen',
          description:
            'Herzlich willkommen auf dem offiziellen YouTube-Kanal des Freistaates Sachsen!',
          avatar:
            'https://yt3.ggpht.com/a/AGF-l7_gmayx5ewvbDiRAYKhBvpE9ot88ElP-dfmDA=s288-c-k-c0xffffffff-no-rj-mo'
        },
        {
          id: 'UCNNEMxGKV1LsKZRt4vaIbvw',
          title: 'NEO MAGAZIN ROYALE',
          description: 'NEO MAGAZIN ROYALE mit Jan Böhmermann',
          avatar:
            'https://yt3.ggpht.com/a/AGF-l7_ZaHvyJmOQmlXO6wXCVsjuGlN8SkFxxTsykA=s288-c-k-c0xffffffff-no-rj-mo'
        }
      ]
    }
  }
}
</script>

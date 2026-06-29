import {scheduledEventHandler} from '@sanity/functions'
import {createClient} from '@sanity/client'
import {XMLParser} from 'fast-xml-parser'

type SpotifyEpisode = {
    id: string
    name: string
    description: string
    release_date: string
    duration_ms: number
    html_description: string
    external_urls: {
        spotify: string
    }
}

/**
 * parse and fetch rss feed information
 * @param rssUrl
 */
const fetchRss = async (rssUrl: string) => {
    const xml = await (await fetch(rssUrl)).text()
    const {rss} = new XMLParser().parse(xml)
    return rss.channel.item.map((item: {guid: string, title: string, pubDate: string}) => ({
        guid: typeof item.guid === 'object' ? item.guid['#text'] : item.guid,
        title: item.title,
        pubDate: new Date(item.pubDate).toISOString(),
    }))
}

/**
 * @param showId
 * @param token
 */
const fetchSpotifyEpisodes = async (showId: string, token: string): Promise<SpotifyEpisode[]> => {
    let url = `https://api.spotify.com/v1/shows/${showId}/episodes?limit=50`;
    const episodes = []
    while (url) {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).catch(error => {
            throw new Error(`Failed to fetch episodes from ${url}: ${error.message}`);
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch episodes from ${url}`);
        }

        const data = await res.json();
        episodes.push(...data.items);
        url = data.next;
    }
    return episodes;
};

/**
 * fetches all episodes from apple
 * @param showId
 */
const fetchAppleEpisodes = async (showId: string) => {
    const res = await fetch(
        `https://itunes.apple.com/lookup?id=${showId}&entity=podcastEpisode&limit=200`
    )
    const {results} = await res.json()
    return results.filter((r: any) => r.wrapperType === 'podcastEpisode')
}

/**
 * matches rss to spotify
 * @param rssItem
 * @param spotifyItems
 */
const matchEpisode = (rssItem: {guid: string, title: string, pubDate: string}, spotifyItems: SpotifyEpisode[]): SpotifyEpisode => {
    const byTitle = spotifyItems.find(
        (s) => {
            return s.name.trim().toLowerCase() === rssItem.title.trim().toLowerCase()
        }
    )

    if (byTitle) return byTitle

    return spotifyItems.reduce((closest: SpotifyEpisode | null, s: SpotifyEpisode) => {
        const diff = Math.abs(new Date(s.release_date).getTime() - new Date(rssItem.pubDate).getTime())
        console.log('diff', diff)
        return !closest || diff < closest.diff ? {...s, diff} : closest
    }, null)
}

export const handler = scheduledEventHandler(async ({context}) => {
    const spotifyShowId = process.env.SPOTIFY_SHOW_ID;
    const spotifySecret = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
    const appleShowId = process.env.APPLE_PODCAST_ID!;
    const resourceId = process.env.RESOURCE_ID!;
    const sanityToken = process.env.SANITY_AUTH_TOKEN!;

    if (!spotifyShowId || !spotifySecret) {
        throw new Error("Missing Spotify show ID or secret");
    }

    if (!appleShowId) {
        throw new Error("Missing Apple show ID");
    }

    // throw new Error(`token suffix:', ${sanityToken.slice(-6)}`)

    const client = createClient({
        projectId: resourceId || 'ya3z8htt',
        dataset: 'production',
        token: sanityToken,
    })

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${spotifySecret}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials'
    }).catch(error => {
        throw new Error(`Error fetching Spotify Token: ${error.message}`);
    })

    if (!res || !res.ok) {
        const body = await res.text()
        throw new Error(`Failed to retrieve Spotify token: ${res.status} ${res.statusText} — ${body}`)
    }

    const {access_token} = await res?.json();
    const [rssEps, spotifyEpisodes, appleEpisodes] = await Promise.all([
        fetchRss('https://anchor.fm/s/e8bb26e4/podcast/rss'),
        fetchSpotifyEpisodes(spotifyShowId, access_token),
        fetchAppleEpisodes(appleShowId)
    ]);

    const existing: {guid: string, episodeNumber: number}[] = await client.fetch(
        `*[_type == "episode" && defined(guid)]{guid, episodeNumber}`
    );

    const existingMap = new Map(existing.map((e) => [e.guid, e.episodeNumber]))
    let nextNumber = existing.reduce((max, e) => Math.max(max, e.episodeNumber ?? 0), 0)
    const chronological = [...rssEps].sort(
        (a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime()
    )

    for(const item of chronological) {
        const matchedSpotify = matchEpisode(item, spotifyEpisodes)
        const apple = appleEpisodes.find((a: any) => a.episodeGuid === item.guid)
        const episodeNumber = existingMap.get(item.guid) ?? ++nextNumber
        console.log('Updating Sanity for episode', episodeNumber, item.title, 'Spotify ID:', matchedSpotify?.id, 'Apple ID:', apple?.trackId)

        await client.createOrReplace({
            _id: `episode-${episodeNumber}`,
            _type: 'episode',
            guid: item.guid,
            title: item.title,
            durationMs: matchedSpotify.duration_ms,
            description: matchedSpotify.html_description || matchedSpotify.description,
            slug: {_type: 'slug', current: String(episodeNumber)},
            episodeNumber,
            releaseDate: item.pubDate,
            spotifyEpisodeId: matchedSpotify?.id,
            spotifyUrl: matchedSpotify?.external_urls?.spotify,
            appleEpisodeId: apple?.trackId,
            appleUrl: apple?.trackViewUrl,
        })
    }
})
import {ReactElement} from "react";
import {NextPage} from "next";
import groq from "groq";
import {client} from "@/studio/lib/client";
import {EpisodeList} from "@/components/episode-list";
import {Episode} from "@/sanity.types";

const query = groq`*[_type == "episode"] | order(releaseDate desc){
    title, description, releaseDate, durationMs, spotifyEpisodeId, slug, episodeNumber
}`

const Episodes: NextPage = async (): Promise<ReactElement> => {
    const episodes: Episode[] = await client.fetch(query, {})

    return (
        <section className="bg-cream px-7 py-10">
            <h2 className="text-navy text-lg font-semibold mb-4">Latest episodes</h2>
            <EpisodeList episodes={episodes} />
        </section>
    )
}

export default Episodes
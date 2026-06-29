import {ReactElement} from "react";
import groq from "groq";
import {Episode} from "@/sanity.types";
import {client} from "@/studio/lib/client";

const query = groq`*[_type == "episode" && slug.current == $slug][0]{
    title, description, releaseDate, durationMs, spotifyEpisodeId
}`

const  EpisodePage = async ({ params }: { params: { slug: string } }): Promise<ReactElement> => {
    const {slug} = await params;
    const episode: Episode = await client.fetch(query, { slug });
    return (
        <main className="bg-cream px-7 py-10">
            <h1 className="text-navy text-2xl font-semibold mb-5">{episode.title}</h1>
            <iframe
                src={`https://open.spotify.com/embed/episode/${episode.spotifyEpisodeId}`}
                width="100%"
                height="232"
                allow="encrypted-media"
                className="rounded-lg"
            />
            <p className="text-navy/70 mt-6">{episode.description}</p>
        </main>
    )
}

export default EpisodePage
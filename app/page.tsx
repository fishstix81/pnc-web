import {client} from "@/studio/lib/client";
import groq from 'groq'
import {ReactElement} from "react";
import {Hero} from "@/components/hero";
import {EpisodeList} from "@/components/episode-list";
import Link from "next/link";
import Image from "next/image";

const query = groq`{
    "settings": *[_type == "siteSettings"][0]{
      title, tagline, coverImage, about,
      spotifyShowUrl, appleShowUrl, rssFeedUrl
    },
    "latest": *[_type == "episode"] | order(releaseDate desc)[0]{
      title, slug, spotifyEpisodeId, spotifyUrl, appleUrl
    },
    "episodes": *[_type == "episode"] | order(releaseDate desc)[0...5]{
      title, slug, description, durationMs, episodeNumber
    }
}`

const  Home = async (): Promise<ReactElement> => {
  const data = await client.fetch(query, {}, {cache: "no-store"})
  const { settings, latest, episodes } = data

  return (
      <main>
          <Hero settings={settings} latest={latest}/>
          <section className="bg-cream px-7 py-10">
              <h2 className="text-navy text-lg font-semibold mb-4">Latest episodes</h2>
              <EpisodeList episodes={episodes} />
          </section>
          <section className="bg-gold px-16 py-16 flex flex-wrap items-center justify-between">
              <div className="flex flex-wrap items-center gap-7">
                  <Image src="" alt="Stephen" />
                  <Image src="" alt="Nick" />
              </div>
              <div>
                  <p className="text-navy text-lg font-semibold mb-4">
                      Reacting to Christianity in the modern world
                  </p>
                  <p></p>
              </div>
              <Link className="text-navy text-lg font-semibold mb-4" href={"/about"}>Meet Nick & Steve</Link>
          </section>
      </main>
  );
}

export default Home;

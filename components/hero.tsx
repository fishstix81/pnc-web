import {ReactElement} from "react";
import Link from "next/link";
import type {Episode, SiteSettings} from "@/sanity.types";
import {SiSpotify, SiApplepodcasts, SiRss} from '@icons-pack/react-simple-icons';


export const Hero  = ({settings, latest}: {settings: SiteSettings, latest: Episode}): ReactElement => {
    console.log('latest', latest)
    return (
        <section className="bg-gold px-16 py-16 flex flex-wrap items-center gap-7">
            <div className="flex-1 min-w-[220px]">
                <p className="text-xs tracking-wide text-amber-800 mb-2">
                    A Weekly Podcast
                </p>
                <h1 className="text-navy text-3xl font-semibold mb-3">{settings.title}</h1>
                <p className="text-navy/70 mb-5">{settings.tagline}</p>
                <div className="flex flex-wrap items-center gap-7">
                    <Link href={latest?.spotifyUrl ?? ''} className="text-black">
                        <SiSpotify />
                    </Link>
                    <Link href={latest?.appleUrl ?? ''} className="text-black">
                        <SiApplepodcasts />
                    </Link>
                    <Link href={settings?.rssFeedUrl ?? ''} className="text-navy">
                        <SiRss />
                    </Link>
                </div>
            </div>
            <iframe
                src={`https://open.spotify.com/embed/episode/${latest.spotifyEpisodeId}`}
                width="100%"
                height="152"
                className="rounded-xl max-w-[360px]"
                allow="encrypted-media"
            />
        </section>
    )
}
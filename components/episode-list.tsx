import {ReactElement} from "react";
import Link from "next/link";
import {Episode} from "@/sanity.types";


export const EpisodeList = ({ episodes }: { episodes: Episode[] }): ReactElement => {
    return (
        <div>
            {episodes.map((episode) => {
                return (
                    <Link
                        key={episode?.slug?.current}
                        href={`/episode/${episode?.slug?.current}`}
                        className="flex gap-4 py-4 border-t border-navy/10"
                    >
                        <span className="w-9 h-9 rounded-lg bg-terracotta text-cream flex items-center justify-center text-sm font-semibold shrink-0">
                            {episode.episodeNumber}
                        </span>
                        <div className="flex-1">
                            <p className="text-navy font-medium">{episode?.title}</p>
                            <p className="text-sm text-navy/60">{episode?.description}</p>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
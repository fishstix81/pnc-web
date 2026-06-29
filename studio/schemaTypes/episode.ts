import { defineField, defineType } from 'sanity'

export const epidode = defineType({
    name: 'episode',
    title: 'Episode',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            readOnly: true,
        }),
        defineField({
            name: 'episodeNumber',
            type: 'number',
            readOnly: true,
        }),
        defineField({
            name: 'description',
            type: 'string',
        }),
        defineField({
            name: 'releaseDate',
            type: 'datetime',
        }),
        defineField({
            name: 'durationMs',
            type: 'number',
        }),
        defineField({
            name: 'coverImage',
            type: 'image',
        }),
        defineField({
            name: 'spotifyEpisodeId',
            type: 'string',
        }),
        defineField({
            name: 'spotifyUrl',
            type: 'url',
        }),
        defineField({
            name: 'appleEpisodeId',
            type: 'number',
        }),
        defineField({
            name: 'appleUrl',
            type: 'url',
        }),
        defineField({name: 'guid', type: 'string', readOnly: true}),
    ]
})
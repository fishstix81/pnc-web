import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            initialValue: 'Praise and Confused',
        }),
        defineField({
            name: 'tagline',
            type: 'string',
        }),
        defineField({
            name: 'coverImage',
            type: 'image',
        }),
        defineField({
            name: 'about',
            type: 'text',
        }),
        defineField({
            name: 'spotifyShowUrl',
            type: 'url'
        }),
        defineField({
            name: 'appleShowUrl',
            type: 'url'
        }),
        defineField({
            name: 'rssFeedUrl',
            type: 'url'
        })
    ]
})
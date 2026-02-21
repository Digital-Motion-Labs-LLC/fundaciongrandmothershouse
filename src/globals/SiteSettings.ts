import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    {
      name: 'siteName',
      type: 'text',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'showHeroBanner',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Hero Banner',
    },
    {
      name: 'showDifference',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Difference Section',
    },
    {
      name: 'showHelp',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Help Section',
    },
    {
      name: 'showTestimonial',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Testimonial Section',
    },
    {
      name: 'showBlogPreview',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Blog Preview Section',
    },
  ],
}

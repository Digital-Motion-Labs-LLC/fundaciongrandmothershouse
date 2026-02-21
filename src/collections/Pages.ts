import type { Block, CollectionConfig } from 'payload'

const HeroSlider: Block = {
  slug: 'heroSlider',
  labels: {
    singular: 'Hero Slider',
    plural: 'Hero Sliders',
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'subtitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'ctaPrimaryText',
          type: 'text',
          localized: true,
        },
        {
          name: 'ctaPrimaryLink',
          type: 'text',
        },
        {
          name: 'ctaSecondaryText',
          type: 'text',
          localized: true,
        },
        {
          name: 'ctaSecondaryLink',
          type: 'text',
        },
      ],
    },
  ],
}

const Difference: Block = {
  slug: 'difference',
  labels: {
    singular: 'Difference',
    plural: 'Difference Blocks',
  },
  fields: [
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
  ],
}

const Help: Block = {
  slug: 'help',
  labels: {
    singular: 'Help',
    plural: 'Help Blocks',
  },
  fields: [
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'videoUrl',
      type: 'text',
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'checkmarks',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      localized: true,
    },
    {
      name: 'ctaLink',
      type: 'text',
    },
    {
      name: 'phone',
      type: 'text',
    },
  ],
}

const Testimonial: Block = {
  slug: 'testimonial',
  labels: {
    singular: 'Testimonial',
    plural: 'Testimonial Blocks',
  },
  fields: [
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'testimonials',
      type: 'array',
      fields: [
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          required: true,
        },
        {
          name: 'quote',
          type: 'textarea',
          localized: true,
          required: true,
        },
        {
          name: 'authorName',
          type: 'text',
          required: true,
        },
        {
          name: 'authorTitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'authorImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}

const BlogPreview: Block = {
  slug: 'blogPreview',
  labels: {
    singular: 'Blog Preview',
    plural: 'Blog Preview Blocks',
  },
  fields: [
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
  ],
}

const RichContent: Block = {
  slug: 'richContent',
  labels: {
    singular: 'Rich Content',
    plural: 'Rich Content Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      localized: true,
      required: true,
    },
  ],
}

const TextSection: Block = {
  slug: 'textSection',
  labels: {
    singular: 'Text Section',
    plural: 'Text Sections',
  },
  fields: [
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
        { label: 'None', value: 'none' },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      localized: true,
    },
    {
      name: 'ctaLink',
      type: 'text',
    },
  ],
}

const CtaBanner: Block = {
  slug: 'ctaBanner',
  labels: {
    singular: 'CTA Banner',
    plural: 'CTA Banners',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'primaryButtonText',
      type: 'text',
      localized: true,
    },
    {
      name: 'primaryButtonLink',
      type: 'text',
    },
    {
      name: 'secondaryButtonText',
      type: 'text',
      localized: true,
    },
    {
      name: 'secondaryButtonLink',
      type: 'text',
    },
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroSlider, Difference, Help, Testimonial, BlogPreview, RichContent, TextSection, CtaBanner],
    },
  ],
}

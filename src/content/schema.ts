import { z } from 'zod'

export type Locale = 'es' | 'en'
export const LOCALES: readonly Locale[] = ['es', 'en'] as const
export const DEFAULT_LOCALE: Locale = 'es'

export const readLocaleFromCookie = (
  cookieValue: string | undefined,
): Locale => {
  return cookieValue === 'en' ? 'en' : 'es'
}

export const LocalizedString = z
  .object({
    es: z.string().nullish(),
    en: z.string().nullish(),
  })
  .refine((v) => (v.es ?? '').length > 0 || (v.en ?? '').length > 0, {
    message: 'LocalizedString must have at least one non-empty locale',
  })
export type LocalizedString = z.infer<typeof LocalizedString>

export const LocalizedStringOptional = z
  .object({
    es: z.string().nullish(),
    en: z.string().nullish(),
  })
  .partial()
  .nullish()
export type LocalizedStringOptional = z.infer<typeof LocalizedStringOptional>

export const Lexical = z
  .object({
    root: z
      .object({
        children: z.array(z.any()),
        type: z.string(),
        version: z.number(),
      })
      .passthrough(),
  })
  .passthrough()
export type Lexical = z.infer<typeof Lexical>

export const RichText = z.union([Lexical, z.string()])
export type RichText = z.infer<typeof RichText>

export const LocalizedRichText = z.object({
  es: RichText.nullish(),
  en: RichText.nullish(),
})
export type LocalizedRichText = z.infer<typeof LocalizedRichText>

export const LocalizedLexical = LocalizedRichText
export type LocalizedLexical = LocalizedRichText

const ImageSize = z.object({
  url: z.string().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  mimeType: z.string().nullable().optional(),
  filesize: z.number().nullable().optional(),
  filename: z.string().nullable().optional(),
})

export const MediaRef = z.object({
  id: z.number().nullable().optional(),
  filename: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  alt: z
    .union([
      z.string(),
      z.object({ es: z.string().nullish(), en: z.string().nullish() }).partial(),
    ])
    .nullish(),
  mimeType: z.string().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  filesize: z.number().nullable().optional(),
  sizes: z
    .object({
      thumbnail: ImageSize.optional(),
      card: ImageSize.optional(),
      hero: ImageSize.optional(),
    })
    .partial()
    .optional(),
})
export type MediaRef = z.infer<typeof MediaRef>

export const MaybeMediaRef = MediaRef.nullable()
export type MaybeMediaRef = z.infer<typeof MaybeMediaRef>

export const hasMedia = (m: MaybeMediaRef | undefined): m is MediaRef =>
  !!m && m.id !== null && m.id !== undefined && !!m.url

export const Activity = z.object({
  id: z.number(),
  slug: z.string().min(1),
  name: LocalizedString,
  description: LocalizedLexical.optional(),
  featuredImage: MaybeMediaRef.optional(),
  gallery: z
    .array(
      z.object({
        id: z.string().nullable().optional(),
        image: MediaRef,
      }),
    )
    .default([]),
  date: z.string(),
  location: z
    .object({
      es: z.string().nullable().optional(),
      en: z.string().nullable().optional(),
    })
    .optional(),
  published: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Activity = z.infer<typeof Activity>

export const NewsArticle = z.object({
  id: z.number(),
  title: LocalizedString,
  slug: z.string().min(1),
  image: MaybeMediaRef.optional(),
  date: z.string(),
  content: LocalizedLexical.optional(),
  excerpt: LocalizedString,
  published: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type NewsArticle = z.infer<typeof NewsArticle>

const blockBase = z.object({
  id: z.string().nullable().optional(),
  blockName: z.string().nullable().optional(),
})

export const HeroSlide = z.object({
  id: z.string().nullable().optional(),
  image: MaybeMediaRef.optional(),
  subtitle: LocalizedStringOptional,
  title: LocalizedString,
  ctaPrimaryText: LocalizedStringOptional,
  ctaPrimaryLink: z.string().nullable().optional(),
  ctaSecondaryText: LocalizedStringOptional,
  ctaSecondaryLink: z.string().nullable().optional(),
})
export type HeroSlide = z.infer<typeof HeroSlide>

export const HeroSliderBlock = blockBase.extend({
  blockType: z.literal('heroSlider'),
  slides: z.array(HeroSlide),
})

export const DifferenceBlock = blockBase.extend({
  blockType: z.literal('difference'),
  subtitle: LocalizedStringOptional,
  title: LocalizedStringOptional,
  description: LocalizedStringOptional,
  items: z.array(
    z.object({
      id: z.string().nullable().optional(),
      icon: z.string().nullable().optional(),
      title: LocalizedStringOptional,
      description: LocalizedStringOptional,
      backgroundImage: MaybeMediaRef.optional(),
      link: z.string().nullable().optional(),
    }),
  ),
})

export const HelpBlock = blockBase.extend({
  blockType: z.literal('help'),
  subtitle: LocalizedStringOptional,
  title: LocalizedStringOptional,
  description: LocalizedStringOptional,
  image: MaybeMediaRef.optional(),
  videoUrl: z.string().nullable().optional(),
  features: z
    .array(
      z.object({
        id: z.string().nullable().optional(),
        icon: z.string().nullable().optional(),
        title: LocalizedStringOptional,
        description: LocalizedStringOptional,
      }),
    )
    .optional(),
  checkmarks: z
    .array(
      z.object({
        id: z.string().nullable().optional(),
        text: LocalizedString,
      }),
    )
    .optional(),
  ctaText: LocalizedStringOptional,
  ctaLink: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
})

export const TestimonialBlock = blockBase.extend({
  blockType: z.literal('testimonial'),
  subtitle: LocalizedStringOptional,
  title: LocalizedStringOptional,
  testimonials: z.array(
    z.object({
      id: z.string().nullable().optional(),
      rating: z.number().nullable().optional(),
      quote: LocalizedString,
      authorName: z.string(),
      authorTitle: LocalizedStringOptional,
      authorImage: MaybeMediaRef.optional(),
    }),
  ),
})

export const BlogPreviewBlock = blockBase.extend({
  blockType: z.literal('blogPreview'),
  subtitle: LocalizedStringOptional,
  title: LocalizedStringOptional,
})

export const RichContentBlock = blockBase.extend({
  blockType: z.literal('richContent'),
  content: LocalizedLexical,
  content_html: z
    .object({ es: z.string().optional(), en: z.string().optional() })
    .partial()
    .optional(),
})

export const TextSectionBlock = blockBase.extend({
  blockType: z.literal('textSection'),
  subtitle: LocalizedStringOptional,
  heading: LocalizedString,
  body: LocalizedLexical,
  body_html: z
    .object({ es: z.string().optional(), en: z.string().optional() })
    .partial()
    .optional(),
  image: MaybeMediaRef.optional(),
  imagePosition: z.enum(['left', 'right', 'none']).nullable().optional(),
  ctaText: LocalizedStringOptional,
  ctaLink: z.string().nullable().optional(),
})

export const CtaBannerBlock = blockBase.extend({
  blockType: z.literal('ctaBanner'),
  title: LocalizedString,
  description: LocalizedStringOptional,
  backgroundImage: MaybeMediaRef.optional(),
  primaryButtonText: LocalizedStringOptional,
  primaryButtonLink: z.string().nullable().optional(),
  secondaryButtonText: LocalizedStringOptional,
  secondaryButtonLink: z.string().nullable().optional(),
})

export const PageBlock = z.discriminatedUnion('blockType', [
  HeroSliderBlock,
  DifferenceBlock,
  HelpBlock,
  TestimonialBlock,
  BlogPreviewBlock,
  RichContentBlock,
  TextSectionBlock,
  CtaBannerBlock,
])
export type PageBlock = z.infer<typeof PageBlock>

export const PAGE_SLUGS = ['home', 'about', 'mission', 'vision', 'terms'] as const
export type PageSlug = (typeof PAGE_SLUGS)[number]

export const Page = z.object({
  id: z.number(),
  title: LocalizedString,
  slug: z.enum(PAGE_SLUGS),
  layout: z.array(PageBlock),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Page = z.infer<typeof Page>

export const SOCIAL_PLATFORMS = [
  'facebook',
  'instagram',
  'youtube',
  'tiktok',
  'x',
  'linkedin',
  'other',
] as const

export const SocialLink = z.object({
  id: z.string().nullable().optional(),
  platform: z.enum(SOCIAL_PLATFORMS),
  url: z.string(),
  label: z.string().nullable().optional(),
})
export type SocialLink = z.infer<typeof SocialLink>

export const NavItem = z.object({
  id: z.string().nullable().optional(),
  label: LocalizedString,
  link: z.string(),
  children: z
    .array(
      z.object({
        id: z.string().nullable().optional(),
        label: LocalizedString,
        link: z.string(),
      }),
    )
    .default([]),
})
export type NavItem = z.infer<typeof NavItem>

export const Header = z.object({
  logo: MaybeMediaRef.optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  donateButtonText: LocalizedStringOptional,
  socialLinks: z.array(SocialLink).default([]),
  navigation: z.array(NavItem),
})
export type Header = z.infer<typeof Header>

export const FooterLink = z.object({
  id: z.string().nullable().optional(),
  label: LocalizedString,
  link: z.string(),
})
export type FooterLink = z.infer<typeof FooterLink>

export const Footer = z.object({
  logo: MaybeMediaRef.optional(),
  description: LocalizedStringOptional,
  socialLinks: z.array(SocialLink).default([]),
  quickLinksTitle: LocalizedStringOptional,
  servicesTitle: LocalizedStringOptional,
  contactTitle: LocalizedStringOptional,
  quickLinks: z.array(FooterLink).default([]),
  services: z.array(FooterLink).default([]),
  contactInfo: z
    .object({
      address: LocalizedStringOptional,
      addressLink: z.string().nullable().optional(),
      phone: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
    })
    .optional(),
  copyrightText: LocalizedStringOptional,
  legalLinks: z.array(FooterLink).default([]),
})
export type Footer = z.infer<typeof Footer>

export const SiteSettings = z.object({
  siteName: z.string(),
  favicon: MaybeMediaRef.optional(),
  showHeroBanner: z.boolean(),
  showDifference: z.boolean(),
  showHelp: z.boolean(),
  showTestimonial: z.boolean(),
  showBlogPreview: z.boolean(),
})
export type SiteSettings = z.infer<typeof SiteSettings>

export const DonationSettings = z.object({
  modalTitle: LocalizedStringOptional,
  modalDescription: LocalizedStringOptional,
  paypal: z
    .object({
      enabled: z.boolean(),
      link: z.string().nullable().optional(),
    })
    .optional(),
  bankTransfer: z
    .object({
      enabled: z.boolean(),
      bankName: z.string().nullable().optional(),
      accountNumber: z.string().nullable().optional(),
      accountType: z.string().nullable().optional(),
      accountHolder: z.string().nullable().optional(),
      routingNumber: z.string().nullable().optional(),
      swift: z.string().nullable().optional(),
    })
    .optional(),
  zelle: z
    .object({
      enabled: z.boolean(),
      emailOrPhone: z.string().nullable().optional(),
    })
    .optional(),
  otherMethods: z
    .array(
      z.object({
        id: z.string().nullable().optional(),
        name: z.string(),
        instructions: LocalizedStringOptional,
        icon: z.string().nullable().optional(),
      }),
    )
    .default([]),
})
export type DonationSettings = z.infer<typeof DonationSettings>

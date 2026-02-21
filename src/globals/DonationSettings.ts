import type { GlobalConfig } from 'payload'

export const DonationSettings: GlobalConfig = {
  slug: 'donation-settings',
  fields: [
    {
      name: 'modalTitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'modalDescription',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'paypal',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
    {
      name: 'bankTransfer',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'bankName',
          type: 'text',
        },
        {
          name: 'accountNumber',
          type: 'text',
        },
        {
          name: 'accountType',
          type: 'text',
        },
        {
          name: 'routingNumber',
          type: 'text',
        },
        {
          name: 'swift',
          type: 'text',
        },
      ],
    },
    {
      name: 'zelle',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'emailOrPhone',
          type: 'text',
        },
      ],
    },
    {
      name: 'otherMethods',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'instructions',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'icon',
          type: 'text',
        },
      ],
    },
  ],
}

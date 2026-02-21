/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import configPromise from '@payload-config'
import { importMap } from './admin/importMap'
import '@payloadcms/next/css'

type Args = { children: React.ReactNode }

const serverFunctions: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunctions}>
    {children}
  </RootLayout>
)

export default Layout

/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./i18n.ts')

const nextConfig = {}

module.exports = withNextIntl(nextConfig)

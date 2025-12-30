import type { UserConfig } from 'unlighthouse/config'

const config: UserConfig = {
  scanner: {
    maxRoutes: 100,
    device: 'desktop',
  },

  puppeteerClusterOptions: {
    maxConcurrency: 3,
  },
}

export default config

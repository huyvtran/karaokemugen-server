import { Nuxt, Builder } from 'nuxt';
import { NuxtConfig } from "../utils/default_settings";
import logger from "../lib/utils/logger";
import {getConfig} from "../lib/utils/config";
import merge from 'lodash.merge';

function generateConfig(production: boolean = false) {
    const conf = getConfig();
    const autoGeneratedConfig = {
        dev: production ? false:process.env.NODE_ENV !== 'production',
        env: {
			LIVE_URL: conf.KaraExplorer.LiveURL,
			KM_IMPORT: conf.KaraExplorer.Import,
			IN_PROGRESS_SONGS_LIST: conf.KaraExplorer.InProgressSongsList,
			BASE_LICENSE_NAME: conf.BaseLicense.Name,
			BASE_LICENSE_LINK: conf.BaseLicense.Link
        },
        router: {
            base: conf.KaraExplorer.Path
        },
        axios: {
            baseURL: `http${conf.API.Secure?'s':''}://${conf.API.Host}${
                (production || conf.API.Port === 443 || conf.API.Port === 80)?'':`:${conf.API.Port}`}/`,
            https: conf.API.Secure
        },
        i18n: {
            baseUrl: `http${conf.KaraExplorer.Secure?'s':''}://${conf.KaraExplorer.Host}${
                (production || conf.API.Port === 443 || conf.API.Port === 80)?'':`:${conf.Frontend.Port}`}${conf.KaraExplorer.Path}`
        }
    };
    const overrideNuxt = conf.KaraExplorer.NuxtOverrides;

    return merge(NuxtConfig, autoGeneratedConfig, overrideNuxt);
}

export async function buildKMExplorer() {
    const NuxtConfig = generateConfig(true);
    logger.debug(`Starting Nuxt with config ${JSON.stringify(NuxtConfig)}`);
    const nuxt = new Nuxt(NuxtConfig);
    await nuxt.ready();
    const builder = new Builder(nuxt);
    await builder.build();
}

export async function startKMExplorer() {
    const NuxtConfig = generateConfig();
    logger.debug(`Starting Nuxt with config ${JSON.stringify(NuxtConfig)}`);
    const nuxt = new Nuxt(NuxtConfig);
    await nuxt.ready();
    if (NuxtConfig.dev) {
        const builder = new Builder(nuxt);
        await builder.build();
    }
    return nuxt;
}
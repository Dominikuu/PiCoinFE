import {Injectable} from '@angular/core';
import {cloneDeep, get as getFromObj} from 'lodash';

declare var window: any;
declare var document: any;

interface UrlParams {
    [key: string]: string;
}

interface UrlQueryParams {
    [key: string]: string | number;
}

interface AssetReference {
    url: string;
    requireParams?: string[];
    requireQueryParams?: string[];
    async?: boolean;
    defer?: boolean;
    load?: (ref: AssetReference) => Promise<boolean>;
}

interface AssetDefinition {
    /**
     * Asset style (css) URLs.
     *
     * For relative URL, AssetLoader will load from ./assets/<asset-name>/<url>
     * For abaolute URL, AssetLoader will load it directly.
     */
    styles?: string[];

    /**
     * Asset JavaScript URLs.
     *
     * For relative URL, AssetLoader will load from ./assets/<asset-name>/<url>
     * For abaolute URL, AssetLoader will load it directly.
     */
    scripts?: (string | AssetReference)[];

    /**
     * After asset loaded, load function will return specific global module.
     * (get by window[globalModule])
     *
     * If not set, load function will return undefined.
     * This setting only works on scripts is not empty.
     */
    globalModule?: string;
}

function isEmptyAsset(asset: AssetDefinition): boolean {
    if (Array.isArray(asset.styles) && asset.styles.length > 0) {
        return false;
    }
    if (Array.isArray(asset.scripts) && asset.scripts.length > 0) {
        return false;
    }
    return true;
}

function attachLazyLoadDom(dom: any, selector: string = 'head'): Promise<any> {
    let done = false;
    return new Promise(function (resolve, reject) {
        dom.onload = dom.onreadystatechange = function (): void {
            if (!done && (!dom.readyState || dom.readyState === 'loaded' || dom.readyState === 'complete')) {
                done = true;
                dom.onload = dom.onreadystatechange = null;
                resolve(dom);
            }
        };
        dom.onerror = reject;
        document.querySelector(selector).appendChild(dom);
    });
}

function loadCss(ref: AssetReference): Promise<any> {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = ref.url;
    return attachLazyLoadDom(link);
}

function loadJs(ref: AssetReference): Promise<any> {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = ref.url;
    script.async = ref.async === false ? false : true;
    script.defer = ref.defer === true ? true : false;
    return attachLazyLoadDom(script, 'body');
}

export enum DynamicAssets {
    Fonts = 'fonts',
    GoogleMap = 'google-map',
    GoogleAnalytics = 'google-ga',
    SNAP_ENGAGE = 'snap-engage',
    SheetJS = 'xlsx',
    TabulatorTables = 'tabulator-tables',
    C3 = 'c3',
    JinjaJs = 'jinja-js',
    QRCode = 'qrcode',
}

const ASSET_STORE: {[name: string]: AssetDefinition} = {
    [DynamicAssets.Fonts]: {
        styles: ['fonts.css'],
    },
    [DynamicAssets.GoogleMap]: {
        scripts: [
            {url: 'https://maps.googleapis.com/maps/api/js', requireQueryParams: ['key', 'libraries']},
            'markerwithlabel.js',
            'markerclusterer.js',
        ],
        globalModule: 'google.maps',
    },
    [DynamicAssets.SNAP_ENGAGE]: {
        scripts: [
            {
                url: 'https://storage.googleapis.com/code.snapengage.com/js/{widgetId}.js',
                requireParams: ['widgetId'],
                async: true,
            },
        ],
    },
    [DynamicAssets.SheetJS]: {
        scripts: ['xlsx.full.min.js'],
        globalModule: 'XLSX',
    },
    [DynamicAssets.TabulatorTables]: {
        styles: ['css/tabulator.min.css'],
        scripts: ['js/tabulator.min.js'],
        globalModule: 'Tabulator',
    },
    [DynamicAssets.C3]: {
        styles: ['c3.min.css'],
    },
    [DynamicAssets.GoogleAnalytics]: {
        scripts: [{url: 'https://www.googletagmanager.com/gtag/js', requireQueryParams: ['id']}],
    },
    [DynamicAssets.JinjaJs]: {
        scripts: ['jinja.js'],
        globalModule: 'jinja',
    },
    [DynamicAssets.QRCode]: {
        scripts: ['qrcode.min.js'],
    },
};

class AssetLoaderClass {
    private baseUrl: string;
    private loadedAssets = {};

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private resolveUri(uri: string, assetName: string): string {
        return uri.includes('//') ? `${uri}` : `./${this.baseUrl}${assetName}/${uri}`;
    }

    private formatUrl(assetName: string, urlTemplate: string | AssetReference, urlParams: UrlParams): string {
        if (typeof urlTemplate === 'string') {
            return this.resolveUri(urlTemplate, assetName);
        }
        let uri = urlTemplate.url;
        const requireParams = urlTemplate.requireParams != null ? urlTemplate.requireParams : [];
        const params = urlParams != null ? urlParams : {};
        requireParams.map(function (key) {
            uri = uri.replace(`{${key}}`, params[key]);
        });
        return this.resolveUri(uri, assetName);
    }

    private getQueryString(assetName: string, requireQueryParams: string[], queryParams: UrlQueryParams): string {
        if (!Array.isArray(requireQueryParams) || requireQueryParams.length === 0) {
            return '';
        }
        const queryStrings = requireQueryParams.map(function (k) {
            const v = queryParams[k];
            if (!v) {
                throw Error(`Query parameter ${k} required for ${assetName}`);
            }
            return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
        });
        return `?${queryStrings.join('&')}`;
    }

    private prepareUrls(
        assetName: string,
        rels: (string | AssetReference)[],
        params: UrlParams,
        queryParams: UrlQueryParams,
    ): AssetReference[] {
        const urlTemplates = Array.isArray(rels) ? rels : [];
        const $this = this;
        return urlTemplates.map(function (tmpl) {
            const src = $this.formatUrl(assetName, tmpl, params);
            let ret: AssetReference = {url: src};
            if (typeof tmpl !== 'string') {
                ret = cloneDeep(tmpl);
                ret.url = `${src}${$this.getQueryString(assetName, tmpl.requireQueryParams, queryParams)}`;
            }
            return ret;
        });
    }

    private async loadingAssets(
        name: DynamicAssets,
        asset: AssetDefinition,
        styles: AssetReference[],
        scripts: AssetReference[],
    ): Promise<object> {
        if (styles.length) {
            await Promise.all(
                styles.map(function (ref) {
                    return loadCss(ref);
                }),
            );
        }
        for (const ref of scripts) {
            if (ref.load != null) {
                await ref.load(ref);
            } else {
                await loadJs(ref);
            }
        }
        return scripts.length > 0 && asset.globalModule ? getFromObj(window, asset.globalModule) : null;
    }

    load(name: DynamicAssets, urlParams?: UrlParams, queryParams?: UrlQueryParams): Promise<object> {
        const asset = ASSET_STORE[name];
        if (!asset) {
            throw Error(`Asset not found: ${name}`);
        }
        if (isEmptyAsset(asset)) {
            throw Error(`Asset without resoruce: ${name}`);
        }
        if (!this.loadedAssets[name]) {
            const styles = this.prepareUrls(name, asset.styles, urlParams, queryParams);
            const scripts = this.prepareUrls(name, asset.scripts, urlParams, queryParams);
            this.loadedAssets[name] = this.loadingAssets(name, asset, styles, scripts);
        }
        return this.loadedAssets[name];
    }
}

export const AssetLoader = new AssetLoaderClass('./assets/');

@Injectable({providedIn: 'root'})
export class AssetLoaderService {
    constructor() {}

    load(name: DynamicAssets, urlParams?: UrlParams, queryParams?: UrlQueryParams): Promise<object> {
        return AssetLoader.load(name, urlParams, queryParams);
    }
}

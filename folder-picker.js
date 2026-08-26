// @ts-check
/** @import {Actions, PAP, AllProps, AP} from './types/folder-picker/types' */;
/** @import {RoundaboutOptions} from './types/roundabout/types' */;
/** @import {ElementEnhancementGateway, SpawnContext} from './types/assign-gingerly/types' */;
/** @import {EMC} from './types/mount-observer/types' */;
/** @import {RAConfig} from './types/roundabout/types' */;

/**
 * @implements {Actions}
 * @implements {EventListenerObject}
 */
class FolderPicker extends EventTarget {

    /**
     * @this {AllProps & Actions}
     * @param {Element & ElementEnhancementGateway} enhancedElement 
     * @param {SpawnContext} ctx 
     * @param {PAP} initVals 
     */
    constructor(enhancedElement, ctx, initVals){
        super();
        this.init(this, enhancedElement, ctx, initVals);
    }

    /**
     * @param {AllProps} self 
     * @param {Element & ElementEnhancementGateway} enhancedElement 
     * @param {SpawnContext} ctx 
     * @param {PAP} initVals 
     */
    async init(self, enhancedElement, ctx, initVals){
        const {customData} = /** @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions>>} */ (ctx.emc);
        /**
         * @type {RoundaboutOptions}
         */
        const raOptions = {
            ...customData,
            vm: self,
            initialPropVals: {
                enhancedElement,
                ...customData?.defaultPropVals,
                ...initVals
            }
        };
        (await import('roundabout-lib/roundabout.js')).roundabout(raOptions);
    }

    /**
     * @param {Event} e
     */
    async handleEvent(e){
        const self = /** @type {AP} */ (/** @type {any} */ (this));
        self.directoryHandle = await window.showDirectoryPicker(self.options);
    }

    /**
     * @param {AP} self 
     * @returns {import('./types/folder-picker/types').ProPAP}
     */
    async hydrate(self){
        const { noNudge, enhancedElement } = self;
        enhancedElement.addEventListener('click', this);
        if(!noNudge){
            (await import('assign-gingerly/handlers/nudge.js')).nudge(enhancedElement);
        }
        return /** @type {PAP} */ ({
            resolved: true,
        });
    }
}

export { FolderPicker };

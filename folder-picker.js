// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types' */
/** @import {Actions, ProPAP, PAP, AllProps, AP, BAP} from './ts-refs/folder-picker/types' */

/**
 * @implements {Actions}
 * @implements {EventListenerObject}
 * 
 */
class FolderPicker extends BE {
    /**
     * @type {BEConfig<AP & BEAllProps, Actions & IEnhancement>}
     */
    static config = {
        propDefaults:{
            noNudge: false,
        },
        propInfo: {
            ...propInfo,
            options: {
                def: {}
            },
            directoryHandle: {}
        },
        positractions: [resolved, rejected],
        compacts:{
            when_options_changes_call_hydrate: 0,
        }
    }

    de = de;

    async handleEvent(){
        const self = /** @type {BAP} */ /** @type {any} */ (this);
        self.directoryHandle = await window.showDirectoryPicker(self.options);
    }

    /**
     * 
     * @param {BAP} self 
     * @returns {ProPAP}
     */
    async hydrate(self){
        const { noNudge, enhancedElement } = self;
        enhancedElement.addEventListener('click', this);
        if(!noNudge){
            (await import('trans-render/lib/nudge.js')).nudge(enhancedElement);
        }
        return /** @type {PAP} */ ({
            resolved: true,
        });
    }
}

await FolderPicker.bootUp();
export { FolderPicker as BeDirective };
//@ts-check

/** @import {EMC} from './types/mount-observer/types' */;
/** @import {AllProps, Actions} from './types/folder-picker/types' */
/** @import {RAConfig} from './types/roundabout/types' */

/**
 * @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions> >}
 */
export const emc = {
    enhConfig: {
        enhKey: 'FolderPicker',
        spawn: 'folder-picker/folder-picker.js',
        withAttrs: {
            base: 'folder-picker',
            noNudge: '${base}-no-nudge',
            _noNudge: {
                instanceOf: 'Boolean'
            },
            _base: {
                instanceOf: 'Object',
                mapsTo: '.'
            }
        }
    },
    customData: {
        weakRef: {
            properties: ['enhancedElement']
        },
        actions: {
            hydrate: {
                ifAllOf: ['enhancedElement']
            }
        },
        compacts: {
            when_resolved_changes_dispatch: 'resolved',
        },
        defaultPropVals: {
            noNudge: false,
            options: {}
        }
    }
};

export function render(){
    return JSON.stringify(emc, null, 4);
}

console.log(render());

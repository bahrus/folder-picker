//@ts-check

/** @import {EMC} from './types/mount-observer/types' */;
/** @import {AllProps, Actions} from './types/folder-picker/types' */
/** @import {RAConfig} from './types/roundabout/types' */

/**
 * @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions> >}
 */
export const emc = {
    enhConfig: {
        enhKey: 'folderPicker',
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
        // Neither prop is read by an action/compact condition, so roundabout
        // wouldn't otherwise monitor them -- and an unmonitored prop set
        // programmatically before spawn finishes gets clobbered by
        // defaultPropVals at the end of roundabout().
        propagate: ['noNudge', 'options'],
        actions: {
            hydrate: {
                ifAllOf: ['enhancedElement', 'initialized']
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

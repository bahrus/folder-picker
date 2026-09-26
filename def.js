import  'assign-gingerly/object-extension.js';

/**
 * 
 * @param {Element | undefined} ref 
 */
export async function defFolderPicker(ref){
    const {default: emc} = await import('./emc.json', {with: {type: 'json'}});
    return await push(ref, emc);
}

async function push(ref, emc){
    const {FolderPicker} = await import('./folder-picker.js');
    const {enhConfig} = emc;
    enhConfig.spawn = FolderPicker;
    enhConfig.customData = emc.customData;
    const registry = ref?.customElementRegistry ?? customElements;
    const {enhancementRegistry} = registry;
    enhancementRegistry.push(enhConfig);
    return enhConfig;
}

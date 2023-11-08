import { Extension } from '@tiptap/core'

const StorageTest = Extension.create({
    name: 'storageTestExtension',

    addStorage() {
        return {
            count: 100,
        }
    },

    onUpdate() {
        // The content has changed.
        this.storage.count += 1
    },

    onCreate() {
        // The editor is ready.
    },

    onSelectionUpdate({ editor }) {
        // The selection has changed.
    },

    onTransaction({ transaction }) {
        // The editor state has changed.
    },

    onFocus({ event }) {
        // The editor is focused.
    },

    onBlur({ event }) {
        // The editor isn’t focused anymore.
    },
    
    onDestroy() {
        // The editor is being destroyed.
    },
});

export default StorageTest;
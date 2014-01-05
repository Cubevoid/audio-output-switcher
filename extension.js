const Lang = imports.lang;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;

const AudioOutputSubMenu = new Lang.Class({
    Name: 'AudioOutputSubMenu',
    Extends: PopupMenu.PopupSubMenuMenuItem,

    _init: function() {
        this.parent('Audio Output: Connecting...', true);

//        this.icon.icon_name = 'audio-speakers-symbolic';

        this._control = Main.panel.statusArea.aggregateMenu._volume._control;
        
        this._controlSignal = this._control.connect('default-sink-changed', Lang.bind(this, function() {
            this._updateDefaultSink();
        }));
        
        this._updateDefaultSink();

        this.menu.connect('open-state-changed', Lang.bind(this, function(menu, isOpen) {
            if (isOpen)
                this._updateSinkList();
        }));
        
        //Unless there is at least one item here, no 'open' will be emitted...
        item = new PopupMenu.PopupMenuItem('Connecting...');
        this.menu.addMenuItem(item);

        //This is a hack, since I don't know how to call a parent class' function from
        //within the override function on gjs; i.e. this.parent.destroy() does not exist...
        this.origdestroy = this.destroy;
        this.destroy = Lang.bind(this, function() {
            this._control.disconnect(this._controlSignal);
            this.origdestroy();
        });
    },
    
    _updateDefaultSink: function () {
        defsink = this._control.get_default_sink();
        //Unfortunately, Gvc neglects some pulse-devices, such as all "Monitor of ..."
        if (defsink == null)
            this.label.set_text("Other");
        else
            this.label.set_text(defsink.get_description());
    },
    
    _updateSinkList: function () {
        this.menu.removeAll();

        defsink = this._control.get_default_sink();
        sinklist = this._control.get_sinks();
        control = this._control;

        for (i = 0; i < sinklist.length; i++) {
            sink = sinklist[i];
            if (sink === defsink)
                continue;
            item = new PopupMenu.PopupMenuItem(sink.get_description());
            item.connect('activate', Lang.bind(sink, function() {
                control.set_default_sink(this);
            }));
            this.menu.addMenuItem(item);
        }
    },
});

let audioOutputSubMenu = null;

function init() {
}

function enable() {
    if (audioOutputSubMenu != null)
        return;
    audioOutputSubMenu = new AudioOutputSubMenu();

    //Try to add the output-switcher right below the output slider...
    volMen = Main.panel.statusArea.aggregateMenu._volume._volumeMenu;
    items = volMen._getMenuItems();
    i = 0; 
    while (i < items.length)
        if (items[i] === volMen._output.item)
            break;
        else
            i++;
    volMen.addMenuItem(audioOutputSubMenu, i+1);
}

function disable() {
    audioOutputSubMenu.destroy();
    audioOutputSubMenu = null;
}

Gnome-Shell Extension Audio-Output-Switcher
===========================================

This extension adds a little entry to the status-menu that shows the currently
selected pulse-audio-output device. Klicking on that will open a submenu with
all available output devices and let's you choose which one to use.

Most importantly this extension is a s simple as possible. Therefore it does not
include an imput switcher or similar.
See Audio-Input-Switcher (https://github.com/anduchs/audio-input-switcher)
extension for microphone selection.

INSTALL
-------

Either via 

    https://extensions.gnome.org

or via

    git clone https://github.com/anduchs/audio-output-switcher.git ~/.local/share/gnome-shell/extensions/audio-output-switcher@anduchs

Then resart the gnome-shell via CTRL+F2 r and enable the extension using gnome-tweak-tool

To update later, just issue

    (cd ~/.local/share/gnome-shell/extensions/audio-output-switcher@anduchs && git pull)

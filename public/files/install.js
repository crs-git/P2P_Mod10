'use strict';

let deferredInstallPrompt = null;
const installButton = document.getElementById('btnInstall');
installButton.style.display = 'none';

installButton.addEventListener('click', installPWA);

window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

function saveBeforeInstallPromptEvent(evt) {
  deferredInstallPrompt = evt;
  installButton.style.display = 'block';
}

function installPWA(evt) {
  deferredInstallPrompt.prompt();
  installButton.style.display = 'none';
  deferredInstallPrompt.userChoice
      .then((choice) => {
        if (choice.outcome === 'accepted') {
          console.log('User accepted', choice);
        } else {
          console.log('User dismissed', choice);
        }
        deferredInstallPrompt = null;
      });
}

window.addEventListener('appinstalled', logAppInstalled);

function logAppInstalled(evt) {
  console.log('Shooter App was installed.', evt);

}

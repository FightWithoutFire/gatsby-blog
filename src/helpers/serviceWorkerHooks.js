import {useEffect, useState} from 'react';

export function useServiceWorker(path) {
  const [registration, setRegistration] = useState(null);
  useEffect(() => {
    async function register() {
      if (navigator != null && navigator.serviceWorker != null) {
        const registration = await navigator.serviceWorker.register(path);
        setRegistration(registration);
      }
    }

    register();
  }, [setRegistration]);
  return [registration];
}

export function useServiceWorkerUpdate(registration) {
  const [serviceWorker, setServiceWorker] = useState(serviceWorker);

  useEffect(() => {
    function onUpdateAvailable(serviceworker) {
      setServiceWorker(serviceworker);
    }

    function onStateChange() {
      if (registration.installing.state === 'installed') onUpdateAvailable(registration.installing);
    }

    function onUpdateFound() {
      registration.installing.addEventListener('statechange', onStateChange);
    }

    if (registration != null) {
      if (registration.waiting) onUpdateAvailable(registration.waiting);
      else if (registration.installing) onUpdateFound();
      else registration.addEventListener('updatefound', onUpdateFound);
    }

    return () => {
      registration.removeEventListener('updatefound', onUpdateFound);
      registration.installing.removeEventListener('statechange', onStateChange);
    };
  }, [registration]);

  return [serviceWorker, () => setServiceWorker(null)];
}

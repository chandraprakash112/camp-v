import { environment } from "src/environments/environment";

export function getBaseUrl(): string {
  let base = environment.baseUrl;

  const isLocalhost = window.location.hostname.includes('localhost');

  if (environment.production && !isLocalhost && base.startsWith('/')) {
    base = `${window.location.origin}${base}`;
  }

  return 'https://qa.samparkme.com/Comp-vision-solution';
}

export function getBaseWebSocketUrl(): string {
  // let baseWs = environment.baseWebSocket;
  // const isLocalhost = window.location.hostname.includes('localhost');

  // if (environment.production && !isLocalhost && baseWs.startsWith('/')) {
  //   const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  //   baseWs = `${wsProtocol}://${window.location.host}${baseWs}`;
  // }

  return "baseWs";
}
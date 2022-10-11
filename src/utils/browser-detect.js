export function detectIE () {
  return window.ActiveXObject === undefined
    ? null
    : !window.XMLHttpRequest
      ? 6
      : !document.querySelector
        ? 7
        : !document.addEventListener
          ? 8
          : !window.atob
            ? 9
            // eslint-disable-next-line no-proto
            : !document.__proto__
              ? 10
              : 11
}

export function detectIOS () {
  let d, v
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)
    d = {
      status: true,
      version: parseInt(v[1], 10),
      info: parseInt(v[1], 10) + '.' + parseInt(v[2], 10) + '.' + parseInt(v[3] || 0, 10),
    }
    return d.version
  } else {
    return null
  }
}

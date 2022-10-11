import Cookies from 'js-cookie'

const accessTokenKey = 'accessToken'

export function setAccessToken (token) {
  Cookies.set(accessTokenKey, token)
}

export function getAccessToken () {
  return Cookies.get(accessTokenKey)
}

export function removeAccessToken () {
  return Cookies.remove(accessTokenKey)
}

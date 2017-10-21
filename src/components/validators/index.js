import XRegExp from 'xregexp'

export const isAlphanumeric = (s) => {
  if (!s) return false
  const m = s.match(/^[a-zA-Z0-9_]*$/)
  return (!!m && m.length === 1)
}

// eslint-disable-next-line
const reEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
export const email = (s) => reEmail.test(s)

const rePassword = /^.{8}.*$/
export const password = (s) => rePassword.test(s)

const reName = XRegExp("^((\\pL+[\\-\\']?)*(\\pL+)?\\s)+(\\pL+[\\-\\']?)*(\\pL+)?$")
export const name = (s) => reName.test(s)

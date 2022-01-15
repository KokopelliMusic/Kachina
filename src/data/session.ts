
export const saveSessionCode = (code: string) => {
  localStorage.setItem('sessionCode', code)
}

export const getSessionCode = () => {
  return localStorage.getItem('sessionCode')
}
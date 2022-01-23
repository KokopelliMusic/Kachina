
export const saveSessionCode = (code: string) => {
  localStorage.setItem('kokopelli:sessionCode', code)
}

export const getSessionCode = () => {
  return localStorage.getItem('kokopelli:sessionCode')
}
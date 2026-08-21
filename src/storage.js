export const readStorage = (key) => {
  try {
    return localStorage.getItem(key)
  } catch (err) {
    console.warn(`Failed to read localStorage key "${key}":`, err)
    return null
  }
}

export const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch (err) {
    console.warn(`Failed to write localStorage key "${key}":`, err)
  }
}

export const escapeFirebaseKey = (s:string|number):string => {
  return s.toString().replace(/[.$[\]#\/]/g, "_")
}
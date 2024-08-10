export function normalize({_id, ...otherProperties}) {
    const id = _id.toString()
    return { ...otherProperties, id }
  }
  
  export { dbConnect } from './connection'
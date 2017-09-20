import { storagePrefix } from '../constants/app';

class StorageHelper {
  static getItem(name, prefix) {
    const newName = this.addPrefix(name, prefix || storagePrefix);
    const storeData = JSON.parse(localStorage.getItem(newName));
    if (storeData === null) return null
    const { value, options } = storeData;
    const { expire, storeTime } = options;
    if (expire === undefined) {
      return value
    } else {
      if (storeTime - new Date().getTime() > 0) {
        return value
      } else {
        localStorage.removeItem(newName);
        return null
      }
    }
  }

  static setItem(name, value, options) {
    options = options || {};
    if (options.expire) options.storeTime = new Date().getTime() + options.expire*24*60*60*1000;
    const newName = this.addPrefix(name, options.prefix || storagePrefix)
    localStorage.setItem(newName, JSON.stringify({value,options}))
  }

  static removeItem(name, prefix) {
    const newName = this.addPrefix(name, prefix || storagePrefix)
    localStorage.removeItem(newName)
  }

  static clear() {
    localStorage.clear()
  }

  static addPrefix(name, prefix) {
    return prefix ? `${prefix}:${name}` : name
  }
}

export default StorageHelper;
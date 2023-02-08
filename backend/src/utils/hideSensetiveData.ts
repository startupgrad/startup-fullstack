import _ from 'lodash'

export const hideSensetiveData = (meta?: Record<string, any>) => {
  if (!meta) {
    return meta
  }
  const result: any = {}
  for (const [key, value] of Object.entries(meta)) {
    const valueHere = value?.toObject ? value.toObject() : value
    if (_.isObject(valueHere)) {
      result[key] = hideSensetiveData(valueHere)
    } else if (
      [
        'email',
        'password',
        'newPassword',
        'oldPassword',
        'token',
        'text',
        'description',
        'apiKey',
        'signature',
        'signedUrl',
      ].includes(key)
    ) {
      result[key] = '🙈'
    } else {
      result[key] = valueHere
    }
  }
  return result
}

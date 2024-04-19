import {request} from '@strapi/helper-plugin';

export function getSettings () {
  return request('/strapi-julius-editor/')
}

export function updateSettings (settings) {
  return request('/strapi-julius-editor/update-settings', {method: 'PUT', body: settings })
}

import { getFetchClient } from '@strapi/strapi/admin';

export async function getSettings () {
  const { get } = getFetchClient();
  const { data } = await get('/strapi-julius-editor/');

  return data;
}

export async function updateSettings (settings) {
  const { put } = getFetchClient();
  const { data } = await put('/strapi-julius-editor/update-settings', settings);

  return data;
}

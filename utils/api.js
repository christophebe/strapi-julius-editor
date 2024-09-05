import {request} from '@strapi/helper-plugin';

export function getSettings() {
  return request("/tiptap-editor-strapi/");
}

export function updateSettings(settings) {
  return request("/tiptap-editor-strapi/update-settings", {
    method: "PUT",
    body: settings,
  });
}

import pluginPkg from "../../package.json";
import Wysiwyg from "./components/Wysiwyg";
import pluginId from "./pluginId";

const name = pluginPkg.strapi.name;

const SettingsPage = () =>
  import(/* webpackChunkName: "strapi-julius-editor-settings-page" */ './pages/App');

export default {
  register(app) {
    app.createSettingSection(
      { id: 'strapi-julius-editor', intlLabel: { id: 'my-plugin.plugin.name', defaultMessage: 'Strapi Julius Editor' } }, // Section to create
      [
        // links
        {
          intlLabel: { id: 'my-plugin.plugin.name', defaultMessage: 'Settings' },
          id: 'Settings',
          to: 'strapi-julius-editor',
          Component: SettingsPage,
          permissions: [],
        },
      ]
    );

    app.addFields({ type: 'richtext', Component: Wysiwyg });

    app.registerPlugin({
      id: pluginId,
      isReady: true,
      name,
    });
  },
  bootstrap() {},
};

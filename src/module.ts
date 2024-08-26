import { coreServices, createBackendModule } from '@backstage/backend-plugin-api';
import { catalogModelExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { customEntityDataParser } from './lib/customEntityParser';

/**
 * The customparser backend module for the customparser plugin.
 *
 * @public
 */
export const customparserModulecustomparser = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'customparser',
  register({registerInit}) {
    registerInit({
      deps: { 
         logger: coreServices.logger,
         catalog: catalogModelExtensionPoint,
         reader: coreServices.urlReader },
      async init({ logger,catalog }) {
        logger.info("Registered customparserModulecustomparser for custom data processor")
        catalog.setEntityDataParser(customEntityDataParser);
      },
    });
  },
});

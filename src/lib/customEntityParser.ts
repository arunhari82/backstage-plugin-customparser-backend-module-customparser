import {
    CatalogProcessorParser,
    LocationSpec,
    processingResult,
  } from '@backstage/plugin-catalog-node';
  import yaml from 'yaml';
  import {
    Entity,
    stringifyLocationRef,
    ANNOTATION_ORIGIN_LOCATION,
    ANNOTATION_LOCATION,
  } from '@backstage/catalog-model';
  import _ from 'lodash';
  
  // This implementation will map whatever your own format is into valid Entity objects.
  const makeEntityFromCustomFormatJson = (
    component: { id: string; type: string; author: string },
    location: LocationSpec,
  ): Entity => {
    return {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: component.id,
        namespace: 'default',
        annotations: {
          [ANNOTATION_LOCATION]: `${location.type}:${location.target}`,
          [ANNOTATION_ORIGIN_LOCATION]: `${location.type}:${location.target}`,
        },
      },
      spec: {
        type: component.type,
        owner: component.author,
        lifecycle: 'experimental'
      }
    }
  };
  
  export const customEntityDataParser: CatalogProcessorParser = async function* ({
    data,
    location,
  }) {
    let documents: yaml.Document.Parsed[];
    try {
      // let's treat the incoming file always as yaml, you can of course change this if your format is not yaml.
      documents = yaml.parseAllDocuments(data.toString('utf8')).filter(d => d);
    } catch (e) {
      // if we failed to parse as yaml throw some errors.
      const loc = stringifyLocationRef(location);
      const message = `Failed to parse YAML at ${loc}, ${e}`;
      yield processingResult.generalError(location, message);
      return;
    }
  
    for (const document of documents) {
      // If there's errors parsing the document as yaml, we should throw an error.
      if (document.errors?.length) {
        const loc = stringifyLocationRef(location);
        const message = `YAML error at ${loc}, ${document.errors[0]}`;
        yield processingResult.generalError(location, message);
      } else {
        // Convert the document to JSON
        const json = document.toJSON();
        if (_.isPlainObject(json)) {
          // Is this a catalog-info.yaml file?
          if (json.apiVersion) {
            yield processingResult.entity(location, json as Entity);
  
          // let's treat this like it's our custom format instead.
          } else {
            yield processingResult.entity(
              location,
              makeEntityFromCustomFormatJson(json, location),
            );
          }
        } else if (json === null) {
          // Ignore null values, these happen if there is an empty document in the
          // YAML file, for example if --- is added to the end of the file.
        } else {
          // We don't support this format.
          const message = `Expected object at root, got ${typeof json}`;
          yield processingResult.generalError(location, message);
        }
      }
    }
  }
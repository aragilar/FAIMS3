/*
 * Copyright 2021 Macquarie University
 *
 * Licensed under the Apache License Version 2.0 (the, "License");
 * you may not use, this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND either express or implied.
 * See, the License, for the specific language governing permissions and
 * limitations under the License.
 *
 * Filename: datamodel.ts
 * Description:
 *   TODO
 */

export const UI_SPECIFICATION_NAME = 'ui-specification';
export const PROJECT_SPECIFICATION_PREFIX = 'project-specification';
export const PROJECT_METADATA_PREFIX = 'project-metadata';
export const OBSERVATION_INDEX_NAME = 'observation-version-index';

/*
 * This may already exist in pouchdb's typing, but lets make a temporary one for
 * our needs
 */
export interface PouchAttachments {
  [key: string]: any; // any for now until we work out what we need
}

export interface ConnectionInfo {
  proto: string;
  host: string;
  port: number;
  lan?: boolean;
  db_name: string;
}

export type PossibleConnectionInfo =
  | undefined
  | {
      proto?: string | undefined;
      host?: string | undefined;
      port?: number | undefined;
      lan?: boolean | undefined;
      db_name?: string | undefined;
    };

export interface ListingsObject {
  _id: string;
  name: string;
  description: string;
  projects_db?: PossibleConnectionInfo;
  people_db?: PossibleConnectionInfo;
}

export interface NonNullListingsObject extends ListingsObject {
  projects_db: ConnectionInfo;
  people_db: ConnectionInfo;
}

export interface ActiveDoc {
  _id: string;
  listing_id: string;
  project_id: string;
  username: string | null;
  password: string | null;
  friendly_name?: string;
  is_sync: boolean;
}

/**
 * Describes a project, with connection, name, description, and schema
 * Part of the Projects DB
 * Do not use with UI code; sync code only
 */
export interface ProjectObject {
  _id: string;
  name: string;
  description?: string;
  data_db?: PossibleConnectionInfo;
  metadata_db?: PossibleConnectionInfo;
  last_updated?: string;
  created?: string;
  status?: string;
}

export type ProjectsList = {
  [key: string]: ProjectObject;
};

/**
 * User readable information about a project
 * Do not use with sync code; UI code only
 */
export type ProjectID = string;

export interface ProjectInformation {
  project_id: ProjectID;
  name: string;
  description?: string;
  last_updated?: string;
  created?: string;
  status?: string;
}

/*
 * Objects that may be contained in a Project's metadata DB
 */
export interface FAIMSType {
  [key: string]: any; // any for now until we lock down the json
}

export interface FAIMSTypeCollection {
  [key: string]: FAIMSType;
}

export interface FAIMSConstant {
  [key: string]: any; // any for now until we lock down the json
}

export interface FAIMSConstantCollection {
  [key: string]: FAIMSConstant;
}

export interface ProjectSchema {
  _id?: string; // optional as we may want to include the raw json in places
  _rev?: string; // optional as we may want to include the raw json in places
  _deleted?: boolean;
  namespace: string;
  constants: FAIMSConstantCollection;
  types: FAIMSTypeCollection;
}

export interface ProjectUIFields {
  [key: string]: any;
}

export interface ProjectUIViews {
  [key: string]: any;
}

export interface ProjectUIModel {
  _id?: string; // optional as we may want to include the raw json in places
  _rev?: string; // optional as we may want to include the raw json in places
  fields: ProjectUIFields;
  views: ProjectUIViews;
  start_view: string;
}

export interface EncodedProjectUIModel {
  _id: string; // optional as we may want to include the raw json in places
  _rev?: string; // optional as we may want to include the raw json in places
  _deleted?: boolean;
  fields: ProjectUIFields;
  fviews: ProjectUIViews; // conflicts with pouchdb views/indexes, hence fviews
  start_view: string;
}

export interface EncodedProjectMetadata {
  _id: string; // optional as we may want to include the raw json in places
  _rev?: string; // optional as we may want to include the raw json in places
  _deleted?: boolean;
  _attachments?: PouchAttachments;
  is_attachment: boolean;
  metadata: any;
}

export interface ProjectPeople {
  _id: string;
  _rev?: string; // optional as we may want to include the raw json in places
  _deleted?: boolean;
}

// There are two internal ID for observations, the former is unique to a
// project, the latter unique to the system (i.e. includes project_id)
export type ObservationID = string;
export type FullyResolvedObservationID = string;
export interface SplitObservationID {
  project_id: string;
  observation_id: ObservationID;
}

export function resolve_observation_id(
  split_id: SplitObservationID
): FullyResolvedObservationID {
  const cleaned_project_id = split_id.project_id.replace('||', '\\|\\|');
  return cleaned_project_id + '||' + split_id.observation_id;
}

export function split_full_observation_id(
  full_proj_id: FullyResolvedObservationID
): SplitObservationID {
  const splitid = full_proj_id.split('||');
  if (
    splitid.length !== 2 ||
    splitid[0].trim() === '' ||
    splitid[1].trim() === ''
  ) {
    throw Error('Not a valid full observation id');
  }
  const cleaned_project_id = splitid[0].replace('\\|\\|', '||');
  return {
    project_id: cleaned_project_id,
    observation_id: splitid[1],
  };
}

// This is used within the form/ui subsystem, do not use with pouch
export interface Observation {
  observation_id: ObservationID;
  _rev?: string; // optional as we may want to include the raw json in places
  _project_id?: string;
  type: string;
  data: any;
  created: Date;
  created_by: string;
  updated: Date;
  updated_by: string;
}

export type ObservationList = {
  [key: string]: Observation;
};

// This is used within the pouch/sync subsystem, do not use with form/ui
export interface EncodedObservation {
  _id: string;
  _rev?: string; // optional as we may want to include the raw json in places
  _revisions?: {start: number; ids: string[]};
  _deleted?: boolean; // This is for couchdb deletion
  deleted?: boolean; // This is for user-level deletion
  _project_id?: string;
  format_version: number;
  type: string;
  data: any;
  created: string;
  created_by: string;
  updated: string;
  updated_by: string;
}

export interface SavedView {
  // ID: active_id + '/' + view_name
  // OR: active_id + '/' + view_name + '/' + existing.observation + '/' + existing.revision
  _id: string;
  // Fields
  [key: string]: unknown;
}

/*
 * Elements of a Project's metadataDB can be any one of these,
 * discriminated by the prefix of the object's id
 */
export type ProjectMetaObject =
  | ProjectSchema
  | EncodedProjectUIModel
  | ProjectPeople;

/*
 * Elements of a Project's dataDB can be any one of these,
 * discriminated by the prefix of the object's id
 */
export type ProjectDataObject = EncodedObservation;

/**
 * Document from a people DB
 */
export interface PeopleDoc {
  roles: Array<string>;
  devices: Array<string>;
  salt: string;
  ierations: 10;
  derived_key: string;
  passsword_scheme: string;
}

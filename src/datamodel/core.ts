/*
 * Copyright 2021, 2022 Macquarie University
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
 * Filename: core.ts
 * Description:
 *   Core types/interfaces that are used throughout the codebase.
 *   Types/interfaces that are only used within the GUI, or are what the GUI
 *   sees should go in the gui file, whilst those types only used within the
 *   databases should go in the database file.
 */

// There are two internal IDs for projects, the former is unique to the system
// (i.e. includes the listing_id), the latter is unique only to the 'projects'
// database it came from, for a FAIMS listing
// (It is this way because the list of projects is decentralised and so we
// cannot enforce system-wide unique project IDs without a 'namespace' listing id)
import type {KeyLike} from 'jose';

export type ProjectID = string;
export type NonUniqueProjectID = string;
export type ListingID = string;

export function resolve_project_id(
  listing_id: ListingID,
  nonunique_id: NonUniqueProjectID
): ProjectID {
  const cleaned_listing_id = listing_id.replace('||', '\\|\\|');
  return cleaned_listing_id + '||' + nonunique_id;
}

export function split_full_project_id(full_proj_id: ProjectID): {
  listing_id: ListingID;
  project_id: NonUniqueProjectID;
} {
  const splitId = full_proj_id.split('||');
  if (
    splitId.length !== 2 ||
    splitId[0].trim() === '' ||
    splitId[1].trim() === ''
  ) {
    throw Error('{full_proj_id} is not a valid full project id.');
  }
  const cleaned_listing_id = splitId[0].replace('\\|\\|', '||');
  const cleaned_project_id = splitId[1].replace('\\|\\|', '||');
  return {
    listing_id: cleaned_listing_id,
    project_id: cleaned_project_id,
  };
}

// There are two internal ID for records, the former is unique to a
// project, the latter unique to the system (i.e. includes project_id)
export type RecordID = string;
export type FullyResolvedRecordID = string;
export interface SplitRecordID {
  project_id: ProjectID;
  record_id: RecordID;
}

export function resolve_record_id(
  split_id: SplitRecordID
): FullyResolvedRecordID {
  const cleaned_project_id = split_id.project_id.replace('||', '\\|\\|');
  return cleaned_project_id + '||' + split_id.record_id;
}

export function split_full_record_id(
  full_record_id: FullyResolvedRecordID
): SplitRecordID {
  const splitId = full_record_id.split('||');
  if (
    splitId.length !== 2 ||
    splitId[0].trim() === '' ||
    splitId[1].trim() === ''
  ) {
    throw Error('Not a valid full record id');
  }
  const cleaned_project_id = splitId[0].replace('\\|\\|', '||');
  return {
    project_id: cleaned_project_id,
    record_id: splitId[1],
  };
}

export type RevisionID = string;
export type AttributeValuePairID = string;
export type FAIMSAttachmentID = string;

export type FAIMSTypeName = string;

// This should be locked down more
export type Annotations = any;

export const HRID_STRING = 'hrid';

export const DEFAULT_REALTION_LINK_VOCAB = 'is related to';

export interface TokenInfo {
  token: string;
  pubkey: KeyLike;
}

export interface TokenContents {
  username: string;
  roles: string[];
  name?: string;
}

export type ProjectRole = string;

export interface ClusterProjectRoles {
  [key: string]: Array<ProjectRole>;
}

export interface SyncStatusCallbacks {
  sync_up: () => void;
  sync_down: () => void;
  sync_error: () => void;
  sync_denied: () => void;
}

export type LocationState = {
  parent_record_id?: string; // parent or linked record id, set from parent or linked record
  field_id?: string; // parent or linked field id, set from parent or linked record
  type?: string; // type of relationship: Child or Linked
  parent_link?: string; // link of parent/linked record, so when child/link record saved, this is the redirect link
  parent?: any; // parent to save upper level information for nest related, for example, grandparent
  record_id?: RecordID; // child/linked record ID, set in child/linked record, should be pass back to parent
  hrid?: string; // child/linked record HRID, this is the value displayed in field, set in child/linked record, should be pass back to parent
  relation_type_vocabPair?: string[] | null; //pass the parent information to child
  child_record_id?: RecordID; //child/linked record ID created from parent
};
export interface LinkedRelation {
  record_id: RecordID;
  field_id: string;
  relation_type_vocabPair: string[];
}
export interface Relationship {
  parent?: LinkedRelation; // has single parent
  linked?: Array<LinkedRelation>; // has multiple link
}

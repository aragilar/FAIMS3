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
 * Filename: index.ts
 * Description:
 *   TODO
 */

import PouchDB from 'pouchdb';
import {RUNNING_UNDER_TEST, DEBUG_APP} from '../buildconfig';
import {SyncStatusCallbacks} from '../datamodel/core';
import {ConnectionInfo, PossibleConnectionInfo} from '../datamodel/database';
import PouchDBAdaptorMemory from 'pouchdb-adapter-memory';

/**
 * Configure local pouchdb settings; note that this applies to *ALL* local
 * databases (remote ones are handled separately), so don't add db-specific
 * logic to this
 */

export const local_pouch_options: any = {};
if (RUNNING_UNDER_TEST) {
  // enable memory adapter for testing
  // console.log('Using memory store');
  PouchDB.plugin(PouchDBAdaptorMemory);
  local_pouch_options['adapter'] = 'memory';
}

export function materializeConnectionInfo(
  base_info: ConnectionInfo,
  ...overlays: PossibleConnectionInfo[]
): ConnectionInfo {
  let ret = {...base_info};
  for (const overlay of overlays) {
    ret = {...ret, ...overlay};
  }
  return ret;
}

/*
 * The following provide the infrastructure connect up the UI sync notifications
 * with pouchdb's callbacks.
 */
export let sync_status_callbacks: SyncStatusCallbacks | null = null;

export function set_sync_status_callbacks(callbacks: SyncStatusCallbacks) {
  sync_status_callbacks = callbacks;
}

export function ping_sync_up() {
  if (sync_status_callbacks !== null) {
    sync_status_callbacks.sync_up();
  }
}

export function ping_sync_down() {
  if (sync_status_callbacks !== null) {
    sync_status_callbacks.sync_down();
  }
}

export function ping_sync_error() {
  if (sync_status_callbacks !== null) {
    sync_status_callbacks.sync_error();
  }
}

export function ping_sync_denied() {
  if (sync_status_callbacks !== null) {
    sync_status_callbacks.sync_denied();
  }
}

/**
 * Creates a local PouchDB.Database used to access a remote Couch/Pouch instance
 * @param connection_info Network address/database info to use to initialize the connection
 * @returns A new PouchDB.Database, interfacing to the remote Couch/Pouch instance
 */
export function ConnectionInfo_create_pouch<Content extends {}>(
  connection_info: ConnectionInfo
): PouchDB.Database<Content> {
  const pouch_options: PouchDB.Configuration.RemoteDatabaseConfiguration = {
    skip_setup: true,
  };

  // Username & password auth is optional
  if ('auth' in connection_info && connection_info.auth !== undefined) {
    pouch_options.auth = {
      username: connection_info.auth.username,
      password: connection_info.auth.password,
    };
  }
  // TODO: Use a new enough pouchdb such that we don't need the fetch hook, see
  // https://github.com/pouchdb/pouchdb/issues/8387
  pouch_options.fetch = function (url: any, opts: any) {
    if (
      'jwt_token' in connection_info &&
      connection_info.jwt_token !== undefined
    ) {
      if (DEBUG_APP) {
        console.debug('Using JWT for connection', connection_info);
      }
      opts.headers.set('Authorization', `Bearer ${connection_info.jwt_token}`);
    }
    ping_sync_up();
    ping_sync_down();
    // Commented out as it seems this may break sending attachments on
    // chrome/safari
    //opts.keepalive = true;
    return PouchDB.fetch(url, opts);
  };
  return new PouchDB(
    encodeURIComponent(connection_info.proto) +
      '://' +
      encodeURIComponent(connection_info.host) +
      ':' +
      encodeURIComponent(connection_info.port) +
      '/' +
      encodeURIComponent(connection_info.db_name),
    pouch_options
  );
}

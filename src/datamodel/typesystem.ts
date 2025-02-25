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
 * Filename: typesystem.ts
 * Description:
 *   TODO
 */
import {isEqual} from 'lodash';

import {FAIMSTypeName} from './core';
import {AttributeValuePair, FAIMSAttachment} from './database';

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

export interface ProjectUIFields {
  [key: string]: any;
}

export interface ProjectUIViewsets {
  [type: string]: {
    label?: string;
    views: string[];
    submit_label?: string;
    is_visible?: boolean;
  };
}

export interface ProjectUIViews {
  [key: string]: {
    label?: string;
    fields: string[];
    uidesign?: string;
    next_label?: string;
    is_logic?: {[key: string]: string[]}; //add for branching logic
  };
}

export interface option {
  value: string;
  label: string;
  key?: string;
}

type AttributeValuePairDumper = (
  avp: AttributeValuePair
) => Array<AttributeValuePair | FAIMSAttachment>;

type AttributeValuePairLoader = (
  avp: AttributeValuePair,
  attach_docs: FAIMSAttachment[]
) => AttributeValuePair;

type EqualityForFAIMSTypeFunction = (
  first: any,
  second: any
) => Promise<boolean>;

const attachment_dumpers: {
  [typename: string]: AttributeValuePairDumper;
} = {};
const attachment_loaders: {
  [typename: string]: AttributeValuePairLoader;
} = {};
const equality_functions: {
  [typename: string]: EqualityForFAIMSTypeFunction;
} = {};

export function getAttachmentLoaderForType(
  type: FAIMSTypeName
): AttributeValuePairLoader | null {
  const loader = attachment_loaders[type];
  if (loader === null || loader === undefined) {
    return null;
  }
  return loader;
}

export function getAttachmentDumperForType(
  type: FAIMSTypeName
): AttributeValuePairDumper | null {
  const dumper = attachment_dumpers[type];
  if (dumper === null || dumper === undefined) {
    return null;
  }
  return dumper;
}

export function setAttachmentLoaderForType(
  type: FAIMSTypeName,
  loader: AttributeValuePairLoader
) {
  attachment_loaders[type] = loader;
}

export function setAttachmentDumperForType(
  type: FAIMSTypeName,
  dumper: AttributeValuePairDumper
) {
  attachment_dumpers[type] = dumper;
}

function isAttachment(a: any): boolean {
  if (a instanceof Blob) {
    return true;
  }
  return false;
}

/*
 * This wraps the isEqual from lodash to add support for blobs which is needed
 * for attachments. It would be nice to replace this with a easier to use option
 * (e.g. without async), but this will have to do for now...
 */
export async function isEqualFAIMS(a: any, b: any): Promise<boolean> {
  if (Array.isArray(a) !== Array.isArray(b)) {
    // only one of a or b is an array, so not equal
    console.info('Not both arrays', a, b);
    return false;
  } else if (Array.isArray(a) && Array.isArray(b)) {
    console.info('Checking arrays', a, b);
    if (a.length !== b.length) {
      console.info('arrays different length', a, b);
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      const same = await isEqualFAIMS(a[i], b[i]);
      if (!same) {
        return false;
      }
    }
    return true;
  } else if (isAttachment(a) && isAttachment(b)) {
    console.info('Checking blobs', a, b);
    if (a.size !== b.size || a.type !== b.type || a.name !== b.name) {
      return false;
    }
    console.info('Checking blob contents', a, b);
    return await Promise.all([a.arrayBuffer(), b.arrayBuffer()])
      .then((res: [any, any]) => {
        const buf_a = res[0] as ArrayBuffer;
        const buf_b = res[1] as ArrayBuffer;
        const arr_a = new Uint8Array(buf_a);
        const arr_b = new Uint8Array(buf_b);
        console.info('Checking array buffers', arr_a, arr_b);
        return arr_a.every((element, index) => {
          return element === arr_b[index];
        });
      })
      .catch(err => {
        console.error('Blob checking failed', err);
        return false;
      });
  } else {
    console.info('Using lodash', a, b);
    return isEqual(a, b);
  }
}

export function getEqualityFunctionForType(
  type: FAIMSTypeName
): EqualityForFAIMSTypeFunction {
  const loader = equality_functions[type];
  if (loader === null || loader === undefined) {
    return isEqualFAIMS;
  }
  return loader;
}

export function setEqualityFunctionForType(
  type: FAIMSTypeName,
  loader: EqualityForFAIMSTypeFunction
) {
  equality_functions[type] = loader;
}

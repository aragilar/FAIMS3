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
 * Filename: geo.ts
 * Description:
 *   TODO
 */

// This is the same as the web/capacitor output, will need to be updated for the
// new GeoJSON format
export interface FAIMSCoordinate {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitudeAccuracy: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
}

export interface FAIMSPosition {
  type: string;
  properties: FAIMSPositionProperties;
  geometry: FAIMSPositionGeometry;
}

export interface FAIMSPositionProperties {
  timestamp: number;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  accuracy: number;
  altitude_accuracy: number | null;
}

export interface FAIMSPositionGeometry {
  type: string;
  coordinates: number[];
}

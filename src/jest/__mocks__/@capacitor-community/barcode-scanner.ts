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
 * Filename: actions.ts
 * Description:
 *   Jest mock stub for the barcode scanner.
 */

jest.mock('@capacitor-community/barcode-scanner', () => {
  return {
    hideBackground: jest.fn(),
    startScan: jest.fn(),
    showBackground: jest.fn(),
    checkPermission: jest.fn(),
    openAppSettings: jest.fn(),
  };
});

export {};

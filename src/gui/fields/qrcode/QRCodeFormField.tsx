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
 * Filename: QRCodeFormField.tsx
 * Description:
 *   Implement QRCodeFormField for scanning QR codes into a field in FAIMS3
 */

import React, {useState} from 'react';
import styles from './QRCodeFormField.module.css';
import Button from '@mui/material/Button';

import {BarcodeScanner} from '@capacitor-community/barcode-scanner';
// requires a workaround for jest - see mock in src/jest/__mocks__
// https://github.com/capacitor-community/barcode-scanner/issues/67

import {FieldProps} from 'formik';
import ReactDOM from 'react-dom';

export interface QRCodeFieldProps extends FieldProps {
  label?: string;
}

export function QRCodeFormField({
  field,
  form,
  ...props
}: QRCodeFieldProps): JSX.Element {
  // get previous form state if available
  let initialValue = {};
  if (form.values[field.name]) {
    initialValue = form.values[field.name];
  }
  const [state, setState] = useState(initialValue);
  const [scanning, setScanning] = useState(false);
  const [canScanMsg, setCanScanMsg] = useState('');

  const updateField = (value: any) => {
    setState(value);
    form.setFieldValue(field.name, value);
  };

  const startScan = async () => {
    BarcodeScanner.checkPermission({force: true})
      .then(permissions => {
        if (permissions.granted) {
          // hide the main app so we can overlay the viewfinder
          // relies on knowing the root id of the page
          //
          const rootcontainer = document.getElementById('root');
          if (rootcontainer) {
            rootcontainer.style.visibility = 'hidden';
          }

          // make background of WebView transparent
          BarcodeScanner.hideBackground();

          // and everything else too
          document.getElementsByTagName('body')[0].style.backgroundColor =
            'transparent';

          // scroll to top to so that our viewfinder etc is visible
          window.scrollTo(0, 0);

          setScanning(true);

          BarcodeScanner.startScan({}).then(result => {
            // if the result has content
            if (result.hasContent) {
              console.log('Barcode content:', result.content); // log the raw scanned content
              updateField(result.content);
            }
            stopScan();
          });
        } else {
          setCanScanMsg('Camera Access Permission not Granted');
        }
      })
      .catch(() => {
        setCanScanMsg('Scanning not supported in web browsers, mobile only');
      });
  };

  const stopScan = () => {
    BarcodeScanner.showBackground()
      .then(() => {
        const rootcontainer = document.getElementById('root');
        if (rootcontainer) {
          rootcontainer.style.visibility = 'visible';
        }
        BarcodeScanner.stopScan()
          .then(() => {
            setScanning(false);
          })
          .catch(() => console.log('stopScan'));
      })
      .catch(() => console.log('showBackground'));
  };

  // a string version of the value
  // to display below the form field
  const valueText = JSON.stringify(state);

  if (scanning) {
    // insert or create an element to hold the overlay
    let target;
    target = document.getElementById('qrscanner');
    if (!target) {
      target = document.createElement('div');
      target.setAttribute('id', 'qrscanner');
      document.body.appendChild(target);
    }

    if (target) {
      return ReactDOM.createPortal(
        <div className={styles.container}>
          <div className={styles.barcodeContainer}>
            <div className={styles.relative}>
              <p>Aim your camera at a barcode</p>
              <Button color="primary" variant="contained" onClick={stopScan}>
                Stop Scan
              </Button>
            </div>
            <div className={styles.square}>
              <div className={styles.outer}>
                <div className={styles.inner}></div>
              </div>
            </div>
          </div>
        </div>,
        target
      );
    } else {
      // how did we get here?
      return <div>Something went wrong</div>;
    }
  } else {
    if (canScanMsg !== '') {
      return (
        <div>
          <p>{props.label}</p>
          <div>{canScanMsg}</div>
          <div>{valueText}</div>
        </div>
      );
    } else {
      return (
        <div>
          <p>{props.label}</p>
          <Button variant="outlined" onClick={startScan}>
            Scan QR Code
          </Button>
          <div>{valueText}</div>
        </div>
      );
    }
  }
}

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
 * Filename: connectedStatus.tsx
 * Description:
 *   This contains the connectedStatus React component, which allows users to see their connectivity status
 */
import React from 'react';
import {IconButton} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
// import WifiOffIcon from '@mui/icons-material/WifiOff';
// import {TokenContents} from '../../../datamodel/core';

// interface ConnectedStatusProps {
//   token?: null | undefined | TokenContents;
// }

export default function ConnectedStatus() {
  return (
    <React.Fragment>
      <IconButton
        size="large"
        aria-label="connected status"
        color="inherit"
        sx={{pointerEvents: 'none'}}
      >
        <WifiIcon />
      </IconButton>
    </React.Fragment>
  );
}

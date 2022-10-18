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
 * Filename: inherited_data.tsx
 * Description:
 *   TODO
 */

import React from 'react';
import {Typography, Box} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {Accordion, AccordionSummary, AccordionDetails} from './accordion';

import CircularLoading from '../ui/circular_loading';

export default function InheritedDataComponent() {
  return (
    <Accordion>
      <AccordionSummary
        aria-controls="links-accordion-content"
        id="links-accordion"
      >
        <ContentCopyIcon sx={{mr: 1}} />
        <Typography>Inherited Data</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{p: 2}}>
          <CircularLoading label={'Loading data inherited from parent'} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

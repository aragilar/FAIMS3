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
 * Filename: ProjectButton.tsx
 * Description: This file define a list of buttons is create notebook UI
 *   TODO any type
 *   TODO clean the buttons
 */
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {Button, IconButton} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
/* eslint-disable @typescript-eslint/no-unused-vars */
type ButtonProps = any;

export function ProjectSubmit(props: ButtonProps) {
  return (
    <Button
      id={props.id}
      type={props.type ?? 'submit'}
      color={props.color ?? 'primary'}
      variant="contained"
      onClick={() => props.onButtonClick(props.id)}
      disableElevation
      disabled={props.isSubmitting}
    >
      {props.isSubmitting ? props.issubmittext ?? 'Working...' : props.text}
      {/* {props.isSubmitting && (
                              <CircularProgress
                                size={24}
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  marginTop: -12,
                                  marginLeft: -12,
                                }}
                              />
                            )} */}
    </Button>
  );
}

export function ProjectDelete(props: ButtonProps) {
  return (
    <Button
      id={props.id}
      type={props.type ?? 'submit'}
      color={props.color ?? 'primary'}
      variant="contained"
      onClick={() => props.onButtonClick(props.id)}
      disableElevation
      style={{backgroundColor: '#d32f2f'}}
    >
      {props.text}
    </Button>
  );
}

export function CusButton(props: ButtonProps) {
  return (
    <Button
      type={props.type}
      onClick={() => props.onButtonClick(props.id)}
      value={props.value}
      id={props.id}
    >
      {props.text}
    </Button>
  );
}

export function CloseButton(props: ButtonProps) {
  return (
    <IconButton
      edge="end"
      aria-label={props.text}
      onClick={() => props.onButtonClick(props.id)}
      value={props.value}
      id={props.id}
      size="large"
    >
      <CancelIcon fontSize="small" />
    </IconButton>
  );
}
export function UpButton(props: ButtonProps) {
  return (
    <IconButton
      edge="end"
      aria-label={props.text}
      onClick={() => props.onButtonClick(props.id)}
      value={props.value}
      id={props.id}
      size="small"
      style={{paddingLeft: 0}}
    >
      <ExpandLessIcon fontSize="small" />
    </IconButton>
  );
}
export function DownButton(props: ButtonProps) {
  return (
    <IconButton
      edge="end"
      aria-label={props.text}
      onClick={() => props.onButtonClick(props.id)}
      value={props.value}
      id={props.id}
      size="small"
      style={{paddingLeft: 0}}
    >
      <ExpandMoreIcon fontSize="small" />
    </IconButton>
  );
}
export function AddSectionButton(props: ButtonProps) {
  return (
    <IconButton
      edge="end"
      aria-label={props.text}
      onClick={() => props.onButtonClick(props.id)}
      value={props.value}
      id={props.id}
      size="large"
    >
      <AddCircleIcon fontSize="large" color="primary" />
    </IconButton>
  );
}
export function EditButton(props: ButtonProps) {
  return (
    <IconButton
      edge="end"
      aria-label={props.text}
      onClick={() => props.onButtonClick(props.id)}
      value={props.value}
      id={props.id}
      size="large"
    >
      <EditIcon fontSize="large" color="primary" />
    </IconButton>
  );
}
export function TickButton(props: ButtonProps) {
  return (
    <IconButton edge="end" type={props.type} id={props.id} size="large">
      <CheckCircleIcon fontSize="large" color="primary" />
    </IconButton>
  );
}

export function AddUserButton(props: ButtonProps) {
  return (
    <Button
      color="primary"
      startIcon={<AddCircleIcon />}
      variant="outlined"
      type={props.type}
      id={props.id}
      onClick={() => props.onButtonClick(props.value)}
      value={props.value}
    >
      ADD{' '}
    </Button>
  );
}

export function AddButton(props: ButtonProps) {
  return (
    <Button
      // variant="contained"
      color="primary"
      size="large"
      startIcon={<AddIcon />}
      type={props.type}
      onClick={() => props.onButtonClick(props.id)}
      value={props.value}
      id={props.id}
    >
      {props.text}
    </Button>
  );
}

export function DeleteuserButton(props: ButtonProps) {
  return (
    <IconButton
      id={props.id}
      edge="end"
      aria-label="delete"
      onClick={() => props.onButtonClick(props.value)}
      value={props.value}
      size="large"
    >
      <DeleteIcon />
    </IconButton>
  );
}

export function Addusersassign(props: ButtonProps) {
  return (
    <IconButton
      color="secondary"
      edge="start"
      aria-label="add"
      onClick={() => props.onButtonClick(props.value)}
      value={props.value}
      size="large"
    >
      <ArrowForwardIosOutlinedIcon fontSize="large" />
    </IconButton>
  );
}

import React from 'react';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import {TextField as FormikTextField} from 'formik-material-ui';
import {Select as FormikSelect} from 'formik-material-ui';
import {RadioGroup as FormikRadioGroup} from 'formik-material-ui';
// import {CheckboxWithLabel as FormikCheckboxWithLabel} from 'formik-material-ui';
import {Select as FAIMSSelect} from './fields/select';
import {Checkbox as FAIMSCheckbox} from './fields/checkbox';
import {RadioGroup as FAIMSRadioGroup} from './fields/radio';

const componentRegistry: {
  [namespace: string]: {[name: string]: React.Component};
} = {};

//export function NoSuchComponentNamespace(message: string) {
//    this.message = message;
//    this.name = 'NoSuchComponentNamespace';
//}
//
//export function NoSuchComponent(message: string) {
//    this.message = message;
//    this.name = 'NoSuchComponent';
//}

export function getComponentByName(namespace: string, componentName: string) {
  if (componentRegistry[namespace] === undefined) {
    throw new Error(`Unknown namespace ${namespace}`);
  }
  if (componentRegistry[namespace][componentName] === undefined) {
    throw new Error(`No component ${componentName} in namespace ${namespace}`);
  }
  return componentRegistry[namespace][componentName];
}

export function registerComponent(
  namespace: string,
  componentName: string,
  component: any
) {
  const n = getNameSpace(namespace);
  n[componentName] = component;
}

function getNameSpace(namespace: string) {
  if (componentRegistry[namespace] === undefined) {
    componentRegistry[namespace] = {};
  }
  return componentRegistry[namespace];
}

// This is temporary, need to work out how to best tie this in as a plugin
// system

registerComponent('core-material-ui', 'Input', Input);
registerComponent('core-material-ui', 'Checkbox', Checkbox);
registerComponent('core-material-ui', 'TextField', TextField);
registerComponent('formik-material-ui', 'TextField', FormikTextField);
registerComponent('formik-material-ui', 'Select', FormikSelect);
registerComponent('formik-material-ui', 'RadioGroup', FormikRadioGroup);
registerComponent('faims-custom', 'Select', FAIMSSelect);
registerComponent('faims-custom', 'Checkbox', FAIMSCheckbox);
registerComponent('faims-custom', 'RadioGroup', FAIMSRadioGroup);

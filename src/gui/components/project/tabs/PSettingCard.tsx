import React from 'react';
import { List,ListItem } from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import GroupIcon from '@material-ui/icons/Group';
import NoteIcon from '@material-ui/icons/Note';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor:'#e1e4e8',
    marginBottom:2,
    '&$selected': {
      backgroundColor: 'red',
      '&:hover': {
        backgroundColor: 'yellow',
      }
    },
    selected: {},
  },
  
}));

export default function PSettingCard(props:any){
	const  { handelonClick,key_id, ...other } = props;
	const classes = useStyles();

	return (
		<List component="nav" aria-label="settings bar" className={classes.root}>
		  <ListItem button onClick={() => handelonClick('settings',key_id)} key='list1'  >
		    <SettingsIcon />
		  </ListItem>
		  <ListItem button onClick={() => handelonClick('valid',key_id)} key='list2'>
		    <PlaylistAddCheckIcon />
		  </ListItem>
		  <ListItem button onClick={() => handelonClick('access',key_id)} key='list3' >
		    <GroupIcon />
		  </ListItem>
		  <ListItem button onClick={() => handelonClick('notes',key_id)} key='list4'>
		    <NoteIcon />
		  </ListItem>
		</List>
		);
}


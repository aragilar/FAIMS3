import React, {useEffect, useState} from 'react';
import {
  Avatar,
  Box,
  Card,
  Chip,
  CardActions,
  CardContent,
  CardHeader,
  // Button,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Link,
  Switch,
} from '@material-ui/core';
// import {EmailShareButton} from 'react-share';
// import MailOutlineIcon from '@material-ui/icons/MailOutline';
// import {Plugins} from '@capacitor/core';
// const {Share} = Plugins;
import {Link as RouterLink} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import {makeStyles} from '@material-ui/core/styles';
import {ProjectInformation} from '../../datamodel';
import ObservationsTable from './observationsTable';
import MetadataRenderer from './metadataRenderer';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {
  isSyncingProject,
  listenSyncingProject,
  setSyncingProject,
} from '../../sync';
import {FormControlLabel} from '@material-ui/core';

type ProjectCardProps = {
  project: ProjectInformation;
  showObservations: boolean;
  listView: boolean;
  dashboard: boolean;
};

const useStyles = makeStyles(theme => ({
  gridRoot: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  cardHeader: {
    alignItems: 'flex-start',
  },
  avatar: {
    borderRadius: 8,
    // backgroundColor: red[500],
    backgroundColor: theme.palette.primary.light,
  },
  overline: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 500,
  },
  status: {
    display: 'inline',
    // fontSize: '0.8rem',
  },
}));

export default function ProjectCard(props: ProjectCardProps) {
  const {project, showObservations, listView, dashboard} = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const project_url = ROUTES.PROJECT + project.project_id;
  const [isSyncing, setIsSyncing] = useState(
    isSyncingProject(project.project_id)
  );

  // const webShare = 'share' in navigator; // Detect whether webshare api is available in browser

  // const getShare = async () => {
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const shareRet = await Share.share({
  //     title: 'FAIMS Project: ' + project.name,
  //     text: 'Really awesome project you need to see right now',
  //     url: project_url,
  //     dialogTitle: 'Share ' + project.name,
  //   });
  // };

  useEffect(() => {
    if (typeof project !== 'undefined' && Object.keys(project).length > 0) {
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    return listenSyncingProject(project.project_id, setIsSyncing);
  }, [project.project_id]);

  return (
    <React.Fragment>
      {loading ? (
        <CircularProgress size={12} thickness={4} />
      ) : dashboard ? (
        <List style={{padding: 0}}>
          <ListItem
            button
            alignItems="flex-start"
            component={RouterLink}
            to={project_url}
          >
            <ListItemAvatar>
              <Avatar aria-label={project.name} className={classes.avatar}>
                {project.name.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={project.name}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.status}
                    color="textSecondary"
                  >
                    Last updated {project.last_updated}
                  </Typography>
                  <br />
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.status}
                    color="textPrimary"
                  >
                    {project.description}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      ) : (
        <Card>
          <CardHeader
            className={classes.cardHeader}
            avatar={
              <Avatar aria-label={project.name} className={classes.avatar}>
                {project.name.charAt(0)}
              </Avatar>
            }
            action={
              // TODO (For β) Liz: add more settings here
              <FormControlLabel
                control={
                  <Switch
                    checked={isSyncing}
                    onChange={(event, checked) =>
                      setSyncingProject(project.project_id, checked)
                    }
                  />
                }
                label="Sync"
              />
            }
            // action={
            //   <IconButton aria-label="settings">
            //     <MoreVertIcon />
            //   </IconButton>
            // }
            title={
              <React.Fragment>
                <b>{project.name}</b>&nbsp;
                {listView ? (
                  ''
                ) : (
                  <Typography
                    variant={'caption'}
                    style={{cursor: 'not-allowed'}}
                    color={'textSecondary'}
                  >
                    <i>edit title</i>
                  </Typography>
                )}
              </React.Fragment>
            }
            subheader={
              'Created:' +
              project.created +
              ', last updated: ' +
              project.last_updated
            }
          />
          <CardContent style={{paddingTop: 0}}>
            <Box mb={2}>
              <Chip
                size={'small'}
                label={'Active team members: 10'}
                style={{marginRight: '5px'}}
              />
              <Chip
                size={'small'}
                label={'Status: active'}
                style={{marginRight: '5px'}}
              />
              <MetadataRenderer
                project_id={project.project_id}
                metadata_key={'project_lead'}
                metadata_label={'Project Lead'}
              />{' '}
              <MetadataRenderer
                project_id={project.project_id}
                metadata_key={'lead_institution'}
                metadata_label={'Lead Institution'}
              />
            </Box>

            <Typography variant="body2" color="textPrimary" component="p">
              {project.description}&nbsp;
              {listView ? (
                ''
              ) : (
                <Typography
                  variant={'caption'}
                  style={{cursor: 'not-allowed'}}
                  color={'textSecondary'}
                >
                  <i>edit description</i>
                </Typography>
              )}
            </Typography>

            {showObservations ? (
              <Box mt={1}>
                <ObservationsTable
                  project_id={project.project_id}
                  restrictRows={10}
                  compact={listView}
                />
              </Box>
            ) : (
              ''
            )}
          </CardContent>
          {listView ? (
            <CardActions>
              <Box pl={1}>
                <Link
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                  component={RouterLink}
                  to={project_url}
                >
                  View Project
                  <ChevronRightIcon />
                </Link>
              </Box>
            </CardActions>
          ) : (
            ''
          )}
          {/*{listView ? (*/}
          {/*  ''*/}
          {/*) : (*/}
          {/*  <CardActions>*/}
          {/*    {webShare ? (*/}
          {/*      <Button size="small" color="primary" onClick={getShare}>*/}
          {/*        Share*/}
          {/*      </Button>*/}
          {/*    ) : (*/}
          {/*      <EmailShareButton*/}
          {/*        url={project_url}*/}
          {/*        subject={'FAIMS Project: ' + project.name}*/}
          {/*        body={"I'd like to share this FAIMS project with you "}*/}
          {/*        resetButtonStyle={false}*/}
          {/*        className={*/}
          {/*          'MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall'*/}
          {/*        }*/}
          {/*      >*/}
          {/*        <span className="MuiButton-label">*/}
          {/*          <span className="MuiButton-startIcon MuiButton-iconSizeSmall">*/}
          {/*            <MailOutlineIcon*/}
          {/*              className="MuiSvgIcon-root"*/}
          {/*              viewBox={'0 0 24 24'}*/}
          {/*            />*/}
          {/*          </span>*/}
          {/*          Share*/}
          {/*        </span>*/}
          {/*        <span className="MuiTouchRipple-root" />*/}
          {/*      </EmailShareButton>*/}
          {/*    )}*/}
          {/*  </CardActions>*/}
          {/*)}*/}
        </Card>
      )}
    </React.Fragment>
  );
}
ProjectCard.defaultProps = {
  showObservations: false,
  listView: false,
  dashboard: false,
};

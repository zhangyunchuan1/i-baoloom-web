import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

interface IProps {
  style?: any;
  title: string; //按钮文案
  loading: boolean;
  onClick: Function; //按钮点击事件
  size?: 'small' | 'medium' | 'large';
  color?: string;
  variant?: 'text' | 'outlined' | 'contained';
}

export default function SubmitButton(props: IProps) {
  
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        display: 'flex',
        alignItems: 'center',
      },
      wrapper: {
        position: 'relative',
        margin: "0px"
      },
      containedbtn: {
        backgroundColor: props.color || "#4caf50",
        color: "#fff",
        '&:hover': {
          backgroundColor: props.color || "#4caf50",
          boxShadow: "none"
        },
        boxShadow: "none"
      },
      outlinedBtn:{
        backgroundColor: "#fff",
        border: `1px solid ${props.color || "#4caf50"}`,
        color: props.color || "#4caf50",
        '&:hover': {
          border: `1px solid ${props.color || "#4caf50"}`,
          backgroundColor: "#fff",
        },
      },
      buttonProgress: {
        color: props.color || "#4caf50",
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
      },
    }),
  );
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Button
          style={props.style || {}}
          variant={props.variant || "contained"}
          className={!props.variant || props.variant == "contained" ? classes.containedbtn : classes.outlinedBtn}
          disabled={props.loading}
          disableRipple
          onClick={()=>{props.onClick()}}
        >
          {props.title}
        </Button>
        {props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    </div>
  );
}
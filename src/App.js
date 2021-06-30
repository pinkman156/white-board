import React from "react";
import { Typography, AppBar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import VideoPlayer from "./components/VideoPlayer";
import Notifications from "./components/Notifications";
import Options from "./components/Options";

const useStyles = makeStyles((theme) => ({
  appBar: {
    margin: "",
    display: "flex",
    fontFamily: "Times New Roman",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%  ",
    backgroundColor: "#662900",
    color: "white",
    fontWeight: "bold",
    padding: "10px",

    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
  },

  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
}));

export default function App() {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <AppBar className={classes.appBar} position="static">
        <Typography variant="h2" align="center">
          WhiteBoard
        </Typography>
      </AppBar>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options>
    </div>
  );
}

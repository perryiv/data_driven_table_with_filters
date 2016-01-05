
////////////////////////////////////////////////////////////////////////////////
//
//  Table module.
//
////////////////////////////////////////////////////////////////////////////////

import "./css/main.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";

// Needed by material-ui.
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();


////////////////////////////////////////////////////////////////////////////////
//
//  Main function.
//
//  Not sure why, but making this a self-executing anonymous function causes
//  an error in webpack-dev-server.
//
////////////////////////////////////////////////////////////////////////////////

function main()
{
  const app = document.createElement ( "div" );

  document.body.appendChild ( app );

  ReactDOM.render ( <App />, app );
}
main();

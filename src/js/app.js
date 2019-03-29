import React from "react";
import { render } from "react-dom";

//import Root from "./Root.js";
//import Root2 from "./RootSocket.js";
//import RootAuth from "./RootAuth.js";
import Chat from "./Chat.js";

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-perfect-scrollbar/dist/css/styles.css';


render(<Chat />, document.getElementById("app"));
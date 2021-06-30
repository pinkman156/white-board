import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io("https://video-chat-zoom.herokuapp.com/");
// const socket = io("http://localhost:5000/");

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  const [text, setText] = useState("Initial");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    socket.emit("send", { text: text, to: call.from });
  }, [text]);

  socket.on("canvas-data", function (data) {
    var interval = setInterval(function () {
      clearInterval(interval);
      var image = new Image();
      var canvas = document.querySelector("#board");
      var ctx = canvas.getContext("2d");
      image.onload = function () {
        ctx.drawImage(image, 0, 0);
      };
      image.src = data;
    }, 200);
  });

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
        drawOnCanvas();
      });

    socket.on("me", (id) => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });

      // console.log("texting");
    });

    socket.on("receive", (data) => {
      setText(data.text);
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    socket.on("receive", (data) => {
      setText(data.text);
      console.log(data.text);
      console.log({ me });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  // canvas.addEventListener("touchmove", function (e) {
  //   /* math to calculate params */
  //   socket.emit("draw", params);
  // });

  // socket.on("draw", function (params) {
  //   ctx.fillRect(params);
  // });

  function show() {
    var x = document.getElementById("sketch");
    var y = document.getElementById("btn");
    if (x.style.display == "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    console.log(y.textContent);
    if (x.style.display === "block") {
      y.textContent = "Hide WhiteBoard";
    } else {
      y.textContent = "Show WhiteBoard";
    }
  }

  function drawOnCanvas() {
    var canvas = document.querySelector("#board");
    var ctx = canvas.getContext("2d");
    var timeout;

    var sketch = document.querySelector("#sketch");
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue("width"));
    canvas.height = parseInt(sketch_style.getPropertyValue("height"));

    var mouse = { x: 0, y: 0 };
    var last_mouse = { x: 0, y: 0 };

    /* Mouse Capturing Work */
    canvas.addEventListener(
      "mousemove",
      function (e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
      },
      false
    );

    /* Drawing on Paint App */
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    canvas.addEventListener(
      "mousedown",
      function (e) {
        canvas.addEventListener("mousemove", onPaint, false);
      },
      false
    );

    canvas.addEventListener(
      "mouseup",
      function () {
        canvas.removeEventListener("mousemove", onPaint, false);
      },
      false
    );

    var root = document.documentElement;
    var onPaint = function () {
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();

      var base64ImageData = canvas.toDataURL("image/png");
      console.log(base64ImageData);
      socket.emit("canvas-data", base64ImageData);

      // if (timeout != undefined) clearTimeout(timeout);
      // timeout = setTimeout(function () {
      //   var base64ImageData = canvas.toDataURL("image/png");
      //   console.log();
      //   socket.emit("canvas-data", base64ImageData);
      // }, 1000);
    };
  }

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        show,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };

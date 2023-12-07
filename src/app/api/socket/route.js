import { Server } from "socket.io";

export async function GET() {
  if (!Response.socket.server.io) {
    console.log("Socket is initializing");
    const io = new Server(Response.socket.server);

    io.on("connection", (socket) => {
      console.log("Client connected");
      // You can set up your socket event listeners here
    });

    Response.socket.server.io = io;
  }

  Response.end("Socket initialized");
}

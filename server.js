const dgram = require("dgram");

const server = dgram.createSocket("udp4");
const clients = [];

server.on("error", (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on("connect", () => {
  console.log("Connected to Client");
});

server.on("message", (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  if (msg.toString() === "conn") {
    clients.push(rinfo);
    console.log("Total Clients::", clients.length);
    return;
  }

  if (msg.toString() === "exit\n") {
    clients.splice(
      clients.findIndex((client) => {
        return client.address === rinfo.address && client.port === rinfo.port;
      }),
      1
    );
    console.log("Total Clients::", clients.length);
    return;
  }

  clients
    .filter(
      (client) =>
        !(client.address === rinfo.address && client.port === rinfo.port)
    )
    .forEach((client) => {
      return server.send(msg, client.port, client.address);
    });
});

server.on("listening", () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234

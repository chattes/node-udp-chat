const dgram = require("dgram");
const { Buffer } = require("buffer");
const rl = require("readline");

const client = dgram.createSocket("udp4");
client.connect(41234, "localhost", (err) => {
  if (err) throw err;

  client.send(Buffer.from("conn"), 41234, "localhost");
  client.on("message", (msg, rinfo) => {
    console.log(rinfo);
    console.log(msg.toString());
  });
  rl.createInterface({
    input: process.stdin,
  });
  process.stdin.on("data", (chunk) => {
    client.send(chunk, (err) => {
      if (chunk.toString("utf-8") == "exit\n") {
        console.log("Close Client");
        client.close();
        process.exit(0);
      }
    });
  });
});

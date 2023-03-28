const WebSocket = require("ws");

const { ApiPromise, WsProvider } = require("@polkadot/api");
const { ContractPromise } = require("@polkadot/api-contract");

const metadata = require("./metadata.json");

async function connect() {
  // Connect to the local development network
  const provider = new WsProvider("wss://rpc.shibuya.astar.network");
  const api = await ApiPromise.create({ provider });

  const contract = new ContractPromise(
    api,
    metadata,
    "a1MvMiL1VPNKHc6pb8XNAw6fcwh85fc8V3wgocpmJjYK1Tm"
  );

  console.log(contract.address.toHuman());

  return contract;
}

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", async (socket) => {
  console.log("Connect");
  const contract = await connect();

  console.log("Client connected.");

  socket.on("message", (message) => {
    console.log(`Received message: ${message}`);
    socket.send(`Server received: ${message}`);
  });

  socket.on("close", () => {
    console.log("Client disconnected.");
  });
});

const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
const http = require("http"); //for socket.io to use when it can't use a websocket connection?
const { Server } = require("socket.io"); //for socket.io to use when it can use a websocket connection?
const cors = require("cors");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
const socketServer = http.createServer(app);
const io = new Server(socketServer, {
  cors: {
        //origin: "http://localhost:3000" //I uncommented this out for you :)
        origin: "http://127.0.0.1:3000"
  },
});
    
io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on("send_message", (data) => {
        console.log(data);
        socket.broadcast.emit("receive_message", data);
        socket.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
}
);

socketServer.listen(3002, () => {
  console.log("Socket server running on port 3002");
});


const server = new ApolloServer({
  typeDefs,
  resolvers,
  //context: ({ req }) => ({ req, socket }), //passing socket via context to resolvers
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
    await server.start();

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use(
        "/graphql",
        expressMiddleware(server, {
            context: authMiddleware,
        })
    );

    if (process.env.NODE_ENV === "production") {
        app.use(express.static(path.join(__dirname, "../client/dist")));

        app.get("*", (req, res) => {
            res.sendFile(path.join(__dirname, "../client/dist/index.html"));
        });
    }

    db.once("open", () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
        });
    });
};

// Call the async function to start the server
startApolloServer();

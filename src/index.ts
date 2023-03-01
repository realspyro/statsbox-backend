import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { GraphQLError } from "graphql";
import GraphQLJSON from "graphql-type-json";
import mongoose from "mongoose";
import { Post } from "./models/post.model";
import PostSchema from "./mongodb/post.js";

const app = express();
const httpServer = http.createServer(app);

const typeDefs = `#graphql

  scalar Any

  type QPost {
  author: String
  title:String
  data: [QPostContent]
  references: [String]
  thumbnail: QPostImage
}

  type QPostImage{
    url:String
    title:String
  }

  type QPostContent {
    type: String
    content: Any
  }

  type Query {
    getPosts:[QPost]
    getPost(title:String!):QPost
  }
  

  input MPost {
  author: String!
  title:String!
  data: [MPostContent!]!
  references: [String]
  thumbnail:MPostImage!
}

  input MPostImage{
    url:String!
    title:String!
  }

  input MPostContent {
    type: String!
    content: Any
  }

  type Mutation{
    makePost(post:MPost!):Any
  }



`;

const resolvers = {
  Any: GraphQLJSON,
  Query: {
    getPosts: async (p, args): Promise<Post[]> => {
      return await PostSchema.find({});
    },
    getPost: async (_, args: { title: string }): Promise<Post | Error> => {
      const { title } = args;

      const post = await PostSchema.findOne({ title });
      return post;
    },
  },
  Mutation: {
    makePost: async (_, args: { post: Post }): Promise<GraphQLError | void> => {
      let post = args.post;
      const newReferences = post.references.filter((e) => e != "");
      post.references = newReferences;
      try {
        const createdPost = new PostSchema(post);
        await createdPost.save();
      } catch (err) {
        return new GraphQLError("Bad Request try again!", {
          extensions: {
            code: "SOMETHING_BAD_HAPPENED",
            http: {
              status: 400,
            },
          },
        });
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://adem_labsi:6CD6j7w0bm3gqFbi@statsbox.a42xrk8.mongodb.net/statsbox?retryWrites=true&w=majority",
  async () => {
    console.log("Connected to Database");

    await server.start();

    app.use(
      "/",
      cors<cors.CorsRequest>({
        origin: ["https://statsproject.vercel.app"],
      }),
      bodyParser.json(),
      expressMiddleware(server)
    );
    const port = Number.parseInt(process.env.PORT) || 4000;

    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

    console.log(`🚀 Server ready`);
  }
);

const serverConfig = async () => {
  await PostSchema.deleteMany({});
};

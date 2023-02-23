import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import GraphQLJSON from "graphql-type-json";
import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import PostSchema from "./mongodb/post.js";
mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://adem_labsi:6CD6j7w0bm3gqFbi@statsbox.a42xrk8.mongodb.net/statsbox?retryWrites=true&w=majority",
  () => {
    console.log("connected to db");
  }
);

const typeDefs = `#graphql

  scalar Any

  type QPost {
  author: String
  title:String
  data: [QPostContent]
  references: [String]
}

  type QPostContent {
    type: String
    content: Any
  }

  type Query {
    getPost(title:String!):QPost
  }
  

  input MPost {
  author: String!
  title:String!
  data: [MPostContent!]!
  references: [String]
}

  input MPostContent {
    type: String!
    content: Any
  }

  type Mutation{
    makePost(post:MPost!):String
  }
`;

const resolvers = {
  Any: GraphQLJSON,
  Query: {
    getPost: async (_, args: { title: string }): Promise<Post> => {
      const { title } = args;

      const post = await PostSchema.findOne({ title });
      if (!post) throw Error("Not Found!");
      return post;
    },
  },
  Mutation: {
    makePost: (_, args: { post: Post }): string => {
      let post = args.post;
      const newReferences = post.references.filter((e) => e != "");
      post.references = newReferences;
      console.log(post);
      const createdPost = new PostSchema(post);
      createdPost.save();
      return "works like a charm";
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
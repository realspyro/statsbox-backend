import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import GraphQLJSON from "graphql-type-json";
import mongoose from "mongoose";
import { Post } from "./models/post.model";
import PostSchema from "./mongodb/post.js";

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
    makePost(post:MPost!):String
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
    makePost: (_, args: { post: Post }): string => {
      let post = args.post;
      const newReferences = post.references.filter((e) => e != "");
      post.references = newReferences;

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

mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://adem_labsi:6CD6j7w0bm3gqFbi@statsbox.a42xrk8.mongodb.net/statsbox?retryWrites=true&w=majority",
  () => {
    const port = Number.parseInt(process.env.PORT) || 4000;
    startStandaloneServer(server, {
      listen: { port },
    }).then(({ url }) => {
      console.log(`🚀  Server ready at: ${url}`);
      //serverConfig();
    });
  }
);

const serverConfig = async () => {
  await PostSchema.deleteMany({});
};

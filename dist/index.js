import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import GraphQLJSON from "graphql-type-json";
const typeDefs = `#graphql

  scalar Object


  type Query {
    test:String
    dodo:String
  }
  

  input MPost {
  author: String!
  title:String!
  data: [MPostContent!]!
  references: [String]
}

  input MPostContent {
    type: String!
    content: [Object]
  }

  type Mutation{
    makePost(post:MPost!):String
  }
`;
const resolvers = {
    Object: GraphQLJSON,
    Query: {},
    Mutation: {
        makePost: (_, args) => {
            console.log(args);
            return "hello";
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

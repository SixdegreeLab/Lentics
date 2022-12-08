const typeDefs = `#graphql
  type Profile {
    profileId: String
    creator: String
    to: String
    handle: String
    imageURI: String
    followModule: String
    followNFTURI: String
    timestamp: String
  }

  type Query {
    Profiles: [Profile]!
    Profile(id: ID!): Profile
  }
`

export default typeDefs;
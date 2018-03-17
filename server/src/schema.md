# Server

> This schema allows for the following operations

## Queries

* feed: Retrieves all links from the backend, note that this query also allows for filter, sorting and pagination arguments

## Mutations

* post: Allows authenticated users to create a new link
* signup: Create an account for a new user
* login: Login an existing user
* vote: Allows authenticated users to vote for an existing link

## Subscriptions

* newLink: Receive realtime updates when a new link is created
* newVote: Receive realtime updates when a vote was submitted

For example, you can send the the following feed query to retrieve the first 10 links from the server:

```graphql
{
  feed(skip: 0, first: 10) {
    links {
      description
      url
      postedBy {
        name
      }
    }
  }
}
```

Or the signup mutation to create a new user:

```graphql
mutation {
  signup(name: "Sarah", email: "sarah@graph.cool", password: "graphql") {
    token
    user {
      id
    }
  }
}
```

---
title: Groove API Reference

language_tabs:
  - shell

toc_footers:
  - <a href="support@groove.com"'>Become an API partner</a>

search: true
---

# Introduction

Welcome to the Groove API!

Hopefully, this documentation can help you get up and running as quickly as possible.

Feel free to reach out to <a href="support@groove.com">our support team</a> if you have any additional questions.

# Authentication

Right now, we support the ability for registered API partners to access our API on behalf of Groove users via an access token. If you are interested in becoming a registered API partner, please <a href="support@groove.com">contact us</a>.

## OAuth Flow

We use [the OAuth 2.0 protocol](https://tools.ietf.org/html/rfc6749) to generate access tokens.

### Step 1: Redirect Users

To initiate the authorization process, redirect users to `https://app.grooveapp.com/oauth/authorize`.

Provide the following query parameters

* `client_id`
* `redirect_uri` - URI to redirect any authorization data to at the end of the process
* `scope` - space-separated list of scopes (see relevant section below)
* `state` - String to be passed back upon completion

### Step 2: Handle User Authorization

If the user authorizes your application, Groove will redirect to the specified `redirect_uri`.

This redirection will contain a temporary `code` query parameter. These authorization `code`s may only be exchanged once, and will expire after 10 minutes.

This redirection will also contain the previously passed `state` value, as a query parameter. If this `state` value does not match, the request may be compromised and you should abort the authorization

### Step 3: Exchange the authorization code for an access token

Make a `POST` request to `https://app.grooveapp.com/oauth/authorize/token`

```shell
curl -X POST "https://app.grooveapp.com/oauth/authorize"
  -H 'Content-Type: application/json'
  -d '{ "client_id": "SomeClientId", "client_secret": "SomeClientSecret" }'
```

> The returned `JSON` will look something like

```json
{
  "access_token": "some-access-token",
  "created_at": "685238400",
  "token_type": "Bearer",
  "expires_in": 7200,
  "refresh_token": "some-refresh-token",
  "scope": "first-scope second-scope",
}
```

The request body should include the following values

* `grant_type=authorization_code`
* `code={PreviousAuthorizationCode}` - Use the previous `code` query parameter values
* `redirect_uri={PreviousRedirectURI}` - Must match the previously defined `redirect_uri`
* `client_id={YourClientId`
* `client_secret={YourClientSecret}`
* **Please avoid exposing your client secret**

The returned response body should contain a `JSON` payload with the following key/value pairs

  * `access_token` - the value represents the string to add to the `Authorization` header of future API requests
  * `created_at` - the value represents the Unix timestamp when the access token was created
  * `token_type` - the value will be `Bearer`
  * `expires_in` - the value indicates the number of seconds until the access token will be invalid
  * `refresh_token` - the value indicates the string to use to generate another access token
  * `scope` - a space-separated string indicating the scopes that the access token can use

* Use the generated `access_token` value to make API requests on behalf of the authorized user in the `Authorization` header with the header value having the following format - `Authorization: Bearer {YourAccessToken}`

## Access Token Expiration

An access token expires 12 minutes after creation. The expiration time is specified by the `expires_in` field in the token creation response body.

In order to generate a new access token, use the refresh token, specified by the `refresh_token` field in the token creation response body, to make a `POST` request to `/oauth/token/refresh` with the refresh token

```shell
curl -X POST "https://app.grooveapp.com/oauth/token/refresh"
  -H 'Content-Type: application/json'
  -d '{ "refresh_token": "SomeRefreshToken" }'
```

# API

Our GraphQL API only has one endpoint - `https://app.groove.com/api/public/v1/graphql`.

One of the benefits of GraphQL is that allows the client to specify _exactly_ what fields they would like as part of the response payload.

Another benefit of GraphQL is it's statically-generated schema that allows introspection into the various query and mutation operations available.

You can checkout our GraphQL documentation here.

Again, the GraphQL schema, and the above documentation, will specify the exact objects and their respective fields for queries and mutations. The following example API responses _are not_ an exhaustive representation.

## Queries

### Search for People

#### Parameters

Parameter | Description
--------- | -----------
Name | The name of the person to search for

#### Response

## Mutations

### Add a Person to a Flow

#### Parameters

Parameter | Description
--------- | -----------
personId | The ID of the Person to be added to the specified Flow
flowId | The ID of the Flow that the person will be added to

#### Response

> The above command returns JSON structured like this:

```json
{
  "id": 2,
  "name": "Max",
  "breed": "unknown",
  "fluffiness": 5,
  "cuteness": 10
}
```

## Errors

# Rate Limiting

We do not allow more than `100` API requests, per minute, per OAuth token.

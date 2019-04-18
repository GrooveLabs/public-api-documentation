---
title: Groove API Reference

language_tabs:
  - cURL

toc_footers:
  - <a href="mailto:support@groove.com"'>Become an API partner</a>

search: true
---

# Introduction

Welcome to the Groove API!

Hopefully, this documentation can help you get up and running as quickly as possible.

Feel free to reach out to <a href="mailto:support@groove.com">our support team</a> if you have any additional questions.

# Authentication

Right now, we support the ability for registered API partners to access our API on behalf of Groove users via an access token. If you are interested in becoming a registered API partner, please <a href="mailto:support@groove.com">contact us</a>.

## OAuth Flow

We use [the OAuth 2.0 protocol](https://tools.ietf.org/html/rfc6749) to generate access tokens.

### Step 1: Redirect Users

To initiate the authorization process, redirect users to `https://auth.grooveapp.com/oauth/authorize`.

Provide the following query parameters

| key           | value                                                                                        |
|---------------|----------------------------------------------------------------------------------------------|
| client_id     | the client ID configured for your OAuth App                                                  |
| redirect_uri  | the redirect URI configured for your OAuth App                                               |
| scope         | space-separated list of scopes (see relevant section below)                                  |
| state         | an optional string to be passed back upon completion                                         |

### Step 2: Handle User Authorization

If the user authorizes your application, Groove will redirect to the specified `redirect_uri`.

This redirection will contain a temporary `code` query parameter. These authorization `code`s may only be exchanged once, and will expire after 10 minutes.

This redirection will also contain the previously passed `state` value, as a query parameter. If this `state` value does not match, the request may be compromised and you should abort the authorization

### Step 3: Exchange the authorization code for an access token

Make a `POST` request to `https://auth.grooveapp.com/oauth/authorize/token`

```shell
curl -X POST "https://auth.grooveapp.com/oauth/authorize"
  -H 'Content-Type: application/json'
  -d '{
    "grant_type": "authorization_code",
    "code": "SomeAuthorizationCode",
    "redirect_url": "SomeRedirectUri",
    "client_id": "SomeClientId",
    "client_secret": "SomeClientSecret"
  }'
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

The request body should include the following values:

| key           | value                                                                                        |
|---------------|----------------------------------------------------------------------------------------------|
| grant_type    | `authorization_code`                                                                         |
| code          | the code you were provided in the previous step                                              |
| redirect_uri  | the redirect URI configured for your OAuth App                                               |
| client_id     | the client ID configured for your OAuth App                                                  |
| client_secret | the client secret configured for your OAuth App                                              |

**Note: Please avoid exposing your client secret**

The returned response body should contain a `JSON` payload with the following key/value pairs

| key           | value                                                                                        |
|---------------|----------------------------------------------------------------------------------------------|
| access_token  | the value represents the string to add to the `Authorization`  header of future API requests |
| created_at    | the value represents the Unix timestamp when the access token was created                    |
| token_type    | the value will be `Bearer`                                                                   |
| expires_in    | the value indicates the number of seconds until the access token will be invalid             |
| refresh_token | the value indicates the string to use to generate another access token                       |
| scope         | a space-separated string indicating the scopes that the access token can use                 |

## Making Authenticated API Calls

Use the generated `access_token` value to make API requests on behalf of the authorized user in the `Authorization` header with the header value having the following format: `Authorization: Bearer {YOUR_ACCESS_TOKEN}`

> An authenticated CURL may look like:

```
curl -X POST "https://app.grooveapp.com/api/public/..."
  -H 'Content-Type: application/json'
  -H 'Authorization: Bearer {YOUR_ACCESS_TOKEN}'
  -d ...
```


## Access Token Expiration

An access token expires 2 hours after creation. The expiration time is specified by the `expires_in` field in the token creation response body.

In order to generate a new access token, use the refresh token, specified by the `refresh_token` field in the token creation response body, to make a `POST` request to `/oauth/token` with the refresh token.


| key           | value                                                                                        |
|---------------|----------------------------------------------------------------------------------------------|
| grant_type    | `refresh_token`                                                                         |
| refresh_token | YOUR_REFRESH_TOKEN
| redirect_uri  | the redirect URI configured for your OAuth App                                               |
| client_id     | the client ID configured for your OAuth App                                                  |
| client_secret | the client secret configured for your OAuth App                                              |

```shell
curl -X POST "https://auth.grooveapp.com/oauth/token"
  -H 'Content-Type: application/json'
  -d '{
    "grant_type": "refresh_token",
    "refresh_token": "SomeRefreshToken",
    "redirect_url": "SomeRedirectUri",
    "client_id": "SomeClientId",
    "client_secret": "SomeClientSecret"
  }'
```

# Rate Limiting

In general, we do not allow more than `100` API requests, per minute, per OAuth token. For every request made, these response headers will be returned:

Header | Description
--------- | -----------
`X-RateLimit-Limit` | The maximum number of API calls able to be made in the current minute
`X-RateLimit-Remaining` | The number of API calls left in the current minute
`X-RateLimit-Reset` | The time (in epoch seconds) at which API calls are guaranteed to be available again

We perform a sliding window calculation across the current and last minutes to prevent call bursts around the minute boundary. If a limit is hit, the reset value is calculated to be the moment in time when the sliding average dips below the limit.

Exceeding the limit will yield an empty response with status code `429`.

**Note: We continue to count any API calls made while the limit is exceeded.**


# API

Our GraphQL API only has one endpoint - `https://app.grooveapp.com/api/public/v1/graphql`.

One of the benefits of GraphQL is that allows the client to specify _exactly_ what fields they would like as part of the response payload.

Another benefit of GraphQL is it's statically-generated schema that allows introspection into the various query and mutation operations available.

You can checkout our GraphQL documentation here.

Again, the GraphQL schema, and the above documentation, will specify the exact objects and their respective fields for queries and mutations. The following example API responses _are not_ an exhaustive representation.

## Query
The query root of this schema

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>findPersonBySalesforceId</strong></td>
<td valign="top"><a href="#person">Person</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">salesforceId</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Represents the corresponding Contact or Lead's id in Salesforce

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>flow</strong></td>
<td valign="top"><a href="#flow">Flow</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#id">ID</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>flows</strong></td>
<td valign="top">[<a href="#flow">Flow</a>!]</td>
<td></td>
</tr>
</tbody>
</table>

## Mutation
The mutation root of this schema

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>addPersonToFlow</strong></td>
<td valign="top"><a href="#addpersontoflowpayload">AddPersonToFlowPayload</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">input</td>
<td valign="top"><a href="#addpersontoflowinput">AddPersonToFlowInput</a>!</td>
<td></td>
</tr>
</tbody>
</table>

## Objects

### AddPersonToFlowPayload

Autogenerated return type of AddPersonToFlow

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>personFlow</strong></td>
<td valign="top"><a href="#personflow">PersonFlow</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### Flow

A Flow object

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>autoImportAssignOwner</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>autoImportId</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>finalized</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#id">ID</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>isMasterFlow</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>labelInstances</strong></td>
<td valign="top"><a href="#labelinstanceconnection">LabelInstanceConnection</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="#string">String</a></td>
<td>

Returns the elements in the list that come after the specified cursor.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">before</td>
<td valign="top"><a href="#string">String</a></td>
<td>

Returns the elements in the list that come before the specified cursor.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

Returns the first _n_ elements from the list.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">last</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

Returns the last _n_ elements from the list.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>removePersonAfterBounce</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>removePersonAfterReply</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sfdcCampaignId</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>steps</strong></td>
<td valign="top"><a href="#stepconnection">StepConnection</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="#string">String</a></td>
<td>

Returns the elements in the list that come after the specified cursor.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">before</td>
<td valign="top"><a href="#string">String</a></td>
<td>

Returns the elements in the list that come before the specified cursor.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

Returns the first _n_ elements from the list.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">last</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

Returns the last _n_ elements from the list.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>userId</strong></td>
<td valign="top"><a href="#id">ID</a></td>
<td></td>
</tr>
</tbody>
</table>

### LabelInstance

An instance of a Label being applied to an object

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#id">ID</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### LabelInstanceConnection

The connection type for LabelInstance.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>edges</strong></td>
<td valign="top">[<a href="#labelinstanceedge">LabelInstanceEdge</a>]</td>
<td>

A list of edges.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nodes</strong></td>
<td valign="top">[<a href="#labelinstance">LabelInstance</a>]</td>
<td>

A list of nodes.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pageInfo</strong></td>
<td valign="top"><a href="#pageinfo">PageInfo</a>!</td>
<td>

Information to aid in pagination.

</td>
</tr>
</tbody>
</table>

### LabelInstanceEdge

An edge in a connection.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>cursor</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

A cursor for use in pagination.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#labelinstance">LabelInstance</a></td>
<td>

The item at the end of the edge.

</td>
</tr>
</tbody>
</table>

### PageInfo

Information about pagination in a connection.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>endCursor</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

When paginating forwards, the cursor to continue.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hasNextPage</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td>

When paginating forwards, are there more items?

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hasPreviousPage</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td>

When paginating backwards, are there more items?

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>startCursor</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

When paginating backwards, the cursor to continue.

</td>
</tr>
</tbody>
</table>

### Person

A Person object

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>emailAddress</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#id">ID</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### PersonFlow

A Person in a Flow

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>createdAt</strong></td>
<td valign="top"><a href="#iso8601datetime">ISO8601DateTime</a>!</td>
<td>

Identifies the date and time when the Person was added to the Flow

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>flow</strong></td>
<td valign="top"><a href="#flow">Flow</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>person</strong></td>
<td valign="top"><a href="#person">Person</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### Step

A Step object in a Flow

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>dayNumber</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#id">ID</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### StepConnection

The connection type for Step.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>edges</strong></td>
<td valign="top">[<a href="#stepedge">StepEdge</a>]</td>
<td>

A list of edges.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nodes</strong></td>
<td valign="top">[<a href="#step">Step</a>]</td>
<td>

A list of nodes.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pageInfo</strong></td>
<td valign="top"><a href="#pageinfo">PageInfo</a>!</td>
<td>

Information to aid in pagination.

</td>
</tr>
</tbody>
</table>

### StepEdge

An edge in a connection.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>cursor</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

A cursor for use in pagination.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#step">Step</a></td>
<td>

The item at the end of the edge.

</td>
</tr>
</tbody>
</table>

## Inputs

### AddPersonToFlowInput

Attributes for adding a Person to a Flow

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>flowId</strong></td>
<td valign="top"><a href="#id">ID</a>!</td>
<td>

ID for Flow

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>personId</strong></td>
<td valign="top"><a href="#id">ID</a>!</td>
<td>

ID for Person

</td>
</tr>
</tbody>
</table>

## Scalars

### Boolean

The `Boolean` scalar type represents `true` or `false`.

### ID

The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.

### ISO8601DateTime

An ISO 8601-encoded datetime

### Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.

### String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

## Errors


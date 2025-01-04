# MSW Memory Issue Reproduction

This repo attempts to create a super minimal reproduction of a memory leak that
seemsm to occur when using MSW in an `express` server that makes outbound HTTP
requests.

## How to run

```bash
$ npm install
$ ./demo.sh
```

## What it does

The repro process consists of running the same set of steps twice, once with MSW enabled, and one with MSW disabled.

> [!NOTE]
> The MSW setup does NOT install any handlers. It simply calls `setupServer().listen({ onUnhandledRequest: 'bypass' })`

The steps of the process are:

1. Starting `api.ts` which represents an external API that the `express` server
   will make outbound requests to. This currently is a minimal `express` app
   itself that does nothing but respond `200` to everything.

2. Starting `server.ts` which represents our application `epxress` server. This server exposes two endpoints:
    - `GET /`: This simply performs an `http.get` request to `localhost:8080` (the server started by `api.ts`)
    - `POST /snapshot?name=`: This is a helper route to perform garbage collection and then write out a `v8` heapsnapshot for analysis.

3. Generating an initial `before` snapshot
4. Running `ab` to load test `server.ts` with 5,000 requests
5. Generating another `after` snapshot

## Output

When complete, you should have 4 `*.heapsnapshot` files. For example, on my machine (16" MacBook Pro / M2 Max / 64GB), I get these as output using `node@22.12.0`:

```bash
$ ls -l *.heapsnapshot
.rw-------  15M bryanross  3 Jan 18:50 with-msw-1-before.heapsnapshot
.rw------- 231M bryanross  3 Jan 18:50 with-msw-2-after.heapsnapshot
.rw-------  15M bryanross  3 Jan 18:50 without-msw-1-before.heapsnapshot
.rw-------  16M bryanross  3 Jan 18:50 without-msw-2-after.heapsnapshot
```
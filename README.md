<p align="center">
    <br/>
    <a align="center" href="https://github.com/faridkarami/nestjs-basic-auth" target="_blank">
        <img width="96px" src="https://raw.githubusercontent.com/faridkarami/nestjs-basic-auth/main/docs/img/logo.png" />
    </a>
</p>
<h3 align="center">NestJS Basic Auth</h3>
<p align="center">HTTP basic auth middleware for NestJS.</p>

<p align="center">
    <a href="https://badge.fury.io/js/nestjs-basic-auth">
        <img src="https://badge.fury.io/js/nestjs-basic-auth.svg" />
    </a>
    <a href="https://npmtrends.com/nestjs-basic-auth">
        <img src="https://img.shields.io/npm/dm/nestjs-basic-auth" />
    </a>
    <a>
        <img src="https://img.shields.io/badge/typescript-compatible-brightgreen.svg">
    </a>
</p>

# Overview

By using this package, you can place a basic auth on any address in the NestJS framework to prevent unauthorized access.

For example, you can set a username and password to the Swagger document.

## Getting Started

```shell
npm install nestjs-basic-auth
```

or

```shell
yarn add nestjs-basic-auth
```

## Example

The module exports a function that, when called with an options object, returns the middleware.

```js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { basicAuth } from 'nestjs-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    ['docs'],
    basicAuth({
      challenge: true,
      users: { admin: 'password' },
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

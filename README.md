ember-cli-dependency-injection-utils
====================================

A utility library for more concise dependency injection through Ember initializers.

## Installation

```shell
# ember-cli > 0.2.3
ember install ember-cli-dependency-injection-utils
# ember-cli <= 0.2.3
ember install:addon ember-cli-dependency-injection-utils
```

## Usage

Below is a sample initializer file/pattern you might create. For additional info, please [check out the source](addon/injex.js).

**Simple example**

```js
// app/initializers/dependency-injection.js
import { injectThroughout, injectDeps } from 'ember-cli-dependency-injection-utils';

export function initialize(application) {
  // Inject factory dependencies onto a specific container
  injectDeps(application, 'route', [
    { property: 'api', injectionName: 'service:some-api-client' },
    { property: 'foo', injectionName: 'service:foo-service-you-want-on-every-route' }
  ]);

  // Inject a service to in common Ember places: route, controller, view, component
  injectThroughout(application, 'service:some-ga-analytics-you-need-everywhere');
}

export default { name: 'dependency-injection', initialize };
```

**DRY, real world usage example**

```js
// app/initializers/dependency-injection.js
import { injectThroughout, injectDeps } from 'ember-cli-dependency-injection-utils';

export function initialize(application) {
  // Register anything you need
  application.register('config:environment', environment, { singleton: false, instantiate: false });

  // Service definitions
  const environment = { property: 'environment', injectionName: 'config:environment' };
  const routing = { property: 'routing', injectionName: 'service:-routing' };
  const site = { property: 'site', injectionName: 'service:site' };
  const session = { property: 'session', injectionName: 'service:session' };
  const api = { property: 'api', injectionName: 'service:some-api-client' };

  // Inject factory dependencies, using service definitions
  injectDeps(application, 'service:site', [environment]);
  injectDeps(application, 'service:some-api-client', [routing, site, session]);
  injectDeps(application, 'route', [api]);

  // Inject these services in common Ember places
  injectThroughout(application, 'service:site');
  injectThroughout(application, 'service:session');
  injectThroughout(application, 'service:some-ga-analytics');
  injectThroughout(application, 'service:any-service-you-need-everywhere');
}

export default { name: 'dependency-injection', initialize };
```

## TODO

- Formally document the methods in this `README`.
- Write tests!
- Properly import lodash

## Contributors

- [@AO16](https://github.com/AO16): Original implementation

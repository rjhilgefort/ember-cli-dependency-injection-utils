const { _ } = window;
// import _ from 'lodash/lodash'
import Ember from 'ember';
const { Logger } = Ember;

/**
 * Inject service into common factories.
 *
 * @name injectThroughout
 * @param {Object} application - The ember application instance.
 * @param {string} [property] - Desired name of injected dep.
 * @param {string} injectionName - Service name.
 * @returns {Logger} Returns a logger call.
 */
export const injectThroughout = (application, property, injectionName) => {
  // Shift args is `injectionName` is missing
  if (_.isNil(injectionName)) {
    injectionName = property;
    property = null;
  }

  // Form property if absent
  if (_.isNil(property)) {
    let rest;
    ([, property, ...rest] = _.split(injectionName, ':'));
    if (!_.isEmpty(rest)) Logger.error('`injectionName` had more than one ":", ignoring');
    property = _.camelCase(property);
  }

  // Param checking
  if (!_.isFunction(application, 'inject')) return Logger.error('Expecting `application` to have `inject`.');
  if (!_.isString(property) || _.includes(property, '-')) return Logger.error('Expecting `property` to be valid.');
  if (!_.isString(injectionName)) return Logger.error('Expecting `injectionName` to be a `String`.');

  // Do the injection
  let factories = ['route', 'controller', 'view', 'component'];
  _.forEach(factories, (factoryNameOrType) => application.inject(factoryNameOrType, property, injectionName));
};


/**
 * Inject dependencies onto a factory.
 *
 * @name injectDeps
 * @param {Object} application - The ember application instance.
 * @param {string} factoryNameOrType - Factory or type to inject onto.
 * @param {Array} deps - Deps array.
 *   {Object} dep - A dependency definition
 *     {string} property - The namespace to inject the dependency onto.
 *     {string} injectionName - The dependency to inject.
 * @returns {Logger} Returns a logger call.
 */
export const injectDeps = (application, factoryNameOrType, deps) => {
  // Param checking
  if (!_.isFunction(application, 'inject')) return Logger.error('Expecting `application` to have `inject`.');
  if (!_.isString(factoryNameOrType)) return Logger.error('Expecting `factoryNameOrType` to be a `String`.');
  if (!_.isArray(deps)) return Logger.error('Expecting `deps` to be an `Array`.');

  // TODO: Check to see if dep is already injected onto dep (or parent of dep) (which would cause and infinite loop)

  // TODO: Could do more error checking here (make sure each dep is constructed correctly).
  //       I opted to just let Ember complain if it's not formed well
  _.forEach(deps, ({ property, injectionName }) => {
    application.inject(factoryNameOrType, property, injectionName);
  });
};

import { Routes } from './compileRoutes';

export const JALAN = Symbol();

export function isEnhanced(history) {
  return typeof history.getLocation === 'function';
}

export function isCompiled(routes) {
  return routes instanceof Routes;
}

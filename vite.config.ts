import { SharedConfig } from 'vite';
import path from 'path';

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr);
};

const sharedConfig: SharedConfig = {
  alias: {
    '/@/': pathResolve('./src'),
  },
};

module.exports = {
  ...sharedConfig,
  transforms: [require('vite-transform-globby-import')(sharedConfig)],
};

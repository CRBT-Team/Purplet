import path from 'path';

const { FormData } = await import(path.resolve(require.resolve('formdata-node'), '../index.js'));
const data = new FormData();

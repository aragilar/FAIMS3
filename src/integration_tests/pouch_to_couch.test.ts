import {
  DIRECTORY_PROTOCOL,
  DIRECTORY_HOST,
  DIRECTORY_PORT,
} from '../buildconfig';
import {
  initialize,
  projects_dbs,
  people_dbs,
  data_dbs,
  metadata_dbs,
  directory_db,
} from '../sync';

const COUCHDB_USER = String(process.env.COUCHDB_USER);
const COUCHDB_PASSWORD = String(process.env.COUCHDB_PASSWORD);

jest.setTimeout(1000 * 10);

test('talk to couch', async () => {
  const url =
    encodeURIComponent(DIRECTORY_PROTOCOL) +
    '://' +
    encodeURIComponent(DIRECTORY_HOST) +
    ':' +
    encodeURIComponent(DIRECTORY_PORT);
  const response = await fetch(url);
  expect(response.ok).toBe(true);
});

test('send to couch', async () => {
  const base_url =
    encodeURIComponent(DIRECTORY_PROTOCOL) +
    '://' +
    encodeURIComponent(COUCHDB_USER) +
    ':' +
    encodeURIComponent(COUCHDB_PASSWORD) +
    '@' +
    encodeURIComponent(DIRECTORY_HOST) +
    ':' +
    encodeURIComponent(DIRECTORY_PORT);
  const data = {
    test: 'test',
  };
  let response = await fetch(base_url + '/test_db', {
    method: 'PUT',
  });
  expect(response.ok).toBe(true);
  response = await fetch(base_url + '/test_db', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  expect(response.ok).toBe(true);
  response = await fetch(base_url + '/test_db', {
    method: 'DELETE',
  });
  expect(response.ok).toBe(true);
});

test('run initialization', async () => {
  expect(projects_dbs).toStrictEqual({});
  expect(people_dbs).toStrictEqual({});
  expect(metadata_dbs).toStrictEqual({});
  expect(data_dbs).toStrictEqual({});
  await initialize();
  const docs = await directory_db.local.allDocs();
  console.error('directory', docs);
  console.error('projects_dbs', projects_dbs);
  console.error('people_dbs', people_dbs);
  console.error('metadata_dbs', metadata_dbs);
  console.error('data_dbs', data_dbs);
  expect(projects_dbs).not.toStrictEqual({});
  expect(people_dbs).not.toStrictEqual({});
  //expect(metadata_dbs).not.toStrictEqual({});
  //expect(data_dbs).not.toStrictEqual({});
  done();
});

/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();
const contentfulManagement = require('contentful-management');

module.exports = async function getEnvironment() {
  const managementAccessToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master';

  if (!managementAccessToken) {
    throw new Error('Missing CONTENTFUL_MANAGEMENT_TOKEN');
  }
  if (!spaceId) {
    throw new Error('Missing CONTENTFUL_SPACE_ID');
  }

  const client = contentfulManagement.createClient({ accessToken: managementAccessToken });
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);
  return environment;
};

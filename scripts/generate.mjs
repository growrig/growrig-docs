import { generateDeviceDocs } from './generate-device-docs.mjs';
import { syncProjectDocs } from './sync-project-docs.mjs';

const project = await syncProjectDocs();
const devices = await generateDeviceDocs();

console.log(`Synced ${project.count} project documents from ${project.sourceRoot}`);
console.log(`Generated ${devices.count} device pages across ${devices.categories} categories from ${devices.devicesRoot}`);

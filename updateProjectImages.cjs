const sdk = require('node-appwrite');

const client = new sdk.Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1') // Your Appwrite endpoint
    .setProject('gurudeep-db') // Your project ID
    .setKey('standard_a935fea0ddc1e0b6cd5c5a83353aadb168afa51c5592ff1243af5c616c17fa107cdde4836b6dc68b5601f8e280bbf99e544f09eab0861fa4bfeefd81f5cbb350759aa8faaeb641286ac37336515c59d201f128723a98fe5018b815e0dce29a93ffa72dcdcc0000c656bbfbf5d2a357c6f23ab1db3d0872fb09ec9bd134b21f0c'); // Your API key with database and storage permissions

const database = new sdk.Databases(client);
const databaseId = 'projects_collection'; // Your database ID
const collectionId = 'projects'; // Your collection ID
const bucketId = 'portfolio_bucket'; // Your bucket ID

async function updateProjectImages() {
    console.log('About to fetch documents with databaseId:', databaseId, 'and collectionId:', collectionId);
    console.log('Fetching projects from Appwrite...');
    let projects;
    try {
        projects = await database.listDocuments(databaseId, collectionId);
        console.log(`Fetched ${projects.documents.length} projects.`);
    } catch (err) {
        console.error('❌ Error fetching projects from Appwrite:', err.message || err);
        return;
    }

    for (const project of projects.documents) {
        console.log('---');
        console.log(`Project ID: ${project.$id}`);
        console.log(`Old image URL: ${project.image}`);
        const fileId = extractFileId(project.image);
        console.log(`Extracted fileId: ${fileId}`);

        // If the image URL contains /preview, replace it with /view
        if (typeof project.image === 'string' && project.image.includes('/preview')) {
            const newImageUrl = project.image.replace('/preview', '/view');
            console.log(`Migrating /preview to /view: ${newImageUrl}`);
            try {
                await database.updateDocument(databaseId, collectionId, project.$id, {
                    image: newImageUrl,
                });
                console.log(`✅ Updated project ${project.$id} image URL from /preview to /view.`);
            } catch (err) {
                console.error(`❌ Error updating project ${project.$id}:`, err.message || err);
            }
            continue;
        }

        if (fileId && fileId !== 'fileId') {
            const newImageUrl = `https://sgp.cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=gurudeep-db`;
            console.log(`New image URL: ${newImageUrl}`);
            try {
                await database.updateDocument(databaseId, collectionId, project.$id, {
                    image: newImageUrl,
                });
                console.log(`✅ Updated project ${project.$id} with new image URL.`);
            } catch (err) {
                console.error(`❌ Error updating project ${project.$id}:`, err.message || err);
            }
        } else {
            console.log(`❌ Skipped project ${project.$id} - fileId could not be extracted or is a placeholder.`);
        }
    }
    console.log('---\nAll projects processed.');
}

function extractFileId(imageUrl) {
    // Try to extract fileId from the old URL
    const match = imageUrl.match(/files\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
}

updateProjectImages().catch(console.error);
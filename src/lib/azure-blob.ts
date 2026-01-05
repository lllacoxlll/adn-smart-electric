import { BlobSASPermissions, BlobServiceClient, BlockBlobClient, generateBlobSASQueryParameters, SASProtocol } from '@azure/storage-blob'
import { getContainer } from './azure-container'
import { authenticateToAzureStorage } from './azure-auth'

export async function uploadToBlob(blobType: string, blobName: string, buffer: ArrayBuffer) {
  try {
    const containerClient = await getContainer(blobType)

    const blockBlobClient: BlockBlobClient = await containerClient.getBlockBlobClient(blobName)

    await blockBlobClient.uploadData(buffer)

    return blockBlobClient.url
  } catch (err) {
    if (err instanceof Error) {
      throw err
    }
    throw new Error('Unknown error uploading to blob')
  }
}

export async function createSAS(containerName: string, blobName: string) {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME

  const TEN_MINUTES = 10 * 60 * 1000
  const NOW = new Date()

  const TEN_MINUTES_BEFORE_NOW = new Date(NOW.valueOf() - TEN_MINUTES)
  const TEN_MINUTES_AFTER_NOW = new Date(NOW.valueOf() + TEN_MINUTES)

  const blobServiceClient: BlobServiceClient = await authenticateToAzureStorage()

  const userDelegationKey = await blobServiceClient.getUserDelegationKey(TEN_MINUTES_BEFORE_NOW, TEN_MINUTES_AFTER_NOW)

  const blobPermissionsForAnonymousUser = 'r'

  const sasOptions = {
    blobName,
    containerName,
    permissions: BlobSASPermissions.parse(blobPermissionsForAnonymousUser),
    protocol: SASProtocol.HttpsAndHttp,
    startsOn: TEN_MINUTES_BEFORE_NOW,
    expiresOn: TEN_MINUTES_AFTER_NOW,
  }

  const sasToken = generateBlobSASQueryParameters(sasOptions, userDelegationKey, accountName!).toString()

  return sasToken
}
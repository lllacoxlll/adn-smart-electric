import { DefaultAzureCredential } from '@azure/identity'
import { BlobServiceClient } from '@azure/storage-blob'

export async function authenticateToAzureStorage() {
  try {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME as string

    if (!accountName) throw Error('Azure Storage accountName not found')

    const blobServiceClient: BlobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, new DefaultAzureCredential())

    return blobServiceClient
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message)
    }
    throw err
  }
}

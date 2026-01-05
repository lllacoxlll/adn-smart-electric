import { BlobServiceClient, ContainerClient, ContainerCreateResponse } from '@azure/storage-blob'
import { authenticateToAzureStorage } from './azure-auth'

export async function getContainer(containerName: string): Promise<ContainerClient> {
  try {
    const blobServiceClient: BlobServiceClient = await authenticateToAzureStorage()

    const containerClient = blobServiceClient.getContainerClient(containerName)

    if (await containerClient.exists()) {
      return containerClient
    }
    else {
      const {
        containerClient,
        containerCreateResponse,
      }: {
        containerClient: ContainerClient
        containerCreateResponse: ContainerCreateResponse
      } = await blobServiceClient.createContainer(containerName)

      if (containerCreateResponse.errorCode) throw Error(containerCreateResponse.errorCode)

      return containerClient
    }

  } catch (err) {
    if (err instanceof Error) {
      throw err
    }
    throw new Error('Unknown error creating container')
  }
}

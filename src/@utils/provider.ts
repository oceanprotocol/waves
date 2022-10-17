import {
  ComputeAlgorithm,
  ComputeAsset,
  ComputeEnvironment,
  downloadFileBrowser,
  FileInfo,
  LoggerInstance,
  ProviderComputeInitializeResults,
  ProviderInstance
} from '@oceanprotocol/lib'
import Web3 from 'web3'
import { getValidUntilTime } from './compute'

export async function initializeProviderForCompute(
  dataset: AssetExtended,
  algorithm: AssetExtended,
  accountId: string,
  computeEnv: ComputeEnvironment = null
): Promise<ProviderComputeInitializeResults> {
  const computeAsset: ComputeAsset = {
    documentId: dataset.id,
    serviceId: dataset.services[0].id,
    transferTxId: dataset.accessDetails.validOrderTx
  }
  const computeAlgo: ComputeAlgorithm = {
    documentId: algorithm.id,
    serviceId: algorithm.services[0].id,
    transferTxId: algorithm.accessDetails.validOrderTx
  }

  const validUntil = getValidUntilTime(
    computeEnv?.maxJobDuration,
    dataset.services[0].timeout,
    algorithm.services[0].timeout
  )

  try {
    return await ProviderInstance.initializeCompute(
      [computeAsset],
      computeAlgo,
      computeEnv?.id,
      validUntil,
      dataset.services[0].serviceEndpoint,
      accountId
    )
  } catch (error) {
    LoggerInstance.error(`Error initializing provider for the compute job!`)
    return null
  }
}

// TODO: Why do we have these one line functions ?!?!?!
export async function getEncryptedFiles(
  files: any,
  providerUrl: string
): Promise<string> {
  try {
    // https://github.com/oceanprotocol/provider/blob/v4main/API.md#encrypt-endpoint
    const response = await ProviderInstance.encrypt(files, providerUrl)
    return response
  } catch (error) {
    console.error('Error parsing json: ' + error.message)
  }
}

export async function getFileDidInfo(
  did: string,
  serviceId: string,
  providerUrl: string,
  withChecksum = false
): Promise<FileInfo[]> {
  try {
    const response = await ProviderInstance.checkDidFiles(
      did,
      serviceId,
      providerUrl,
      withChecksum
    )
    return response
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}

export async function getFileUrlInfo(
  url: string,
  providerUrl: string
): Promise<FileInfo[]> {
  try {
    const response = await ProviderInstance.checkFileUrl(url, providerUrl)
    return response
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}

export async function downloadFile(
  web3: Web3,
  asset: AssetExtended,
  accountId: string,
  validOrderTx?: string
) {
  const downloadUrl = await ProviderInstance.getDownloadUrl(
    asset.id,
    accountId,
    asset.services[0].id,
    0,
    validOrderTx || asset.accessDetails.validOrderTx,
    asset.services[0].serviceEndpoint,
    web3
  )
  await downloadFileBrowser(downloadUrl)
}

export async function getFileUrl(
  web3: Web3,
  asset: AssetExtended,
  accountId: string,
  validOrderTx?: string
) {
  // const url = asset.services[0].serviceEndpoint

  // const nonce = await ProviderInstance.getNonce(url, accountId)
  // console.log('nonce', nonce)

  // const signature = await ProviderInstance.signProviderRequest(
  //   web3,
  //   accountId,
  //   ' '
  // )
  // console.log('signature', signature)
  // const endpoint = '/api/services/createAuthToken'
  // const link =
  //   url +
  //   endpoint +
  //   '?signature=' +
  //   signature +
  //   '&nonce=' +
  //   nonce +
  //   '&address=' +
  //   accountId +
  //   '&expiration=' +
  //   '1670053210'

  // fetch(link)
  //   .then((response) => response.json())
  //   .then((data) => console.log(data))

  const downloadUrl = await ProviderInstance.getDownloadUrl(
    asset.id,
    accountId,
    asset.services[0].id,
    0,
    validOrderTx || asset.accessDetails.validOrderTx,
    asset.services[0].serviceEndpoint,
    web3
  )
  return downloadUrl
}

export async function authTest(
  web3: Web3,
  asset: AssetExtended,
  accountId: string,
  validOrderTx?: string
) {
  console.log('accountId', accountId)
  const url = asset.services[0].serviceEndpoint

  const nonce = await ProviderInstance.getNonce(url, accountId)
  console.log('nonce', nonce)

  const signature = await ProviderInstance.signProviderRequest(
    web3,
    accountId,
    'signed message'
  )
  console.log('signature', signature)
  const endpoint = '/api/services/createAuthToken'
  const link =
    url +
    endpoint +
    '?signature=' +
    signature +
    '&nonce=' +
    nonce +
    '&address=' +
    accountId +
    '&expiration=' +
    '1670053210'

  fetch(link)
    .then((response) => response.json())
    .then((data) => console.log(data))
}

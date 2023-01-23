import {
  ComputeAlgorithm,
  ComputeAsset,
  ComputeEnvironment,
  downloadFileBrowser,
  FileInfo,
  LoggerInstance,
  ProviderComputeInitializeResults,
  ProviderInstance,
  UrlFile
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
    const fileUrl: UrlFile = {
      type: 'url',
      index: 0,
      url,
      method: 'get'
    }

    const response = await ProviderInstance.getFileInfo(fileUrl, providerUrl)
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

/* --------------------------------------------------------------
  Get Blob with AuthToken
-------------------------------------------------------------- */
function getTimestampInSeconds(addDays = 0) {
  return Math.floor(Date.now() / 1000) + addDays * 24 * 60 * 60
}

const WAVES_USER = 'WAVES_USER'

async function requestAuthToken(
  web3: Web3,
  baseUrl: string,
  accountId: string,
  expiration: string
) {
  const nonce = Date.now() // await ProviderInstance.getNonce(baseUrl, accountId)
  const signature = await ProviderInstance.signProviderRequest(
    web3,
    accountId,
    `${accountId}${nonce}`
  )
  const route = '/api/services/createAuthToken'

  const params = {
    signature,
    nonce,
    address: accountId,
    expiration
  }

  const url = new URL(baseUrl + route)

  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, String(value))
  )

  return fetch(url, {
    method: 'GET'
  })
    .then((response) => response.json())
    .then((data) => {
      return data.token
    })
    .catch((error) => console.log(error))
}

async function genDownloadUrl(
  did: string,
  accountId: string,
  serviceId: string,
  fileIndex: number,
  transferTxId: string,
  providerUri: string
): Promise<any> {
  const providerEndpoints = await ProviderInstance.getEndpoints(providerUri)
  const serviceEndpoints = await ProviderInstance.getServiceEndpoints(
    providerUri,
    providerEndpoints
  )
  const nonce = Date.now()
  const downloadUrl = ProviderInstance.getEndpointURL(
    serviceEndpoints,
    'download'
  )
    ? ProviderInstance.getEndpointURL(serviceEndpoints, 'download').urlPath
    : null
  if (!downloadUrl) return null

  let consumeUrl = downloadUrl
  consumeUrl += `?fileIndex=${fileIndex}`
  consumeUrl += `&documentId=${did}`
  consumeUrl += `&transferTxId=${transferTxId}`
  consumeUrl += `&serviceId=${serviceId}`
  consumeUrl += `&consumerAddress=${accountId}`
  consumeUrl += `&nonce=${nonce}`
  consumeUrl += `&datatoken=""`

  return consumeUrl
}

export async function getFileBlobUrlWithAuth(
  web3: Web3,
  asset: AssetExtended,
  accountId: string,
  validOrderTx?: string
) {
  const baseUrl = asset.services[0].serviceEndpoint

  const localStorageKey = [WAVES_USER, baseUrl, accountId].join('_')

  const user = JSON.parse(localStorage.getItem(localStorageKey))

  if (!user?.token || Number(user?.expiration) < getTimestampInSeconds()) {
    const expiration = String(getTimestampInSeconds(31))
    const token = await requestAuthToken(web3, baseUrl, accountId, expiration)
    localStorage.setItem(localStorageKey, JSON.stringify({ token, expiration }))
  }

  const downloadUrl = await genDownloadUrl(
    asset.id,
    accountId,
    asset.services[0].id,
    0,
    validOrderTx || asset.accessDetails.validOrderTx,
    asset.services[0].serviceEndpoint
  )

  const { token } = JSON.parse(localStorage.getItem(localStorageKey))

  return fetch(downloadUrl, {
    headers: {
      AuthToken: token
    }
  })
    .then((response) => {
      return response.blob()
    })
    .then((blob) => {
      const songBlob = URL.createObjectURL(blob)
      return songBlob
    })
    .catch((error) => {
      console.log('error', error)
      return undefined
    })
}

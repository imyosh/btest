import axios from 'axios'
import { store } from '../redux/store/store'
import path from 'path'

import { updateProject } from '../redux/components/projects/projectsSlice'

import { linkVersions } from '.'

export const getAllReceivedRequests = () => {
  const { token } = store.getState().user
  return axios.get(`/api/users/getAllReceivedRequests/`, {
    headers: {
      'x-access-token': token,
    },
  })
}

export const acceptRequest = (requestId) => {
  const { token } = store.getState().user
  return axios.post(
    `/api/users/acceptRequest/${requestId}`,
    {},
    {
      headers: {
        'x-access-token': token,
      },
    }
  )
}

export const rejectRequest = (requestId) => {
  const { token } = store.getState().user
  return axios.post(
    `/api/users/rejectRequest/${requestId}`,
    {},
    {
      headers: {
        'x-access-token': token,
      },
    }
  )
}

export const downloadVersion = async (version, projectName, projectId) => {
  const {
    user: { token },
    homeFolderPath,
  } = store.getState()

  window.loading(
    'Downloading',
    `Fetching ${projectName} version ${version.current} files`
  )

  let projectPath = path.join(homeFolderPath, projectName)

  window.api.removeDir(projectPath, () => {})

  console.log(version.Version_Samples)

  Promise.all(
    version.Version_Samples.map((sample) => {
      let filePath = path.join(
        projectPath,
        sample.Location.slice(sample.Location.indexOf('samples/') + 8)
      )

      console.log('downloading to ', filePath)

      return axios.post(
        '/api/projects/Download',
        {
          key: sample.Key,
        },
        {
          headers: {
            'x-access-token': token,
          },
        }
      )
    })
  )
    .then(
      axios.spread((...allData) => {
        console.log({ allData })

        window.api.createProjectFolder(projectPath)

        allData.map((file) => {
          console.log(JSON.parse(file.config.data))
          let key = JSON.parse(file.config.data).key

          let filePath = path.join(
            projectPath,
            key.slice(key.indexOf('samples/') + 8)
          )

          console.log(filePath)

          let buffer = window.api.getBufferFromDataUrl(file.data)
          window.api.writeFileSync(filePath, buffer)
          console.log(key, ' Downloaded')
        })

        store.dispatch(
          updateProject({
            _id: projectId,
            data: {
              activeVersion: version._id,
            },
          })
        )
        window.finishLoading()
      })
    )
    .catch((err) => {
      console.log(err)
      window.finishLoading()
      window.notify()
    })
}

window.downloadVersion = downloadVersion

export const deleteVersion = (activeProject, version_id, versions) => {
  return new Promise(function (resolve, reject) {
    const {
      user: { token },
    } = store.getState()

    console.log({ activeProject, version_id })

    axios
      .delete(`/api/versions/Delete/${activeProject._id}/${version_id}`, {
        headers: {
          'x-access-token': token,
        },
      })
      .then((res) => {
        console.log(res)

        store.dispatch(
          updateProject({
            _id: activeProject._id,
            data: {
              versions: linkVersions(
                versions.filter((vertion) => vertion._id !== version_id)
              ),
              activeVersion:
                activeProject.activeVersion === version_id
                  ? null
                  : activeProject.activeVersion,
            },
          })
        )

        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

import axios from 'axios'
import { store } from '../redux/store/store'
import path from 'path'

import {
  removeProjectById,
  updateProject,
} from '../redux/components/projects/projectsSlice'

let { homeFolderPath } = api.store.initial()

////////////////////////////////////////////////

export function getBase64(file, func) {
  var reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => func(reader.result)

  reader.onerror = function (error) {
    console.log('Error: ', error)
  }
}

//return a promise that resolves with a File instance
export function urltoFile(url, filename, mimeType) {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer()
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType })
    })
}

////////////////////////////////////////////////

export const deleteProject = (project) => {
  return new Promise(function (resolve, reject) {
    const { token } = store.getState().user

    addDeleteStatus(project._id)

    if (project.isLocalFiles)
      window.api.removeDir(
        path.join(homeFolderPath, project.projectName),
        (err) => {
          if (err) {
            removeDeleteStatus(project._id)
            reject(error)
          }
          if (project.isRemoteFiles) {
            console.log('delte remote')
            axios
              .delete(`/api/projects/Delete/${project._id}`, {
                headers: {
                  'x-access-token': token,
                },
              })
              .then(function (res) {
                removeDeleteStatus(project._id)
                store.dispatch(removeProjectById(project._id))
                resolve(project)
              })
              .catch(function (error) {
                removeDeleteStatus(project._id)
                reject(error)
                console.log(error)
                window.api.send('show-error-message', {
                  title: '',
                  message: error.response.data.message,
                })
              })
          } else {
            removeDeleteStatus(project._id)
            store.dispatch(removeProjectById(project._id))
            resolve(project)
          }
        }
      )
    else if (project.isRemoteFiles) {
      console.log(token)
      axios
        .delete(`/api/projects/Delete/${project._id}`, {
          headers: {
            'x-access-token': token,
          },
        })
        .then(function (res) {
          removeDeleteStatus(project._id)
          store.dispatch(removeProjectById(project._id))
          resolve(project)
        })
        .catch(function (error) {
          removeDeleteStatus(project._id)
          reject(error)
          console.log(error)
        })
    } else {
      removeDeleteStatus(project._id)
      store.dispatch(removeProjectById(project._id))
      resolve(project)
    }
  })
}

const addDeleteStatus = (id) => {
  console.log('adding stataus')
  let elem = document.getElementById('projectElement' + id)
  if (elem) elem.classList.add('projectElement--deleting')
  // elem.getElementsByClassName('projectElement__icons')[0].style.display = 'none'
}

const removeDeleteStatus = (id) => {
  console.log('removing stataus')

  let elem = document.getElementById('projectElement' + id)
  if (elem) elem.classList.remove('projectElement--deleting')
}

///////////////////////////////////////////////

export const readLocalProject = (projectName) => {
  return new Promise(function (resolve, reject) {
    const { homeFolderPath } = store.getState()
    let rootDir = path.join(homeFolderPath, projectName)
    let Files = []

    function ThroughDirectory(dir) {
      api.readdir(dir).forEach((File) => {
        const filePath = path.join(dir, File)
        if (api.getIsDirectory(filePath)) return ThroughDirectory(filePath)
        else
          return Files.push({
            path: filePath.replace(rootDir, ''),
            data: `data:audio/${path
              .extname(File)
              .replace('.', '')};base64,${api.readFileBase64(filePath)}`,
            IsBounceFile:
              filePath.replace(rootDir, '').split('/')[1] === 'Bounces'
                ? true
                : false,
          })
      })
    }

    try {
      ThroughDirectory(rootDir)
    } catch (err) {
      reject(err)
    }

    resolve(Files)
  })
}

window.readLocalProject = readLocalProject

//////////////////////////////////////////////

export const linkVersions = (data) => {
  return data.map((item, i) => {
    if (!item.previousVersion_id) return { ...item, current: 1, last: 0 }

    const last =
      data.map((object) => object._id).indexOf(item.previousVersion_id) + 1

    return { ...item, last, current: i + 1 }
  })
}

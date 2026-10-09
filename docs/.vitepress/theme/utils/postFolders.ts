import type { Post } from '../../../posts.data'

export interface PostFolderNode {
  name: string
  path: string[]
  posts: Post[]
  children: PostFolderNode[]
  postCount: number
}

export function buildPostFolderTree(posts: Post[]) {
  const roots: PostFolderNode[] = []

  for (const post of posts) {
    const folders = post.folders.length ? post.folders : ['未归档']
    let level = roots
    let parentPath: string[] = []
    let target: PostFolderNode | undefined

    for (const folder of folders) {
      const path = [...parentPath, folder]
      let node = level.find((item) => item.name === folder)

      if (!node) {
        node = { name: folder, path, posts: [], children: [], postCount: 0 }
        level.push(node)
      }

      node.postCount += 1
      level = node.children
      parentPath = path
      target = node
    }

    target?.posts.push(post)
  }

  return sortPostFolderNodes(roots)
}

export function findPostFolder(nodes: PostFolderNode[], path: string[]) {
  let level = nodes
  let node: PostFolderNode | undefined

  for (const folder of path) {
    node = level.find((item) => item.name === folder)
    if (!node) return undefined
    level = node.children
  }

  return node
}

export function countPostFolders(nodes: PostFolderNode[]) {
  return nodes.reduce((total, node) => total + 1 + countPostFolders(node.children), 0)
}

function sortPostFolderNodes(nodes: PostFolderNode[]): PostFolderNode[] {
  return nodes
    .map((node) => ({ ...node, children: sortPostFolderNodes(node.children) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
}

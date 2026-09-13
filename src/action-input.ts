import { isAbsolute, relative, resolve } from 'node:path'

export const actionCommands = [
  'sync',
  'pull',
  'generate',
  'check',
  'push',
  'diff',
  'publish',
] as const
export type ActionCommand = (typeof actionCommands)[number]

export function actionArguments(input: {
  command: string
  config: string
  workingDirectory: string
  arguments: readonly string[]
  workspace: string
}) {
  if (!actionCommands.includes(input.command as ActionCommand)) {
    throw new Error(`Unsupported LinguaFlow command: ${input.command}`)
  }
  const cwd = safeWorkingDirectory(input.workspace, input.workingDirectory)
  const config = requiredPath(input.config, 'config')
  const extra = input.arguments.map((value) => {
    if (value.includes('\0') || /[\r\n]/.test(value))
      throw new Error('Each additional argument must occupy one line.')
    return value
  })
  return { cwd, argv: [input.command, '--config', config, ...extra] }
}

function safeWorkingDirectory(workspace: string, value: string) {
  const requested = requiredPath(value, 'working-directory')
  const root = resolve(workspace)
  const cwd = resolve(root, requested)
  const relation = relative(root, cwd)
  if (
    isAbsolute(requested) ||
    relation === '..' ||
    relation.startsWith('../') ||
    relation.startsWith('..\\')
  ) {
    throw new Error('working-directory must stay inside GITHUB_WORKSPACE.')
  }
  return cwd
}

function requiredPath(value: string, name: string) {
  const path = value.trim()
  if (!path || path.includes('\0')) throw new Error(`${name} must be a non-empty path.`)
  return path
}

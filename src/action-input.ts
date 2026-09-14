import { isAbsolute, relative, resolve } from 'node:path'

export const actionCommands = [
  'sync',
  'pull',
  'generate',
  'check',
  'push',
  'diff',
  'branch',
  'publish',
] as const
export type ActionCommand = (typeof actionCommands)[number]

export interface ActionInput {
  command: string
  config: string
  workingDirectory: string
  arguments: readonly string[]
  workspace: string
}

export interface ActionInvocation {
  cwd: string
  argv: string[]
}

export class ActionInputError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ActionInputError'
  }
}

export function actionArguments(input: ActionInput): ActionInvocation {
  if (!isActionCommand(input.command)) {
    throw new ActionInputError(`Unsupported LinguaFlow command: ${input.command}`)
  }
  const cwd = safeWorkingDirectory(input.workspace, input.workingDirectory)
  const config = requiredPath(input.config, 'config')
  const extra = input.arguments.map((value) => {
    if (value.includes('\0') || /[\r\n]/.test(value))
      throw new ActionInputError('Each additional argument must occupy one line.')
    if (value === '--config' || value.startsWith('--config=')) {
      throw new ActionInputError('Additional arguments cannot override the config input.')
    }
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
    throw new ActionInputError('working-directory must stay inside GITHUB_WORKSPACE.')
  }
  return cwd
}

function requiredPath(value: string, name: string) {
  const path = value.trim()
  if (!path || path.includes('\0')) throw new ActionInputError(`${name} must be a non-empty path.`)
  return path
}

function isActionCommand(value: string): value is ActionCommand {
  return actionCommands.some((command) => command === value)
}

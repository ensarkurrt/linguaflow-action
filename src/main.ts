import process from 'node:process'
import * as core from '@actions/core'
import { run } from '@linguaflow/cli/api'
import { actionArguments } from './action-input.ts'

async function main() {
  const managementKey = core.getInput('management-key').trim()
  if (managementKey) core.setSecret(managementKey)
  const { argv, cwd } = actionArguments({
    command: core.getInput('command', { required: true }),
    config: core.getInput('config', { required: true }),
    workingDirectory: core.getInput('working-directory', { required: true }),
    arguments: core.getMultilineInput('arguments'),
    workspace: process.env.GITHUB_WORKSPACE ?? process.cwd(),
  })
  const previous = process.env.LINGUAFLOW_MANAGEMENT_KEY
  try {
    if (managementKey) process.env.LINGUAFLOW_MANAGEMENT_KEY = managementKey
    await run(argv, { cwd })
  } finally {
    if (previous === undefined) delete process.env.LINGUAFLOW_MANAGEMENT_KEY
    else process.env.LINGUAFLOW_MANAGEMENT_KEY = previous
  }
}

main().catch((error: unknown) => {
  core.setFailed(error instanceof Error ? error.message : 'LinguaFlow action failed.')
})

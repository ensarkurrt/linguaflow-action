import assert from 'node:assert/strict'
import test from 'node:test'
import { actionArguments } from '../dist/action-input.cjs'

test('builds shell-free CLI arguments in the workspace', () => {
  const result = actionArguments({
    command: 'publish',
    config: '.linguaconfig',
    workingDirectory: 'apps/mobile',
    arguments: ['--message', 'Release translations'],
    workspace: '/work/repository',
  })
  assert.deepEqual(result, {
    cwd: '/work/repository/apps/mobile',
    argv: ['publish', '--config', '.linguaconfig', '--message', 'Release translations'],
  })
})

test('rejects traversal and unknown commands', () => {
  assert.throws(() =>
    actionArguments({
      command: 'exec',
      config: '.linguaconfig',
      workingDirectory: '.',
      arguments: [],
      workspace: '/work/repository',
    }),
  )
  assert.throws(() =>
    actionArguments({
      command: 'sync',
      config: '.linguaconfig',
      workingDirectory: '../secrets',
      arguments: [],
      workspace: '/work/repository',
    }),
  )
})

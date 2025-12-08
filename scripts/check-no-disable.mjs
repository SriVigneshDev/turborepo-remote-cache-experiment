import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'

// All patterns to block
const BLOCKED_PATTERNS = [
  // ESLint (legacy)
  /eslint-disable/i,
  /eslint-enable/i,

  // Biome
  /biome-ignore/i,

  // TypeScript
  /@ts-ignore/,
  /@ts-nocheck/,
  /@ts-expect-error/,

  // Prettier (legacy)
  /prettier-ignore/i,
]

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']
const DIRS_TO_CHECK = ['apps', 'packages']
const IGNORE_DIRS = [
  'node_modules',
  '.next',
  'dist',
  '.turbo',
  '.cache',
  'coverage',
  'biome-config', // Don't check the config package itself
]

function getAllFiles(dir, files = []) {
  try {
    const items = readdirSync(dir)

    for (const item of items) {
      const fullPath = join(dir, item)

      if (IGNORE_DIRS.includes(item)) {
        continue
      }

      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        getAllFiles(fullPath, files)
      } else if (EXTENSIONS.includes(extname(item))) {
        files.push(fullPath)
      }
    }
  } catch {
    // Directory doesn't exist, skip
  }

  return files
}

function checkFile(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const violations = []

  lines.forEach((line, index) => {
    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({
          file: filePath,
          line: index + 1,
          content: line.trim(),
        })
        break
      }
    }
  })

  return violations
}

function main() {
  console.info('')
  console.info('🔍 Scanning for disable comments...')
  console.info('')

  const allFiles = []

  for (const dir of DIRS_TO_CHECK) {
    getAllFiles(dir, allFiles)
  }

  if (allFiles.length === 0) {
    console.info('⚠️  No source files found.')
    process.exit(0)
  }

  console.info(`   Found ${allFiles.length} files to check.`)
  console.info('')

  const allViolations = []

  for (const file of allFiles) {
    const violations = checkFile(file)
    allViolations.push(...violations)
  }

  if (allViolations.length > 0) {
    console.info('❌ BLOCKED COMMENTS FOUND!')
    console.info('')
    console.info('─'.repeat(50))

    for (const v of allViolations) {
      console.info('')
      console.info(`   📍 ${v.file}:${v.line}`)
      console.info(`      ${v.content}`)
    }

    console.info('')
    console.info('─'.repeat(50))
    console.info('')
    console.info(`   Total violations: ${allViolations.length}`)
    console.info('')
    console.info('💡 Fix: Remove disable comments and fix actual issues.')
    console.info('')

    process.exit(1)
  }

  console.info('✅ No disable comments found!')
  console.info('')
  process.exit(0)
}

main()

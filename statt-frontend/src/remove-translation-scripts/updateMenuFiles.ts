import { consola } from 'consola'

const fs = require('fs').promises

const staticMenuFiles = [
  'src/components/layout/vertical/VerticalMenu.tsx',
  'src/components/layout/horizontal/HorizontalMenu.tsx'
]

const menuDataFiles = ['src/data/navigation/verticalMenuData.tsx', 'src/data/navigation/horizontalMenuData.tsx']

const removeTranslationInNavigation = async (path: string) => {
  consola.start('Removing translation in navigation files...')
  let fileContent = await fs.readFile(path, 'utf8')

  fileContent = fileContent.replace(/href={`\/\$\{locale\}\/(.*?)`}/g, (match: string, p1: string) => {
    // Check if there's any dynamic segment like `${id || '4987'}` and preserve it as is
    if (p1.includes('${')) {
      // Rebuild the path with preserved dynamic expressions
      return `href={\`/${p1}\`}`
    } else {
      // For static paths, simply remove the `${locale}` part
      return `href='/${p1}'`
    }
  })

  // Replace dictionary references in labels and MenuItem children
  fileContent = fileContent.replace(/label=\{dictionary\['navigation'\]\.(\w+)\}/g, "label='$1'")

  // Replace dictionary references in labels and MenuItem children
  fileContent = fileContent.replace(/\{dictionary\['navigation'\]\.(\w+)\}/g, '$1')

  await fs.writeFile(path, fileContent)
  consola.success('Removed translation in navigation files successfully\n')
}

const removeFromMenuData = async (path: string) => {
  consola.start('Removing translation in menu data files...')

  let fileContent = await fs.readFile(path, 'utf8')

  // Transform `label` by directly using the key from the dictionary reference
  fileContent = fileContent.replace(/label: dictionary\['navigation'\]\.(\w+)/g, "label: '$1'")

  // Transform `href` by removing `${locale}/` and preserving dynamic content
  // This pattern targets both static and dynamic hrefs, including those with `params.id` or similar
  fileContent = fileContent.replace(/href: `\/\$\{locale\}\/([^`]+)`/g, (match: string, p1: string) => {
    // Check if there's a dynamic segment like `${params.id || 'default'}` and rebuild the string
    if (p1.includes('${')) {
      return `href: \`/${p1}\``
    } else {
      return `href: '/${p1}'`
    }
  })

  await fs.writeFile(path, fileContent)

  consola.success('Removed translation in menu data files successfully\n')
}

export const updateMenuFiles = async () => {
  for (const path of staticMenuFiles) {
    await removeTranslationInNavigation(path)
  }

  for (const path of menuDataFiles) {
    await removeFromMenuData(path)
  }
}

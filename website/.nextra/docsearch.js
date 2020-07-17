import { useRef, useEffect } from 'react'

export default function () {
  const input = useRef(null)

  useEffect(() => {
    const inputs = ['input', 'select', 'button', 'textarea']

    const down = (e) => {
      if (
        document.activeElement &&
        inputs.indexOf(document.activeElement.tagName.toLowerCase() !== -1)
      ) {
        if (e.key === '/') {
          e.preventDefault()
          input.current?.focus()
        }
      }
    }

    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    if (window.docsearch) {
      window.docsearch({
        apiKey: '247dd86c8ddbbbe6d7a2d4adf4f3a68a',
        indexName: 'vercel_swr',
        inputSelector: 'input#algolia-doc-search'
      })
    }
  }, [])

  return <div className="relative w-full md:w-64 mr-2">
    <input
      id="algolia-doc-search"
      className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
      type="search"
      placeholder='Search ("/" to focus)'
      ref={input}
    />
  </div>
}

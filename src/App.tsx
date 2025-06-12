import { useEffect, useState } from 'react'
import './App.css'


function App () {
  const [content, setContent] = useState('')
  const [htmlCode, setHtmlCode] = useState('code')


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setHtmlCode(e.target.value)
  }
  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'figma-preview.html';
    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      alert('HTML copiado para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
      alert('Não foi possível copiar o conteúdo.');
    }
  };



  useEffect(() => {
    const template = (content: string) => {
      return `<!DOCTYPE html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Figma Embed</title>
    <style>
      * {
        box-sizing: border-box;
      }
      html,
      body {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
      }
      .hide {
        height: 70px;
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: white;
        z-index: 50;
      }
      .hideFullScreen {
        height: 70px;
        position: absolute;
        top: 0;
        right: 0;
        width: 90px;
        height: 90px;
        background-color: white;
        z-index: 50;
      }
    </style>
  </head>

  <body>
    <div class="hide"></div>
    <div class="hideFullScreen"></div>
    <div
      style="
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    "
  >
    ${content.replace("800", "100%").replace("450", "100%").replace("show-proto-sidebar=1", "show-proto-sidebar=0")}
    </div>
  </body>
</html>
    `
    }

    const formatHTMLCode = () => {
      const code = `${template(content)}`
      setHtmlCode(code)
    }
    formatHTMLCode()
  }, [content])

  return (
    <>
      <div className='container mx-auto px-4'>
        <h1 className='text-4xl mt-5 mb-10 font-bold text-slate-800'>Gerador Figma</h1>
        <div className='flex flex-row gap-6'>
          <div className='w-6/12 flex flex-col justify-between flex-wrap'>
            <div className='flex flex-col mb-4 content-between'>
              <label htmlFor='FigmaEmbedCode' className='font-semibold'>Insira o código gerado pelo Figma</label>
              <textarea onChange={handleChange} rows={7} className=' w-full border border-slate-500 font-mono p-2 rounded-md' value={content}></textarea>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="Código Final" className='font-semibold'>Código Final <small>(Salve com a extensão .html)</small></label>
              <textarea rows={8} className='w-full border border-slate-500 font-mono p-2 rounded-md' value={content && htmlCode}></textarea>
              {content && <div className='flex flex-row justify-end mt-4 gap-4'>
                <button onClick={handleCopy} className='border rounded border-slate-500 px-4 py-2'>Copiar</button>
                <button onClick={handleDownload} className='border rounded border-slate-500 px-4 py-2'>Baixar HTML</button>
              </div>}
            </div>
          </div>
          <div className='w-6/12'>
            <div className='flex flex-col h-full'>
              <label htmlFor="preview" className='font-semibold'>Preview do arquivo Figma</label>
              <div id='preview' className='border border-slate-500 rounded-md min-h-96 h-full overflow-hidden flex justify-center items-center w-full' dangerouslySetInnerHTML={{ __html: content.replace("800", "100%").replace("show-proto-sidebar=1", "show-proto-sidebar=0") }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

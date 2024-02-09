import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
    onNoteCreated: (content:string) => void
}
let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {


    const [ shouldShowOnboarding, setshouldShowOnboarding ] = useState(true)
    const [ isRecording, setIsRecording ] = useState(false)
    const [ content, setContent ] =  useState('')

    function handleStartEditor () {
        setshouldShowOnboarding(false)
    }

    function handleOnChange (event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value)
        
        if (event.target.value === '') {
            setshouldShowOnboarding(true)
        }   
    }

    function handleStartRecord () {
        
        const isSpeetchRecognitionAvaliable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
        
        if (!isSpeetchRecognitionAvaliable) {
            alert('Seu navegador não suporta a API de gravação.')
            return
        }
        
        setIsRecording(true)
        setshouldShowOnboarding(false)

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition 

        speechRecognition = new SpeechRecognitionAPI()

        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '')
            setContent(transcription)
        }
        speechRecognition.onerror = (err) => {
            console.log(err);
        }

        speechRecognition.start()
    }

    function handleStopRecord () {
        console.log(
            'parado'
        );
        
        speechRecognition?.stop()

        setIsRecording(false)

    }

    function handleSaveNote (event: FormEvent) {
        event.preventDefault()
        onNoteCreated(content)

        setContent('')

        toast.success('Nota criada com sucesso.')
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger className="rounded-md bg-slate-700 p-5 space-y-3 overflow-hidden hover:bg-slate-800">
                <span className='text-sm font-medium text slate-400' > Adicionar Nota </span>
                <p className='text-sm leading-6 text-slate-400' >
                    Grave uma nota em áudio
                </p>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Content className='fixed  md:left-1/2 md:top-1/2 inset-0 md:inset-auto md:-translate-x-1/2 md:-translate-y-1/2 md:h-[60vh] w-full md:max-w-[640px] bg-slate-700 rounded-md flex flex-col outlite-none overflow-hidden' >

                    <Dialog.Close className='absolute right-0 top-0 m-3' > <X className='hover:text-slate-500' /> </Dialog.Close>
                    <form className='flex-1 flex flex-col'>
                        <div className="flex flex-1 flex-col gap-3 p-5">
                            <span className='text-sm font-medium text slate-400' > Adicionar Nota </span>
                            {
                            shouldShowOnboarding ? (
                                <p className='text-sm leading-6 text-slate-400' >
                                    Começe <button type='button' onClick={handleStartRecord} className='text-lime-400 hover:underline' >gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className='text-lime-400 hover:underline' >utilize apenas texto.</button>
                                </p>
                            ) : (
                                <textarea 
                                    autoFocus
                                    className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                                    onChange={handleOnChange}
                                    value={content}
                                />
                            )
                            }
                        </div>

                        {
                            isRecording 
                            ? (
                                <button onClick={handleStopRecord} type='button' className='flex items-center justify-center gap-2 w-full bg-slate-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-slate-200 ' >
                                    <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                                    Gravando!
                                </button>
                            ) : (
                                <button onClick={handleSaveNote} type='button' className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500 ' >
                                    Salvar Nota
                                </button>
                            )
                        }
                    </form>

                </Dialog.Content>

            </Dialog.Portal>
        </Dialog.Root>
    )

}
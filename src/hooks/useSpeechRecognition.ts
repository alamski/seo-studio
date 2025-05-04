import { useState, useCallback } from 'react'

interface SpeechRecognitionHook {
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  error: string | null
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const recognition = typeof window !== 'undefined' ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : null

  if (recognition) {
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex
      const transcript = event.results[current][0].transcript
      setTranscript(transcript)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Error occurred in recognition: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }
  }

  const startListening = useCallback(() => {
    if (!recognition) {
      setError('Speech recognition is not supported in your browser')
      return
    }

    try {
      recognition.start()
      setIsListening(true)
      setError(null)
    } catch (err) {
      setError('Failed to start speech recognition')
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    error,
  }
} 
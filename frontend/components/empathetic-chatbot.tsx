"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { User, Send, Mic, MicOff, Heart, Sparkles, CheckCircle, Volume2 } from "lucide-react"
import { useVoiceInput } from "@/hooks/use-voice-input"
import type { HandoffEntry } from "@/types/shift-handoff"

interface EmpathicChatbotProps {
  patientName: string
  onEntryComplete: (entry: Omit<HandoffEntry, "id" | "timestamp">) => void
  completionStatus: Record<string, boolean>
  onComplete: () => void
}

interface ChatMessage {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: string
  category?: string
  isQuestion?: boolean
  suggestions?: string[]
}

const handoffQuestions = [
  {
    id: "greeting",
    content:
      "Hi there! 👋 I'm here to help you with the handoff for {patientName}. How are you feeling about this shift so far?",
    category: "greeting",
    suggestions: ["Going well", "A bit busy", "Challenging shift", "Pretty smooth"],
  },
  {
    id: "assessment",
    content:
      "Let's start with how {patientName} is doing overall. What's your general assessment of their condition? 🩺",
    category: "assessment",
    suggestions: ["Stable condition", "Some concerns", "Improving", "Needs close monitoring"],
  },
  {
    id: "vitals",
    content: "How are {patientName}'s vital signs looking? Any changes or concerns I should know about? 📊",
    category: "vitals",
    suggestions: ["All normal", "BP elevated", "Temp spike", "Pain increased"],
  },
  {
    id: "medications",
    content: "Tell me about medications - were all scheduled meds given? Any reactions or missed doses? 💊",
    category: "medications",
    suggestions: ["All given on time", "One dose missed", "New medication started", "Side effects noted"],
  },
  {
    id: "interventions",
    content: "What care activities or interventions did you perform this shift? 🤲",
    category: "interventions",
    suggestions: ["Wound care", "Physical therapy", "Patient education", "Family meeting"],
  },
  {
    id: "pending",
    content: "What tasks or follow-ups need attention from the next shift? 📋",
    category: "pending",
    suggestions: ["Lab results pending", "Doctor visit scheduled", "Discharge planning", "Family call needed"],
  },
  {
    id: "concerns",
    content: "Any safety concerns, behavioral changes, or special alerts for the next nurse? 🚨",
    category: "alerts",
    suggestions: ["Fall risk", "Confusion noted", "Family concerns", "All good"],
  },
]

export function EmpatheticChatbot({
  patientName,
  onEntryComplete,
  completionStatus,
  onComplete,
}: EmpathicChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const {
    isListening: voiceListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    clearTranscript,
  } = useVoiceInput()

  useEffect(() => {
    // Initialize with greeting
    const greeting = handoffQuestions[0]
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      type: "bot",
      content: greeting.content.replace("{patientName}", patientName),
      timestamp: new Date().toISOString(),
      category: greeting.category,
      isQuestion: true,
      suggestions: greeting.suggestions,
    }
    setMessages([welcomeMessage])
  }, [patientName])

  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript)
    }
  }, [transcript])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (message?: string) => {
    const messageToSend = message || inputMessage.trim()
    if (!messageToSend) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    clearTranscript()

    // Save the entry if it's a response to a question
    if (currentQuestionIndex > 0 && currentQuestionIndex < handoffQuestions.length) {
      const currentQuestion = handoffQuestions[currentQuestionIndex]
      const priority =
        currentQuestion.category === "alerts"
          ? "critical"
          : currentQuestion.category === "pending"
            ? "important"
            : "normal"

      const entry: Omit<HandoffEntry, "id" | "timestamp"> = {
        handoffId: "current",
        inputMethod: "guided",
        category: currentQuestion.category as any,
        content: messageToSend,
        priority: priority as any,
        isComplete: true,
      }

      onEntryComplete(entry)
    }

    // Move to next question
    setTimeout(() => {
      if (currentQuestionIndex < handoffQuestions.length - 1) {
        const nextIndex = currentQuestionIndex + 1
        setCurrentQuestionIndex(nextIndex)

        const nextQuestion = handoffQuestions[nextIndex]
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: nextQuestion.content.replace("{patientName}", patientName),
          timestamp: new Date().toISOString(),
          category: nextQuestion.category,
          isQuestion: true,
          suggestions: nextQuestion.suggestions,
        }

        setMessages((prev) => [...prev, botMessage])
      } else {
        // Handoff complete
        const completeMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: `Perfect! ✨ Thank you for taking such great care of ${patientName}. The handoff summary is ready for the next nurse. You've done an amazing job this shift! 🌟`,
          timestamp: new Date().toISOString(),
          category: "complete",
        }

        setMessages((prev) => [...prev, completeMessage])
        setIsComplete(true)
      }
    }, 1000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleVoiceToggle = () => {
    if (voiceListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const getCompletionPercentage = () => {
    return Math.round((currentQuestionIndex / (handoffQuestions.length - 1)) * 100)
  }

  return (
    <Card className="h-[700px] flex flex-col bg-gradient-to-br from-white to-primary-50/30 border-0 shadow-warm rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary to-primary-400 text-white p-6 rounded-t-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Caring Assistant</h3>
              <p className="text-primary-100 text-sm">Here to help with {patientName}'s handoff</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold">{getCompletionPercentage()}%</div>
            <div className="text-xs text-primary-100">Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 bg-white/20 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-500 ease-out"
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6 py-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "bot" && (
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                )}

                <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                  <div
                    className={`rounded-3xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-accent to-accent-400 text-white ml-auto"
                        : "bg-white shadow-gentle border border-primary-100"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>

                    {message.type === "bot" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-full hover:bg-primary-100"
                        onClick={() => speakMessage(message.content)}
                      >
                        <Volume2 className="h-3 w-3 text-primary-600" />
                      </Button>
                    )}

                    {message.category && message.type === "bot" && (
                      <Badge variant="secondary" className="text-xs bg-primary-100 text-primary-700 rounded-xl">
                        {message.category}
                      </Badge>
                    )}
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.type === "bot" && !isComplete && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs rounded-2xl border-primary-200 hover:bg-primary-50 hover:border-primary-300 transition-all duration-200"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {message.type === "user" && (
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        {!isComplete && (
          <div className="border-t border-primary-100 p-6 bg-white/80">
            <div className="flex gap-3 mb-3">
              <Button
                variant={voiceListening ? "default" : "outline"}
                size="sm"
                onClick={handleVoiceToggle}
                disabled={!isSupported}
                className={`rounded-2xl transition-all duration-200 ${
                  voiceListening
                    ? "bg-gradient-to-r from-critical to-red-400 text-white animate-pulse-soft"
                    : "border-primary-200 hover:bg-primary-50"
                }`}
              >
                {voiceListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {voiceListening ? "Stop" : "Voice"}
              </Button>

              {voiceListening && (
                <Badge className="bg-critical/20 text-critical animate-bounce-gentle rounded-xl">🎤 Listening...</Badge>
              )}
            </div>

            <div className="flex gap-3">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Share your thoughts about the patient's care..."
                className="flex-1 rounded-2xl border-primary-200 focus:border-primary-400 focus:ring-primary-400 resize-none min-h-[60px] bg-white/80"
                disabled={voiceListening}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-primary to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white rounded-2xl px-6 transition-all duration-200 hover:shadow-warm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Complete Actions */}
        {isComplete && (
          <div className="border-t border-primary-100 p-6 bg-gradient-to-r from-success/10 to-primary-50">
            <div className="flex items-center justify-center gap-4">
              <CheckCircle className="h-6 w-6 text-success" />
              <span className="text-success font-medium">Handoff Complete!</span>
              <Button
                onClick={onComplete}
                className="bg-gradient-to-r from-success to-green-400 hover:from-green-600 hover:to-green-500 text-white rounded-2xl px-6 transition-all duration-200 hover:shadow-warm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Summary
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

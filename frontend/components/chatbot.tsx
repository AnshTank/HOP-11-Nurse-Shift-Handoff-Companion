"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Mic, MicOff, Stethoscope, AlertCircle, Info } from "lucide-react"
import { useVoiceInput } from "@/hooks/use-voice-input"

interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: string
  category?: "medical" | "procedure" | "medication" | "general"
}

interface ChatbotProps {
  currentPatient?: string
  nurseName?: string
}

export function Chatbot({ currentPatient, nurseName }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "bot",
      content: `Hello ${nurseName || "Nurse"}! I'm your AI assistant. I can help you with medical information, procedures, medication guidance, and shift-related questions. How can I assist you today?`,
      timestamp: new Date().toISOString(),
      category: "general",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [useVoiceInputMode, setUseVoiceInputMode] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { isListening, transcript, isSupported, startListening, stopListening, clearTranscript } = useVoiceInput()

  useEffect(() => {
    if (useVoiceInputMode && transcript) {
      setInputMessage(transcript)
    }
  }, [transcript, useVoiceInputMode])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const generateBotResponse = (
    userMessage: string,
  ): { content: string; category: "medical" | "procedure" | "medication" | "general" } => {
    const message = userMessage.toLowerCase()

    // Medical information responses
    if (message.includes("blood pressure") || message.includes("hypertension")) {
      return {
        content:
          "Normal blood pressure is typically less than 120/80 mmHg. For hypertensive patients, monitor closely and ensure medications are administered as prescribed. Consider lifestyle factors and report significant changes to the physician.",
        category: "medical",
      }
    }

    if (message.includes("pain") || message.includes("pain scale")) {
      return {
        content:
          "Use the 0-10 pain scale for assessment. Document pain location, quality, and factors that worsen/improve it. Non-pharmacological interventions include positioning, ice/heat, and distraction techniques. Always reassess after interventions.",
        category: "medical",
      }
    }

    if (message.includes("medication") || message.includes("drug")) {
      return {
        content:
          "Always follow the 5 rights of medication administration: Right patient, right drug, right dose, right route, right time. Check for allergies, verify orders, and document administration. Report any adverse reactions immediately.",
        category: "medication",
      }
    }

    if (message.includes("handoff") || message.includes("shift change")) {
      return {
        content:
          "Effective handoffs include: Patient identification, current condition, recent changes, pending orders, safety concerns, and family updates. Use SBAR format: Situation, Background, Assessment, Recommendation.",
        category: "procedure",
      }
    }

    if (message.includes("infection control") || message.includes("ppe")) {
      return {
        content:
          "Standard precautions apply to all patients. Use appropriate PPE based on transmission risk. Hand hygiene is crucial - wash hands before and after patient contact. Follow isolation protocols as ordered.",
        category: "procedure",
      }
    }

    if (message.includes("fall risk") || message.includes("safety")) {
      return {
        content:
          "Assess fall risk using validated tools. Implement appropriate interventions: bed alarms, non-slip socks, adequate lighting, clear pathways. Educate patients about calling for assistance.",
        category: "medical",
      }
    }

    // Default responses
    const defaultResponses = [
      "I can help you with medical procedures, medication information, patient care guidelines, and shift management. What specific topic would you like to discuss?",
      "For specific patient care questions, please consult your facility's protocols or speak with the attending physician. I can provide general nursing guidance.",
      "Remember to always follow your institution's policies and procedures. I'm here to provide general support and information.",
    ]

    return {
      content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      category: "general",
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    clearTranscript()
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(
      () => {
        const botResponse = generateBotResponse(inputMessage)
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: botResponse.content,
          timestamp: new Date().toISOString(),
          category: botResponse.category,
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 2000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "medical":
        return <Stethoscope className="h-3 w-3" />
      case "procedure":
        return <Info className="h-3 w-3" />
      case "medication":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Bot className="h-3 w-3" />
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "medical":
        return "bg-blue-100 text-blue-800"
      case "procedure":
        return "bg-green-100 text-green-800"
      case "medication":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Nursing Assistant AI
          {currentPatient && (
            <Badge variant="outline" className="ml-auto">
              Patient: {currentPatient}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}

                <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>
                    {message.category && message.type === "bot" && (
                      <Badge variant="secondary" className={`text-xs ${getCategoryColor(message.category)}`}>
                        {getCategoryIcon(message.category)}
                        <span className="ml-1">{message.category}</span>
                      </Badge>
                    )}
                  </div>
                </div>

                {message.type === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2 mb-2">
            <Button
              variant={useVoiceInputMode ? "default" : "outline"}
              size="sm"
              onClick={() => setUseVoiceInputMode(!useVoiceInputMode)}
              disabled={!isSupported}
            >
              <Mic className="h-4 w-4" />
            </Button>
            {useVoiceInputMode && (
              <Button
                variant={isListening ? "destructive" : "default"}
                size="sm"
                onClick={isListening ? stopListening : startListening}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
            {isListening && (
              <Badge variant="destructive" className="animate-pulse">
                Listening...
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about procedures, medications, patient care..."
              disabled={isTyping || (useVoiceInputMode && isListening)}
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send } from "lucide-react"
import type { GuidedPrompt, HandoffEntry } from "@/types/shift-handoff"

interface HandoffChatbotProps {
  patientName: string
  onEntryComplete: (entry: Omit<HandoffEntry, "id" | "timestamp">) => void
  completionStatus: Record<string, boolean>
}

interface ChatMessage {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: string
  category?: string
  isPrompt?: boolean
}

export function HandoffChatbot({ patientName, onEntryComplete, completionStatus }: HandoffChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [currentPrompt, setCurrentPrompt] = useState<GuidedPrompt | null>(null)
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const guidedPrompts: GuidedPrompt[] = [
    {
      id: "assessment",
      category: "assessment",
      question: `How is ${patientName} doing overall? Please describe their current condition and any changes since the last shift.`,
      required: true,
      completed: completionStatus.assessment,
    },
    {
      id: "vitals",
      category: "vitals",
      question:
        "What are the latest vital signs? Any concerns with temperature, blood pressure, heart rate, or oxygen levels?",
      required: true,
      completed: completionStatus.vitals,
    },
    {
      id: "medications",
      category: "medications",
      question: "Were all medications given as scheduled? Any missed doses, new medications, or adverse reactions?",
      required: true,
      completed: completionStatus.medications,
    },
    {
      id: "interventions",
      category: "interventions",
      question: "What care interventions were performed this shift? Any procedures, treatments, or nursing actions?",
      required: true,
      completed: completionStatus.interventions,
    },
    {
      id: "pending",
      category: "pending",
      question: "What tasks or orders are still pending for the next shift? Any follow-ups needed?",
      required: true,
      completed: completionStatus.pending,
    },
    {
      id: "alerts",
      category: "alerts",
      question:
        "Are there any safety concerns, behavioral changes, or important alerts the next nurse should know about?",
      required: false,
      completed: completionStatus.alerts,
    },
  ]

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      type: "bot",
      content: `Hi! I'll help you complete the handoff for ${patientName}. I'll ask you about key areas to ensure nothing is missed. Let's start!`,
      timestamp: new Date().toISOString(),
    }
    setMessages([welcomeMessage])

    // Start with first incomplete prompt
    const nextPrompt = guidedPrompts.find((p) => !p.completed)
    if (nextPrompt) {
      setTimeout(() => askNextQuestion(nextPrompt), 1000)
    } else {
      setTimeout(() => {
        const completeMessage: ChatMessage = {
          id: "complete",
          type: "bot",
          content:
            "Great! All required sections are complete. You can add any additional notes or complete the handoff.",
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, completeMessage])
      }, 1000)
    }
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const askNextQuestion = (prompt: GuidedPrompt) => {
    setCurrentPrompt(prompt)
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "bot",
      content: prompt.question,
      timestamp: new Date().toISOString(),
      category: prompt.category,
      isPrompt: true,
    }
    setMessages((prev) => [...prev, botMessage])
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isWaitingForResponse) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsWaitingForResponse(true)

    // Process the response
    if (currentPrompt) {
      // Create handoff entry
      const priority =
        currentPrompt.category === "alerts" ? "critical" : currentPrompt.category === "pending" ? "important" : "normal"

      const entry: Omit<HandoffEntry, "id" | "timestamp"> = {
        handoffId: "current", // This would be set by parent
        inputMethod: "guided",
        category: currentPrompt.category as any,
        content: inputMessage,
        priority: priority as any,
        isComplete: true,
      }

      onEntryComplete(entry)

      // Send confirmation
      setTimeout(() => {
        const confirmMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: `Got it! I've recorded that information for ${currentPrompt.category}. ✓`,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, confirmMessage])

        // Ask next question
        const nextPrompt = guidedPrompts.find((p) => !p.completed && p.id !== currentPrompt.id)
        if (nextPrompt) {
          setTimeout(() => askNextQuestion(nextPrompt), 1500)
        } else {
          setTimeout(() => {
            const finalMessage: ChatMessage = {
              id: (Date.now() + 2).toString(),
              type: "bot",
              content:
                "Perfect! All key areas have been covered. Is there anything else important the next nurse should know?",
              timestamp: new Date().toISOString(),
            }
            setMessages((prev) => [...prev, finalMessage])
            setCurrentPrompt(null)
          }, 1500)
        }
        setIsWaitingForResponse(false)
      }, 1000)
    }

    setInputMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getCompletedCount = () => {
    return Object.values(completionStatus).filter(Boolean).length
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Handoff Assistant
          </div>
          <Badge variant="outline">
            {getCompletedCount()}/{guidedPrompts.length} Complete
          </Badge>
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
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : message.isPrompt
                          ? "bg-green-100 text-green-900 border border-green-200"
                          : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>
                    {message.category && (
                      <Badge variant="secondary" className="text-xs">
                        {message.category}
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

            {isWaitingForResponse && (
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
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentPrompt ? "Type your response..." : "Any additional notes?"}
              disabled={isWaitingForResponse}
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isWaitingForResponse}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

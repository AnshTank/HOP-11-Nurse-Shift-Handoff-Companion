"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Send, Mic, MicOff, Stethoscope, AlertCircle, Info, Pill, Activity } from "lucide-react"
import { useVoiceInput } from "@/hooks/use-voice-input"

interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: string
  category?: "medical" | "procedure" | "medication" | "protocol" | "general"
}

interface NursingChatbotProps {
  currentPatient?: string
  onQuickAction?: (action: string, data: any) => void
}

export function NursingChatbot({ currentPatient, onQuickAction }: NursingChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "bot",
      content: `Hello! I'm your nursing assistant. I can help you with medical protocols, medication information, patient care guidelines, and quick calculations. ${
        currentPatient ? `I see you're working with ${currentPatient}.` : ""
      } How can I assist you today?`,
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
  ): { content: string; category: "medical" | "procedure" | "medication" | "protocol" | "general" } => {
    const message = userMessage.toLowerCase()

    // Medical calculations
    if (message.includes("calculate") || message.includes("dose") || message.includes("drip rate")) {
      return {
        content:
          "I can help with common nursing calculations:\n• IV drip rates: (Volume × Drop factor) ÷ Time in minutes\n• Medication dosages: (Desired dose ÷ Available dose) × Quantity\n• Body surface area calculations\n• Unit conversions\n\nWhat specific calculation do you need help with?",
        category: "medical",
      }
    }

    // Pain assessment
    if (message.includes("pain") || message.includes("pain scale")) {
      return {
        content:
          "Pain Assessment Guidelines:\n• Use 0-10 numeric scale for adults\n• FACES scale for pediatric patients\n• Document: Location, quality, intensity, duration\n• Reassess 30-60 minutes after intervention\n• Non-pharmacological options: positioning, heat/cold, distraction\n• Always believe the patient's report of pain",
        category: "medical",
      }
    }

    // Vital signs
    if (message.includes("vital") || message.includes("blood pressure") || message.includes("temperature")) {
      return {
        content:
          "Normal Adult Vital Signs:\n• Temperature: 97-99°F (36.1-37.2°C)\n• Heart Rate: 60-100 bpm\n• Respiratory Rate: 12-20 breaths/min\n• Blood Pressure: <120/80 mmHg\n• O2 Saturation: >95%\n\nReport immediately if outside normal ranges or significant changes from baseline.",
        category: "medical",
      }
    }

    // Medication administration
    if (message.includes("medication") || message.includes("drug") || message.includes("5 rights")) {
      return {
        content:
          "5 Rights of Medication Administration:\n1. Right Patient - Check ID band\n2. Right Drug - Verify medication name\n3. Right Dose - Check calculation\n4. Right Route - Confirm administration method\n5. Right Time - Verify schedule\n\nAdditional: Right documentation, right reason, right response. Always check allergies first!",
        category: "medication",
      }
    }

    // Infection control
    if (message.includes("infection") || message.includes("ppe") || message.includes("isolation")) {
      return {
        content:
          "Infection Control Precautions:\n• Standard: All patients (hand hygiene, gloves when indicated)\n• Contact: Gown + gloves (C. diff, MRSA, VRE)\n• Droplet: Surgical mask within 3 feet (flu, pertussis)\n• Airborne: N95 mask (TB, measles, varicella)\n\nHand hygiene before and after every patient contact!",
        category: "protocol",
      }
    }

    // Fall prevention
    if (message.includes("fall") || message.includes("safety")) {
      return {
        content:
          "Fall Prevention Strategies:\n• Assess fall risk on admission and daily\n• Keep bed in lowest position\n• Ensure call light within reach\n• Non-slip socks for ambulatory patients\n• Clear pathways, adequate lighting\n• Toileting schedule for high-risk patients\n• Consider bed/chair alarms if appropriate",
        category: "protocol",
      }
    }

    // Emergency protocols
    if (message.includes("emergency") || message.includes("code") || message.includes("cardiac arrest")) {
      return {
        content:
          "Emergency Response:\n• Call for help immediately\n• Start CPR if no pulse (30:2 ratio)\n• Apply AED if available\n• Prepare for advanced life support\n• Document time of events\n• Notify physician and family\n\nRemember: Your safety first, then patient care.",
        category: "protocol",
      }
    }

    // Wound care
    if (message.includes("wound") || message.includes("dressing") || message.includes("pressure ulcer")) {
      return {
        content:
          "Wound Assessment & Care:\n• Document: Size, depth, drainage, odor, surrounding skin\n• Clean technique for chronic wounds\n• Sterile technique for acute/surgical wounds\n• Pressure ulcer staging: I-IV, unstageable, suspected deep tissue\n• Turn/reposition every 2 hours\n• Keep wound bed moist, surrounding skin dry",
        category: "procedure",
      }
    }

    // Default responses with quick actions
    const defaultResponses = [
      "I can help you with:\n• Medical protocols and procedures\n• Medication calculations and guidelines\n• Patient safety measures\n• Emergency procedures\n• Documentation requirements\n\nWhat specific topic interests you?",
      "Need quick help? Try asking about:\n• Pain assessment\n• Vital signs ranges\n• Infection control\n• Fall prevention\n• Medication administration\n• Wound care basics",
      "I'm here to support your nursing practice with evidence-based information. Remember to always follow your facility's specific policies and consult with physicians for patient-specific decisions.",
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
    const currentInput = inputMessage
    setInputMessage("")
    clearTranscript()
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(
      () => {
        const botResponse = generateBotResponse(currentInput)
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
      800 + Math.random() * 1200,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
    setTimeout(() => handleSendMessage(), 100)
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "medical":
        return <Stethoscope className="h-3 w-3" />
      case "procedure":
        return <Activity className="h-3 w-3" />
      case "medication":
        return <Pill className="h-3 w-3" />
      case "protocol":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Info className="h-3 w-3" />
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "medical":
        return "bg-blue-100 text-blue-800"
      case "procedure":
        return "bg-green-100 text-green-800"
      case "medication":
        return "bg-purple-100 text-purple-800"
      case "protocol":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const quickQuestions = [
    "Normal vital signs ranges",
    "5 rights of medication",
    "Fall prevention strategies",
    "Pain assessment guidelines",
    "Infection control precautions",
    "Calculate IV drip rate",
  ]

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Nursing Assistant
          {currentPatient && (
            <Badge variant="outline" className="ml-auto">
              Patient: {currentPatient}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Quick Questions */}
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-1">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

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

                <div className={`max-w-[85%] ${message.type === "user" ? "order-first" : ""}`}>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
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
              placeholder="Ask about protocols, medications, calculations..."
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

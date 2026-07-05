import { ChatMessage } from './types'

type Listener = () => void

class ChatSessionManager {
  private messages: ChatMessage[] = []
  private listeners: Set<Listener> = new Set()

  public getMessages() {
    return this.messages
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach(l => l())
  }

  public addMessage(msg: ChatMessage) {
    this.messages = [...this.messages, msg]
    this.notify()
  }

  public updateMessage(id: string, updates: Partial<ChatMessage>) {
    this.messages = this.messages.map(m => 
      m.id === id ? { ...m, ...updates } : m
    )
    this.notify()
  }

  public appendToContent(id: string, chunk: string) {
    this.messages = this.messages.map(m => 
      m.id === id ? { ...m, content: m.content + chunk } : m
    )
    this.notify()
  }

  public clear() {
    this.messages = []
    this.notify()
  }

  public removeLastMessage() {
    this.messages = this.messages.slice(0, -1)
    this.notify()
  }
}

export const chatSession = new ChatSessionManager()

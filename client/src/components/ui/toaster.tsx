import * as React from "react"
import { Toast } from "./use-toast"
import { useToast } from "./use-toast"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col space-y-2 p-4">
      {toasts.map(({ id, title, description, variant }) => (
        <Toast key={id} variant={variant}>
          <div className="grid gap-1">
            {title && <p className="font-medium">{title}</p>}
            {description && (
              <p className="text-sm opacity-90">{description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(id)}
            className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </Toast>
      ))}
    </div>
  )
}
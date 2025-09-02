import * as React from "react"
import { toast as sonnerToast } from "sonner"

const toast = ({ title, description, ...props }) => {
  sonnerToast(title, {
    description,
    ...props,
  })
}

export function useToast() {
  return {
    toast
  }
}

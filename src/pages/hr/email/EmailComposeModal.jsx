import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Send, X, Paperclip, Smile, Image } from "lucide-react";

export function EmailComposeModal({
  open,
  onOpenChange,
  defaultTo = "",
  defaultSubject = "",
  defaultBody = "",
  onSend,
  loading = false,
}) {const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setTo(defaultTo);
    setSubject(defaultSubject);
    setBody(defaultBody);
  }, [defaultTo, defaultSubject, defaultBody]);  const handleSend = async () => {
    if (!to) {
      return;
    }

    setIsSending(true);

    try {
      await onSend({ to, subject, htmlBody: body });
      onOpenChange && onOpenChange(false);
    } catch (error) {
      console.error("Error in handleSend:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Compose New Email
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Create and send your email message
          </DialogDescription>
        </DialogHeader>        <div className="flex-1 overflow-auto py-4 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-blue-600">
                <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-blue-600 animate-spin" />
                <span className="text-sm font-medium">Đang tải nội dung email...</span>
              </div>
            </div>
          )}
          
          <div className="space-y-1.5">
            <label htmlFor="to" className="text-sm font-medium text-gray-700">
              To
            </label>
            <Input
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>          <div className="space-y-1.5">
            <label
              htmlFor="subject"
              className="text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="body" className="text-sm font-medium text-gray-700">
              Message
            </label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
              className="min-h-[200px] resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 py-2 border-t border-b">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <Smile className="h-4 w-4" />
          </Button>
          <div className="ml-auto text-xs text-gray-400">
            {body.length} characters
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
            className="border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={isSending || !to}
            className={cn(
              "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300",
              "shadow-md hover:shadow-lg",
              isSending && "opacity-80 cursor-not-allowed"
            )}
          >
            {isSending ? (
              <>
                <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

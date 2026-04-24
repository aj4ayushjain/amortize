import React, { useEffect, useRef, useState } from "react"
import { Check, Copy, Mail, MessageCircle, Share2, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShareCalculatorProps {
  shareUrl: string
  shareText: string
}

export function ShareCalculator({ shareUrl, shareText }: ShareCalculatorProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const nativeShare = async () => {
    await navigator.share({ title: "Calculator Result", text: shareText, url: shareUrl })
    setOpen(false)
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`
  const emailHref = `mailto:?subject=${encodeURIComponent("Calculator Result")}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
  const supportsNativeShare = typeof navigator !== "undefined" && !!navigator.share

  return (
    <div className="relative inline-block" ref={ref}>
      <Button
        type="button"
        variant="outline"
        className=""
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Share2 className="size-4" />
        Share
      </Button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[200px]">
          <button
            className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
            onClick={copyLink}
          >
            {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
            {copied ? "Copied!" : "Copy link"}
          </button>

          {supportsNativeShare && (
            <button
              className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
              onClick={nativeShare}
            >
              <Share2 className="size-4" />
              Share via…
            </button>
          )}

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            <MessageCircle className="size-4 text-green-600" />
            WhatsApp
          </a>

          <a
            href={twitterHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            <Twitter className="size-4" />
            Twitter / X
          </a>

          <a
            href={emailHref}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            <Mail className="size-4" />
            Email
          </a>
        </div>
      )}
    </div>
  )
}

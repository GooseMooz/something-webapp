"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { X, Check, Move } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageCropModalProps {
  src: string
  fileName: string
  mimeType: string
  onConfirm: (file: File) => void
  onCancel: () => void
}

const PREVIEW_SIZE = 280
const OUTPUT_SIZE = 512

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
}

export function ImageCropModal({ src, fileName, mimeType, onConfirm, onCancel }: ImageCropModalProps) {
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const scale = naturalSize.w && naturalSize.h
    ? PREVIEW_SIZE / Math.min(naturalSize.w, naturalSize.h)
    : 1
  const sw = naturalSize.w * scale
  const sh = naturalSize.h * scale
  const minX = PREVIEW_SIZE - sw
  const minY = PREVIEW_SIZE - sh

  function startDrag(mx: number, my: number) {
    setDragging(true)
    dragRef.current = { mx, my, ox: offset.x, oy: offset.y }
  }

  function moveDrag(mx: number, my: number) {
    if (!dragging || !dragRef.current) return
    const dx = mx - dragRef.current.mx
    const dy = my - dragRef.current.my
    setOffset({
      x: clamp(dragRef.current.ox + dx, minX, 0),
      y: clamp(dragRef.current.oy + dy, minY, 0),
    })
  }

  function endDrag() {
    setDragging(false)
    dragRef.current = null
  }

  async function handleConfirm() {
    if (mimeType === "image/gif") {
      const res = await fetch(src)
      const blob = await res.blob()
      onConfirm(new File([blob], fileName, { type: "image/gif" }))
      return
    }

    const canvas = document.createElement("canvas")
    canvas.width = OUTPUT_SIZE
    canvas.height = OUTPUT_SIZE
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.src = src
    await new Promise<void>(resolve => { img.onload = () => resolve() })

    const sx = -offset.x / scale
    const sy = -offset.y / scale
    const cropW = PREVIEW_SIZE / scale
    const cropH = PREVIEW_SIZE / scale
    ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE)

    canvas.toBlob(blob => {
      if (!blob) return
      const file = new File([blob], fileName.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" })
      onConfirm(file)
    }, "image/jpeg", 0.92)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-espresso/60 backdrop-blur-sm p-4"
      style={{ cursor: dragging ? "grabbing" : "default" }}
      onMouseMove={e => moveDrag(e.clientX, e.clientY)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-full max-w-sm rounded-2xl border border-border/60 bg-card shadow-2xl overflow-hidden"
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-matcha/50 to-sky/40 rounded-t-2xl" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-espresso">Crop Photo</h3>
              <p className="text-[11px] text-espresso/40 mt-0.5">Drag to reposition within the square</p>
            </div>
            <button
              onClick={onCancel}
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-latte text-espresso/40 hover:text-espresso transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Crop preview */}
          <div
            className="relative mx-auto overflow-hidden rounded-2xl border-2 border-dashed border-matcha/40 bg-latte/30 select-none"
            style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE, cursor: dragging ? "grabbing" : "grab" }}
            onMouseDown={e => { e.preventDefault(); startDrag(e.clientX, e.clientY) }}
            onTouchStart={e => { const t = e.touches[0]; startDrag(t.clientX, t.clientY) }}
            onTouchMove={e => { e.preventDefault(); const t = e.touches[0]; moveDrag(t.clientX, t.clientY) }}
            onTouchEnd={endDrag}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt="crop preview"
              draggable={false}
              onLoad={() => {
                if (imgRef.current) {
                  setNaturalSize({ w: imgRef.current.naturalWidth, h: imgRef.current.naturalHeight })
                }
              }}
              style={{
                position: "absolute",
                width: sw || "100%",
                height: sh || "100%",
                left: offset.x,
                top: offset.y,
                pointerEvents: "none",
              }}
            />
            {/* Rule-of-thirds grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: [
                  `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)`,
                  `linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
                ].join(", "),
                backgroundSize: `${PREVIEW_SIZE / 3}px ${PREVIEW_SIZE / 3}px`,
              }}
            />
            {/* Corner indicators */}
            {[["top-2 left-2", "border-t-2 border-l-2"], ["top-2 right-2", "border-t-2 border-r-2"],
              ["bottom-2 left-2", "border-b-2 border-l-2"], ["bottom-2 right-2", "border-b-2 border-r-2"]
            ].map(([pos, border], i) => (
              <div key={i} className={`absolute ${pos} h-5 w-5 border-matcha/60 rounded-sm ${border}`} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] text-espresso/30">
            <Move className="h-2.5 w-2.5" /> Drag to adjust
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleConfirm}
              className="flex-1 rounded-full bg-espresso text-card hover:bg-espresso/90 font-bold h-10"
            >
              <Check className="mr-1.5 h-4 w-4" /> Use This Crop
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="rounded-full border-border/60 font-semibold text-espresso/50 h-10 px-4"
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
